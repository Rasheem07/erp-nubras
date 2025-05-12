"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { inventoryService, type InventoryItem, type MaterialAllocation } from "@/lib/inventory/inventory-service"

export function MaterialAllocationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemId = searchParams.get("itemId")

  const [items, setItems] = useState<InventoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [availableStock, setAvailableStock] = useState(0)
  const [formData, setFormData] = useState<Partial<MaterialAllocation>>({
    itemId: itemId || "", // Changed from inventoryItemId to itemId
    itemName: "",
    quantity: 1,
    status: "Reserved",
    allocatedBy: "current-user",
    allocatedAt: new Date(),
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
          itemId: item.id, // Changed from inventoryItemId to itemId
          itemName: item.name,
        }))

        // Calculate available stock
        const existingAllocations = inventoryService
          .getMaterialAllocationsByItemId(item.id)
          .filter((a) => a.status === "Reserved")
          .reduce((total, a) => total + a.quantity, 0)

        setAvailableStock(item.currentStock - existingAllocations)
      }
    }
  }, [itemId])

  const handleItemChange = (id: string) => {
    const item = inventoryService.getInventoryItemById(id)
    if (item) {
      setSelectedItem(item)
      setFormData((prev) => ({
        ...prev,
        itemId: id, // Changed from inventoryItemId to itemId
        itemName: item.name,
      }))

      // Calculate available stock
      const existingAllocations = inventoryService
        .getMaterialAllocationsByItemId(id)
        .filter((a) => a.status === "Reserved")
        .reduce((total, a) => total + a.quantity, 0)

      setAvailableStock(item.currentStock - existingAllocations)
    } else {
      setSelectedItem(null)
      setAvailableStock(0)
    }
  }

  const handleChange = (field: keyof MaterialAllocation, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate quantity
      if (formData.quantity && formData.quantity > availableStock) {
        throw new Error(`Cannot allocate more than available stock (${availableStock} ${selectedItem?.unitOfMeasure}s)`)
      }

      // Ensure required fields are present
      if (!formData.itemId || !formData.projectName) {
        throw new Error("Item and Project Name are required")
      }

      // Create material allocation
      inventoryService.createMaterialAllocation(formData as Omit<MaterialAllocation, "id">)

      // Redirect back to material allocations list
      router.push("/material-allocations")
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Allocate Material</CardTitle>
          <CardDescription>Reserve materials for projects or customer orders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemId">Inventory Item</Label>
              <Select value={formData.itemId} onValueChange={handleItemChange} disabled={!!itemId}>
                <SelectTrigger id="itemId">
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
                    <p className="text-sm font-medium text-muted-foreground">Available Stock</p>
                    <p className="font-medium">
                      {availableStock} {selectedItem.unitOfMeasure}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                max={availableStock}
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number.parseFloat(e.target.value))}
                required
              />
              {selectedItem && <p className="text-sm text-muted-foreground">In {selectedItem.unitOfMeasure}(s)</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={formData.projectName || ""}
                onChange={(e) => handleChange("projectName", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                <Label htmlFor="department">Department (Optional)</Label>
                <Input
                  id="department"
                  placeholder="Enter department"
                  value={formData.department || ""}
                  onChange={(e) => handleChange("department", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID (Optional)</Label>
                <Input
                  id="orderId"
                  placeholder="Enter order ID"
                  value={formData.orderId || ""}
                  onChange={(e) => handleChange("orderId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderReference">Order Reference (Optional)</Label>
                <Input
                  id="orderReference"
                  placeholder="Enter order reference"
                  value={formData.orderReference || ""}
                  onChange={(e) => handleChange("orderReference", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="Issued">Issued</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                  <SelectItem value="Consumed">Consumed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => handleChange("dueDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Enter any additional notes"
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/material-allocations")}>
            Cancel
          </Button>
          <Button type="submit">Allocate Material</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
