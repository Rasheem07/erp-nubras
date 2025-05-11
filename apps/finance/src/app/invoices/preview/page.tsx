"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Separator } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { ArrowLeft, Printer, Check } from "lucide-react"
// import { InvoicePDFDownloadButton } from "@/components/invoice-pdf-generator"
import dynamic from "next/dynamic"

// Dynamically import the PDF viewer component with SSR disabled
const PDFViewerComponent = dynamic(() => import("@/components/pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[800px] w-full border rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading PDF viewer...</p>
      </div>
    </div>
  ),
})

export default function InvoicePreviewPage() {
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // In a real app, you would fetch this from your API
    const savedInvoice = localStorage.getItem("invoicePreview")
    if (savedInvoice) {
      try {
        const parsedInvoice = JSON.parse(savedInvoice)
        // Ensure the invoice has the required properties
        if (!parsedInvoice.taxes) {
          parsedInvoice.taxes = []
        }
        if (!parsedInvoice.items) {
          parsedInvoice.items = []
        }
        setInvoice(parsedInvoice)
      } catch (error) {
        console.error("Error parsing invoice data:", error)
      }
    }
    setLoading(false)
  }, [])

  const handlePrint = () => {
    setShowPdfPreview(true)
  }

  const handleConfirm = () => {
    // In a real app, you would save the invoice to your database
    alert("Invoice confirmed and saved!")
    router.push("/invoices")
  }

  if (loading) {
    return <div>Loading invoice preview...</div>
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">No Invoice Data Found</h2>
        <p className="text-muted-foreground mb-6">There is no invoice data to preview.</p>
        <Button onClick={() => router.push("/invoices/create")}>Create New Invoice</Button>
      </div>
    )
  }

  if (showPdfPreview && isClient) {
    return <PDFViewerComponent invoice={invoice} onBack={() => setShowPdfPreview(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Invoice Preview</h2>
            <p className="text-muted-foreground">Review your invoice before confirming</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            View PDF
          </Button>
          {/* {isClient && <InvoicePDFDownloadButton invoice={invoice} />} */}
          <Button onClick={handleConfirm}>
            <Check className="mr-2 h-4 w-4" />
            Confirm & Save
          </Button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="print:shadow-none bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-500 mt-1">#{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-800">Nubras Tailoring</div>
            <p className="text-gray-500">Dubai, UAE</p>
            <p className="text-gray-500">info@nubras.com</p>
            <p className="text-gray-500">+971 4 123 4567</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-10">
          <div>
            <h2 className="text-gray-500 font-medium mb-2">Bill To:</h2>
            <p className="font-bold text-gray-800">{invoice.customer}</p>
            <p className="text-gray-600">{invoice.customerEmail}</p>
            <p className="text-gray-600 whitespace-pre-line">{invoice.customerAddress}</p>
          </div>
          <div className="text-right">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Invoice Number:</div>
              <div className="font-medium">{invoice.invoiceNumber}</div>

              <div className="text-gray-500">Issue Date:</div>
              <div className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</div>

              <div className="text-gray-500">Due Date:</div>
              <div className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</div>

              <div className="text-gray-500">Status:</div>
              <div className="font-medium capitalize">{invoice.status}</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {(item.quantity * item.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-80">
            <div className="flex justify-between py-2">
              <div className="text-gray-500">Subtotal:</div>
              <div className="font-medium">
                AED {invoice.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
            {invoice.taxes &&
              Array.isArray(invoice.taxes) &&
              invoice.taxes
                .filter((tax: any) => tax.enabled)
                .map((tax: any, index: number) => (
                  <div key={index} className="flex justify-between py-2">
                    <div className="text-gray-500">
                      {tax.name} ({tax.rate}%):
                    </div>
                    <div className="font-medium">
                      AED{" "}
                      {((invoice.subtotal * tax.rate) / 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                ))}
            <Separator className="my-2" />
            <div className="flex justify-between py-2">
              <div className="font-bold">Total:</div>
              <div className="font-bold text-xl">
                AED {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8">
            <h3 className="font-medium text-gray-700 mb-2">Notes:</h3>
            <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-medium text-gray-700 mb-2">Terms and Conditions:</h3>
          <p className="text-gray-600 whitespace-pre-line">{invoice.termsAndConditions}</p>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  )
}
