import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  customer,
  customerGroup,
  salesOrder,
  salesOrderItem,
} from 'src/core/drizzle/schema/sales.schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) { }
  async create(dto: CreateCustomerDto) {
    const existing = await this.db
      .select({ id: customerGroup.id })
      .from(customerGroup)
      .where(eq(customerGroup.phone, dto.phone))
      .limit(1);

    const existingId = existing[0]?.id;

    // 2) insert if missing
    const grpId = existingId
      ? existingId
      : (
        await this.db
          .insert(customerGroup)
          .values({ phone: dto.phone, admin: dto.name })
          .returning({ id: customerGroup.id })
      )[0].id;

    const newCustomer = await this.db.insert(customer).values({ grpId, ...dto }).returning({
      id: customer.id,
      phone: customer.phone,
      name: customer.name,
      status: customer.status
    });

    return { message: `Customer created successfully!`, newCustomer };
  }

  async findAllCustomerGroups() {
    return await this.db
      .select({
        groupId: customerGroup.id,
        name: customerGroup.admin,
        phone: customerGroup.phone,
        totalSpent: sql`SUM(${salesOrder.totalAmount})`.as('totalSpent'),
        customerCount: sql`COUNT(DISTINCT ${customer.id})`.as('customerCount'),

        customers: sql`
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'id',               c.id,
              'name',             c.name,
              'status',           c.status,
              'preferences',      c.preferences,
              'ordersCount',      co.orders_count,
              'totalSpent',       co.spent,
              'lastPurchaseDate', co.last_date
            ) ORDER BY co.last_date DESC)
            FROM ${customer} AS c
            LEFT JOIN (
              SELECT
                ${salesOrder.customerId}        AS customer_id,
                COUNT(*)                        AS orders_count,
                SUM(${salesOrder.totalAmount})  AS spent,
                MAX(${salesOrder.completedDate}) AS last_date
              FROM ${salesOrder}
              GROUP BY ${salesOrder.customerId}
            ) AS co
              ON co.customer_id = c.id
            WHERE c."grpId" = ${customerGroup.id}
          ),
          '[]'
        )
      `.as('customers'),
      })
      .from(customerGroup)
      .leftJoin(customer, eq(customer.grpId, customerGroup.id))
      .leftJoin(salesOrder, eq(salesOrder.customerId, customer.id))
      .groupBy(customerGroup.id, customerGroup.admin, customerGroup.phone);
  }

  private async checkIfCustomerExist(id: number) {
    const [{ count }] = await this.db
      .select({ count: sql`COUNT(*)` })
      .from(customer)
      .where(eq(customer.id, id));
    if (Number(count) === 0) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
  }

  async findOne(id: number) {
    // 1) existence guard
    const [{ count }] = await this.db
      .select({ count: sql`COUNT(*)` })
      .from(customer)
      .where(eq(customer.id, id));
    if (Number(count) === 0) {
      throw new NotFoundException(`Customer #${id} not found`);
    }

    // 2) single‐pass fetch with scalar subqueries
    const [row] = await this.db
      .select({
        // ── Profile ────────────────────────────────
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        groupId: customer.grpId,
        groupCode: sql`'GRP-' || ${customer.grpId}`.as('groupCode'),
        joinedYear: sql`EXTRACT(YEAR FROM ${customer.createdAt})`.as(
          'joinedYear',
        ),
        status: customer.status,

        // ── Basic analytics via scalar subqueries ───
        totalSpent: sql`
        COALESCE(
          (SELECT SUM("totalAmount")
           FROM ${salesOrder}
           WHERE customer_id = ${customer.id}
          ), 0
        )
      `.as('totalSpent'),

        totalOrders: sql`
        COALESCE(
          (SELECT COUNT(*)
           FROM ${salesOrder}
           WHERE customer_id = ${customer.id}
          ), 0
        )
      `.as('totalOrders'),

        averageOrderValue: sql`
        COALESCE(
          (SELECT AVG("totalAmount")
           FROM ${salesOrder}
           WHERE customer_id = ${customer.id}
          ), 0
        )
      `.as('averageOrderValue'),

        // ── Group analytics ─────────────────────────
        groupMembersCount: sql`
        (SELECT COUNT(*)
         FROM ${customer}
         WHERE "grpId" = ${customer.grpId}
        )
      `.as('groupMembersCount'),

        groupMembers: sql`
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id',         cm.id,
                'name',       cm.name,
                'status',     cm.status,
                'totalSpent', gs.total_spent
              )
            )
            FROM ${customer} cm
            LEFT JOIN LATERAL (
              SELECT SUM("totalAmount") AS total_spent
              FROM ${salesOrder}
              WHERE customer_id = cm.id
            ) gs ON true
            WHERE cm."grpId" = ${customer.grpId}
          ),
          '[]'
        )
      `.as('groupMembers'),

        // ── Preferences & Measurements ───────────────
        preferences: customer.preferences,
        measurement: customer.measurement,

        // ── Full order history ───────────────────────
        orderHistory: sql`
        COALESCE(
          (
            SELECT json_agg(o ORDER BY o.orderDate DESC)
            FROM (
              SELECT
                so.id            AS orderId,
                so.created_at    AS orderDate,
                (
                  SELECT COUNT(*)
                  FROM ${salesOrderItem} si
                  WHERE si."orderId" = so.id
                )                 AS itemCount,
                so."totalAmount"  AS totalAmount,
                so.status        AS orderStatus
              FROM ${salesOrder} so
              WHERE so.customer_id = ${customer.id}
              ORDER BY so.created_at DESC
            ) o
          ),
          '[]'
        )
      `.as('orderHistory'),
      })
      .from(customer)
      .where(eq(customer.id, id))
      .limit(1);

    return row;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.checkIfCustomerExist(id);
    const [{ id: updatedId }] = await this.db
      .update(customer)
      .set(updateCustomerDto)
      .where(eq(customer.id, id))
      .returning({ id: customer.id });

    if (!updatedId) {
      throw new ConflictException(`Customer #${id} failed to update!`);
    }

    return { message: `Customer #${id} updated successfully!` };
  }

  async remove(id: number) {
    await this.checkIfCustomerExist(id);
    const { rowCount } = await this.db
      .delete(customer)
      .where(eq(customer.id, id));

    if (!rowCount) {
      throw new ConflictException(`Customer #${id} failed to delete!`);
    }

    return { message: `Customer #${id} deleted successfully!` };
  }

  async listCustomers() {
    return await this.db
      .select({
        id: customer.id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        status: customer.status,
      })
      .from(customer);
  }

  async getStats() {
    // Define month boundaries
    const monthStart = sql`date_trunc('month', now())`;
    const nextMonthStart = sql`${monthStart} + INTERVAL '1 month'`;
    const lastMonthStart = sql`${monthStart} - INTERVAL '1 month'`;

    // One‐shot stats query
    const [stats]: any = await this.db
      .select({
        // ── Customer groups ─────────────────────────────
        totalGroups: sql` 
        (SELECT COUNT(*) 
         FROM ${customerGroup}
         WHERE created_at >= ${monthStart}
           AND created_at <  ${nextMonthStart}
        )
      `.as('totalGroups'),

        groupsChange: sql`
        (SELECT COUNT(*) 
         FROM ${customerGroup}
         WHERE created_at >= ${monthStart}
           AND created_at <  ${nextMonthStart}
        )
        -
        (SELECT COUNT(*) 
         FROM ${customerGroup}
         WHERE created_at >= ${lastMonthStart}
           AND created_at <  ${monthStart}
        )
      `.as('groupsChange'),

        groupsPercentChange: sql`
        CASE
          WHEN (SELECT COUNT(*) 
                FROM ${customerGroup}
                WHERE created_at >= ${lastMonthStart}
                  AND created_at <  ${monthStart}
               ) = 0
            THEN NULL
          ELSE
            (
              (SELECT COUNT(*) 
               FROM ${customerGroup}
               WHERE created_at >= ${monthStart}
                 AND created_at <  ${nextMonthStart}
              )
              -
              (SELECT COUNT(*) 
               FROM ${customerGroup}
               WHERE created_at >= ${lastMonthStart}
                 AND created_at <  ${monthStart}
              )
            )::float
            /
            (SELECT COUNT(*) 
             FROM ${customerGroup}
             WHERE created_at >= ${lastMonthStart}
               AND created_at <  ${monthStart}
            )
            * 100
        END
      `.as('groupsPercentChange'),

        // ── Customers ────────────────────────────────────
        totalCustomers: sql`
        (SELECT COUNT(*)
         FROM ${customer}
         WHERE created_at >= ${monthStart}
           AND created_at <  ${nextMonthStart}
        )
      `.as('totalCustomers'),

        customersChange: sql`
        (SELECT COUNT(*)
         FROM ${customer}
         WHERE created_at >= ${monthStart}
           AND created_at <  ${nextMonthStart}
        )
        -
        (SELECT COUNT(*)
         FROM ${customer}
         WHERE created_at >= ${lastMonthStart}
           AND created_at <  ${monthStart}
        )
      `.as('customersChange'),

        customersPercentChange: sql`
        CASE
          WHEN (SELECT COUNT(*)
                FROM ${customer}
                WHERE created_at >= ${lastMonthStart}
                  AND created_at <  ${monthStart}
               ) = 0
            THEN NULL
          ELSE
            (
              (SELECT COUNT(*)
               FROM ${customer}
               WHERE created_at >= ${monthStart}
                 AND created_at <  ${nextMonthStart}
              )
              -
              (SELECT COUNT(*)
               FROM ${customer}
               WHERE created_at >= ${lastMonthStart}
                 AND created_at <  ${monthStart}
              )
            )::float
            /
            (SELECT COUNT(*)
             FROM ${customer}
             WHERE created_at >= ${lastMonthStart}
               AND created_at <  ${monthStart}
            )
            * 100
        END
      `.as('customersPercentChange'),

        // ── VIP Customers ────────────────────────────────
        totalVips: sql`
        (SELECT COUNT(*)
         FROM ${customer}
         WHERE status = 'vip'
           AND created_at >= ${monthStart}
           AND created_at <  ${nextMonthStart}
        )
      `.as('totalVips'),

        vipsChange: sql`
        (SELECT COUNT(*)
         FROM ${customer}
         WHERE status = 'vip'
           AND created_at >= ${monthStart}
           AND created_at <  ${nextMonthStart}
        )
        -
        (SELECT COUNT(*)
         FROM ${customer}
         WHERE status = 'vip'
           AND created_at >= ${lastMonthStart}
           AND created_at <  ${monthStart}
        )
      `.as('vipsChange'),

        vipsPercentChange: sql`
        CASE
          WHEN (SELECT COUNT(*)
                FROM ${customer}
                WHERE status = 'vip'
                  AND created_at >= ${lastMonthStart}
                  AND created_at <  ${monthStart}
               ) = 0
            THEN NULL
          ELSE
            (
              (SELECT COUNT(*)
               FROM ${customer}
               WHERE status = 'vip'
                 AND created_at >= ${monthStart}
                 AND created_at <  ${nextMonthStart}
              )
              -
              (SELECT COUNT(*)
               FROM ${customer}
               WHERE status = 'vip'
                 AND created_at >= ${lastMonthStart}
                 AND created_at <  ${monthStart}
              )
            )::float
            /
            (SELECT COUNT(*)
             FROM ${customer}
             WHERE status = 'vip'
               AND created_at >= ${lastMonthStart}
               AND created_at <  ${monthStart}
            )
            * 100
        END
      `.as('vipsPercentChange'),

        // ── Monthly Revenue ─────────────────────────────
        totalRevenue: sql`
        COALESCE(
          (SELECT SUM("totalAmount")
           FROM ${salesOrder}
           WHERE created_at >= ${monthStart}
             AND created_at <  ${nextMonthStart}
          ),
          0
        )
      `.as('totalRevenue'),

        revenueChange: sql`
        COALESCE(
          (SELECT SUM("totalAmount")
           FROM ${salesOrder}
           WHERE created_at >= ${monthStart}
             AND created_at <  ${nextMonthStart}
          ), 0
        )
        -
        COALESCE(
          (SELECT SUM("totalAmount")
           FROM ${salesOrder}
           WHERE created_at >= ${lastMonthStart}
             AND created_at <  ${monthStart}
          ), 0
        )
      `.as('revenueChange'),

        revenuePercentChange: sql`
        CASE
          WHEN COALESCE(
                 (SELECT SUM("totalAmount")
                  FROM ${salesOrder}
                  WHERE created_at >= ${lastMonthStart}
                    AND created_at <  ${monthStart}
                 ), 0
               ) = 0
            THEN NULL
          ELSE
            (
              COALESCE(
                (SELECT SUM("totalAmount")
                 FROM ${salesOrder}
                 WHERE created_at >= ${monthStart}
                   AND created_at <  ${nextMonthStart}
                ), 0
              )
              -
              COALESCE(
                (SELECT SUM("totalAmount")
                 FROM ${salesOrder}
                 WHERE created_at >= ${lastMonthStart}
                   AND created_at <  ${monthStart}
                ), 0
              )
            )::float
            /
            COALESCE(
              (SELECT SUM("totalAmount")
               FROM ${salesOrder}
               WHERE created_at >= ${lastMonthStart}
                 AND created_at <  ${monthStart}
              ), 0
            )
            * 100
        END
      `.as('revenuePercentChange'),
      })
      // dummy FROM so Drizzle can compile
      .from(sql`(SELECT 1)`)
      .limit(1);

    return stats;
  }
}
