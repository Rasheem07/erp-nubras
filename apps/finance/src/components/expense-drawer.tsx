"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Printer,
  Receipt,
  Share2,
  Tag,
  User,
  X,
  CreditCard,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExpenseDrawerProps {
  open: boolean
  onClose: () => void
  expense: any | null
}

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "rejected":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Status icon
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "rejected":
      return <X className="h-4 w-4 text-red-600" />
    default:
      return null
  }
}

export function ExpenseDrawer({ open, onClose, expense }: ExpenseDrawerProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  // Initialize form data when expense changes
  useState(() => {
    if (expense) {
      setFormData({ ...expense })
    }
  })

  if (!expense) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save the data to your backend
    console.log("Saving expense:", formData)
    setIsEditing(false)
  }

  const handleApprove = () => {
    // In a real app, this would update the expense status
    console.log("Approving expense:", expense.id)
  }

  const handleReject = () => {
    // In a real app, this would update the expense status
    console.log("Rejecting expense:", expense.id)
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold">{expense.title}</SheetTitle>
          <SheetDescription>
            Expense #{expense.id} - {format(expense.date, "MMMM d, yyyy")}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="receipt">Receipt</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
              <div className="text-lg font-bold">${expense.amount.toFixed(2)}</div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Expense Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter expense title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={format(formData.date, "yyyy-MM-dd")}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office Supplies</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Meals">Meals & Entertainment</SelectItem>
                      <SelectItem value="Software">Software & Subscriptions</SelectItem>
                      <SelectItem value="Professional Development">Professional Development</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Company Card">Company Card</SelectItem>
                      <SelectItem value="Personal Card">Personal Card</SelectItem>
                      <SelectItem value="Direct Debit">Direct Debit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about this expense"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags.join(", ")}
                    onChange={handleInputChange}
                    placeholder="e.g. client, project, department"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-medium">{expense.category}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Payment Method</div>
                    <div className="font-medium flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {expense.paymentMethod}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(expense.date, "MMMM d, yyyy")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Amount</div>
                    <div className="font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {expense.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Submitted By</div>
                    <div className="font-medium flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {expense.submittedBy}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Receipt</div>
                    <div className="font-medium flex items-center gap-1">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      {expense.receipt ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className="text-sm">{expense.description}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {expense.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <div className="space-x-2">
                    {expense.status === "Pending" && (
                      <>
                        <Button variant="outline" onClick={handleReject} className="text-red-600">
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="receipt" className="space-y-4 pt-4">
            {expense.receipt ? (
              <div className="space-y-4">
                <div className="border rounded-md p-4 flex flex-col items-center justify-center min-h-[300px]">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">Receipt preview would be displayed here</p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No receipt has been uploaded for this expense</p>
                <Button className="mt-4">Upload Receipt</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Expense created</p>
                  <p className="text-xs text-muted-foreground">{format(expense.date, "MMMM d, yyyy")} at 10:30 AM</p>
                  <p className="text-sm">{expense.submittedBy} submitted this expense</p>
                </div>
              </div>

              {expense.status === "Approved" && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Expense approved</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(expense.date.getTime() + 86400000), "MMMM d, yyyy")} at 2:15 PM
                    </p>
                    <p className="text-sm">Finance Manager approved this expense</p>
                  </div>
                </div>
              )}

              {expense.status === "Rejected" && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Expense rejected</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(expense.date.getTime() + 86400000), "MMMM d, yyyy")} at 2:15 PM
                    </p>
                    <p className="text-sm">Finance Manager rejected this expense</p>
                    <p className="text-sm text-muted-foreground">
                      Reason: Missing receipt and insufficient description
                    </p>
                  </div>
                </div>
              )}

              {expense.receipt && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Receipt className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Receipt uploaded</p>
                    <p className="text-xs text-muted-foreground">{format(expense.date, "MMMM d, yyyy")} at 10:35 AM</p>
                    <p className="text-sm">{expense.submittedBy} uploaded a receipt</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
