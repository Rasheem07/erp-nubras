"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Label } from "@nubras/ui"
import { Textarea } from "@nubras/ui"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@nubras/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { Separator } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Save, X, Printer, Download, DollarSign } from "lucide-react"
import { formatCurrency } from "@nubras/utils"

interface BankAccountDrawerProps {
  open: boolean
  onClose: () => void
  account: any
  mode: "view" | "edit"
}

export function BankAccountDrawer({ open, onClose, account, mode: initialMode }: BankAccountDrawerProps) {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState(
    account || {
      id: "",
      accountName: "",
      accountNumber: "",
      bank: "",
      currency: "AED",
      balance: 0,
      status: "Active",
      type: "Checking",
      description: "",
      lastUpdated: new Date().toISOString().split("T")[0],
    },
  )

  React.useEffect(() => {
    if (account) {
      setFormData(account)
    }
  }, [account])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
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
    alert("Bank account statement download functionality would be implemented here")
  }

  // Sample transactions for this account
  const accountTransactions = [
    {
      id: "TR-001",
      date: "2023-04-20",
      description: "Customer Payment - Dubai Fashion LLC",
      type: "Deposit",
      amount: 15000.0,
      reference: "INV-001",
    },
    {
      id: "TR-002",
      date: "2023-04-19",
      description: "Rent Payment",
      type: "Withdrawal",
      amount: 8000.0,
      reference: "EXP-001",
    },
    {
      id: "TR-003",
      date: "2023-04-18",
      description: "Supplier Payment - Fabric Wholesalers",
      type: "Withdrawal",
      amount: 12500.0,
      reference: "PO-005",
    },
    {
      id: "TR-004",
      date: "2023-04-17",
      description: "Customer Payment - Al Ain Retail Group",
      type: "Deposit",
      amount: 25000.0,
      reference: "INV-002",
    },
    {
      id: "TR-005",
      date: "2023-04-16",
      description: "Utility Bills",
      type: "Withdrawal",
      amount: 1500.0,
      reference: "EXP-002",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{mode === "view" ? "Bank Account Details" : "Edit Bank Account"}</SheetTitle>
          <SheetDescription>
            {mode === "view"
              ? "View bank account details and transaction history"
              : "Fill in the information below to update the bank account"}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue={initialMode} onValueChange={(value) => setMode(value as "view" | "edit")}>
          <TabsList className="mb-6">
            <TabsTrigger value="view" disabled={!account}>
              View
            </TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6">
            {account && (
              <>
                <div className="flex justify-end gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Statement
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{account.accountName}</CardTitle>
                      <Badge variant={account.status === "Active" ? "success" : "secondary"}>{account.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Bank</p>
                        <p className="text-lg">{account.bank}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                        <p className="text-lg">{account.accountNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Type</p>
                        <p className="text-lg">{account.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Currency</p>
                        <p className="text-lg">{account.currency}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                      <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-lg">{account.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-lg">{account.lastUpdated}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accountTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.reference}</TableCell>
                            <TableCell
                              className={`text-right ${
                                transaction.type === "Deposit" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "Deposit" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={() => setMode("edit")}>Edit Account</Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="edit">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Account ID</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="e.g., BA-001"
                    required
                    readOnly={!!account}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="e.g., Operating Account"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Bank</Label>
                  <Input
                    id="bank"
                    name="bank"
                    value={formData.bank}
                    onChange={handleInputChange}
                    placeholder="e.g., Emirates NBD"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 1234567890"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Checking">Checking</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Loan">Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Opening Balance</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="balance"
                    name="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter account description"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {account ? "Update Account" : "Create Account"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
