"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

export default function CreateBudgetPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, category: "Salaries", description: "Staff salaries", amount: 120000 },
    { id: 2, category: "Rent", description: "Office rent", amount: 45000 },
    { id: 3, category: "Utilities", description: "Electricity, water, internet", amount: 12000 },
  ])
  const [nextItemId, setNextItemId] = useState(4)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect back to budgeting page
    router.push("/budgeting")
  }

  const handleCancel = () => {
    router.push("/budgeting")
  }

  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, { id: nextItemId, category: "", description: "", amount: 0 }])
    setNextItemId(nextItemId + 1)
  }

  const removeBudgetItem = (id: number) => {
    setBudgetItems(budgetItems.filter((item) => item.id !== id))
  }

  const updateBudgetItem = (id: number, field: string, value: string | number) => {
    setBudgetItems(budgetItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Budget</h1>
          <p className="text-muted-foreground">Set up a new budget for your organization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Budget Information</CardTitle>
            <CardDescription>Enter the basic details of the budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="budgetName" className="text-base">
                  Budget Name
                </Label>
                <Input id="budgetName" placeholder="e.g. Q3 2023 Operating Budget" required className="h-11" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="budgetType" className="text-base">
                  Budget Type
                </Label>
                <Select>
                  <SelectTrigger id="budgetType" className="h-11">
                    <SelectValue placeholder="Select budget type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operating">Operating</SelectItem>
                    <SelectItem value="capital">Capital</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="cash-flow">Cash Flow</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="period" className="text-base">
                  Budget Period
                </Label>
                <Select>
                  <SelectTrigger id="period" className="h-11">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="startDate" className="text-base">
                  Start Date
                </Label>
                <Input id="startDate" type="date" required className="h-11" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="endDate" className="text-base">
                  End Date
                </Label>
                <Input id="endDate" type="date" required className="h-11" />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Provide a description of this budget"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="department" className="text-base">
                  Department
                </Label>
                <Select>
                  <SelectTrigger id="department" className="h-11">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="status" className="text-base">
                  Status
                </Label>
                <Select defaultValue="draft">
                  <SelectTrigger id="status" className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Budget Items</CardTitle>
              <CardDescription>Add line items to your budget</CardDescription>
            </div>
            <Button type="button" onClick={addBudgetItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Category</TableHead>
                    <TableHead className="w-[300px]">Description</TableHead>
                    <TableHead className="text-right">Amount (AED)</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.category}
                          onChange={(e) => updateBudgetItem(item.id, "category", e.target.value)}
                          placeholder="Category"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateBudgetItem(item.id, "description", e.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateBudgetItem(item.id, "amount", Number.parseFloat(e.target.value) || 0)}
                          className="text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBudgetItem(item.id)}
                          disabled={budgetItems.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm font-medium">Total Budget</div>
                <div className="text-2xl font-bold">AED {totalBudget.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
            <CardDescription>Configure additional budget settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="approver" className="text-base">
                  Budget Approver
                </Label>
                <Select>
                  <SelectTrigger id="approver" className="h-11">
                    <SelectValue placeholder="Select approver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahmed">Ahmed Al Mansouri</SelectItem>
                    <SelectItem value="fatima">Fatima Khan</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sara">Sara Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="currency" className="text-base">
                  Currency
                </Label>
                <Select defaultValue="AED">
                  <SelectTrigger id="currency" className="h-11">
                    <SelectValue placeholder="Select currency" />
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

            <div className="space-y-3">
              <Label htmlFor="notes" className="text-base">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this budget"
                className="resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel} className="px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-6">
            {isSubmitting ? "Creating..." : "Create Budget"}
          </Button>
        </div>
      </form>
    </div>
  )
}
