"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { ArrowLeft, Printer } from "lucide-react"
// import { InvoiceDownloadButton } from "@/components/invoice-download-button"
import type { Invoice } from "@nubras/utils/types.js"

// Sample data for invoices - in a real app, you would fetch this from your API
const invoicesData: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    customer: "Dubai Fashion LLC",
    issueDate: "2023-04-01",
    dueDate: "2023-05-01",
    status: "Paid",
    subtotal: 1000.0,
    tax: 50.0,
    total: 1050.0,
    items: [
      {
        description: "Custom Tailored Suit",
        quantity: 1,
        price: 800.0,
      },
      {
        description: "Alterations",
        quantity: 2,
        price: 100.0,
      },
    ],
    notes: "Thank you for your business!",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    customer: "Al Ain Retail Group",
    issueDate: "2023-04-05",
    dueDate: "2023-05-05",
    status: "Pending",
    subtotal: 2500.0,
    tax: 125.0,
    total: 2625.0,
    items: [
      {
        description: "Uniform Shirts",
        quantity: 10,
        price: 150.0,
      },
      {
        description: "Uniform Pants",
        quantity: 10,
        price: 100.0,
      },
    ],
    notes: "",
  },
  // Add other invoices here
]

export default function InvoiceViewPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to get invoice from localStorage first (for newly created invoices)
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
        setLoading(false)
        return
      } catch (error) {
        console.error("Error parsing invoice data:", error)
      }
    }

    // Otherwise, find the invoice by ID from our sample data
    const foundInvoice = invoicesData.find((inv) => inv.id === params.id)
    if (foundInvoice) {
      setInvoice(foundInvoice)
    }

    setLoading(false)
  }, [params.id])

  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading invoice...</div>
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Invoice Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested invoice could not be found.</p>
        <Button onClick={handleBack}>Back to Invoices</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with buttons - will be hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Invoice #{invoice.invoiceNumber}</h2>
            <p className="text-muted-foreground">View and print invoice details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          {/* <InvoiceDownloadButton invoice={invoice} /> */}
        </div>
      </div>

      {/* Print-optimized styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Invoice Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-500 mt-1 text-lg">#{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">Nubras Tailoring</div>
            <p className="text-gray-600">Dubai, UAE</p>
            <p className="text-gray-600">info@nubras.com</p>
            <p className="text-gray-600">+971 4 123 4567</p>
          </div>
        </div>

        {/* Bill To & Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mt-8 mb-8">
          <div className="border-r pr-8">
            <h2 className="text-gray-600 font-medium mb-3 text-lg">Bill To:</h2>
            <p className="font-bold text-xl mb-1">{invoice.customer}</p>
            {invoice.customerEmail && <p className="text-gray-600 mb-1">{invoice.customerEmail}</p>}
            {invoice.customerAddress && <p className="text-gray-600 whitespace-pre-line">{invoice.customerAddress}</p>}
          </div>
          <div>
            <div className="grid grid-cols-2 gap-y-3 text-base">
              <div className="text-gray-600">Invoice Number:</div>
              <div className="font-medium text-right">{invoice.invoiceNumber}</div>

              <div className="text-gray-600">Issue Date:</div>
              <div className="font-medium text-right">{new Date(invoice.issueDate).toLocaleDateString()}</div>

              <div className="text-gray-600">Due Date:</div>
              <div className="font-medium text-right">{new Date(invoice.dueDate).toLocaleDateString()}</div>

              <div className="text-gray-600">Status:</div>
              <div className="font-medium text-right capitalize">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    invoice.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "Overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mt-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-3 px-4 font-semibold text-gray-600 w-[40%] border-b">Description</th>
                <th className="py-3 px-4 font-semibold text-gray-600 text-right border-b">Quantity</th>
                <th className="py-3 px-4 font-semibold text-gray-600 text-right border-b">Unit Price</th>
                <th className="py-3 px-4 font-semibold text-gray-600 text-right border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items &&
                invoice.items.map((item: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4 border-b">{item.description}</td>
                    <td className="py-3 px-4 text-right border-b">{item.quantity}</td>
                    <td className="py-3 px-4 text-right border-b">
                      {item.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-4 text-right border-b font-medium">
                      {(item.quantity * item.price).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-80 border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between py-2">
              <div className="text-gray-600">Subtotal:</div>
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
                    <div className="text-gray-600">
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
            <div className="border-t my-2"></div>
            <div className="flex justify-between py-2">
              <div className="font-bold">Total:</div>
              <div className="font-bold text-xl">
                AED {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 border-t pt-4">
            <h3 className="font-medium text-gray-700 mb-2">Notes:</h3>
            <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mt-8 border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-2">Terms and Conditions:</h3>
          <p className="text-gray-600 whitespace-pre-line">
            {invoice.termsAndConditions || "Standard terms and conditions apply."}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 border-t pt-4">
          <p className="mb-1">Thank you for your business!</p>
          <p className="text-sm">Nubras Tailoring LLC • Dubai, UAE • Tax Registration: 12345678</p>
        </div>
      </div>
    </div>
  )
}
