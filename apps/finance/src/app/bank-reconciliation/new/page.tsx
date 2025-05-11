"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Label } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@nubras/ui"
import { Calendar, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Checkbox } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"

// Mock bank accounts data
const bankAccounts = [
  { id: "1", name: "Main Checking Account", accountNumber: "****4567", type: "Checking" },
  { id: "2", name: "Savings Account", accountNumber: "****7890", type: "Savings" },
  { id: "3", name: "Business Credit Card", accountNumber: "****2345", type: "Credit" },
  { id: "4", name: "Payroll Account", accountNumber: "****6789", type: "Checking" },
  { id: "5", name: "Tax Reserve Account", accountNumber: "****1234", type: "Savings" },
]

export default function NewBankReconciliationPage() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [statementDate, setStatementDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [bankBalance, setBankBalance] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/bank-reconciliation")
    }, 1000)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Bank Reconciliation</h1>
          <p className="text-muted-foreground">Create a new bank reconciliation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Bank Account Selection</CardTitle>
            <CardDescription>
              Select the bank account you want to reconcile and enter the statement details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="statementDate">Statement Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="statementDate"
                    name="statementDate"
                    type="date"
                    className="pl-10"
                    value={statementDate}
                    onChange={(e) => setStatementDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankBalance">Bank Statement Balance</Label>
                <Input
                  id="bankBalance"
                  name="bankBalance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={bankBalance}
                  onChange={(e) => setBankBalance(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountSelect">Select Account</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger id="accountSelect">
                    <SelectValue placeholder="Select a bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.accountNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Available Accounts</Label>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankAccounts.map((account) => (
                      <TableRow key={account.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <Checkbox
                            checked={selectedAccount === account.id}
                            onCheckedChange={() => setSelectedAccount(account.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>{account.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {!selectedAccount && (
                <p className="text-sm text-muted-foreground mt-2">Please select an account to continue</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedAccount || !bankBalance || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Reconciliation"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
