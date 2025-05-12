"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  inventoryService,
  type InventoryItem,
  type Location,
  type StockMovement,
} from "@/lib/inventory/inventory-service"

export function StockMovementForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemId = searchParams.get("itemId")

  const [items, setItems] = useState<InventoryItem[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [formData, setFormData] = useState<Partial<StockMovement>>({
    itemId: itemId || "",
    type: "Purchase",
    quantity: 1,
    notes: "",
    createdBy: "current-user",
  })

  useEffect(() => {
    // Load inventory items and locations
    setItems(inventoryService.getInventoryItems())
    setLocations(inventoryService.getLocations())

    // If itemId is provided, set it as selected
    if (itemId) {
      const item = inventoryService.getInventoryItemById(itemId)
      if (item) {
        setSelectedItem(item)
      }
    }
  }, [itemId])

  const handleItemChange = (id: string) => {
    const item = inventoryService.getInventoryItemById(id)
    setSelectedItem(item || null)
    setFormData((prev) => ({ ...prev, inventoryItemId: id }))
  }

  const handleChange = (field: keyof StockMovement, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Create stock movement
      inventoryService.createStockMovement(formData as Omit<StockMovement, "id" | "createdAt">)

      // Redirect back to stock movements list
      router.push("/stock-movements")
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create Stock Movement</CardTitle>
          <CardDescription>Record a movement of stock in or out of inventory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inventoryItemId">Inventory Item</Label>
              <Select value={formData.itemId} onValueChange={handleItemChange} disabled={!!itemId}>
                <SelectTrigger id="inventoryItemId">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedItem && (
              <div className="rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Stock</p>
                    <p className="font-medium">
                      {selectedItem.currentStock} {selectedItem.unitOfMeasure}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {inventoryService.getLocationById(selectedItem.location)?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="type">Movement Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select movement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Purchase">Purchase (In)</SelectItem>
                  <SelectItem value="Sale">Sale (Out)</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Adjustment">Adjustment</SelectItem>
                  <SelectItem value="Waste">Waste</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number.parseFloat(e.target.value))}
                required
              />
              {selectedItem && <p className="text-sm text-muted-foreground">In {selectedItem.unitOfMeasure}(s)</p>}
            </div>

            {formData.type === "transfer" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromLocation">From Location</Label>
                  <Select value={formData.fromLocation} onValueChange={(value) => handleChange("fromLocation", value)}>
                    <SelectTrigger id="fromLocation">
                      <SelectValue placeholder="Select source location" />
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

                <div className="space-y-2">
                  <Label htmlFor="toLocation">To Location</Label>
                  <Select value={formData.toLocation} onValueChange={(value) => handleChange("toLocation", value)}>
                    <SelectTrigger id="toLocation">
                      <SelectValue placeholder="Select destination location" />
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
            )}

            {formData.type !== "transfer" && (
              <div className="space-y-2">
                <Label htmlFor="location">{formData.type === "Purchase" ? "To Location" : "From Location"}</Label>
                <Select
                  value={formData.type === "Purchase" ? formData.toLocation : formData.fromLocation}
                  onValueChange={(value) => {
                    if (formData.type === "Purchase") {
                      handleChange("toLocation", value)
                    } else {
                      handleChange("fromLocation", value)
                    }
                  }}
                >
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
            )}

            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID (Optional)</Label>
              <Input
                id="referenceId"
                placeholder="e.g., PO-2023-001, INV-2023-001"
                value={formData.referenceId || ""}
                onChange={(e) => handleChange("referenceId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referenceType">Reference Type (Optional)</Label>
              <Select value={formData.referenceType} onValueChange={(value) => handleChange("referenceType", value)}>
                <SelectTrigger id="referenceType">
                  <SelectValue placeholder="Select reference type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PurchaseOrder">Purchase Order</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Order">Customer Order</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/stock-movements")}>
            Cancel
          </Button>
          <Button type="submit">Create Movement</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
