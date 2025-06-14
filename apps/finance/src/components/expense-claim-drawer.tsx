"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Save, X, Printer, Download, Plus, Trash, Check, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ExpenseClaimDrawerProps {
  open: boolean
  onClose: () => void
  claim: any
  mode: "view" | "edit"
}

export function ExpenseClaimDrawer({ open, onClose, claim, mode: initialMode }: ExpenseClaimDrawerProps) {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState(
    claim || {
      id: "",
      employee: "",
      department: "",
      date: new Date().toISOString().split("T")[0],
      total: 0,
      status: "Pending",
      paymentStatus: "Not Paid",
      description: "",
      items: [
        {
          category: "",
          description: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
        },
      ],
    },
  )

  React.useEffect(() => {
    if (claim) {
      setFormData(claim)
    }
  }, [claim])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Recalculate total
    const total = newItems.reduce((sum, item) => sum + Number(item.amount), 0)

    setFormData((prev: any) => ({ ...prev, items: newItems, total }))
  }

  const handleAddItem = () => {
    setFormData((prev: any) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          category: "",
          description: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
        },
      ],
    }))
  }

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) return
    const newItems = [...formData.items]
    newItems.splice(index, 1)

    // Recalculate total
    const total = newItems.reduce((sum, item) => sum + Number(item.amount), 0)

    setFormData((prev: any) => ({ ...prev, items: newItems, total }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log("Form submitted:", formData)
    onClose()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF or other document format
    alert("Expense claim download functionality would be implemented here")
  }

  const handleApprove = () => {
    // In a real app, this would update the claim status to Approved
    setFormData((prev: any) => ({ ...prev, status: "Approved" }))
  }

  const handleReject = () => {
    // In a real app, this would update the claim status to Rejected
    setFormData((prev: any) => ({ ...prev, status: "Rejected" }))
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">
            {mode === "view" ? "Expense Claim Details" : "Edit Expense Claim"}
          </SheetTitle>
          <SheetDescription>
            {mode === "view"
              ? "View expense claim details and line items"
              : "Fill in the information below to update the expense claim"}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue={initialMode} onValueChange={(value) => setMode(value as "view" | "edit")}>
          <TabsList className="mb-6">
            <TabsTrigger value="view" disabled={!claim}>
              View
            </TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6">
            {claim && (
              <>
                <div className="flex justify-end gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">Expense Claim #{claim.id}</CardTitle>
                      <Badge
                        variant={
                          claim.status === "Approved"
                            ? "default"
                            : claim.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {claim.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Employee</p>
                        <p className="text-lg">{claim.employee}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Department</p>
                        <p className="text-lg">{claim.department}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                        <p className="text-lg">{claim.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                        <Badge
                          variant={
                            claim.paymentStatus === "Paid"
                              ? "default"
                              : claim.paymentStatus === "Pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {claim.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-lg">{claim.description}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Expense Items</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {claim.items.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={3} className="font-bold">
                              Total
                            </TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(claim.total)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={() => setMode("edit")}>Edit Claim</Button>
                  {claim.status === "Pending" && (
                    <>
                      <Button variant="outline" className="bg-green-50" onClick={handleApprove}>
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Approve
                      </Button>
                      <Button variant="outline" className="bg-red-50" onClick={handleReject}>
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="edit">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Claim ID</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="e.g., EC-001"
                    required
                    readOnly={!!claim}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Input
                    id="employee"
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    placeholder="Employee name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value) => handleSelectChange("paymentStatus", value)}
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Paid">Not Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter claim description"
                  rows={2}
                  required
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Expense Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.items.map((item: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.category}
                              onValueChange={(value) => handleItemChange(index, "category", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Travel">Travel</SelectItem>
                                <SelectItem value="Meals">Meals</SelectItem>
                                <SelectItem value="Accommodation">Accommodation</SelectItem>
                                <SelectItem value="Supplies">Supplies</SelectItem>
                                <SelectItem value="Equipment">Equipment</SelectItem>
                                <SelectItem value="Software">Software</SelectItem>
                                <SelectItem value="Training">Training</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={(e) => handleItemChange(index, "description", e.target.value)}
                              placeholder="Item description"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={item.date}
                              onChange={(e) => handleItemChange(index, "date", e.target.value)}
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.amount}
                                onChange={(e) => handleItemChange(index, "amount", Number(e.target.value))}
                                className="pl-10"
                                placeholder="0.00"
                                required
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                              disabled={formData.items.length <= 1}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={3} className="font-bold">
                          Total
                        </TableCell>
                        <TableCell className="font-bold">{formatCurrency(formData.total)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {claim ? "Update Claim" : "Create Claim"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
