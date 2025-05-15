"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Save, Trash, Calculator } from "lucide-react"
import { formatCurrency } from "@nubras/utils"

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

export default function CreateJournalEntryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    ref: "",
    refType: "",
    description: "",
    entries: [
      { account: "", debit: 0, credit: 0 },
      { account: "", debit: 0, credit: 0 },
    ],
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

    setFormData((prev) => ({ ...prev, entries: newEntries }))
  }

  const handleAddEntry = () => {
    setFormData((prev) => ({
      ...prev,
      entries: [...prev.entries, { account: "", debit: 0, credit: 0 }],
    }))
  }

  const handleRemoveEntry = (index: number) => {
    if (formData.entries.length <= 2) return // Minimum 2 entries required
    const newEntries = [...formData.entries]
    newEntries.splice(index, 1)
    setFormData((prev) => ({ ...prev, entries: newEntries }))
  }

  const calculateTotals = () => {
    const debitTotal = formData.entries.reduce((sum, entry) => sum + Number(entry.debit), 0)
    const creditTotal = formData.entries.reduce((sum, entry) => sum + Number(entry.credit), 0)
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
    router.push("/journal-entries")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Journal Entry</h2>
          <p className="text-muted-foreground">Create a new general ledger journal entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Journal Entry Information</CardTitle>
            <CardDescription>Enter the details for the new journal entry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ref">Reference no</Label>
                <Input
                  id="ref"
                  name="ref"
                  value={formData.ref}
                  onChange={handleInputChange}
                  placeholder="e.g., INV-001, PO-123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refType">Reference type</Label>
                <Input
                  id="refType"
                  name="refType"
                  value={formData.refType}
                  onChange={handleInputChange}
                  placeholder="e.g., Invoice, Expense etc"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a description for this journal entry"
                  required
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Journal Entry Lines</h3>
                <div className="flex items-center gap-2">
                  <div className={`text-sm ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                    {isBalanced ? "Balanced" : "Unbalanced"}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddEntry}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Line
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Account</TableHead>
                      <TableHead className="text-right">Debit (AED)</TableHead>
                      <TableHead className="text-right">Credit (AED)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.entries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={entry.account}
                            onValueChange={(value) => handleEntryChange(index, "account", value)}
                            required
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
                            value={entry.debit || ""}
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
                            value={entry.credit || ""}
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
                            <Trash className="h-4 w-4" />
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

            <Separator className="my-6" />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any additional notes or context for this journal entry"
                rows={3}
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Auto-balance functionality could be implemented here
                  alert("Auto-balance feature would be implemented here")
                }}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Auto-Balance
              </Button>
              <Button type="submit" disabled={!isBalanced}>
                <Save className="mr-2 h-4 w-4" />
                Save Journal Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
