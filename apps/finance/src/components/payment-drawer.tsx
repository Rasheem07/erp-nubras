"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Printer,
  Download,
} from "lucide-react"

// Mock data for a single payment
const mockPaymentData = {
  "pay-001": {
    id: "pay-001",
    date: "2023-04-28",
    reference: "PAY-2023-001",
    paymentMethod: "Bank Transfer",
    type: "outgoing",
    amount: 2500.0,
    currency: "AED",
    status: "Completed",
    payee: "XYZ Suppliers Ltd",
    description: "Payment for April inventory",
    category: "Inventory",
    accountFrom: "Main Business Account",
    accountTo: "Supplier Bank Account",
    notes: "Regular monthly inventory payment",
    attachments: ["invoice-april.pdf"],
    createdBy: "Ahmed Hassan",
    createdAt: "2023-04-28T10:15:30Z",
  },
  "pay-002": {
    id: "pay-002",
    date: "2023-04-25",
    reference: "PAY-2023-002",
    paymentMethod: "Credit Card",
    type: "outgoing",
    amount: 750.5,
    currency: "AED",
    status: "Completed",
    payee: "Dubai Utilities",
    description: "Electricity and water bill",
    category: "Utilities",
    accountFrom: "Company Credit Card",
    accountTo: "Dubai Utilities",
    notes: "Monthly utility payment",
    attachments: ["utility-bill-april.pdf"],
    createdBy: "Fatima Al-Mansouri",
    createdAt: "2023-04-25T14:22:45Z",
  },
  "pay-004": {
    id: "pay-004",
    date: "2023-04-20",
    reference: "REC-2023-001",
    paymentMethod: "Bank Transfer",
    type: "incoming",
    amount: 5000.0,
    currency: "AED",
    status: "Completed",
    payee: "ABC Corporation",
    description: "Payment for Invoice #INV-2023-042",
    category: "Sales",
    accountFrom: "Customer Account",
    accountTo: "Main Business Account",
    notes: "Payment received for services rendered in March",
    attachments: ["receipt-abc-corp.pdf"],
    createdBy: "Mohammed Al-Farsi",
    createdAt: "2023-04-20T09:45:12Z",
  },
  "pay-006": {
    id: "pay-006",
    date: "2023-04-15",
    reference: "PAY-2023-004",
    paymentMethod: "Bank Transfer",
    type: "outgoing",
    amount: 4500.0,
    currency: "AED",
    status: "Pending",
    payee: "Commercial Rent LLC",
    description: "Office rent for May 2023",
    category: "Rent",
    accountFrom: "Main Business Account",
    accountTo: "Landlord Account",
    notes: "Monthly office rent payment",
    attachments: [],
    createdBy: "Ahmed Hassan",
    createdAt: "2023-04-15T16:30:00Z",
  },
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Failed":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
      case "Pending":
        return <Clock className="h-3.5 w-3.5 mr-1" />
      case "Failed":
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />
      default:
        return null
    }
  }

  return (
    <Badge className={`flex items-center ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status}
    </Badge>
  )
}

// Payment type badge component
const PaymentTypeBadge = ({ type }: { type: string }) => {
  return (
    <Badge
      className={`flex items-center ${
        type === "incoming"
          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
          : "bg-purple-100 text-purple-800 hover:bg-purple-100"
      }`}
    >
      {type === "incoming" ? (
        <ArrowDownLeft className="h-3.5 w-3.5 mr-1" />
      ) : (
        <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
      )}
      {type === "incoming" ? "Received" : "Sent"}
    </Badge>
  )
}

interface PaymentDrawerProps {
  open: boolean
  onClose: () => void
  paymentId: string | null
}

export function PaymentDrawer({ open, onClose, paymentId }: PaymentDrawerProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [payment, setPayment] = useState<any>(null)
  const [isNew, setIsNew] = useState(false)
  const [formData, setFormData] = useState({
    type: "outgoing",
    payee: "",
    amount: "",
    currency: "AED",
    date: "",
    paymentMethod: "Bank Transfer",
    description: "",
    category: "",
    accountFrom: "",
    accountTo: "",
    reference: "",
    notes: "",
  })

  useEffect(() => {
    if (paymentId && mockPaymentData[paymentId as keyof typeof mockPaymentData]) {
      const data = mockPaymentData[paymentId as keyof typeof mockPaymentData]
      setPayment(data)
      setIsNew(false)
      setFormData({
        type: data.type,
        payee: data.payee,
        amount: data.amount.toString(),
        currency: data.currency,
        date: data.date,
        paymentMethod: data.paymentMethod,
        description: data.description,
        category: data.category,
        accountFrom: data.accountFrom,
        accountTo: data.accountTo,
        reference: data.reference,
        notes: data.notes || "",
      })
    } else {
      setPayment(null)
      setIsNew(true)
      setFormData({
        type: "outgoing",
        payee: "",
        amount: "",
        currency: "AED",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Bank Transfer",
        description: "",
        category: "",
        accountFrom: "",
        accountTo: "",
        reference: "",
        notes: "",
      })
    }
  }, [paymentId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isNew ? "New Payment" : `Payment ${payment?.reference}`}</SheetTitle>
          <SheetDescription>
            {isNew ? "Create a new payment record" : `View or edit payment details for ${payment?.payee}`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments" disabled={isNew}>
                Attachments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Payment Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="incoming">Received (Incoming)</SelectItem>
                          <SelectItem value="outgoing">Sent (Outgoing)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payee">{formData.type === "incoming" ? "Received From" : "Paid To"}</Label>
                    <Input id="payee" name="payee" value={formData.payee} onChange={handleInputChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => handleSelectChange("currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Payment Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          className="pl-10"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference">Reference Number</Label>
                      <Input id="reference" name="reference" value={formData.reference} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Inventory">Inventory</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Salaries">Salaries</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountFrom">
                        {formData.type === "incoming" ? "Sender Account" : "From Account"}
                      </Label>
                      <Input
                        id="accountFrom"
                        name="accountFrom"
                        value={formData.accountFrom}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountTo">
                      {formData.type === "incoming" ? "To Account" : "Recipient Account"}
                    </Label>
                    <Input id="accountTo" name="accountTo" value={formData.accountTo} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
                  </div>

                  {!isNew && (
                    <div className="pt-2">
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <StatusBadge status={payment?.status || "Pending"} />
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">Created By:</span>
                        <span className="font-medium">{payment?.createdBy || "System"}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">Created At:</span>
                        <span className="font-medium">
                          {payment?.createdAt
                            ? new Date(payment.createdAt).toLocaleString()
                            : new Date().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <SheetFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-2">
                  {!isNew && (
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        View Receipt
                      </Button>
                      <Button type="button" variant="outline" className="flex items-center gap-1">
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </SheetFooter>
              </form>
            </TabsContent>

            <TabsContent value="attachments">
              {payment && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Attachments</h3>
                    <Button variant="outline" size="sm">
                      Upload New
                    </Button>
                  </div>

                  {payment.attachments && payment.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {payment.attachments.map((attachment: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <span>{attachment}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium">No Attachments</h3>
                      <p className="text-gray-500">There are no attachments for this payment.</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
