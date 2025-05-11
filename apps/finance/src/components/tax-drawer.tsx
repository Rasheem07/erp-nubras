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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, CheckCircle2, AlertCircle, Clock, Save, FileText, BarChart3, Percent, Download } from "lucide-react"

// Mock data for a single tax
const mockTaxData = {
  "tax-001": {
    id: "tax-001",
    name: "Value Added Tax (VAT)",
    type: "Sales Tax",
    rate: 5.0,
    frequency: "Monthly",
    nextDueDate: "2023-05-15",
    status: "Upcoming",
    lastFiled: "2023-04-15",
    amountDue: 12500.0,
    description: "Standard UAE VAT on goods and services",
    filingInstructions: "File through Federal Tax Authority portal by the 15th of each month",
    accountingEntries: [
      { account: "VAT Payable", debit: 0, credit: 12500 },
      { account: "VAT Collected", debit: 15000, credit: 0 },
      { account: "VAT Paid", debit: 0, credit: 2500 },
    ],
    history: [
      { period: "Mar 2023", filingDate: "2023-04-15", amount: 11200.0, status: "Filed" },
      { period: "Feb 2023", filingDate: "2023-03-15", amount: 10800.0, status: "Filed" },
      { period: "Jan 2023", filingDate: "2023-02-15", amount: 9500.0, status: "Filed" },
    ],
  },
  "tax-002": {
    id: "tax-002",
    name: "Corporate Income Tax",
    type: "Income Tax",
    rate: 9.0,
    frequency: "Annually",
    nextDueDate: "2023-12-31",
    status: "Upcoming",
    lastFiled: "2022-12-31",
    amountDue: 45000.0,
    description: "UAE corporate income tax",
    filingInstructions: "File through Federal Tax Authority portal by December 31st",
    accountingEntries: [
      { account: "Income Tax Payable", debit: 0, credit: 45000 },
      { account: "Income Tax Expense", debit: 45000, credit: 0 },
    ],
    history: [
      { period: "2022", filingDate: "2022-12-31", amount: 42000.0, status: "Filed" },
      { period: "2021", filingDate: "2021-12-31", amount: 38500.0, status: "Filed" },
      { period: "2020", filingDate: "2020-12-31", amount: 35000.0, status: "Filed" },
    ],
  },
  "tax-004": {
    id: "tax-004",
    name: "Customs Duty",
    type: "Import Tax",
    rate: 5.0,
    frequency: "Per Import",
    nextDueDate: "2023-05-05",
    status: "Overdue",
    lastFiled: "2023-03-20",
    amountDue: 3750.0,
    description: "Standard GCC customs duty on imported goods",
    filingInstructions: "Pay at the time of import clearance",
    accountingEntries: [
      { account: "Customs Duty Payable", debit: 0, credit: 3750 },
      { account: "Customs Duty Expense", debit: 3750, credit: 0 },
    ],
    history: [
      { period: "Import #IMP-2023-015", filingDate: "2023-03-20", amount: 4200.0, status: "Filed" },
      { period: "Import #IMP-2023-008", filingDate: "2023-02-10", amount: 3100.0, status: "Filed" },
      { period: "Import #IMP-2023-003", filingDate: "2023-01-15", amount: 2800.0, status: "Filed" },
    ],
  },
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Filed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Filed":
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
      case "Upcoming":
        return <Clock className="h-3.5 w-3.5 mr-1" />
      case "Overdue":
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

interface TaxDrawerProps {
  open: boolean
  onClose: () => void
  taxId: string | null
}

export function TaxDrawer({ open, onClose, taxId }: TaxDrawerProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [tax, setTax] = useState<any>(null)
  const [isNew, setIsNew] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "Sales Tax",
    rate: "",
    frequency: "Monthly",
    nextDueDate: "",
    amountDue: "",
    description: "",
    filingInstructions: "",
  })

  useEffect(() => {
    if (taxId && mockTaxData[taxId as keyof typeof mockTaxData]) {
      const data = mockTaxData[taxId as keyof typeof mockTaxData]
      setTax(data)
      setIsNew(false)
      setFormData({
        name: data.name,
        type: data.type,
        rate: data.rate.toString(),
        frequency: data.frequency,
        nextDueDate: data.nextDueDate,
        amountDue: data.amountDue.toString(),
        description: data.description,
        filingInstructions: data.filingInstructions || "",
      })
    } else {
      setTax(null)
      setIsNew(true)
      setFormData({
        name: "",
        type: "Sales Tax",
        rate: "",
        frequency: "Monthly",
        nextDueDate: new Date().toISOString().split("T")[0],
        amountDue: "",
        description: "",
        filingInstructions: "",
      })
    }
  }, [taxId])

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
          <SheetTitle>{isNew ? "New Tax" : tax?.name}</SheetTitle>
          <SheetDescription>
            {isNew ? "Create a new tax record" : `View or edit tax details for ${tax?.type}`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="accounting" disabled={isNew}>
                Accounting
              </TabsTrigger>
              <TabsTrigger value="history" disabled={isNew}>
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tax Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tax Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                          <SelectItem value="Income Tax">Income Tax</SelectItem>
                          <SelectItem value="Withholding Tax">Withholding Tax</SelectItem>
                          <SelectItem value="Import Tax">Import Tax</SelectItem>
                          <SelectItem value="Excise Tax">Excise Tax</SelectItem>
                          <SelectItem value="Local Tax">Local Tax</SelectItem>
                          <SelectItem value="Transaction Tax">Transaction Tax</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Tax Rate (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="rate"
                          name="rate"
                          type="number"
                          step="0.01"
                          className="pl-10"
                          value={formData.rate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Filing Frequency</Label>
                      <Select
                        value={formData.frequency}
                        onValueChange={(value) => handleSelectChange("frequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Annually">Annually</SelectItem>
                          <SelectItem value="Per Import">Per Import</SelectItem>
                          <SelectItem value="Per Transaction">Per Transaction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextDueDate">Next Due Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="nextDueDate"
                          name="nextDueDate"
                          type="date"
                          className="pl-10"
                          value={formData.nextDueDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amountDue">Amount Due (AED)</Label>
                    <Input
                      id="amountDue"
                      name="amountDue"
                      type="number"
                      step="0.01"
                      value={formData.amountDue}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filingInstructions">Filing Instructions</Label>
                    <Textarea
                      id="filingInstructions"
                      name="filingInstructions"
                      value={formData.filingInstructions}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  {!isNew && (
                    <div className="pt-2">
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <StatusBadge status={tax?.status || "Upcoming"} />
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500">Last Filed:</span>
                        <span className="font-medium">{tax?.lastFiled || "Never"}</span>
                      </div>
                    </div>
                  )}
                </div>

                <SheetFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-2">
                  {!isNew && (
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        File Tax Return
                      </Button>
                      <Button type="button" variant="outline" className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        Tax Report
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

            <TabsContent value="accounting">
              {tax && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Accounting Entries</h3>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Journal Entry
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Debit (AED)</TableHead>
                          <TableHead className="text-right">Credit (AED)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tax.accountingEntries.map((entry: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{entry.account}</TableCell>
                            <TableCell className="text-right">
                              {entry.debit > 0 ? entry.debit.toFixed(2) : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.credit > 0 ? entry.credit.toFixed(2) : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">
                            {tax.accountingEntries.reduce((sum: number, entry: any) => sum + entry.debit, 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {tax.accountingEntries
                              .reduce((sum: number, entry: any) => sum + entry.credit, 0)
                              .toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Tax Calculation Notes</h4>
                    <p className="text-sm text-gray-600">
                      This tax is calculated based on the applicable rate and the taxable amount for the period. The
                      accounting entries shown above reflect the current tax liability and related accounts.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {tax && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Filing History</h3>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead>Filing Date</TableHead>
                          <TableHead className="text-right">Amount (AED)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tax.history.map((record: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{record.period}</TableCell>
                            <TableCell>{record.filingDate}</TableCell>
                            <TableCell className="text-right">{record.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <StatusBadge status={record.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Filing Trend</h4>
                    <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-gray-400 mr-2" />
                      <span className="text-gray-500">Tax filing trend chart would appear here</span>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
