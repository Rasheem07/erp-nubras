"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Save, FileText, Download, ArrowUpDown, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data for a single reconciliation
const mockReconciliationDetails = {
  id: "1",
  accountName: "Main Checking Account",
  accountNumber: "****4567",
  bankBalance: 15420.75,
  bookBalance: 15320.75,
  difference: 100.0,
  lastReconciled: "2023-04-15",
  status: "In Progress",
  statementDate: "2023-04-30",
  items: [
    {
      id: "item1",
      date: "2023-04-02",
      description: "Client Payment - ABC Corp",
      reference: "INV-2023-042",
      amount: 1250.0,
      type: "deposit",
      matched: true,
    },
    {
      id: "item2",
      date: "2023-04-05",
      description: "Office Supplies",
      reference: "PO-2023-015",
      amount: 85.75,
      type: "withdrawal",
      matched: true,
    },
    {
      id: "item3",
      date: "2023-04-10",
      description: "Monthly Rent",
      reference: "AUTO-PAY",
      amount: 2200.0,
      type: "withdrawal",
      matched: true,
    },
    {
      id: "item4",
      date: "2023-04-15",
      description: "Client Payment - XYZ Ltd",
      reference: "INV-2023-047",
      amount: 3450.0,
      type: "deposit",
      matched: true,
    },
    {
      id: "item5",
      date: "2023-04-18",
      description: "Utility Bill",
      reference: "AUTO-PAY",
      amount: 175.5,
      type: "withdrawal",
      matched: true,
    },
    {
      id: "item6",
      date: "2023-04-20",
      description: "Software Subscription",
      reference: "SUB-2023-04",
      amount: 49.99,
      type: "withdrawal",
      matched: true,
    },
    {
      id: "item7",
      date: "2023-04-22",
      description: "Client Payment - 123 Industries",
      reference: "INV-2023-051",
      amount: 1875.25,
      type: "deposit",
      matched: true,
    },
    {
      id: "item8",
      date: "2023-04-25",
      description: "Insurance Premium",
      reference: "INS-2023-04",
      amount: 350.0,
      type: "withdrawal",
      matched: true,
    },
    {
      id: "item9",
      date: "2023-04-28",
      description: "Employee Reimbursement",
      reference: "EMP-2023-042",
      amount: 125.75,
      type: "withdrawal",
      matched: true,
    },
    {
      id: "item10",
      date: "2023-04-29",
      description: "Bank Fee",
      reference: "FEE-2023-04",
      amount: 35.0,
      type: "withdrawal",
      matched: true,
    },
    {
      id: "item11",
      date: "2023-04-30",
      description: "Interest Earned",
      reference: "INT-2023-04",
      amount: 12.5,
      type: "deposit",
      matched: false,
    },
    {
      id: "item12",
      date: "2023-04-30",
      description: "Unknown Deposit",
      reference: "DEP-2023-042",
      amount: 100.0,
      type: "deposit",
      matched: false,
    },
  ],
}

// New reconciliation template
const newReconciliationTemplate = {
  id: "new",
  accountName: "",
  accountNumber: "",
  bankBalance: 0,
  bookBalance: 0,
  difference: 0,
  lastReconciled: "",
  status: "Not Started",
  statementDate: new Date().toISOString().split("T")[0],
  items: [],
}

interface BankReconciliationDrawerProps {
  id: string | null
  open: boolean
  onClose: () => void
}

export function BankReconciliationDrawer({ id, open, onClose }: BankReconciliationDrawerProps) {
  const [reconciliation, setReconciliation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("summary")
  const [matchedItems, setMatchedItems] = useState<string[]>([])
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankBalance: "",
    bookBalance: "",
    statementDate: new Date().toISOString().split("T")[0],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    // Simulate loading data
    setLoading(true)
    setTimeout(() => {
      if (id === "new") {
        setReconciliation({ ...newReconciliationTemplate })
        setFormData({
          accountName: "",
          accountNumber: "",
          bankBalance: "",
          bookBalance: "",
          statementDate: new Date().toISOString().split("T")[0],
        })
      } else if (id === "1") {
        // Deep clone to avoid reference issues
        const data = JSON.parse(JSON.stringify(mockReconciliationDetails))
        setReconciliation(data)
        setFormData({
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          bankBalance: data.bankBalance.toString(),
          bookBalance: data.bookBalance.toString(),
          statementDate: data.statementDate,
        })
        // Initialize matched items
        setMatchedItems(data.items.filter((item: any) => item.matched).map((item: any) => item.id))
      } else {
        // For demo purposes, just use the mock data for any ID
        const data = JSON.parse(JSON.stringify(mockReconciliationDetails))
        data.id = id
        setReconciliation(data)
        setFormData({
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          bankBalance: data.bankBalance.toString(),
          bookBalance: data.bookBalance.toString(),
          statementDate: data.statementDate,
        })
        setMatchedItems(data.items.filter((item: any) => item.matched).map((item: any) => item.id))
      }
      setLoading(false)
    }, 500)
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleToggleMatch = (itemId: string) => {
    if (matchedItems.includes(itemId)) {
      setMatchedItems(matchedItems.filter((id) => id !== itemId))
    } else {
      setMatchedItems([...matchedItems, itemId])
    }

    // Update the reconciliation object
    if (reconciliation) {
      const updatedItems = reconciliation.items.map((item: any) => {
        if (item.id === itemId) {
          return { ...item, matched: !item.matched }
        }
        return item
      })
      setReconciliation({ ...reconciliation, items: updatedItems })
    }
  }

  const getMatchPercentage = () => {
    if (!reconciliation || !reconciliation.items || reconciliation.items.length === 0) return 0
    return Math.round((matchedItems.length / reconciliation.items.length) * 100)
  }

  const calculateDifference = () => {
    const bankBalance = Number.parseFloat(formData.bankBalance) || 0
    const bookBalance = Number.parseFloat(formData.bookBalance) || 0
    return (bankBalance - bookBalance).toFixed(2)
  }

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving reconciliation:", {
      ...reconciliation,
      ...formData,
      difference: Number.parseFloat(calculateDifference()),
    })
    onClose()
  }

  const handleComplete = () => {
    // Here you would typically mark the reconciliation as complete
    console.log("Completing reconciliation:", {
      ...reconciliation,
      status: "Completed",
    })
    onClose()
  }

  const filteredItems =
    reconciliation?.items?.filter((item: any) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType =
        filterType === "all" ||
        (filterType === "matched" && item.matched) ||
        (filterType === "unmatched" && !item.matched) ||
        (filterType === "deposits" && item.type === "deposit") ||
        (filterType === "withdrawals" && item.type === "withdrawal")
      return matchesSearch && matchesType
    }) || []

  const isNewReconciliation = id === "new"

  if (loading) {
    return (
      <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <SheetContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
          <SheetHeader>
            <SheetTitle>Loading...</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <div className="space-y-4">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isNewReconciliation ? "New Bank Reconciliation" : `Reconcile: ${reconciliation.accountName}`}
          </SheetTitle>
          <SheetDescription>
            {isNewReconciliation
              ? "Create a new bank reconciliation"
              : `Statement Date: ${reconciliation.statementDate}`}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transactions" disabled={isNewReconciliation}>
              Transactions
            </TabsTrigger>
            <TabsTrigger value="reports" disabled={isNewReconciliation}>
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="Enter account name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankBalance">Bank Statement Balance</Label>
                <Input
                  id="bankBalance"
                  name="bankBalance"
                  type="number"
                  step="0.01"
                  value={formData.bankBalance}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookBalance">Book Balance</Label>
                <Input
                  id="bookBalance"
                  name="bookBalance"
                  type="number"
                  step="0.01"
                  value={formData.bookBalance}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statementDate">Statement Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="statementDate"
                    name="statementDate"
                    type="date"
                    className="pl-10"
                    value={formData.statementDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difference">Difference</Label>
                <Input
                  id="difference"
                  value={`$${calculateDifference()}`}
                  readOnly
                  className={
                    Number.parseFloat(calculateDifference()) !== 0
                      ? "bg-red-50 text-red-600 font-medium"
                      : "bg-green-50 text-green-600 font-medium"
                  }
                />
              </div>
            </div>

            {!isNewReconciliation && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Reconciliation Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        {matchedItems.length} of {reconciliation.items.length} items matched
                      </span>
                      <span>{getMatchPercentage()}% complete</span>
                    </div>
                    <Progress value={getMatchPercentage()} className="h-2" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">Bank Balance</div>
                        <div className="text-xl font-bold mt-1">
                          ${Number.parseFloat(formData.bankBalance).toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-600 font-medium">Book Balance</div>
                        <div className="text-xl font-bold mt-1">
                          ${Number.parseFloat(formData.bookBalance).toFixed(2)}
                        </div>
                      </div>
                      <div
                        className={`p-4 rounded-lg ${
                          Number.parseFloat(calculateDifference()) !== 0 ? "bg-red-50" : "bg-green-50"
                        }`}
                      >
                        <div
                          className={`text-sm font-medium ${
                            Number.parseFloat(calculateDifference()) !== 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          Difference
                        </div>
                        <div
                          className={`text-xl font-bold mt-1 ${
                            Number.parseFloat(calculateDifference()) !== 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          ${Math.abs(Number.parseFloat(calculateDifference())).toFixed(2)}
                          {Number.parseFloat(calculateDifference()) !== 0 && (
                            <span>{Number.parseFloat(calculateDifference()) < 0 ? " short" : " over"}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="unmatched">Unmatched</SelectItem>
                    <SelectItem value="deposits">Deposits</SelectItem>
                    <SelectItem value="withdrawals">Withdrawals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Match</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox checked={item.matched} onCheckedChange={() => handleToggleMatch(item.id)} />
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell>{item.reference}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.type === "deposit"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {item.type === "deposit" ? "Deposit" : "Withdrawal"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">${item.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredItems.length} of {reconciliation.items.length} items
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Add Missing Transaction
                </Button>
                <Button variant="outline" size="sm">
                  Auto-Match
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Reconciliation Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Reconciliation Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Unmatched Items Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Reconciliation History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SheetFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-4 border-t mt-4">
          <div className="flex gap-2">
            {!isNewReconciliation && (
              <Button
                variant="outline"
                onClick={handleComplete}
                disabled={Number.parseFloat(calculateDifference()) !== 0}
              >
                Mark as Complete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
