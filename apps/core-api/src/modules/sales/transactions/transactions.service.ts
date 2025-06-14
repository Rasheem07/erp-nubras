import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import { salesOrder, salesTransactions } from 'src/core/drizzle/schema';
import { eq } from 'drizzle-orm';
import Decimal from 'decimal.js';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  /**
   * Create a new payment transaction.
   * - Ensures the new payment does not push `amountPaid` over `totalAmount`.
   * - Updates `amountPaid`, `amountPending`, `paymentStatus`, and `paymentCompletedDate` on the order.
   * - Inserts a row into `sales_transactions`.
   */
  async create(createDto: CreateTransactionDto) {
    const { orderId, paymentMethod, amount: rawAmount } = createDto;

    // 1) Fetch existing order balances
    const [order] = await this.db
      .select({
        id: salesOrder.id,
        totalAmount: salesOrder.totalAmount,
        amountPaid: salesOrder.amountPaid,
        amountPending: salesOrder.amountPending,
        paymentStatus: salesOrder.paymentStatus,
      })
      .from(salesOrder)
      .where(eq(salesOrder.id, orderId))
      .limit(1);

    if (!order.id) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    // 2) Parse as Decimal for exact arithmetic
    const totalAmount = new Decimal(order.totalAmount);
    const alreadyPaid = new Decimal(order.amountPaid);
    const alreadyPending = new Decimal(order.amountPending);
    const newPayment = new Decimal(rawAmount);

    // 3) Basic validation
    if (newPayment.lte(0)) {
      throw new BadRequestException(`Payment amount must be > 0`);
    }

    // 4) Compute new paid & pending
    const newPaidTotal = alreadyPaid.plus(newPayment);
    if (newPaidTotal.gt(totalAmount)) {
      throw new BadRequestException(
        `Payment exceeds total. Already paid: ${alreadyPaid.toFixed(
          2,
        )}, trying to pay: ${newPayment.toFixed(
          2,
        )}, but order total is: ${totalAmount.toFixed(2)}`,
      );
    }

    const newPending = totalAmount.minus(newPaidTotal);

    // 5) Determine updated paymentStatus and paymentCompletedDate
    let updatedStatus = order.paymentStatus;
    let completedAt = null;

    if (newPaidTotal.eq(totalAmount)) {
      updatedStatus = 'completed';
      completedAt = new Date(); // mark now as payment completed
    } else if (newPaidTotal.gt(0)) {
      updatedStatus = 'partial';
      completedAt = null;
    }

    // 6) Wrap in a transaction (optional but recommended) to keep financial integrity
    return await this.db.transaction(async (tx) => {
      // 6a) Update sales_orders
      const [updatedOrder] = await tx
        .update(salesOrder)
        .set({
          amountPaid: newPaidTotal.toFixed(2),
          amountPending: newPending.toFixed(2),
          paymentStatus: updatedStatus,
          paymentCompletedDate: completedAt,
        })
        .where(eq(salesOrder.id, orderId))
        .returning({
          id: salesOrder.id,
          amountPaid: salesOrder.amountPaid,
          amountPending: salesOrder.amountPending,
          paymentStatus: salesOrder.paymentStatus,
          paymentCompletedDate: salesOrder.paymentCompletedDate,
        });

      // 6b) Insert into sales_transactions
      const [insertedTx] = await tx
        .insert(salesTransactions)
        .values({
          orderId,
          paymentMethod,
          amount: newPayment.toFixed(2),
        })
        .returning({
          id: salesTransactions.id,
          orderId: salesTransactions.orderId,
          paymentMethod: salesTransactions.paymentMethod,
          amount: salesTransactions.amount,
          createdAt: salesTransactions.createdAt,
          updatedAt: salesTransactions.updatedAt,
        });

      return {
        message: 'Transaction recorded successfully!',
      };
    });
  }

  async findAll() {
    return await this.db.select().from(salesTransactions);
  }

  private async checkIfExists(id: number) {
    const [trans] = await this.db
      .select({ id: salesTransactions })
      .from(salesTransactions)
      .where(eq(salesTransactions.id, id));
    if (!trans.id) {
      throw new NotFoundException(`Transaction with #${id} not found !`);
    }
  }

    /**
   * Retrieve a single transaction by its ID.
   * Throws NotFoundException if not found.
   */
  async findOne(id: number) {
    const [tx] = await this.db
      .select()
      .from(salesTransactions)
      .where(eq(salesTransactions.id, id))
      .limit(1);

    if (!tx || !tx.id) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }

    return tx;
  }

  /**
   * Update an existing payment transaction.
   * - Ensures that changing the payment amount does not push `amountPaid` over `totalAmount`.
   * - Adjusts the order’s `amountPaid`, `amountPending`, `paymentStatus`, and `paymentCompletedDate`.
   * - Updates the transaction row itself.
   */
  async update(id: number, updateDto: UpdateTransactionDto) {
    // 1) Fetch existing transaction
    const [existingTx] = await this.db
      .select({
        id: salesTransactions.id,
        orderId: salesTransactions.orderId,
        paymentMethod: salesTransactions.paymentMethod,
        amount: salesTransactions.amount,
      })
      .from(salesTransactions)
      .where(eq(salesTransactions.id, id))
      .limit(1);

    if (!existingTx || !existingTx.id) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }

    const { orderId, amount: oldRawAmount } = existingTx;
    const oldAmount = new Decimal(oldRawAmount);

    // 2) Fetch the related order
    const [order] = await this.db
      .select({
        id: salesOrder.id,
        totalAmount: salesOrder.totalAmount,
        amountPaid: salesOrder.amountPaid,
        amountPending: salesOrder.amountPending,
        paymentStatus: salesOrder.paymentStatus,
        paymentCompletedDate: salesOrder.paymentCompletedDate
      })
      .from(salesOrder)
      .where(eq(salesOrder.id, orderId))
      .limit(1);

    if (!order || !order.id) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    // 3) Parse new amount & existing balances
    const totalAmount = new Decimal(order.totalAmount);
    const alreadyPaid = new Decimal(order.amountPaid);
    const newPayment = new Decimal(updateDto.amount);

    // 4) Prevent invalid new amount
    if (newPayment.lte(0)) {
      throw new BadRequestException(`Payment amount must be > 0`);
    }

    // 5) Compute how the new amount changes the order’s paid/pending
    //    Remove old tx amount, then add new amount
    const adjustedPaid = alreadyPaid.minus(oldAmount).plus(newPayment);
    if (adjustedPaid.gt(totalAmount)) {
      throw new BadRequestException(
        `Updated payment exceeds total. Already paid (before change): ${alreadyPaid.toFixed(
          2,
        )}, old transaction: ${oldAmount.toFixed(
          2,
        )}, new transaction: ${newPayment.toFixed(
          2,
        )}, order total is: ${totalAmount.toFixed(2)}`,
      );
    }

    const adjustedPending = totalAmount.minus(adjustedPaid);

    // 6) Determine updated paymentStatus and paymentCompletedDate
    let updatedStatus = order.paymentStatus;
    let completedAt: Date | null = order.paymentCompletedDate ?? null;

    if (adjustedPaid.eq(totalAmount)) {
      updatedStatus = 'completed';
      completedAt = new Date();
    } else if (adjustedPaid.gt(0)) {
      updatedStatus = 'partial';
      completedAt = null;
    }

    // 7) Wrap in transaction for consistency
    return await this.db.transaction(async (tx) => {
      // 7a) Update sales_orders with new paid/pending/status
      const [updatedOrder] = await tx
        .update(salesOrder)
        .set({
          amountPaid: adjustedPaid.toFixed(2),
          amountPending: adjustedPending.toFixed(2),
          paymentStatus: updatedStatus,
          paymentCompletedDate: completedAt,
        })
        .where(eq(salesOrder.id, orderId))
        .returning({
          id: salesOrder.id,
          amountPaid: salesOrder.amountPaid,
          amountPending: salesOrder.amountPending,
          paymentStatus: salesOrder.paymentStatus,
          paymentCompletedDate: salesOrder.paymentCompletedDate,
        });

      // 7b) Update the transaction row
      const [updatedTx] = await tx
        .update(salesTransactions)
        .set({
          paymentMethod: updateDto.paymentMethod,
          amount: newPayment.toFixed(2),
        })
        .where(eq(salesTransactions.id, id))
        .returning({
          id: salesTransactions.id,
          orderId: salesTransactions.orderId,
          paymentMethod: salesTransactions.paymentMethod,
          amount: salesTransactions.amount,
          createdAt: salesTransactions.createdAt,
          updatedAt: salesTransactions.updatedAt,
        });

      return {
        message: `Transaction #${id} updated successfully!`,
      };
    });
  }



}
