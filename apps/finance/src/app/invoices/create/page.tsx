"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Save, Trash, Eye } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function CreateInvoicePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("items")
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customer: "",
    customerEmail: "",
    customerAddress: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "draft",
    items: [{ description: "", quantity: 1, price: 0, taxCategory: "" }],
    taxes: [{ name: "VAT", rate: 5, applyOn: "Net Total", enabled: true }],
    notes: "",
    termsAndConditions: "Standard terms and conditions apply.",
  })

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const calculateTaxes = () => {
    let taxes = 0
    formData.taxes.forEach((tax) => {
      if (tax.enabled) {
        taxes += calculateSubtotal() * (tax.rate / 100)
      }
    })
    return taxes
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes()
  }

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
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, price: 0, taxCategory: "" }],
    }))
  }

  const handleRemoveItem = (index: number) => {
    if (formData.items.length === 1) return
    const newItems = [...formData.items]
    newItems.splice(index, 1)
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const handleTaxChange = (index: number, field: string, value: any) => {
    const newTaxes = [...formData.taxes]
    newTaxes[index] = { ...newTaxes[index], [field]: value }
    setFormData((prev) => ({ ...prev, taxes: newTaxes }))
  }

  const handleAddTax = () => {
    setFormData((prev) => ({
      ...prev,
      taxes: [...prev.taxes, { name: "", rate: 0, applyOn: "Net Total", enabled: true }],
    }))
  }

  const handleRemoveTax = (index: number) => {
    if (formData.taxes.length === 1) return
    const newTaxes = [...formData.taxes]
    newTaxes.splice(index, 1)
    setFormData((prev) => ({ ...prev, taxes: newTaxes }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log("Form submitted:", {
      ...formData,
      subtotal: calculateSubtotal(),
      taxAmount: calculateTaxes(),
      total: calculateTotal(),
    })
    router.push("/invoices")
  }

  // Update the handlePreview function to ensure we're storing the complete invoice data
  const handlePreview = () => {
    // In a real application, you would save the draft and redirect to preview
    // For now, we'll just store the data in localStorage for the preview page to use
    const invoiceData = {
      ...formData,
      subtotal: calculateSubtotal(),
      taxAmount: calculateTaxes(),
      total: calculateTotal(),
      // Ensure these arrays are defined
      items: formData.items || [],
      taxes: formData.taxes || [],
    }

    localStorage.setItem("invoicePreview", JSON.stringify(invoiceData))
    router.push("/invoices/preview")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create New Invoice</h2>
            <p className="text-muted-foreground">Create a new sales invoice</p>
          </div>
        </div>
        <Button onClick={handlePreview} className="gap-2">
          <Eye className="h-4 w-4" />
          Preview Invoice
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="taxes">Taxes & Charges</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <Card className="mt-4 border-t-0 rounded-tl-none rounded-tr-none">
            <CardContent className="pt-6">
              <TabsContent value="items" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., INV-001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Input
                      id="customer"
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      placeholder="Customer name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Customer Email</Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="customer@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      name="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="customerAddress">Customer Address</Label>
                    <Textarea
                      id="customerAddress"
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleInputChange}
                      placeholder="Customer's billing address"
                      rows={2}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Invoice Items</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price (AED)</TableHead>
                          <TableHead>Tax Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                placeholder="Item description"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 0)
                                }
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.price}
                                onChange={(e) =>
                                  handleItemChange(index, "price", Number.parseFloat(e.target.value) || 0)
                                }
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.taxCategory}
                                onValueChange={(value) => handleItemChange(index, "taxCategory", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select tax" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard Rate</SelectItem>
                                  <SelectItem value="reduced">Reduced Rate</SelectItem>
                                  <SelectItem value="zero">Zero Rated</SelectItem>
                                  <SelectItem value="exempt">Exempt</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {(item.quantity * item.price).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(index)}
                                disabled={formData.items.length === 1}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="taxes" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tax Summary</h3>
                    <div className="rounded-lg border p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">
                            AED{" "}
                            {calculateSubtotal().toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        {formData.taxes
                          .filter((tax) => tax.enabled)
                          .map((tax, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-muted-foreground">
                                {tax.name} ({tax.rate}%)
                              </span>
                              <span className="font-medium">
                                AED{" "}
                                {((calculateSubtotal() * tax.rate) / 100).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          ))}
                        <Separator />
                        <div className="flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="text-xl font-bold">
                            AED{" "}
                            {calculateTotal().toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Tax Configuration</h3>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddTax}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tax
                      </Button>
                    </div>

                    <div className="overflow-x-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tax Name</TableHead>
                            <TableHead>Rate (%)</TableHead>
                            <TableHead>Apply On</TableHead>
                            <TableHead>Enabled</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.taxes.map((tax, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Input
                                  value={tax.name}
                                  onChange={(e) => handleTaxChange(index, "name", e.target.value)}
                                  placeholder="Tax name"
                                  required
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={tax.rate}
                                  onChange={(e) =>
                                    handleTaxChange(index, "rate", Number.parseFloat(e.target.value) || 0)
                                  }
                                  required
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={tax.applyOn}
                                  onValueChange={(value) => handleTaxChange(index, "applyOn", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Apply on" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Net Total">Net Total</SelectItem>
                                    <SelectItem value="Previous Row Amount">Previous Row Amount</SelectItem>
                                    <SelectItem value="Previous Row Total">Previous Row Total</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={tax.enabled}
                                  onCheckedChange={(checked) => handleTaxChange(index, "enabled", checked)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveTax(index)}
                                  disabled={formData.taxes.length === 1}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Invoice Summary</h3>
                    <div className="space-y-4 rounded-lg border p-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          AED{" "}
                          {calculateSubtotal().toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">
                          AED{" "}
                          {calculateTaxes().toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold">
                          AED{" "}
                          {calculateTotal().toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Additional notes or payment instructions"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
                        <Textarea
                          id="termsAndConditions"
                          name="termsAndConditions"
                          value={formData.termsAndConditions}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
          <Button type="button" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </form>
    </div>
  )
}
