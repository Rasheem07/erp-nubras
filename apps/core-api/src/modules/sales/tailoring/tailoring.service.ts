import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTailoringDto } from './dto/create-tailoring.dto';
import { UpdateTailoringDto } from './dto/update-tailoring.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  customer,
  projectWorkflows,
  workflowTemplates,
  salesOrder,
  salesProjects,
  salesStaff,
  salesOrderItem,
  orderItemMeasurements,
} from 'src/core/drizzle/schema/sales.schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

@Injectable()
export class TailoringService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(createTailoringDto: CreateTailoringDto) {
    const { workflows, ...projectDto } = createTailoringDto;
    await this.db.transaction(async (tx) => {
      const [order, customerRec, tailor] = await Promise.all([
        tx
          .select({ c: sql`COUNT(*)` })
          .from(salesOrder)
          .where(eq(salesOrder.id, projectDto.orderId)),
        tx
          .select({ c: sql`COUNT(*)` })
          .from(customer)
          .where(eq(customer.id, projectDto.customerId)),
        tx
          .select({ c: sql`COUNT(*)` })
          .from(salesStaff)
          .where(eq(salesStaff.id, projectDto.tailorId)),
      ]);

      if (Number(order[0].c) === 0) {
        throw new NotFoundException(`Order #${projectDto.orderId} not found!`);
      }
      if (Number(customerRec[0].c) === 0) {
        throw new NotFoundException(
          `Customer #${projectDto.customerId} not found!`,
        );
      }
      if (Number(tailor[0].c) === 0) {
        throw new NotFoundException(
          `Tailor #${projectDto.tailorId} not found!`,
        );
      }

      const totalEstimatedHours = workflows.reduce(
        (acc, w) => acc + w.estimatedHours,
        0,
      );

      const [project] = await tx
        .insert(salesProjects)
        .values({ ...projectDto, estimatedHours: totalEstimatedHours })
        .returning({ id: salesProjects.id });
      if (!project.id) {
        throw new ConflictException(`Failed to create a sales project!`);
      }

      const seen = new Set<number>();
      for (const wf of workflows) {
        if (seen.has(wf.stepNo)) {
          throw new BadRequestException(
            `Duplicate stepNo ${wf.stepNo} in workflows`,
          );
        }
        seen.add(wf.stepNo);
      }

      const configIds = workflows.map((w) => w.configId);
      const configs = await tx
        .select({ id: workflowTemplates.id })
        .from(workflowTemplates)
        .where(inArray(workflowTemplates.id, configIds));

      if (configs.length !== configIds.length)
        throw new NotFoundException('One or more workflowTemplates not found');

      await tx
        .insert(projectWorkflows)
        .values(workflows.map((w) => ({ ...w, projectId: project.id })));
    });

    return { message: `Tailoring project created successfully!` };
  }

  async findAll() {
    const result = await this.db
      .select({
        id: salesProjects.id,
        customer: customer.name,
        description: salesProjects.description,
        deadline: salesProjects.deadline,
        rush: salesProjects.rush,
        status: salesProjects.status,
        progress: salesProjects.progress,
        tailor: salesStaff.name,
        tailorLevel: salesStaff.level,
        createdAt: salesProjects.createdAt,
      })
      .from(salesProjects)
      .leftJoin(customer, eq(customer.id, salesProjects.customerId))
      .leftJoin(salesStaff, eq(salesStaff.id, salesProjects.tailorId));

    return result;
  }

  async findOne(id: number) {
    const [row] = await this.db
      .select({
        // ─── Project header ───────────────────────────────────────
        id: salesProjects.id,
        orderId: salesProjects.orderId,
        customerId: salesProjects.customerId,
        description: salesProjects.description,
        deadline: salesProjects.deadline,
        rush: salesProjects.rush,
        instructions: salesProjects.instructions,

        // If you want to keep the original column, or sum workflows instead:
        estimatedProjectHours: salesProjects.estimatedHours,

        status: salesProjects.status,
        tailorId: salesProjects.tailorId,
        createdAt: salesProjects.createdAt,
        updatedAt: salesProjects.updatedAt,

        customerName: customer.name,
        tailorName: salesStaff.name,

        // ─── Workflows as JSON array (includes estimated/actual hours)
        workflows: sql`
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',             ${projectWorkflows.id},
              'stepNo',         ${projectWorkflows.stepNo},
              'notes',          ${projectWorkflows.notes},
              'status',         ${projectWorkflows.status},
              'estimatedHours', ${projectWorkflows.estimatedHours},
              'actualHours',    ${projectWorkflows.actualHours},
              'completedAt',    ${projectWorkflows.completedAt},
              'config',         ROW_TO_JSON(${workflowTemplates}.*)
            )
          ) FILTER (WHERE ${projectWorkflows.id} IS NOT NULL),
          '[]'
        )
      `.as('workflows'),

        // ─── Count of completed steps
        stepsCompleted: sql<number>`
        COUNT(*) FILTER (WHERE ${projectWorkflows.status} = 'completed')
      `.as('stepsCompleted'),

        // ─── Total steps in this project
        totalSteps: sql<number>`
        COUNT(${projectWorkflows.id})
      `.as('totalSteps'),

        // ─── Days remaining until deadline
        daysRemaining: sql<number>`
        GREATEST(DATE_PART('day', ${salesProjects.deadline} - NOW()), 0)
      `.as('daysRemaining'),

        // ─── Actual hours used: sum of actual_hours for completed workflows
        actualProjectHours: sql<number>`
        COALESCE(
          (
            SELECT SUM(${projectWorkflows.actualHours})
            FROM ${projectWorkflows}
            WHERE ${projectWorkflows.projectId} = ${salesProjects.id}
              AND ${projectWorkflows.status} = 'completed'
          ),
          0
        )
      `.as('actualProjectHours'),

        // ─── Time efficiency:
        //     If actualProjectHours = 0, return 0.
        //     Otherwise, compute (estimatedProjectHours / actualProjectHours) * 100, capped at 100.
        timeEfficiency: sql<number>`
        CASE
          WHEN (
            SELECT COALESCE(
              SUM(${projectWorkflows.actualHours}) FILTER (WHERE ${projectWorkflows.status} = 'completed'),
              0
            )
            FROM ${projectWorkflows}
            WHERE ${projectWorkflows.projectId} = ${salesProjects.id}
          ) = 0
            THEN 0
          ELSE
            LEAST(
              (
                (
                  SELECT COALESCE(SUM(${projectWorkflows.estimatedHours}), 0)
                  FROM ${projectWorkflows}
                  WHERE ${projectWorkflows.projectId} = ${salesProjects.id}
                )::float8
                /
                NULLIF(
                  (
                    SELECT COALESCE(
                      SUM(${projectWorkflows.actualHours}) FILTER (WHERE ${projectWorkflows.status} = 'completed'),
                      0
                    )::float8
                    FROM ${projectWorkflows}
                    WHERE ${projectWorkflows.projectId} = ${salesProjects.id}
                  ),
                  0
                )
                * 100
              ),
              100
            )
        END
      `.as('timeEfficiency'),
        customItems: sql`
  COALESCE(
    JSON_AGG(
      DISTINCT JSONB_BUILD_OBJECT(
        'id',             ${salesOrderItem.id},
        'description',    ${salesOrderItem.description},
        'modelName',      ${salesOrderItem.modelName},
        'sku',            ${salesOrderItem.sku},
        'price',          ${salesOrderItem.price},
        'modelPrice',     ${salesOrderItem.modelPrice},
        'total',          ${salesOrderItem.total},
        'measurement', CASE
          WHEN ${orderItemMeasurements.id} IS NOT NULL THEN JSONB_BUILD_OBJECT(
            'frontLength', ${orderItemMeasurements.frontLength},
            'backLength',  ${orderItemMeasurements.backLength},
            'shoulder',    ${orderItemMeasurements.shoulder},
            'sleeves',     ${orderItemMeasurements.sleeves},
            'neck',        ${orderItemMeasurements.neck},
            'waist',       ${orderItemMeasurements.waist},
            'chest',       ${orderItemMeasurements.chest},
            'widthEnd',    ${orderItemMeasurements.widthEnd},
            'notes',       ${orderItemMeasurements.notes}
          )
          ELSE NULL
        END
      )
    ) FILTER (WHERE ${salesOrderItem.type} = 'custom'),
    '[]'
  )
`.as('customItems'),
      })
      .from(salesProjects)
      .leftJoin(customer, eq(customer.id, salesProjects.customerId))
      .leftJoin(salesStaff, eq(salesStaff.id, salesProjects.tailorId))
      .leftJoin(
        projectWorkflows,
        eq(projectWorkflows.projectId, salesProjects.id),
      )
      .leftJoin(
        workflowTemplates,
        eq(workflowTemplates.id, projectWorkflows.configId),
      )
      .leftJoin(
        salesOrderItem,
        eq(salesOrderItem.orderId, salesProjects.orderId),
      )
      .leftJoin(
        orderItemMeasurements,
        eq(orderItemMeasurements.orderItemId, salesOrderItem.id),
      )

      .where(eq(salesProjects.id, id))
      .groupBy(salesProjects.id, customer.id, salesStaff.id);

    if (!row) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return {
      id: row.id,
      orderId: row.orderId,
      customerId: row.customerId,
      description: row.description,
      deadline: row.deadline,
      rush: row.rush,
      instructions: row.instructions,

      estimatedHours: row.estimatedProjectHours,
      actualHours: row.actualProjectHours,
      status: row.status,
      tailorId: row.tailorId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,

      customerName: row.customerName,
      tailorName: row.tailorName,

      daysRemaining: row.daysRemaining,
      stepsCompleted: row.stepsCompleted,
      totalSteps: row.totalSteps,
      timeEfficiency: row.timeEfficiency.toFixed(2),

      workflows: row.workflows as Array<{
        id: number;
        stepNo: number;
        notes: string;
        status: string;
        estimatedHours: number;
        actualHours: number | null;
        completedAt: Date | null;
        config: {
          id: number;
          title: string;
          description: string;
          createdAt: Date;
          updatedAt: Date;
        };
      }>,

      customItems: row.customItems as Array<{
        id: number;
        description: string;
        modelName: string;
        sku: string;
        price: string;
        modelPrice: string;
        total: string;
        measurement: {
          frontLength: string;
          backLength: string;
          shoulder: string;
          sleeves: string;
          neck: string;
          waist: string;
          chest: string;
          widthEnd: string;
          notes: string;
        } | null;
      }>,
    };
  }

  /**
   * Update a tailoring project and its workflows.
   * • Validates project exists
   * • Updates project‐level fields (description, deadline, etc.)
   * • Synchronizes workflows:
   *     – Inserts new steps
   *     – Updates existing steps (by stepNo)
   *     – Deletes removed steps
   * • Recalculates project.estimatedHours = SUM(workflow.estimatedHours)
   * All in a single transaction.
   */
  async update(id: number, dto: UpdateTailoringDto) {
    return this.db.transaction(async (tx) => {
      // 1) Check project exists
      const [exists] = await tx
        .select({ count: sql`COUNT(*)` })
        .from(salesProjects)
        .where(eq(salesProjects.id, id));

      if (Number(exists.count) === 0) {
        throw new NotFoundException(`Sales project #${id} not found`);
      }

      // 2) Separate workflow updates from project fields
      const { workflows: inputWorkflows, ...projectFields } = dto;

      const allConfigIds = inputWorkflows.map((w) => w.configId);
      const existingConfigs = await tx
        .select({ id: workflowTemplates.id })
        .from(workflowTemplates)
        .where(inArray(workflowTemplates.id, allConfigIds));
      if (existingConfigs.length !== new Set(allConfigIds).size) {
        throw new NotFoundException('One or more workflowTemplates not found');
      }
      // 3) Update project‐level fields if any
      if (Object.keys(projectFields).length > 0) {
        const result = await tx
          .update(salesProjects)
          .set(projectFields)
          .where(eq(salesProjects.id, id))
          .returning({ id: salesProjects.id });

        if (!result.length || result[0].id !== id) {
          throw new ConflictException(`Failed to update project #${id}`);
        }
      }

      // 4) If workflows provided, synchronize them
      if (Array.isArray(inputWorkflows)) {
        // 4.1) Ensure no duplicate stepNo in input
        const seen = new Set<number>();
        for (const wf of inputWorkflows) {
          if (seen.has(wf.stepNo)) {
            throw new BadRequestException(
              `Duplicate stepNo ${wf.stepNo} in workflows`,
            );
          }
          seen.add(wf.stepNo);
        }

        // 4.2) Fetch existing workflows for this project
        const existing = await tx
          .select({
            id: projectWorkflows.id,
            stepNo: projectWorkflows.stepNo,
          })
          .from(projectWorkflows)
          .where(eq(projectWorkflows.projectId, id));

        // Build maps of existing stepNo → id
        const existingMap = new Map<number, number>();
        for (const row of existing) {
          existingMap.set(row.stepNo, row.id);
        }

        // 4.3) Upsert each input workflow
        for (const wf of inputWorkflows) {
          const { stepNo, configId, notes, estimatedHours } = wf;

          if (existingMap.has(stepNo)) {
            // Update existing row
            const workflowId = existingMap.get(stepNo)!;
            await tx
              .update(projectWorkflows)
              .set({ configId, notes, estimatedHours })
              .where(eq(projectWorkflows.id, workflowId));
          } else {
            // Insert new row
            await tx.insert(projectWorkflows).values({
              stepNo,
              configId,
              notes,
              estimatedHours,
              status: 'pending',
              projectId: id,
            });
          }
        }

        // 4.4) Delete any existing steps not present in input
        const inputStepNos = inputWorkflows.map((w) => w.stepNo);
        const toDeleteIds = existing
          .filter((row) => !inputStepNos.includes(row.stepNo))
          .map((row) => row.id);

        if (toDeleteIds.length) {
          await tx
            .delete(projectWorkflows)
            .where(inArray(projectWorkflows.id, toDeleteIds));
        }

        // 4.5) Recalculate total estimated hours across all remaining workflows
        const [{ total }] = await tx
          .select({
            total: sql<number>`COALESCE(SUM(${projectWorkflows.estimatedHours}), 0)`,
          })
          .from(projectWorkflows)
          .where(eq(projectWorkflows.projectId, id));

        // 4.6) Update project's estimatedHours
        await tx
          .update(salesProjects)
          .set({ estimatedHours: total })
          .where(eq(salesProjects.id, id));
      }

      return { message: `Sales project #${id} updated successfully` };
    });
  }

  async updateWorkFlowNotes(id: number, notes: string) {
    const workflow = await this.db
      .select({ c: sql`COUNT(*)` })
      .from(projectWorkflows)
      .where(eq(projectWorkflows.id, id));
    if (Number(workflow[0].c) === 0) {
      throw new NotFoundException(`project workflow #${id} not found!`);
    }
    await this.db
      .update(projectWorkflows)
      .set({ notes })
      .where(eq(projectWorkflows.id, id));

    return { message: `Notes updated for workflow #${id} !`, notes };
  }

  async updateProgress(id: number) {
    return this.db.transaction(async (tx) => {
      // 1) Load current step so we know its stepNo, createdAt, projectId
      const [currentStep] = await tx
        .select({
          stepNo: projectWorkflows.stepNo,
          createdAt: projectWorkflows.createdAt,
          projectId: projectWorkflows.projectId,
        })
        .from(projectWorkflows)
        .where(eq(projectWorkflows.id, id));

      if (!currentStep) {
        throw new NotFoundException(`Workflow #${id} not found`);
      }

      const { stepNo, createdAt, projectId } = currentStep;

      // 2) Determine the “start” moment:
      //    If stepNo = 1 → start = createdAt
      //    Otherwise, fetch previous step’s completedAt (if any)
      let startTime = createdAt;
      if (stepNo > 1) {
        const [prevStep] = await tx
          .select({
            completedAt: projectWorkflows.completedAt,
            status: projectWorkflows.status,
          })
          .from(projectWorkflows)
          .where(
            and(
              eq(projectWorkflows.projectId, projectId),
              eq(projectWorkflows.stepNo, stepNo - 1),
            ),
          );

        if (!prevStep || prevStep.status !== 'completed') {
          throw new BadRequestException(
            `Cannot complete step #${stepNo} before step #${stepNo - 1} is completed`,
          );
        }

        if (prevStep?.completedAt) {
          startTime = prevStep.completedAt;
        }
      }

      // 3) Compute actualHours in JavaScript:
      //    Difference between now and startTime, in hours, floored to integer.
      const now = new Date();
      const diffMs = now.getTime() - new Date(startTime).getTime();
      const actualHours = Math.floor(diffMs / (1000 * 60 * 60));

      // 4) Mark current step as completed, set completedAt=now, actualHours=computed
      const [updateResult] = await tx
        .update(projectWorkflows)
        .set({
          status: 'completed',
          completedAt: now,
          actualHours, // use the JS‐computed integer
        })
        .where(eq(projectWorkflows.id, id))
        .returning({ stepNo: projectWorkflows.stepNo });

      if (!updateResult) {
        throw new NotFoundException(`Workflow #${id} not found`);
      }

      // 5) Recompute how many steps are completed vs. total
      const [stats] = await tx
        .select({
          completedCount: sql<number>`
          COUNT(*) FILTER (WHERE ${projectWorkflows.status} = 'completed')
        `,
          totalCount: sql<number>`COUNT(${projectWorkflows.id})`,
        })
        .from(projectWorkflows)
        .where(eq(projectWorkflows.projectId, projectId))
        .groupBy(projectWorkflows.projectId);

      const completedCount = Number(stats.completedCount);
      const totalCount = Number(stats.totalCount);

      // 6) Compute new project‐level progress & status
      const progress =
        totalCount === 0 ? 0 : Math.floor((completedCount / totalCount) * 100);
      const newStatus =
        completedCount === totalCount ? 'completed' : 'in-progress';

      // 7) Update the project record
      await tx
        .update(salesProjects)
        .set({ progress, status: newStatus })
        .where(eq(salesProjects.id, projectId));

      return {
        message: `Step #${updateResult.stepNo} completed. Actual hours recorded: ${actualHours}. Project #${projectId} is now ${progress}% done (${newStatus}).`,
        progress,
        status: newStatus,
      };
    });
  }

  async remove(id: number) {
    const { rowCount } = await this.db
      .delete(salesProjects)
      .where(eq(salesProjects.id, id));

    if (!rowCount || rowCount === 0) {
      throw new ConflictException(`Failed to delete sales Project #${id}!`);
    }

    return { message: `Sales project #${id} deleted successfully!` };
  }

  async listAllWorkflowTempaltes() {
    return await this.db.select().from(workflowTemplates);
  }
}
