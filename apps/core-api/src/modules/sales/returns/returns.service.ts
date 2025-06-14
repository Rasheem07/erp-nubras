import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  customer,
  salesOrder,
  salesOrderItem,
  salesReturns,
  salesReturnsItem,
} from 'src/core/drizzle/schema/sales.schema';
import { eq, sql, and } from 'drizzle-orm';

@Injectable()
export class ReturnsService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(createReturnDto: CreateReturnDto) {
    const { items, ...returnDto } = createReturnDto;

    await this.db.transaction(async (tx) => {
      // 1) Check customer & order exist in parallel
      const [custCount, orderCount] = await Promise.all([
        tx
          .select({ c: sql`COUNT(*)` })
          .from(customer)
          .where(eq(customer.id, returnDto.customerId))
          .then((r) => Number(r[0].c)),
        tx
          .select({ c: sql`COUNT(*)` })
          .from(salesOrder)
          .where(eq(salesOrder.id, returnDto.orderId))
          .then((r) => Number(r[0].c)),
      ]);
      if (!custCount)
        throw new NotFoundException(
          `Customer #${returnDto.customerId} not found`,
        );
      if (!orderCount)
        throw new NotFoundException(`Order   #${returnDto.orderId} not found`);

      // 2) How many items were on that order?
      const totalOnOrder = await tx
        .select({ cnt: sql`COUNT(*)` })
        .from(salesOrderItem)
        .where(eq(salesOrderItem.orderId, returnDto.orderId))
        .then((r) => Number(r[0].cnt));

      // 3) How many have already been returned?
      const alreadyReturned = await tx
        .select({ cnt: sql`COUNT(*)` })
        .from(salesReturnsItem)
        .leftJoin(salesReturns, eq(salesReturnsItem.returnId, salesReturns.id))
        .where(eq(salesReturns.orderId, returnDto.orderId))
        .then((r) => Number(r[0].cnt));

      // 4) Guard against over-returning
      if (alreadyReturned >= totalOnOrder) {
        throw new BadRequestException('All items have already been returned');
      }
      if (alreadyReturned + items.length > totalOnOrder) {
        throw new BadRequestException(
          `Cannot return ${items.length} items; only ${totalOnOrder - alreadyReturned} remaining`,
        );
      }

      // 5) Insert the return “header”
      const [newReturn] = await tx
        .insert(salesReturns)
        .values(returnDto)
        .returning();

      // 6) Bulk insert the return items
      //    Note: your table schema names the refund column `refunedAmount`
      const rowsToInsert = items.map((it) => ({
        returnId: newReturn.id,
        orderItemId: it.orderItemId,
        itemName: it.itemName,
        qty: it.qty,
        reason: it.reason,
        type: it.type,
        condition: it.condition,
        refundAmount: it.refundAmount,
      }));
      await tx.insert(salesReturnsItem).values(rowsToInsert);
      await tx
        .update(salesOrder)
        .set({ status: 'cancelled' })
        .where(eq(salesOrder.id, returnDto.orderId));
    });

    return {
      message: `Successfully returned ${items.length} item(s) on order #${returnDto.orderId}`,
    };
  }

  async findAll() {
    const rows = await this.db
      .select({
        id: salesReturns.id,
        orderId: salesReturns.orderId,
        customerId: salesReturns.customerId,
        customerName: salesReturns.customerName,
        customerPhone: customer.phone,
        paymentMethod: salesReturns.paymentMethod,
        status: salesReturns.status,
        notes: salesReturns.notes,
        createdAt: salesReturns.createdAt,
        updatedAt: salesReturns.updatedAt,
        itemsCount: sql`COUNT(${salesReturnsItem.id})`.as('itemsCount'),
        totalRefundAmount:
          sql`COALESCE(SUM(${salesReturnsItem.refundAmount}), 0)`.as(
            'totalRefundAmount',
          ),
      })
      .from(salesReturns)
      .leftJoin(
        salesReturnsItem,
        eq(salesReturnsItem.returnId, salesReturns.id),
      )
      .leftJoin(customer, eq(customer.id, salesReturns.customerId))
      .groupBy(salesReturns.id, customer.phone);

    return rows.map((r) => ({
      id: r.id,
      orderId: r.orderId,
      customerId: r.customerId,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      paymentMethod: r.paymentMethod,
      status: r.status,
      notes: r.notes,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      itemsCount: Number(r.itemsCount),
      totalRefundAmount: parseFloat(r.totalRefundAmount as unknown as string),
    }));
  }

 async findOne(id: number) {
  const [row] = await this.db
    .select({
      id: salesReturns.id,
      orderId: salesReturns.orderId,
      customerId: salesReturns.customerId,
      paymentMethod: salesReturns.paymentMethod,
      status: salesReturns.status,
      notes: salesReturns.notes,
      createdAt: salesReturns.createdAt,
      updatedAt: salesReturns.updatedAt,
      customer: sql`row_to_json(${customer}.*)`.as('customer'),
      items: sql`
        COALESCE(
          json_agg(
            json_build_object(
              'id', ${salesReturnsItem.id},
              'itemName', ${salesReturnsItem.itemName},
              'qty', ${salesReturnsItem.qty},
              'reason', ${salesReturnsItem.reason},
              'type', ${salesReturnsItem.type},
              'condition', ${salesReturnsItem.condition},
              'refundAmount', ${salesReturnsItem.refundAmount},
              'originalTotal',  ${sql`${salesReturnsItem.qty} * ${salesOrderItem.price}`},
              'createdAt', ${sql`${salesReturnsItem.createdAt}`}
            )
          ) FILTER (
            WHERE ${salesReturnsItem}.return_id IS NOT NULL
          ),
          '[]'
        )
      `.as('items'),
      totalRefundAmount: sql`
        COALESCE(SUM(${salesReturnsItem.refundAmount}), 0)
      `.as('totalRefundAmount'),
        returnItemsOriginalValue: sql`
        COALESCE(
          SUM(${salesReturnsItem.qty} * ${salesOrderItem.price}),
          0
        )
      `.as('returnItemsOriginalValue'),
    })
    .from(salesReturns)
    .leftJoin(customer, eq(customer.id, salesReturns.customerId))
    .leftJoin(salesReturnsItem, eq(salesReturnsItem.returnId, salesReturns.id))
    .leftJoin(
      salesOrderItem,
      and(
        eq(salesOrderItem.orderId, salesReturns.orderId),
        eq(salesOrderItem.id, salesReturnsItem.orderItemId)
      )
    )
    .leftJoin(salesOrder, eq(salesOrder.id, salesReturns.orderId))
    .where(eq(salesReturns.id, id))
    .groupBy(salesReturns.id, customer.id, salesOrder.id);

  if (!row) {
    throw new NotFoundException(`Return #${id} not found`);
  }

  return {
    id: row.id,
    orderId: row.orderId,
    customerId: row.customerId,
    paymentMethod: row.paymentMethod,
    status: row.status,
    notes: row.notes,
    totalRefundAmount: row.totalRefundAmount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    customer: row.customer,
    items: row.items,
    returnItemsOriginalValue: row.returnItemsOriginalValue,
  };
}


  async update(id: number, updateReturnDto: UpdateReturnDto) {
    const { items, ...returnDto } = updateReturnDto;

    await this.db.transaction(async (tx) => {
      const rows = await tx
        .select({ id: salesReturns.id })
        .from(salesReturns)
        .where(eq(salesReturns.id, id))
        .limit(1);
      if (rows.length === 0) {
        throw new NotFoundException(`Return #${id} not found`);
      }

      const [returnOrder] = await tx
        .update(salesReturns)
        .set({...returnDto, updatedAt: sql`NOW()`})
        .where(eq(salesReturns.id, id))
        .returning({ id: salesReturns.id });

      await tx
        .delete(salesReturnsItem)
        .where(eq(salesReturnsItem.returnId, returnOrder.id));

      for (const it of items) {
        const itemData = {
          returnId: returnOrder.id,
          itemName: it.itemName!,
          qty: it.qty!,
          reason: it.reason!,
          type: it.type!,
          condition: it.condition!,
          refundAmount: it.refundAmount!,
          orderItemId: it.orderItemId!
        };

        await tx.insert(salesReturnsItem).values(itemData);
      }
    });

    return { message: `Sales return #${id} updated successfully!` };
  }

  async reject(id: number) {
    const result = await this.db
      .update(salesReturns)
      .set({ status: 'rejected' })
      .where(eq(salesReturns.id, id))
      .returning();

    if (!result || !(result.length > 0)) {
      throw new NotFoundException(`Sales return #${id} not found!`);
    }
    return `Sales return #${id} has been rejected!`;
  }
}
