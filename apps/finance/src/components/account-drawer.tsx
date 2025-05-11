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
import { Switch } from "@nubras/ui"
import { Separator } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { DollarSign, Save, X } from "lucide-react"

interface AccountDrawerProps {
  open: boolean
  onClose: () => void
  account: any
  mode: "view" | "edit"
}

export function AccountDrawer({ open, onClose, account, mode: initialMode }: AccountDrawerProps) {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState(
    account || {
      id: "",
      name: "",
      type: "",
      subtype: "",
      balance: 0,
      status: "Active",
      description: "",
      created: new Date().toISOString().split("T")[0],
    },
  )

  useState(
    account || {
      id: "",
      name: "",
      type: "",
      subtype: "",
      balance: 0,
      status: "Active",
      description: "",
      created: new Date().toISOString().split("T")[0],
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [name]: checked ? "Active" : "Inactive" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{mode === "view" ? "Account Details" : "Edit Account"}</SheetTitle>
          <SheetDescription>
            {mode === "view"
              ? "View account details and transaction history"
              : "Fill in the information below to update an account"}
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                        <p className="text-lg font-semibold">{account.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge variant={account.status === "Active" ? "success" : "secondary"}>{account.status}</Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Name</p>
                      <p className="text-lg">{account.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Type</p>
                        <p className="text-lg">{account.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Subtype</p>
                        <p className="text-lg">{account.subtype}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                      <p className="text-2xl font-bold">
                        AED{" "}
                        {account.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-lg">{account.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created On</p>
                      <p className="text-lg">{account.created}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Transactions</CardTitle>
                    <CardDescription>Last 5 transactions for this account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Invoice Payment #INV-001</p>
                          <p className="text-sm text-muted-foreground">Apr 15, 2023</p>
                        </div>
                        <p className="font-semibold text-green-600">+AED 1,250.00</p>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Rent Payment</p>
                          <p className="text-sm text-muted-foreground">Apr 10, 2023</p>
                        </div>
                        <p className="font-semibold text-red-600">-AED 800.00</p>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Invoice Payment #INV-002</p>
                          <p className="text-sm text-muted-foreground">Apr 05, 2023</p>
                        </div>
                        <p className="font-semibold text-green-600">+AED 750.00</p>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">Utility Bills</p>
                          <p className="text-sm text-muted-foreground">Apr 02, 2023</p>
                        </div>
                        <p className="font-semibold text-red-600">-AED 150.00</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Invoice Payment #INV-003</p>
                          <p className="text-sm text-muted-foreground">Apr 01, 2023</p>
                        </div>
                        <p className="font-semibold text-green-600">+AED 2,000.00</p>
                      </div>
                    </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
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
                  <Select value={formData.subtype} onValueChange={(value) => handleSelectChange("subtype", value)}>
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
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Update Account
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
