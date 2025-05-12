"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, MapPin, ArrowRightLeft, Layers, Edit } from "lucide-react"
import {
  inventoryService,
  type InventoryItem,
  type StockMovement,
  type MaterialAllocation,
  type WasteRecord,
} from "@/lib/inventory/inventory-service"
import Link from "next/link"

interface InventoryItemDrawerProps {
  itemId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InventoryItemDrawer({ itemId, open, onOpenChange }: InventoryItemDrawerProps) {
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [allocations, setAllocations] = useState<MaterialAllocation[]>([])
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([])
  const [supplier, setSupplier] = useState<string>("Unknown")
  const [location, setLocation] = useState<string>("Unknown")

  useEffect(() => {
    if (open && itemId) {
      // Load item details
      const inventoryItem = inventoryService.getInventoryItemById(itemId)
      if (inventoryItem) {
        setItem(inventoryItem)

        // Load related data
        setStockMovements(inventoryService.getStockMovementsByItemId(itemId))
        setAllocations(inventoryService.getMaterialAllocationsByItemId(itemId))
        setWasteRecords(inventoryService.getWasteRecordsByItemId(itemId))

        // Get supplier and location names
        const supplierObj = inventoryService.getSupplierById(inventoryItem.supplier)
        if (supplierObj) {
          setSupplier(supplierObj.name)
        }

        const locationObj = inventoryService.getLocationById(inventoryItem.location)
        if (locationObj) {
          setLocation(locationObj.name)
        }
      }
    }
  }, [itemId, open])

  if (!item) {
    return null
  }

  // Calculate stock status
  const stockStatus =
    item.currentStock === 0 ? "Out of Stock" : item.currentStock <= item.minimumStock ? "Low Stock" : "In Stock"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>{item.name}</SheetTitle>
          <SheetDescription>Inventory item details and stock information</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  stockStatus === "Out of Stock" ? "destructive" : stockStatus === "Low Stock" ? "outline" : "default"
                }
              >
                {stockStatus}
              </Badge>
              <Badge variant="outline">{item.category}</Badge>
              {item.isHalalCertified && <Badge variant="secondary">Halal Certified</Badge>}
            </div>
            <Button variant="outline" asChild size="sm">
              <Link href={`/items/${itemId}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Package className="h-12 w-12 rounded-md border p-2" />
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.sku}</p>
              </div>
            </div>

            {item.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-sm">{item.description}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Item Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{item.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subcategory</p>
                  <p>{item.subcategory || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit of Measure</p>
                  <p>{item.unitOfMeasure}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barcode</p>
                  <p>{item.barcode || "N/A"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Supplier & Location</h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Supplier: {supplier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Location: {location}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Stock</p>
                <p className="text-3xl font-bold">
                  {item.currentStock} {item.unitOfMeasure}
                </p>
              </div>
              <Badge
                variant={
                  stockStatus === "Out of Stock" ? "destructive" : stockStatus === "Low Stock" ? "outline" : "default"
                }
                className="text-md px-3 py-1"
              >
                {stockStatus}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minimum Stock</p>
                <p>
                  {item.minimumStock} {item.unitOfMeasure}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reorder Point</p>
                <p>
                  {item.reorderPoint} {item.unitOfMeasure}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Price</p>
                <p>
                  {inventoryService.formatCurrency(item.costPrice)} per {item.unitOfMeasure}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p>{inventoryService.formatCurrency(item.currentStock * item.costPrice)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">VAT Rate</p>
                <p>{item.vatRate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Restock Date</p>
                <p>{item.lastRestockDate.toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href={`/stock-movements/create?itemId=${item.id}`}>
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Add Movement
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href={`/material-allocations/create?itemId=${item.id}`}>
                    <Layers className="h-4 w-4 mr-2" />
                    Allocate
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="movements" className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Recent Movements</h3>
              <Button asChild size="sm" variant="outline">
                <Link href={`/items/${item.id}`}>View All</Link>
              </Button>
            </div>

            {stockMovements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <ArrowRightLeft className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No stock movements recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stockMovements.slice(0, 3).map((movement) => (
                  <div key={movement.id} className="flex justify-between items-center rounded-md border p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            movement.type === "Purchase"
                              ? "default"
                              : movement.type === "Sale"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {movement.type}
                        </Badge>
                        <span className="text-sm">{movement.createdAt.toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{movement.notes || "No notes"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {movement.quantity} {item.unitOfMeasure}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-4" />

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Allocations</h3>
            </div>

            {allocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Layers className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No material allocations yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allocations.slice(0, 2).map((allocation) => (
                  <div key={allocation.id} className="flex justify-between items-center rounded-md border p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            allocation.status === "Reserved"
                              ? "outline"
                              : allocation.status === "Issued"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {allocation.status}
                        </Badge>
                        <span className="text-sm">
                          {allocation.projectName || allocation.orderReference || "Unspecified"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {allocation.dueDate ? `Due: ${allocation.dueDate.toLocaleDateString()}` : "No due date"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {allocation.quantity} {item.unitOfMeasure}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
