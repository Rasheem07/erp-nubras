import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  customer,
  salesOrder,
  salesQuotations,
  salesQuoteItem,
} from 'src/core/drizzle/schema/sales.schema';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class QuotationsService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(createQuotationDto: CreateQuotationDto) {
    const { items, ...quote } = createQuotationDto;
    await this.db.transaction(async (tx) => {
      const customerRecord = await tx
        .select({ id: customer.id })
        .from(customer);
      if (!customerRecord || !(customerRecord.length > 0)) {
        throw new NotFoundException('Customer not found!');
      }

      const quotation = await tx
        .insert(salesQuotations)
        .values(quote)
        .returning();
      if (!(quotation.length > 0)) {
        throw new ConflictException(`Failed to create a quotation!`);
      }

      await tx.insert(salesQuoteItem).values(
        items.map((item) => ({
          quoteId: quotation[0].id,
          description: item.description,
          catalogId: item.catalogId,
          sku: item.sku,
          qty: item.qty,
          price: item.price,
          total: item.total,
        })),
      );
    });

    return { message: 'Sales quotation created successfully!' };
  }

 async findAll() {
  const rows = await this.db 
    .select({
      id:             salesQuotations.id,
      validUntil:     salesQuotations.validUntil,
      customerId:     salesQuotations.customerId,
      customerName:   salesQuotations.customerName,
      customerPhone:  customer.phone,
      notes:          salesQuotations.notes,
      terms:          salesQuotations.terms,
      itemCount:      sql`COUNT(${salesQuoteItem.id})`.as('itemCount'),
      totalAmount:    salesQuotations.totalAmount,
      status:         salesQuotations.status, 
      createdAt:  salesQuotations.createdAt,
      // this will be `true` if at least one matching salesOrders row exists
      convertedToSale: sql`COUNT(${salesOrder.id}) > 0`.as('convertedToSale'),
    })
    .from(salesQuotations)
    .leftJoin(salesQuoteItem, eq(salesQuoteItem.quoteId, salesQuotations.id))
    .leftJoin(customer,       eq(customer.id,          salesQuotations.customerId))
    .leftJoin(salesOrder,    eq(salesOrder.quoteId,   salesQuotations.id))
    .groupBy(salesQuotations.id, customer.phone)

  return rows.map(r => ({
    id:             r.id,
    validUntil:     r.validUntil,
    customerId:     r.customerId,
    customerName:   r.customerName,
    customerPhone:  r.customerPhone,
    notes:          r.notes,
    terms:          r.terms,
    status:         r.status,
    createdAt:      r.createdAt,
    itemCount:      Number(r.itemCount),
    totalAmount:    parseFloat(r.totalAmount as unknown as string),
    convertedToSale: Boolean(r.convertedToSale),
  }))
}

  async findOne(id: number) {
  const [row] = await this.db
    .select({
      id:           salesQuotations.id,
      validUntil:   salesQuotations.validUntil,
      customerId:   salesQuotations.customerId,
      customerName: salesQuotations.customerName,
      subtotal:     salesQuotations.subtotal,
      discountAmount: salesQuotations.discountAmount,
      taxAmount:      salesQuotations.taxAmount,
      totalAmount:    salesQuotations.totalAmount,
      notes:        salesQuotations.notes,
      terms:        salesQuotations.terms,
      createdAt:    salesQuotations.createdAt,
      updatedAt:    salesQuotations.updatedAt,
      customer:     sql`row_to_json(${customer}.*)`.as('customer'),
      items: sql`
        coalesce(
          json_agg(
            json_build_object(
              'id',          ${salesQuoteItem.id},
              'catalogId',   ${salesQuoteItem.catalogId},
              'description', ${salesQuoteItem.description},
              'sku',         ${salesQuoteItem.sku},
              'qty',         ${salesQuoteItem.qty},
              'price',       ${salesQuoteItem.price},
              'total',       ${salesQuoteItem.total}
            )
          ) FILTER (WHERE ${salesQuoteItem.quoteId} IS NOT NULL),
          '[]'
        )
      `.as('items'),
    })
    .from(salesQuotations)
    .leftJoin(customer,        eq(customer.id,        salesQuotations.customerId))
    .leftJoin(salesQuoteItem, eq(salesQuoteItem.quoteId, salesQuotations.id))
    .where(eq(salesQuotations.id, id))
    .groupBy(
      salesQuotations.id,
      customer.id
    );

  if (!row) throw new NotFoundException('Quotation not found');
  return row;
}


  async update(id: number, updateQuotationDto: UpdateQuotationDto) {
    const { items, ...quoteDto } = updateQuotationDto;
    const quote = await this.db
      .select({ id: salesQuotations.id })
      .from(salesQuotations)
      .where(eq(salesQuotations.id, id))
      .limit(1);

    if (!quote || !(quote.length > 0)) {
      throw new NotFoundException(`Sales quotation #${id} not found!`);
    }

    await this.db.transaction(async (tx) => {
      const quoteRec = await tx
        .update(salesQuotations)
        .set(quoteDto)
        .where(eq(salesQuotations.id, id))
        .returning();

      if (!quoteRec) {
        throw new ConflictException(`Sales quotation #${id} failed to update!`);
      }

      await tx.delete(salesQuoteItem).where(eq(salesQuoteItem.quoteId, id))

      for (const item of items) {
        await tx
          .insert(salesQuoteItem)
          .values({
            quoteId: id,
            description: item.description!,
            catalogId: item.catalogId!,
            sku: item.sku!,
            qty: item.qty!,
            price: item.price!,
            total: item.total!
          });
      }
    });

    return { message: `Sales quotation #${id} updated successfully!` };
  }

  async remove(id: number) {
    const { rowCount } = await this.db
      .delete(salesQuotations)
      .where(eq(salesQuotations.id, id));

    if (!rowCount) {
      throw new NotFoundException(`Sales quotation #${id} not found!`);
    }

    return { message: `Sales quotation #${id} deleted successfully!` };
  }
}
