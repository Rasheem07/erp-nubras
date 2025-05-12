"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { inventoryService, type InventoryItem, type Supplier, type Location } from "@/lib/inventory/inventory-service"

interface InventoryItemFormProps {
  itemId?: string
}

export function InventoryItemForm({ itemId }: InventoryItemFormProps) {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: "",
    sku: "",
    description: "",
    category: "Fabric",
    subcategory: "",
    unitOfMeasure: "Meter",
    currentStock: 0,
    minimumStock: 0,
    reorderPoint: 0,
    costPrice: 0,
    vatRate: 5,
    supplier: "",
    location: "",
    barcode: "",
    isActive: true,
    isHalalCertified: false,
  })

  useEffect(() => {
    // Load suppliers and locations
    setSuppliers(inventoryService.getSuppliers())
    setLocations(inventoryService.getLocations())

    // If editing an existing item, load its data
    if (itemId) {
      const item = inventoryService.getInventoryItemById(itemId)
      if (item) {
        setFormData(item)
      }
    }
  }, [itemId])

  const handleChange = (field: keyof InventoryItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (itemId) {
        // Update existing item
        inventoryService.updateInventoryItem(itemId, formData)
      } else {
        // Create new item
        inventoryService.createInventoryItem(formData as Omit<InventoryItem, "id" | "createdAt" | "updatedAt">)
      }

      // Redirect back to inventory items list
      router.push("/items")
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{itemId ? "Edit Inventory Item" : "Create New Inventory Item"}</CardTitle>
          <CardDescription>
            {itemId
              ? "Update the details of an existing inventory item."
              : "Add a new item to your inventory with details and initial stock."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">Unique identifier for this item</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  placeholder="Enter barcode"
                  value={formData.barcode}
                  onChange={(e) => handleChange("barcode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter item description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fabric">Fabric</SelectItem>
                    <SelectItem value="Thread">Thread</SelectItem>
                    <SelectItem value="Accessory">Accessory</SelectItem>
                    <SelectItem value="Tool">Tool</SelectItem>
                    <SelectItem value="Packaging">Packaging</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  placeholder="Enter subcategory"
                  value={formData.subcategory}
                  onChange={(e) => handleChange("subcategory", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
                <Select value={formData.unitOfMeasure} onValueChange={(value) => handleChange("unitOfMeasure", value)}>
                  <SelectTrigger id="unitOfMeasure">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meter">Meter</SelectItem>
                    <SelectItem value="Yard">Yard</SelectItem>
                    <SelectItem value="Piece">Piece</SelectItem>
                    <SelectItem value="Roll">Roll</SelectItem>
                    <SelectItem value="Spool">Spool</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                    <SelectItem value="Kg">Kilogram</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={formData.supplier} onValueChange={(value) => handleChange("supplier", value)}>
                  <SelectTrigger id="supplier">
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

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Stock Information</h3>

              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.currentStock}
                  onChange={(e) => handleChange("currentStock", Number.parseFloat(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minimumStock}
                  onChange={(e) => handleChange("minimumStock", Number.parseFloat(e.target.value))}
                  required
                />
                <p className="text-sm text-muted-foreground">Minimum stock level before alerts are triggered</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderPoint">Reorder Point</Label>
                <Input
                  id="reorderPoint"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.reorderPoint}
                  onChange={(e) => handleChange("reorderPoint", Number.parseFloat(e.target.value))}
                  required
                />
                <p className="text-sm text-muted-foreground">Stock level at which to reorder this item</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing Information</h3>

              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price (AED)</Label>
                <Input
                  id="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => handleChange("costPrice", Number.parseFloat(e.target.value))}
                  required
                />
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

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange("isActive", checked)}
                  />
                  <Label htmlFor="isActive">Active Item</Label>
                </div>
                <p className="text-sm text-muted-foreground">Inactive items won&quot;t appear in regular searches</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isHalalCertified"
                    checked={formData.isHalalCertified}
                    onCheckedChange={(checked) => handleChange("isHalalCertified", checked)}
                  />
                  <Label htmlFor="isHalalCertified">Halal Certified</Label>
                </div>
                <p className="text-sm text-muted-foreground">Mark if this material is Halal certified</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/items")}>
            Cancel
          </Button>
          <Button type="submit">{itemId ? "Update Item" : "Create Item"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
