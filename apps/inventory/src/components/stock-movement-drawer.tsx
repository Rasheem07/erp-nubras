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
import { Separator } from "@/components/ui/separator"
import { Package, MapPin, FileText, User } from "lucide-react"
import { inventoryService, type StockMovement, type InventoryItem } from "@/lib/inventory/inventory-service"

interface StockMovementDrawerProps {
  movementId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StockMovementDrawer({ movementId, open, onOpenChange }: StockMovementDrawerProps) {
  const [movement, setMovement] = useState<StockMovement | null>(null)
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [fromLocation, setFromLocation] = useState<string | null>(null)
  const [toLocation, setToLocation] = useState<string | null>(null)

  useEffect(() => {
    if (open && movementId) {
      // Load movement details
      const allMovements = inventoryService
        .getInventoryItems()
        .flatMap((item) => inventoryService.getStockMovementsByItemId(item.id))

      const movementData = allMovements.find((m) => m.id === movementId)

      if (movementData) {
        setMovement(movementData)

        // Load related item
        const itemData = inventoryService.getInventoryItemById(movementData.itemId)
        setItem(itemData || null)

        // Get location names
        if (movementData.fromLocation) {
          const fromLoc = inventoryService.getLocationById(movementData.fromLocation)
          setFromLocation(fromLoc ? fromLoc.name : null)
        } else {
          setFromLocation(null)
        }

        if (movementData.toLocation) {
          const toLoc = inventoryService.getLocationById(movementData.toLocation)
          setToLocation(toLoc ? toLoc.name : null)
        } else {
          setToLocation(null)
        }
      }
    }
  }, [movementId, open])

  if (!movement) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Stock Movement Details</SheetTitle>
          <SheetDescription>View details of this stock movement</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <Badge
              variant={
                movement.type === "Purchase" ? "default" : movement.type === "Sale" ? "destructive" : "secondary"
              }
              className="px-3 py-1"
            >
              {movement.type}
            </Badge>
            <p className="text-sm text-muted-foreground">{movement.createdAt.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-4 py-2">
          {item && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Item</h3>
              <div className="flex items-center gap-3 rounded-md border p-3">
                <Package className="h-9 w-9 rounded-md border p-2" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.sku}</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Movement Details</h3>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Quantity:</p>
                <p className="font-medium">
                  {movement.quantity} {item?.unitOfMeasure || "units"}
                </p>
              </div>

              {fromLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>From: {fromLocation}</span>
                </div>
              )}

              {toLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>To: {toLocation}</span>
                </div>
              )}

              {movement.referenceId && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Reference: {movement.referenceId}
                    {movement.referenceType && (
                      <span className="text-sm text-muted-foreground ml-1">({movement.referenceType})</span>
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Created by: {movement.createdBy}</span>
              </div>
            </div>
          </div>

          {movement.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="text-sm">{movement.notes}</p>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
