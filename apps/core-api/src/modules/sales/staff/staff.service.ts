import { Injectable, Inject } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { projectWorkflows, salesProjects, salesStaff } from "src/core/drizzle/schema/sales.schema"
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class StaffService {

  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) { }

  create(createStaffDto: CreateStaffDto) {
    return 'This action adds a new staff';
  }

  async findAll() {
    return await this.db.select().from(salesStaff);
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }

  /**
    * List all tailoring staff with:
    *   • photo, name, id, level, specialitites
    *   • workload       = count of active projects (not 'completed' or 'cancelled')
    *   • performance    = avg(progress) over non-cancelled projects (0 if none)
    *   • status         = 'new' if zero total projects, else 'overloaded'/'excellent'/'normal'
    */
  async listAllStaffForTailoring(): Promise<
    Array<{
      id: number;
      name: string;
      photo: string | null;
      level: number;
      specialties: unknown;
      workload: number;
      performance: number;
      status: string;
    }>
  > {
    const tailors =  await this.db
      .select({
        id: salesStaff.id,
        name: salesStaff.name,
        photo: salesStaff.photo,
        level: salesStaff.level,
        specialties: sql<string>`COALESCE(${salesStaff.specialties}, '[]'::jsonb)`,


        //
        // 1) workload: active projects (status NOT IN ('completed','cancelled'))
        //
        workload: sql<number>`(
       SELECT COUNT(*)
       FROM ${salesProjects} AS p
       WHERE p.tailor_id = ${salesStaff.id}
         AND p.status NOT IN ('completed', 'cancelled')
     )`,

        //
        // 2) performance: AVG(progress) over non-cancelled projects; 0 if none
        //
        performance: sql<number>`COALESCE((
       SELECT AVG(p2.progress)
       FROM ${salesProjects} AS p2
       WHERE p2.tailor_id = ${salesStaff.id}
         AND p2.status <> 'cancelled'
     ), 0)`,

        //
        // 3) status: first check if totalProjects = 0 → 'new'.
        //    Otherwise, use same thresholds as before:
        //      • >5 active & avg <50 → 'overloaded'
        //      • AVG ≥80 → 'excellent'
        //      • else → 'normal'
        //
        status: sql<string>`CASE
       -- if no projects ever assigned, mark as 'new'
       WHEN (
         SELECT COUNT(*)
         FROM ${salesProjects} AS p0
         WHERE p0.tailor_id = ${salesStaff.id}
       ) = 0
         THEN 'new'

       -- overloaded: too many active & low avg
       WHEN (
         SELECT COUNT(*)
         FROM ${salesProjects} AS p3
         WHERE p3.tailor_id = ${salesStaff.id}
           AND p3.status NOT IN ('completed', 'cancelled')
       ) > 5
       AND (
         SELECT COALESCE(AVG(p4.progress), 0)
         FROM ${salesProjects} AS p4
         WHERE p4.tailor_id = ${salesStaff.id}
           AND p4.status <> 'cancelled'
       ) < 50
         THEN 'overloaded'

       -- excellent: high avg progress
       WHEN (
         SELECT COALESCE(AVG(p5.progress), 0)
         FROM ${salesProjects} AS p5
         WHERE p5.tailor_id = ${salesStaff.id}
           AND p5.status <> 'cancelled'
       ) >= 80
         THEN 'excellent'

       ELSE 'normal'
     END`,
      })
      .from(salesStaff)
      .where(eq(salesStaff.department, 'tailor'));

    return tailors.map(t => {
      return { ...t, specialties: Array.isArray(t.specialties) ? t.specialties : []}
    })
  }

  private parseSpecialties(s: string): string[] {
    // Check that it really looks like "['a','b',…,'z']"
    if (s  && s.startsWith("['") && s.endsWith("']")) {
      // Remove the leading "['" and the trailing "']"
      const inner = s.slice(2, -2);
      // Split on "','" to get each element. 
      // e.g. "kandura','abaya" → ["kandura", "abaya"]
      return inner.length === 0 ? [] : inner.split("','");
    }
    return [];
  }
}
