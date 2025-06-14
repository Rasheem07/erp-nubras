import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSalesOrderDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  customer,
  salesOrderItem,
  salesOrder,
  salesStaff,
  productCatalog,
  salesTransactions,
  orderItemMeasurements,
} from 'src/core/drizzle/schema/sales.schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import Decimal from 'decimal.js';
import { TransactionsService } from './transactions/transactions.service';

@Injectable()
export class SalesService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  /**
   * The function creates a sales order, computes payment-related details, validates data, and inserts
   * records into the database.
   * @param {CreateSalesOrderDto} createSaleDto - The `createSaleDto` parameter in the `create`
   * function represents the data needed to create a sales order. It contains information such as the
   * items being purchased, total amount, partial amount (if any), sales person ID, customer ID,
   * payment method, etc.
   * @returns The `create` function is returning an object with a message property indicating that the
   * order was created successfully. The return statement is `{ message: 'Order created successfully!'
   * }`.
   */
  async create(createSaleDto: CreateSalesOrderDto) {
    const { items, ...orderDto } = createSaleDto;
    //  Compute amountPaid / amountPending / paymentStatus / paymentCompletedDate
    const totalAmount = new Decimal(orderDto.totalAmount);
    const paidAmount = new Decimal(orderDto.partialAmount ?? '0');

    let order;
    await this.db.transaction(async (tx) => {
      const salesPerson = await tx
        .select({ id: salesStaff.id })
        .from(salesStaff)
        .where(eq(salesStaff.id, orderDto.salesPersonId))
        .limit(1);

      if (!salesPerson || !(salesPerson.length > 0)) {
        throw new NotFoundException('Sales person not found!');
      }

      const customerRec = await tx
        .select({ id: customer.id })
        .from(customer)
        .where(eq(customer.id, orderDto.customerId))
        .limit(1);
      if (!customerRec || !(customerRec.length > 0)) {
        throw new NotFoundException('Customer not found!');
      }

      if (paidAmount.lt(0) || paidAmount.gt(totalAmount)) {
        throw new ConflictException(
          `Invalid partialAmount: must be between 0.00 and totalAmount`,
        );
      }
      const pendingAmount = totalAmount.minus(paidAmount);

      let paymentStatus: 'no-payment' | 'partial' | 'completed' = 'no-payment';
      let paymentCompletedDate: Date | null = null;
      if (paidAmount.eq(totalAmount)) {
        paymentStatus = 'completed';
        paymentCompletedDate = new Date();
      } else if (paidAmount.gt(0)) {
        paymentStatus = 'partial';
      }

      order = await tx
        .insert(salesOrder)
        .values({
          ...orderDto,
          paymentStatus,
          amountPaid: paidAmount.toFixed(2),
          amountPending: pendingAmount.toFixed(2),
          paymentCompletedDate,
        })
        .returning();

      if (!order) {
        throw new ConflictException('Failed to create sales order');
      }

      const catalogIds = Array.from(new Set(items.map((i) => i.catelogId))); // deduplicate
      const actualIds = await this.db
        .select({ id: productCatalog.id })
        .from(productCatalog)
        .where(inArray(productCatalog.id, catalogIds));

      if (catalogIds.length !== actualIds.length) {
        throw new NotFoundException(
          'Some items are not found in the product catalog!',
        );
      }

      const itemsToInsert = items.map((item) => ({
        ...item,
        orderId: order[0].id,
      }));

      const insertedItems = await tx
        .insert(salesOrderItem)
        .values(itemsToInsert)
        .returning({ id: salesOrderItem.id });

      const measurementRecords = items
        .map((item, index) => {
          if (!item.measurement) return null;

          return {
            ...item.measurement,
            orderItemId: insertedItems[index].id,
          };
        })
        .filter((m) => m !== null); // Remove nulls

      if (measurementRecords.length > 0) {
        await tx.insert(orderItemMeasurements).values(measurementRecords);
      }
    });

    if (paidAmount.gt(0)) {
      const args = {
        orderId: order[0].id,
        paymentMethod: orderDto.paymentMethod as
          | 'cash'
          | 'visa'
          | 'bank_transfer',
        amount: paidAmount.toFixed(2),
      };
      await this.db.insert(salesTransactions).values(args);
    }
    return { message: `Order created successfully!` };
  }

  /**
   * The `findAll` function asynchronously retrieves all records from the `salesOrder` table using a
   * select query.
   * @returns The `findAll` function is returning a promise that resolves to the result of selecting
   * all records from the `salesOrder` table using the `select` method of the `db` object. The `await`
   * keyword is used to wait for the promise to resolve before returning the result.
   */
  async findAll() {
    return await this.db.select().from(salesOrder).orderBy(desc(salesOrder.createdAt));
  }

  /**
   * This TypeScript function retrieves a sales order with the specified ID along with related
   * customer, salesperson, and order items data from a database.
   * @param {number} id - The `findOne` function you provided is an asynchronous function that
   * retrieves a sales order based on the given `id`. Here's a breakdown of the function:
   * @returns The `findOne` method is returning an object that contains information about a sales order
   * with the specified `id`. The returned object includes details such as the sales order itself, the
   * customer associated with the order, the sales person responsible for the order, and an array of
   * items included in the order. The method first fetches the necessary data from the database using
   * the provided `id`, processes the retrieved rows
   */
  async findOne(id: number) {
    // 1. Get order + items + customer + salesPerson
    const orderRows = await this.db
      .select()
      .from(salesOrder)
      .leftJoin(salesOrderItem, eq(salesOrderItem.orderId, salesOrder.id))
      .leftJoin(customer, eq(customer.id, salesOrder.customerId))
      .leftJoin(salesStaff, eq(salesStaff.id, salesOrder.salesPersonId))
      .where(eq(salesOrder.id, id));

    if (orderRows.length === 0) {
      throw new NotFoundException(`Sales order #${id} not found!`);
    }

    const firstRow = orderRows[0];

    // 2. Group item rows
    const itemIds = orderRows
      .filter((row) => row.sales_order_items != null)
      .map((row) => row.sales_order_items.id);

    // 3. Get measurement records
    const measurements = itemIds.length
      ? await this.db
          .select()
          .from(orderItemMeasurements)
          .where(inArray(orderItemMeasurements.orderItemId, itemIds))
      : [];

    // 4. Map measurements by orderItemId
    const measurementMap = new Map<
      number,
      typeof orderItemMeasurements.$inferSelect
    >();
    for (const m of measurements) {
      measurementMap.set(m.orderItemId, m);
    }

    // 5. Construct final order object
    const result = {
      ...firstRow.sales_orders,
      customer: firstRow.customers,
      salesPerson: firstRow.sales_staff,
      items: orderRows
        .filter((row) => row.sales_order_items != null)
        .map((row) => {
          const item = row.sales_order_items;
          const measurement = measurementMap.get(item.id);
          return {
            ...item,
            measurement: item.type === 'custom' ? (measurement ?? null) : null,
          };
        }),
    };

    return result;
  }

  /**
   * This TypeScript function updates a sales order in a database with new information and items.
   * @param {number} id - The `id` parameter in the `update` function represents the unique identifier
   * of the sales order that you want to update. It is used to locate the specific sales order in the
   * database that needs to be modified.
   * @param {UpdateSaleDto} updateSaleDto - The `updateSaleDto` parameter is an object containing
   * information about the sale order that needs to be updated. It may include properties such as
   * `completedDate`, `status`, and an array of `items` representing the items in the sale order.
   * @returns The `update` function is returning an object with a message property indicating that the
   * order with the ID `id` has been updated successfully. The message is in the format `Order
   * INV- updated successfully!`.
   */
  async update(id: number, updateSaleDto: UpdateSaleDto) {
    const { items, ...orderDto } = updateSaleDto;

    // 1) Verify order exists
    const [existingOrder] = await this.db
      .select()
      .from(salesOrder)
      .where(eq(salesOrder.id, id));
    if (!existingOrder) {
      throw new NotFoundException('Sales order not found!');
    }

    // 2) Decide final status
    const newStatus = orderDto.completedDate ? 'completed' : orderDto.status;

    // 3) All in one TX
    await this.db.transaction(async (tx) => {
      // 3a) Update order header
      await tx
        .update(salesOrder)
        .set({ ...orderDto, status: newStatus })
        .where(eq(salesOrder.id, id));

      // 3b) Wipe out old items
      await tx.delete(salesOrderItem).where(eq(salesOrderItem.orderId, id));

      // 3c) Bulk-insert new items
      if (items.length) {
        await tx.insert(salesOrderItem).values(
          items.map((item) => ({
            orderId: id,
            catelogId: item.catelogId,
            description: item.description,
            qty: item.qty,
            sku: item.sku,
            price: item.price,
            total: item.total,
            modelName: item.modelName,
            modelPrice: item.modelPrice,
          })),
        );
      }
    });

    return { message: `Order INV-${id} updated successfully!` };
  }

  /**
   * This TypeScript function cancels a sales order by updating its status to 'cancelled' in the
   * database.
   * @param {number} id - The `id` parameter in the `cancel` function is a number that represents the
   * unique identifier of the sales order that needs to be cancelled.
   * @returns The `cancel` function is returning an object with a message property indicating the
   * success of the cancellation. The message includes the order ID that was cancelled. The return
   * statement is `{ message: `Order INV- canncelled successfully!` }`.
   */
  async cancel(id: number) {
    const order = await this.db
      .select()
      .from(salesOrder)
      .where(eq(salesOrder.id, id));
    if (!order || !(order.length > 0)) {
      throw new NotFoundException('Sales order not found!');
    }
    await this.db
      .update(salesOrder)
      .set({ status: 'cancelled' })
      .where(eq(salesOrder.id, id));
    return { message: `Order INV-${id} canncelled successfully!` };
  }

  /**
   * The function `listOrders` retrieves and organizes order data from multiple database tables into a
   * structured format for display.
   * @returns An array of orders is being returned. Each order object contains the order ID, date,
   * customer information (ID, name, phone, email), items in the order (each item includes ID, name,
   * SKU, price, quantity, and category), total amount, and status.
   */
  async listOrders() {
    const rows = await this.db
      .select()
      .from(salesOrder)
      .leftJoin(salesOrderItem, eq(salesOrderItem.orderId, salesOrder.id))
      .leftJoin(customer, eq(customer.id, salesOrder.customerId))
      .leftJoin(
        productCatalog,
        eq(productCatalog.id, salesOrderItem.catelogId),
      );

    const ordersMap = new Map();

    for (const row of rows) {
      const order = row.sales_orders;
      const item = row.sales_order_items;
      const customerData = row.customers;
      const catalog = row.product_catelog;

      if (!ordersMap.has(order.id)) {
        ordersMap.set(order.id, {
          id: order.id,
          date: order.createdAt,
          customer: {
            id: customerData.id,
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email,
          },
          items: [],
          total: parseFloat(order.totalAmount?.toString() || '0'),
          status: order.status,
        });
      }

      if (item) {
        ordersMap.get(order.id)!.items.push({
          id: item.id,
          name: item.description,
          sku: item.sku,
          price: parseFloat(item.price?.toString() || '0'),
          quantity: item.qty,
          category: catalog?.categoryName || '', // fill from catalog or fallback
        });
      }
    }

    return Array.from(ordersMap.values());
  }

  /**
   * This function retrieves a list of sales order items based on the provided order ID asynchronously.
   * @param {number} orderId - The `orderId` parameter is the unique identifier of a sales order for
   * which you want to retrieve the order items.
   * @returns The `listSalesOrderItems` function returns a list of sales order items that belong to the
   * specified `orderId`.
   */
  async listSalesOrderItems(orderId: number) {
    const orderItems = await this.db
      .select({
        id: salesOrderItem.id,
        orderId: salesOrderItem.orderId,
        catelogId: salesOrderItem.catelogId,
        description: salesOrderItem.description,
        qty: salesOrderItem.qty,
        sku: salesOrderItem.sku,
        price: salesOrderItem.price,
        total: salesOrderItem.total,
      })
      .from(salesOrderItem)
      .where(eq(salesOrderItem.orderId, orderId));
    return orderItems;
  }

  /**
   * The function `listOrdersForTailoring` retrieves orders with specific details for tailoring
   * purposes.
   * @returns This function `listOrdersForTailoring` returns a list of orders for tailoring. Each order
   * includes the following properties: id, date, totalAmount, priority, status, notes, customer (with
   * id, name, phone, and preferences), and items (an array of items with id, name, type, and quantity).
   */
  async listOrdersForTailoring() {
    const orders = await this.db
      .select({
        id: salesOrder.id,
        date: salesOrder.createdAt,
        totalAmount: salesOrder.totalAmount,
        priority: salesOrder.priority,
        status: salesOrder.status,
        notes: salesOrder.notes,
        customer: sql`
      json_build_object(
        'id', ${customer.id},
        'name', ${customer.name},
        'phone', ${customer.phone},
        'preferences', ${customer.preferences}
      )
    `.as('customer'),
        items: sql`
      (
        SELECT COALESCE(json_agg(
          json_build_object(
            'id', si.id,
            'name', si.description,
            'type', pc.type,
            'qty', si.qty
          )
        ), '[]')
        FROM ${salesOrderItem} si
        JOIN ${productCatalog} pc ON pc.id = si.catelog_id
        WHERE si."orderId" = ${salesOrder.id} AND 
        (pc.type = 'custom')
      )
    `.as('items'),
      })
      .from(salesOrder)
      .leftJoin(customer, eq(customer.id, salesOrder.customerId));

    return orders;
  }

  /**
   * This TypeScript function retrieves payment details for a specific sales order ID from a database
   * asynchronously.
   * @param {number} id - The `getPaymentDetails` function is an asynchronous function that retrieves
   * payment details for a specific sales order ID. The function takes an `id` parameter of type
   * `number`, which represents the ID of the sales order for which payment details are to be fetched.
   * @returns The `getPaymentDetails` function is returning an object with the following properties:
   * `orderPaymentStatus`, `pendingAmount`, `paidAmount`, and `totalAmount`. These properties are
   * retrieved from the `salesOrder` table in the database based on the provided `id`.
   */
  async getPaymentDetails(id: number) {
    return await this.db
      .select({
        orderPaymentStatus: salesOrder.paymentStatus,
        pendingAmount: salesOrder.amountPending,
        paidAmount: salesOrder.amountPaid,
        totalAmount: salesOrder.totalAmount,
      })
      .from(salesOrder)
      .where(eq(salesOrder.id, id));
  }
}
