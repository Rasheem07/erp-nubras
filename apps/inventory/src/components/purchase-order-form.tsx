"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import { CalendarIcon, Plus, Trash2, Save, Send, ShoppingCart } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  inventoryService,
  type InventoryItem,
  type Supplier,
  type PurchaseOrder,
  type PurchaseOrderItem,
  PurchaseOrderStatus,
} from "@/lib/inventory/inventory-service"

interface PurchaseOrderFormProps {
  orderId?: string
}

export function PurchaseOrderForm({ orderId }: PurchaseOrderFormProps) {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [itemSearch, setItemSearch] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [poItems, setPOItems] = useState<PurchaseOrderItem[]>([])
  const [activeTab, setActiveTab] = useState("details")
  const [isGeneratingPO, setIsGeneratingPO] = useState(false)

  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    supplierId: "",
    supplierName: "",
    orderDate: new Date(),
    expectedDeliveryDate: addDays(new Date(), 14),
    status: PurchaseOrderStatus.DRAFT,
    notes: "",
    paymentTerms: "Net 30",
    shippingMethod: "Standard",
    currency: "AED",
    vatRate: 5,
    createdBy: "current-user",
    items: [],
    subtotal: 0,
    vatAmount: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    // Load suppliers and inventory items
    setSuppliers(inventoryService.getSuppliers())
    setInventoryItems(inventoryService.getInventoryItems())
    setFilteredItems(inventoryService.getInventoryItems())

    // If editing an existing order, load its data
    if (orderId) {
      const order = inventoryService.getPurchaseOrderById(orderId)
      if (order) {
        setFormData(order)
        setPOItems(order.items || [])

        // Set selected supplier
        const supplier = inventoryService.getSupplierById(order.supplierId)
        if (supplier) {
          setSelectedSupplier(supplier)
        }
      }
    }
  }, [orderId])

  useEffect(() => {
    // Filter items based on search query
    if (itemSearch) {
      setFilteredItems(
        inventoryItems.filter(
          (item) =>
            item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
            item.sku.toLowerCase().includes(itemSearch.toLowerCase()) ||
            item.category.toLowerCase().includes(itemSearch.toLowerCase()),
        ),
      )
    } else {
      setFilteredItems(inventoryItems)
    }
  }, [itemSearch, inventoryItems])

  useEffect(() => {
    // Calculate totals whenever items change
    const subtotal = poItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
    const vatAmount = (subtotal * (formData.vatRate || 5)) / 100
    const totalAmount = subtotal + vatAmount

    setFormData((prev) => ({
      ...prev,
      items: poItems,
      subtotal,
      vatAmount,
      totalAmount,
    }))
  }, [poItems, formData.vatRate])

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId)
    if (supplier) {
      setSelectedSupplier(supplier)
      setFormData((prev) => ({
        ...prev,
        supplierId: supplier.id,
        supplierName: supplier.name,
      }))

      // Filter items to show only those from this supplier
      if (supplier.preferredItems && supplier.preferredItems.length > 0) {
        setFilteredItems(inventoryItems.filter((item) => supplier.preferredItems?.includes(item.id)))
      } else {
        setFilteredItems(inventoryItems)
      }
    }
  }

  const handleChange = (field: keyof PurchaseOrder, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddItem = (itemId: string) => {
    const item = inventoryItems.find((i) => i.id === itemId)
    if (!item) return

    // Check if item already exists in PO
    const existingItemIndex = poItems.findIndex((i) => i.inventoryItemId === itemId)
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...poItems]
      updatedItems[existingItemIndex].quantity += 1
      setPOItems(updatedItems)
    } else {
      // Add new item
      const newItem: PurchaseOrderItem = {
        id: `poi-${Date.now()}`,
        inventoryItemId: item.id,
        itemName: item.name,
        sku: item.sku,
        quantity: 1,
        unitOfMeasure: item.unitOfMeasure,
        unitPrice: item.costPrice,
        totalPrice: item.costPrice,
        notes: "",
        itemId: item.id,
        vatRate: formData.vatRate || 5,
        total: item.costPrice,
      }
      setPOItems([...poItems, newItem])
    }
  }

  const handleUpdateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updatedItems = [...poItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Update total price if quantity or unit price changes
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].unitPrice
    }

    setPOItems(updatedItems)
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...poItems]
    updatedItems.splice(index, 1)
    setPOItems(updatedItems)
  }

  const handleGeneratePO = () => {
    setIsGeneratingPO(true)

    // Get low stock items
    const lowStockItems = inventoryItems.filter((item) => item.currentStock <= item.reorderPoint)

    // Group by supplier
    const itemsBySupplier = lowStockItems.reduce(
      (acc, item) => {
        const supplierId = item.supplier
        if (!acc[supplierId]) {
          acc[supplierId] = []
        }
        acc[supplierId].push(item)
        return acc
      },
      {} as Record<string, InventoryItem[]>,
    )

    // If we have a selected supplier, only use their items
    if (selectedSupplier) {
      const supplierItems = itemsBySupplier[selectedSupplier.id] || []

      // Create PO items
      const newPOItems = supplierItems.map((item) => {
        const orderQuantity = Math.max(
          item.reorderPoint - item.currentStock + 5, // Order enough to get above reorder point plus buffer
          5, // Minimum order quantity
        )

        return {
          id: `poi-${Date.now()}-${item.id}`,
          inventoryItemId: item.id,
          itemName: item.name,
          sku: item.sku,
          quantity: orderQuantity,
          unitOfMeasure: item.unitOfMeasure,
          unitPrice: item.costPrice,
          totalPrice: item.costPrice * orderQuantity,
          notes: "Auto-generated based on low stock",
          itemId: item.id, // Ensure this matches the required field in PurchaseOrderItem
          vatRate: formData.vatRate || 5, // Add default VAT rate
          total: item.costPrice * orderQuantity, // Add total calculation
        }
      })

      setPOItems([...poItems, ...newPOItems])
    }

    setIsGeneratingPO(false)
  }

  const handleSubmit = (e: React.FormEvent, saveAsDraft = true) => {
    e.preventDefault()

    try {
      // Validate form
      if (!formData.supplierId) {
        throw new Error("Please select a supplier")
      }

      if (poItems.length === 0) {
        throw new Error("Please add at least one item to the purchase order")
      }

      // Create or update purchase order
      if (orderId) {
        // Update existing order
        inventoryService.updatePurchaseOrder(orderId, {
          ...formData,
          status: saveAsDraft ? PurchaseOrderStatus.DRAFT : PurchaseOrderStatus.SENT,
          items: poItems,
        })
      } else {
        // Create new order
        const purchaseOrder: Omit<PurchaseOrder, "id"> = {
          ...(formData as Omit<PurchaseOrder, "id">),
          status: saveAsDraft ? PurchaseOrderStatus.DRAFT : PurchaseOrderStatus.SENT,
          items: poItems,
          createdAt: new Date(),
        }
        inventoryService.createPurchaseOrder(purchaseOrder)
      }

      // Redirect back to purchase orders list
      router.push("/purchase-orders")
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, true)}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">PO Details</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Order Details</CardTitle>
                <CardDescription>Enter the basic information for this purchase order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="poNumber">PO Number</Label>
                    <Input
                      id="poNumber"
                      value={formData.poNumber}
                      onChange={(e) => handleChange("poNumber", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplierId">Supplier</Label>
                    <Select value={formData.supplierId} onValueChange={handleSupplierChange}>
                      <SelectTrigger id="supplierId">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedSupplier && (
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2">Supplier Information</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                        <p>{selectedSupplier.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                        <p>{selectedSupplier.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                        <p>{selectedSupplier.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                        <p>{selectedSupplier.paymentTerms}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Order Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.orderDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.orderDate ? format(new Date(formData.orderDate), "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.orderDate ? new Date(formData.orderDate) : undefined}
                          onSelect={(date) => handleChange("orderDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.expectedDeliveryDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.expectedDeliveryDate
                            ? format(new Date(formData.expectedDeliveryDate), "PPP")
                            : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate) : undefined}
                          onSelect={(date) => handleChange("expectedDeliveryDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes or instructions for the supplier"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Order Items</CardTitle>
                <CardDescription>Add items to your purchase order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Input
                      type="search"
                      placeholder="Search items..."
                      className="w-[300px]"
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleGeneratePO}
                      disabled={isGeneratingPO || !selectedSupplier}
                      className="flex items-center gap-2"
                      type="button"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Auto-Add Low Stock Items
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No items found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium">{item.name}</div>
                            </TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {item.currentStock} {item.unitOfMeasure}
                                {item.currentStock <= item.minimumStock && (
                                  <Badge variant="destructive">Low Stock</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{inventoryService.formatCurrency(item.costPrice)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddItem(item.id)}
                                className="flex items-center gap-1"
                                type="button"
                              >
                                <Plus className="h-4 w-4" />
                                Add
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Selected Items</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {poItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No items added to this purchase order.
                            </TableCell>
                          </TableRow>
                        ) : (
                          poItems.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="font-medium">{item.itemName}</div>
                              </TableCell>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateItem(index, "quantity", Number.parseInt(e.target.value))}
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.unitPrice}
                                  onChange={(e) =>
                                    handleUpdateItem(index, "unitPrice", Number.parseFloat(e.target.value))
                                  }
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>{inventoryService.formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(index)}
                                  className="flex items-center gap-1 text-destructive"
                                  type="button"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex w-full max-w-xs justify-between">
                    <span>Subtotal:</span>
                    <span>{inventoryService.formatCurrency(formData.subtotal || 0)}</span>
                  </div>
                  <div className="flex w-full max-w-xs justify-between">
                    <span>VAT ({formData.vatRate}%):</span>
                    <span>{inventoryService.formatCurrency(formData.vatAmount || 0)}</span>
                  </div>
                  <div className="flex w-full max-w-xs justify-between font-bold">
                    <span>Total:</span>
                    <span>{inventoryService.formatCurrency(formData.totalAmount || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Payment Details</CardTitle>
                <CardDescription>Configure shipping and payment options for this purchase order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shippingMethod">Shipping Method</Label>
                    <Select
                      value={formData.shippingMethod}
                      onValueChange={(value) => handleChange("shippingMethod", value)}
                    >
                      <SelectTrigger id="shippingMethod">
                        <SelectValue placeholder="Select shipping method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard Shipping</SelectItem>
                        <SelectItem value="Express">Express Shipping</SelectItem>
                        <SelectItem value="Pickup">Supplier Pickup</SelectItem>
                        <SelectItem value="Delivery">Supplier Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select
                      value={formData.paymentTerms}
                      onValueChange={(value) => handleChange("paymentTerms", value)}
                    >
                      <SelectTrigger id="paymentTerms">
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 7">Net 7</SelectItem>
                        <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                        <SelectItem value="Advance Payment">Advance Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vatRate">VAT Rate (%)</Label>
                    <Input
                      id="vatRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.vatRate}
                      onChange={(e) => handleChange("vatRate", Number.parseFloat(e.target.value))}
                      required
                    />
                    <p className="text-sm text-muted-foreground">Standard UAE VAT rate is 5%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendToSupplier"
                      checked={formData.sendToSupplier}
                      onCheckedChange={(checked) => handleChange("sendToSupplier", checked)}
                    />
                    <Label htmlFor="sendToSupplier">Send to supplier automatically</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    If enabled, the purchase order will be emailed to the supplier when you save it.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/purchase-orders")}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button type="button" onClick={(e) => handleSubmit(e, false)} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Save and Send
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
