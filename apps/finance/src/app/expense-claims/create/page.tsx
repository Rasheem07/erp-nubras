"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Label } from "@nubras/ui"
import { Textarea } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { Separator } from "@nubras/ui"
import { DollarSign, Plus, Save, Trash, ArrowLeft } from "lucide-react"
import { formatCurrency } from "@nubras/utils"

export default function CreateExpenseClaim() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: `EC-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
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
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Recalculate total
    const total = newItems.reduce((sum, item) => sum + Number(item.amount), 0)

    setFormData((prev) => ({ ...prev, items: newItems, total }))
  }

  const handleAddItem = () => {
    setFormData((prev) => ({
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

    setFormData((prev) => ({ ...prev, items: newItems, total }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would submit the data to your backend here
      console.log("Form submitted:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate back to expense claims list
      router.push("/expense-claims")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Expense Claim</h2>
          <p className="text-muted-foreground">Submit a new expense claim for reimbursement</p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-none shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl">Claim Information</CardTitle>
            <CardDescription>Provide basic information about your expense claim</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="id">Claim ID</Label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Automatically generated</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee Name</Label>
                <Input
                  id="employee"
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the expense claim (e.g., Client meeting expenses, Conference travel)"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Expense Items</CardTitle>
                <CardDescription>Add all items you want to claim for reimbursement</CardDescription>
              </div>
              <Button type="button" onClick={handleAddItem} variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Item #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    disabled={formData.items.length <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`item-category-${index}`}>Category</Label>
                    <Select value={item.category} onValueChange={(value) => handleItemChange(index, "category", value)}>
                      <SelectTrigger id={`item-category-${index}`}>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-date-${index}`}>Date</Label>
                    <Input
                      id={`item-date-${index}`}
                      type="date"
                      value={item.date}
                      onChange={(e) => handleItemChange(index, "date", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-description-${index}`}>Description</Label>
                  <Input
                    id={`item-description-${index}`}
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    placeholder="Brief description of the expense item"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-amount-${index}`}>Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`item-amount-${index}`}
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
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <div className="bg-muted p-4 rounded-lg w-full md:w-1/3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-xl font-bold">{formatCurrency(formData.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Submit Claim
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
