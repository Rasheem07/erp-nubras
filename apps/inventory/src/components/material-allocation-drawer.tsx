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
import {
  inventoryService,
  type MaterialAllocation,
  type InventoryItem,
  type MaterialAllocationItem,
} from "@/lib/inventory/inventory-service"
import { Layers, Calendar, User, FileText, X, Briefcase } from "lucide-react"

interface MaterialAllocationDrawerProps {
  allocationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MaterialAllocationDrawer({ allocationId, open, onOpenChange }: MaterialAllocationDrawerProps) {
  const [allocation, setAllocation] = useState<MaterialAllocation | null>(null)
  const [item, setItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    if (allocationId && open) {
      const allocationData = inventoryService.getMaterialAllocationById(allocationId)
      if (allocationData) {
        setAllocation(allocationData)

        // Get the item details
        const itemData = inventoryService.getInventoryItemById(allocationData.itemId)
        if (itemData) {
          setItem(itemData)
        }
      }
    } else {
      setAllocation(null)
      setItem(null)
    }
  }, [allocationId, open])

  if (!allocation) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <div className="mx-auto w-full max-w-sm">
          <Sheet>
            <SheetTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Material Allocation Details
            </SheetTitle>
            <SheetDescription>
              {allocation.allocationNumber
                ? `Allocation #: ${allocation.allocationNumber}`
                : `Allocation ID: ${allocation.id}`}
            </SheetDescription>
          </Sheet>
          <div className="p-4 pb-0">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Project Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Project Name:</span>
                    <span className="font-medium">{allocation.projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Order Reference:</span>
                    <span>{allocation.orderReference || "N/A"}</span>
                  </div>
                  {allocation.orderNumber && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Order Number:</span>
                      <span>{allocation.orderNumber}</span>
                    </div>
                  )}
                  {allocation.department && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        Department:
                      </span>
                      <span>{allocation.department}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
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
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Item Details</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Item:</span>
                    <span className="font-medium">{item?.name || "Unknown Item"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SKU:</span>
                    <span>{item?.sku || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Quantity:</span>
                    <span>
                      {allocation.quantity} {item?.unitOfMeasure || "units"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Allocation Details</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Allocated Date:
                    </span>
                    <span>{allocation.allocatedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Due Date:
                    </span>
                    <span>{allocation.dueDate ? allocation.dueDate.toLocaleDateString() : "N/A"}</span>
                  </div>
                  {allocation.requiredByDate && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Required By:
                      </span>
                      <span>{allocation.requiredByDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Allocated By:
                    </span>
                    <span>{allocation.allocatedBy}</span>
                  </div>
                </div>
              </div>

              {allocation.notes && (
                <div>
                  <h3 className="font-medium">Notes</h3>
                  <div className="mt-2">
                    <p className="text-sm">{allocation.notes}</p>
                  </div>
                </div>
              )}

              {allocation.items && allocation.items.length > 0 && (
                <div>
                  <h3 className="font-medium">Additional Items</h3>
                  <div className="mt-2 space-y-2">
                    {allocation.items.map((allocationItem: MaterialAllocationItem) => (
                      <div key={allocationItem.id} className="rounded border p-2 text-sm">
                        <div className="flex justify-between">
                          <span>{allocationItem.itemName}</span>
                          <span>
                            {allocationItem.quantity} {allocationItem.unitOfMeasure}
                          </span>
                        </div>
                        {allocationItem.notes && (
                          <div className="mt-1 text-xs text-muted-foreground">{allocationItem.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <SheetFooter>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <a
                  href={`/material-allocations/${allocation.id}/print`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Print
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href={`/material-allocations/${allocation.id}/edit`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Edit
                </a>
              </Button>
            </div>
            <SheetClose asChild>
              <Button variant="outline">
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
