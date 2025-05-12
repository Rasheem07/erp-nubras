"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Edit, ArrowRightLeft, Layers, Scissors, Truck, MapPin } from "lucide-react"
import {
  inventoryService,
  type InventoryItem,
  type StockMovement,
  type MaterialAllocation,
  type WasteRecord,
} from "@/lib/inventory/inventory-service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InventoryItemDetailProps {
  itemId: string
}

export function InventoryItemDetail({ itemId }: InventoryItemDetailProps) {
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [allocations, setAllocations] = useState<MaterialAllocation[]>([])
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([])
  const [supplier, setSupplier] = useState<string>("Unknown")
  const [location, setLocation] = useState<string>("Unknown")

  useEffect(() => {
    // Load item details
    const inventoryItem = inventoryService.getInventoryItemById(itemId)
    if (inventoryItem) {
      setItem(inventoryItem)

      // Load related data
      const movements = inventoryService.getStockMovementsByItemId(itemId)
      setStockMovements(movements)

      const itemAllocations = inventoryService.getMaterialAllocationsByItemId(itemId)
      setAllocations(itemAllocations)

      const itemWasteRecords = inventoryService.getWasteRecordsByItemId(itemId)
      setWasteRecords(itemWasteRecords)

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
  }, [itemId])

  if (!item) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading item details...</p>
      </div>
    )
  }

  // Calculate stock status
  const stockStatus =
    item.currentStock === 0 ? "Out of Stock" : item.currentStock <= item.minimumStock ? "Low Stock" : "In Stock"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{item.name}</h2>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/stock-movements/create?itemId=${item.id}`} className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Add Movement
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/material-allocations/create?itemId=${item.id}`} className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Allocate
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/items/${item.id}/edit`} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Item
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Basic information about this inventory item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Package className="h-12 w-12 rounded-md border p-2" />
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.sku}</p>
              </div>
            </div>

            <div className="grid gap-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{item.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subcategory</p>
                  <p>{item.subcategory || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p>{item.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Barcode</p>
                  <p>{item.barcode || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unit of Measure</p>
                  <p>{item.unitOfMeasure}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground">Status:</p>
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground">Halal Certified:</p>
                  <Badge variant={item.isHalalCertified ? "default" : "secondary"}>
                    {item.isHalalCertified ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Information</CardTitle>
            <CardDescription>Current stock levels and related information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4 pt-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VAT Rate</p>
                <p>{item.vatRate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Restock Date</p>
                <p>{item.lastRestockDate.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <p>{supplier}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p>{location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Stock Movements
          </TabsTrigger>
          <TabsTrigger value="allocations" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Material Allocations
          </TabsTrigger>
          <TabsTrigger value="waste" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Waste Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>History of stock changes for this item</CardDescription>
            </CardHeader>
            <CardContent>
              {stockMovements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ArrowRightLeft className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Stock Movements</h3>
                  <p className="text-sm text-muted-foreground mt-1">This item has no recorded stock movements yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>From/To</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{movement.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              movement.type === "receipt"
                                ? "default"
                                : movement.type === "issue"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {movement.quantity} {item.unitOfMeasure}
                        </TableCell>
                        <TableCell>
                          {movement.fromLocation && `From: ${movement.fromLocation}`}
                          {movement.toLocation && `To: ${movement.toLocation}`}
                        </TableCell>
                        <TableCell>{movement.referenceId || "N/A"}</TableCell>
                        <TableCell>{movement.notes || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations">
          <Card>
            <CardHeader>
              <CardTitle>Material Allocations</CardTitle>
              <CardDescription>Materials reserved for projects or orders</CardDescription>
            </CardHeader>
            <CardContent>
              {allocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Material Allocations</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This item has not been allocated to any projects or orders yet.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Project/Order</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Allocated By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocations.map((allocation) => (
                      <TableRow key={allocation.id}>
                        <TableCell>{allocation.allocatedAt.toLocaleDateString()}</TableCell>
                        <TableCell>{allocation.projectName || allocation.orderReference || "N/A"}</TableCell>
                        <TableCell>
                          {allocation.quantity} {item.unitOfMeasure}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              allocation.status === "Reserved"
                                ? "outline"
                                : allocation.status === "Issued"
                                  ? "default"
                                  : allocation.status === "Returned"
                                    ? "destructive"
                                    : "secondary"
                            }
                          >
                            {allocation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{allocation.dueDate ? allocation.dueDate.toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>{allocation.allocatedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste">
          <Card>
            <CardHeader>
              <CardTitle>Waste Records</CardTitle>
              <CardDescription>Records of material waste and suggested reuse</CardDescription>
            </CardHeader>
            <CardContent>
              {wasteRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Waste Records</h3>
                  <p className="text-sm text-muted-foreground mt-1">This item has no recorded waste yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Waste %</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Suggested Reuse</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wasteRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.recordedAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          {record.quantity} {item.unitOfMeasure}
                        </TableCell>
                        <TableCell>{record.wastePercentage}%</TableCell>
                        <TableCell>{record.reason}</TableCell>
                        <TableCell>{record.projectName || "N/A"}</TableCell>
                        <TableCell>{record.suggestedReuse || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
