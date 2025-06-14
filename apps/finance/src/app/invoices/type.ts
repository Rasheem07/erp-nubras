export type invoiceStatus = 'draft' | 'paid' | 'sent' | 'rejected' | 'overdue';

export interface Invoice {
    id: number;
    invoiceType: string;
    customerId?: number;
    supplierId: number;
    status: invoiceStatus;
    date: Date;
    dueDate: Date;
    deliveryDate?: Date;
    shippingMethod?: string;
    notes?: string;
    netAmount: string;
    taxAmount: string;
    totalAmount: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InvoiceItem {
    id: number;
    itemId: number;
    quantity: number;
    total: string;
}

export interface InvoiceTax {
   id: number;
   taxName: string;
   rate: number;
   applyOn: string;
}

export interface FullInvoice extends Invoice {
    items: InvoiceItem[],
    taxes: InvoiceTax[]
}

