// src/accounting/repos/invoices.repository.ts

import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  invoices,
  invoiceTaxes,
  purchaseInvoiceItems,
  salesInvoiceItems,
} from 'src/core/drizzle/schema/accounting.schema';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { productCatalog } from 'src/core/drizzle/schema/sales.schema';
import { inventoryItems } from 'src/core/drizzle/schema/inventory.schema';

export interface FullInvoice {
  id: number;
  invoiceType: 'sales' | 'purchase';
  customerId: number | null;
  supplierId: number | null;
  status: string;
  date: Date;
  dueDate: Date;
  deliveryDate: Date | null;
  shippingMethod: string | null;
  notes: string | null;
  netAmount: string;
  taxAmount: string;
  totalAmount: string;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: number;
    invoiceId: number;
    itemId: number;
    quantity: number;
    total: string;
    // from product catalog / inventory
    name: string;
    sku: string | null;
    description: string | null;
  }>;
  taxes: Array<{
    id: number;
    invoiceId: number;
    taxName: string;
    rate: number;
    applyOn: string;
    enabled: boolean;
  }>;
}

@Injectable()
export class InvoicesRepository {
  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  /**
   * Create an invoice + its taxes + its items (sales or purchase)
   * all in one transaction.
   */
  async createInvoice(dto: CreateInvoiceDto) {
    const invoiceInsert = {
      invoiceType: dto.type,
      customerId: dto.type === 'sales' ? dto.customerId : null,
      supplierId: dto.type === 'purchase' ? dto.supplierId : null,
      date: new Date(dto.date),
      dueDate: new Date(dto.dueDate),
      deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
      shippingMethod: dto.shippingMethod,
      notes: dto.notes,
      netAmount: dto.netAmount.toString(),
      taxAmount: dto.taxAmount.toString(),
      totalAmount: dto.totalAmount.toString(),
    } as typeof invoices.$inferInsert;

    return this.db.transaction(async (tx) => {
      // 1) Insert main invoice row
      const [inv] = await tx.insert(invoices).values(invoiceInsert).returning();

      const invoiceId = inv.id;

      // 2) Insert taxes
      if (dto.taxes.length) {
        await tx.insert(invoiceTaxes).values(
          dto.taxes.map((t) => ({
            invoiceId,
            taxName: t.taxName,
            rate: t.rate,
            applyOn: t.applyOn,
            enabled: t.enabled,
          })),
        );
      }

      // 3) Insert line items
      const itemsTable =
        dto.type === 'sales' ? salesInvoiceItems : purchaseInvoiceItems;

      if (dto.items.length) {
        await tx.insert(itemsTable).values(
          dto.items.map((i) => ({
            invoiceId,
            itemId: i.itemId,
            quantity: i.quantity,
            total: i.total.toString(),
          })),
        );
      }

      return inv;
    });
  }

  /** Example read methods */
  async findAll() {
    return await this.db.select().from(invoices);
  }

  async findOne(id: number): Promise<FullInvoice> {
    // 1) Load the invoice
    const [invRow] = await this.db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
      .limit(1);

    if (!invRow) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }

    const isSales = invRow.invoiceType === 'sales';

    // 2) In parallel, load items + their product/inventory detail, and taxes
    const itemsQ = this.db
      .select({
        id:           isSales ? salesInvoiceItems.id           : purchaseInvoiceItems.id,
        invoiceId:    isSales ? salesInvoiceItems.invoiceId    : purchaseInvoiceItems.invoiceId,
        itemId:       isSales ? salesInvoiceItems.itemId       : purchaseInvoiceItems.itemId,
        quantity:     isSales ? salesInvoiceItems.quantity     : purchaseInvoiceItems.quantity,
        total:        isSales ? salesInvoiceItems.total        : purchaseInvoiceItems.total,
        name:         isSales ? productCatalog.name            : inventoryItems.name,
        sku:          isSales ? productCatalog.sku             : inventoryItems.sku,
        description:  isSales ? productCatalog.description     : inventoryItems.description,
      })
      .from(isSales ? salesInvoiceItems : purchaseInvoiceItems)
      .leftJoin(
        isSales ? productCatalog : inventoryItems,
        isSales
          ? eq(salesInvoiceItems.itemId, productCatalog.id)
          : eq(purchaseInvoiceItems.itemId, inventoryItems.id),
      )
      .where(
        isSales
          ? eq(salesInvoiceItems.invoiceId, id)
          : eq(purchaseInvoiceItems.invoiceId, id),
      );

    const taxesQ = this.db
      .select({
        id:        invoiceTaxes.id,
        invoiceId: invoiceTaxes.invoiceId,
        taxName:   invoiceTaxes.taxName,
        rate:      invoiceTaxes.rate,
        applyOn:   invoiceTaxes.applyOn,
        enabled:   invoiceTaxes.enabled,
      })
      .from(invoiceTaxes)
      .where(eq(invoiceTaxes.invoiceId, id));

    const [items, taxes] = await Promise.all([itemsQ, taxesQ]);

    // 3) Return the nicely‐shaped FullInvoice
    return {
      id:            invRow.id,
      invoiceType:   invRow.invoiceType as 'sales' | 'purchase',
      customerId:    invRow.customerId,
      supplierId:    invRow.supplierId,
      status:        invRow.status,
      date:          invRow.date,
      dueDate:       invRow.dueDate,
      deliveryDate:  invRow.deliveryDate,
      shippingMethod:invRow.shippingMethod,
      notes:         invRow.notes,
      netAmount:     invRow.netAmount,
      taxAmount:     invRow.taxAmount,
      totalAmount:   invRow.totalAmount,
      createdAt:     invRow.createdAt,
      updatedAt:     invRow.updatedAt,
      items,
      taxes,
    };
  }

  async updateInvoice(dto: UpdateInvoiceDto) {
    return this.db.transaction(async (tx) => {
      // 0) Fetch the current invoice
      const [current] = await tx
        .select()
        .from(invoices)
        .where(eq(invoices.id, dto.id))
        .limit(1);
      if (!current) {
        throw new NotFoundException(`Invoice #${dto.id} not found`);
      }

      // 1) Merge type & party IDs
      const newType = dto.type ?? current.invoiceType;
      let newCustomerId: number | null = null;
      let newSupplierId: number | null = null;

      if (newType === 'sales') {
        // sales must have customerId
        newCustomerId = dto.customerId ?? current.customerId;
        newSupplierId = null;
      } else if (newType === 'purchase') {
        // purchase must have supplierId
        newSupplierId = dto.supplierId ?? current.supplierId;
        newCustomerId = null;
      } else {
        throw new BadRequestException(
          `'type' must be "sales" or "purchase", got "${newType}".`,
        );
      }

      // 2) Validate exactly-one-party
      if (newType === 'sales' && newCustomerId == null) {
        throw new BadRequestException(
          'A sales invoice requires customerId to be set and supplierId to be null.',
        );
      }
      if (newType === 'purchase' && newSupplierId == null) {
        throw new BadRequestException(
          'A purchase invoice requires supplierId to be set and customerId to be null.',
        );
      }

      // 3) Perform the update in one shot
      const [updated] = await tx
        .update(invoices)
        .set({
          invoiceType: newType,
          customerId: newCustomerId,
          supplierId: newSupplierId,
          status: dto.status ?? current.status,
          date: dto.date ? new Date(dto.date) : current.date,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : current.dueDate,
          deliveryDate: dto.deliveryDate
            ? new Date(dto.deliveryDate)
            : current.deliveryDate,
          shippingMethod: dto.shippingMethod ?? current.shippingMethod,
          notes: dto.notes ?? current.notes,
          netAmount: dto.netAmount ?? current.netAmount,
          taxAmount: dto.taxAmount ?? current.taxAmount,
          totalAmount: dto.totalAmount ?? current.totalAmount,
        })
        .where(eq(invoices.id, dto.id))
        .returning();

      // 4) Replace taxes
      await tx.delete(invoiceTaxes).where(eq(invoiceTaxes.invoiceId, dto.id));
      if (dto.taxes && dto.taxes.length) {
        await tx.insert(invoiceTaxes).values(
          dto.taxes.map((t) => ({
            invoiceId: dto.id,
            taxName: t.taxName,
            rate: t.rate,
            applyOn: t.applyOn,
            enabled: t.enabled,
          })),
        );
      }

      // 5) Replace items (sales vs purchase)
      const itemsTable =
        newType === 'sales' ? salesInvoiceItems : purchaseInvoiceItems;
      await tx.delete(itemsTable).where(eq(itemsTable.invoiceId, dto.id));

      if (dto.items && dto.items.length) {
        await tx.insert(itemsTable).values(
          dto.items.map((i) => ({
            invoiceId: dto.id,
            itemId: i.itemId,
            quantity: i.quantity,
            total: i.total,
          })),
        );
      }

      return updated;
    });
  }
}
