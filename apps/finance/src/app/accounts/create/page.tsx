"use client"

export const dynamic = "force-dynamic"


import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Label } from "@nubras/ui"
import { Textarea } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { Switch } from "@nubras/ui"
import { Separator } from "@nubras/ui"
import { ArrowLeft, DollarSign, Save } from "lucide-react"

export default function CreateAccountPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    subtype: "",
    balance: 0,
    status: "Active",
    description: "",
    created: new Date().toISOString().split("T")[0],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked ? "Active" : "Inactive" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log("Form submitted:", formData)
    router.push("/accounts")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Account</h2>
          <p className="text-muted-foreground">Add a new account to your chart of accounts</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Enter the details for the new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">Account Number</Label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status === "Active"}
                    onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    {formData.status}
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Cash"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtype">Account Subtype</Label>
                <Select
                  value={formData.subtype}
                  onValueChange={(value) => handleSelectChange("subtype", value)}
                  required
                >
                  <SelectTrigger id="subtype">
                    <SelectValue placeholder="Select subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Current Asset">Current Asset</SelectItem>
                    <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                    <SelectItem value="Current Liability">Current Liability</SelectItem>
                    <SelectItem value="Long-term Liability">Long-term Liability</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Operating Revenue">Operating Revenue</SelectItem>
                    <SelectItem value="Other Revenue">Other Revenue</SelectItem>
                    <SelectItem value="Cost of Sales">Cost of Sales</SelectItem>
                    <SelectItem value="Operating Expense">Operating Expense</SelectItem>
                    <SelectItem value="Other Expense">Other Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">Opening Balance (AED)</Label>
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
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
