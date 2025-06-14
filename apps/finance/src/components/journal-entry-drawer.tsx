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
import { Save, X, Printer, Download, Calculator } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Sample accounts for dropdown
const accounts = [
  { id: "1000", name: "1000 - Cash" },
  { id: "1100", name: "1100 - Accounts Receivable" },
  { id: "1200", name: "1200 - Inventory" },
  { id: "1500", name: "1500 - Equipment" },
  { id: "2000", name: "2000 - Accounts Payable" },
  { id: "2100", name: "2100 - Loans Payable" },
  { id: "3000", name: "3000 - Owner's Equity" },
  { id: "4000", name: "4000 - Sales Revenue" },
  { id: "5000", name: "5000 - Cost of Goods Sold" },
  { id: "6000", name: "6000 - Rent Expense" },
  { id: "6100", name: "6100 - Utilities Expense" },
  { id: "6200", name: "6200 - Salaries Expense" },
  { id: "2200", name: "2200 - Tax Payable" },
]

interface JournalEntryDrawerProps {
  open: boolean
  onClose: () => void
  entry: any
  mode: "view" | "edit"
}

export function JournalEntryDrawer({ open, onClose, entry, mode: initialMode }: JournalEntryDrawerProps) {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState(
    entry || {
      id: "",
      date: "",
      reference: "",
      description: "",
      status: "Draft",
      entries: [],
      notes: "",
    },
  )

  React.useEffect(() => {
    if (entry) {
      setFormData(entry)
    }
  }, [entry])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleEntryChange = (index: number, field: string, value: string | number) => {
    const newEntries = [...formData.entries]
    newEntries[index] = { ...newEntries[index], [field]: value }

    // If debit is entered, clear credit and vice versa
    if (field === "debit" && Number(value) > 0) {
      newEntries[index].credit = 0
    } else if (field === "credit" && Number(value) > 0) {
      newEntries[index].debit = 0
    }

    setFormData((prev: any) => ({ ...prev, entries: newEntries }))
  }

  const handleAddEntry = () => {
    setFormData((prev: any) => ({
      ...prev,
      entries: [...prev.entries, { account: "", debit: 0, credit: 0 }],
    }))
  }

  const handleRemoveEntry = (index: number) => {
    if (formData.entries.length <= 2) return // Minimum 2 entries required
    const newEntries = [...formData.entries]
    newEntries.splice(index, 1)
    setFormData((prev: any) => ({ ...prev, entries: newEntries }))
  }

  const calculateTotals = () => {
    const debitTotal = formData.entries.reduce((sum: any, entry: any) => sum + Number(entry.debit), 0)
    const creditTotal = formData.entries.reduce((sum: any, entry: any) => sum + Number(entry.credit), 0)
    return { debitTotal, creditTotal }
  }

  const { debitTotal, creditTotal } = calculateTotals()
  const isBalanced = debitTotal === creditTotal && debitTotal > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isBalanced) {
      alert("Journal entry must be balanced before saving.")
      return
    }
    // Here you would typically save the data to your backend
    console.log("Form submitted:", formData)
    onClose()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF or other document format
    alert("Journal entry download functionality would be implemented here")
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">
            {mode === "view" ? "Journal Entry Details" : "Edit Journal Entry"}
          </SheetTitle>
          <SheetDescription>
            {mode === "view"
              ? "View journal entry details and line items"
              : "Fill in the information below to update the journal entry"}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue={initialMode} onValueChange={(value) => setMode(value as "view" | "edit")}>
          <TabsList className="mb-6">
            <TabsTrigger value="view" disabled={!entry}>
              View
            </TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6">
            {entry && (
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
                      <CardTitle className="text-xl">Journal Entry #{entry.id}</CardTitle>
                      <Badge
                        variant={
                          entry.status === "Posted"
                            ? "default"
                            : entry.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {entry.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                        <p className="text-lg">{entry.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reference</p>
                        <p className="text-lg">{entry.reference || "N/A"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-lg">{entry.description}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Journal Entry Lines</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entry.entries.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{accounts.find((a) => a.id === item.account)?.name || item.account}</TableCell>
                              <TableCell className="text-right">
                                {item.debit > 0 ? formatCurrency(item.debit) : ""}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.credit > 0 ? formatCurrency(item.credit) : ""}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(entry.debitTotal)}</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(entry.creditTotal)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {entry.notes && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Notes</p>
                        <p className="text-sm mt-1">{entry.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={() => setMode("edit")}>Edit Journal Entry</Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="edit">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Journal Entry Number</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="e.g., JE-001"
                    required
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Posted">Posted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
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
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="e.g., INV-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description of journal entry"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Journal Entry Lines</Label>
                  <div className="flex items-center gap-2">
                    <div className={`text-sm ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                      {isBalanced ? "Balanced" : "Unbalanced"}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddEntry}>
                      Add Line
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.entries.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.account}
                              onValueChange={(value) => handleEntryChange(index, "account", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.debit || ""}
                              onChange={(e) => handleEntryChange(index, "debit", Number(e.target.value))}
                              className="text-right"
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.credit || ""}
                              onChange={(e) => handleEntryChange(index, "credit", Number(e.target.value))}
                              className="text-right"
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveEntry(index)}
                              disabled={formData.entries.length <= 2}
                            >
                              X
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(debitTotal)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(creditTotal)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="button" variant="outline" disabled={isBalanced}>
                  <Calculator className="mr-2 h-4 w-4" />
                  Auto-Balance
                </Button>
                <Button type="submit" disabled={!isBalanced}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Journal Entry
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
