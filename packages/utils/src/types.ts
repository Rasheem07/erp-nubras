// Define invoice type
export interface InvoiceItem {
  description: string
  quantity: number
  price: number
}

export interface InvoiceTax {
  name: string
  rate: number
  enabled: boolean
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customer: string
  customerEmail?: string
  customerAddress?: string
  issueDate: string
  dueDate: string
  status: string
  items: InvoiceItem[]
  taxes?: InvoiceTax[]
  subtotal: number
  tax?: number
  total: number
  notes?: string
  termsAndConditions?: string
}
