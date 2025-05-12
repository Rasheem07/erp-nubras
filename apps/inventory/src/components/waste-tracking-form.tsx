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
import { inventoryService, type InventoryItem, type WasteRecord } from "@/lib/inventory/inventory-service"

export function WasteTrackingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemId = searchParams.get("itemId")

  const [items, setItems] = useState<InventoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [formData, setFormData] = useState<Partial<WasteRecord>>({
    itemId: itemId || "",
    quantity: 1,
    reason: "",
    wastePercentage: 0,
    suggestedReuse: "",
    recordedBy: "current-user",
    recordedAt: new Date(),
  })

  useEffect(() => {
    // Load inventory items
    setItems(inventoryService.getInventoryItems())

    // If itemId is provided, set it as selected
    if (itemId) {
      const item = inventoryService.getInventoryItemById(itemId)
      if (item) {
        setSelectedItem(item)
        setFormData((prev) => ({
          ...prev,
          inventoryItemId: item.id,
          itemName: item.name,
        }))
      }
    }
  }, [itemId])

  const handleItemChange = (id: string) => {
    const item = inventoryService.getInventoryItemById(id)
    if (item) {
      setSelectedItem(item)
      setFormData((prev) => ({
        ...prev,
        inventoryItemId: id,
        itemName: item.name,
      }))
    } else {
      setSelectedItem(null)
    }
  }

  const handleChange = (field: keyof WasteRecord, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate quantity
      if (selectedItem && formData.quantity && formData.quantity > selectedItem.currentStock) {
        throw new Error(
          `Cannot record waste more than current stock (${selectedItem.currentStock} ${selectedItem.unitOfMeasure}s)`,
        )
      }

      // Create waste record
      inventoryService.createWasteRecord(formData as Omit<WasteRecord, "id">)

      // Redirect back to waste tracking list
      router.push("/waste-tracking")
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Record Waste</CardTitle>
          <CardDescription>Track material waste and suggest ways to reuse leftover materials</CardDescription>
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
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedItem.category}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Waste Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                max={selectedItem?.currentStock}
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number.parseFloat(e.target.value))}
                required
              />
              {selectedItem && <p className="text-sm text-muted-foreground">In {selectedItem.unitOfMeasure}(s)</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wastePercentage">Waste Percentage</Label>
              <Input
                id="wastePercentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.wastePercentage}
                onChange={(e) => handleChange("wastePercentage", Number.parseFloat(e.target.value))}
                required
              />
              <p className="text-sm text-muted-foreground">Percentage of original material wasted</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Waste</Label>
              <Select value={formData.reason} onValueChange={(value) => handleChange("reason", value)}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cutting Waste">Cutting Waste</SelectItem>
                  <SelectItem value="Defective Material">Defective Material</SelectItem>
                  <SelectItem value="Production Error">Production Error</SelectItem>
                  <SelectItem value="Measurement Error">Measurement Error</SelectItem>
                  <SelectItem value="Design Change">Design Change</SelectItem>
                  <SelectItem value="Customer Request">Customer Request</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID (Optional)</Label>
              <Input
                id="projectId"
                placeholder="Enter project ID"
                value={formData.projectId || ""}
                onChange={(e) => handleChange("projectId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name (Optional)</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={formData.projectName || ""}
                onChange={(e) => handleChange("projectName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestedReuse">Suggested Reuse</Label>
              <Textarea
                id="suggestedReuse"
                placeholder="Suggest how leftover material could be reused"
                value={formData.suggestedReuse}
                onChange={(e) => handleChange("suggestedReuse", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/waste-tracking")}>
            Cancel
          </Button>
          <Button type="submit">Record Waste</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
