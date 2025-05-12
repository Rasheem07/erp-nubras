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
import { Building2, Phone, MapPin, Package, ArrowRightLeft } from "lucide-react"
import { inventoryService, type Location, type InventoryItem } from "@/lib/inventory/inventory-service"
import Link from "next/link"

interface LocationDrawerProps {
  locationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationDrawer({ locationId, open, onOpenChange }: LocationDrawerProps) {
  const [location, setLocation] = useState<Location | null>(null)
  const [locationItems, setLocationItems] = useState<InventoryItem[]>([])
  const [parentLocation, setParentLocation] = useState<Location | null>(null)
  const [childLocations, setChildLocations] = useState<Location[]>([])

  useEffect(() => {
    if (open && locationId) {
      // Load location details
      const locationData = inventoryService.getLocationById(locationId)
      if (locationData) {
        setLocation(locationData)

        // Load items in this location
        const items = inventoryService.getInventoryItems().filter((item) => item.location === locationId)
        setLocationItems(items)

        // Load parent location if exists
        if (locationData.parentLocationId) {
          const parent = inventoryService.getLocationById(locationData.parentLocationId)
          setParentLocation(parent || null)
        } else {
          setParentLocation(null)
        }

        // Load child locations
        const children = inventoryService.getLocations().filter((loc) => loc.parentLocationId === locationId)
        setChildLocations(children)
      }
    }
  }, [locationId, open])

  if (!location) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>{location.name}</SheetTitle>
          <SheetDescription>Location details and inventory information</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={location.isActive ? "default" : "secondary"}>
                {location.isActive ? "Active" : "Inactive"}
              </Badge>
              {location.isDefault && <Badge variant="outline">Default</Badge>}
              <Badge>{location.type}</Badge>
            </div>
            <Button variant="outline" asChild size="sm">
              <Link href={`/inventory/locations/${locationId}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="items">Items ({locationItems.length})</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            {location.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-sm">{location.description}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{location.address}</p>
                  <p>
                    {location.city}
                    {location.postalCode ? `, ${location.postalCode}` : ""}
                  </p>
                  <p>{location.country}</p>
                </div>
              </div>
            </div>

            {(location.contactPerson || location.contactPhone) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                  <div className="grid gap-2">
                    {location.contactPerson && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{location.contactPerson}</span>
                      </div>
                    )}
                    {location.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{location.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Location Hierarchy</h3>
              {parentLocation ? (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>Parent: {parentLocation.name}</span>
                </div>
              ) : (
                <p className="text-sm">This is a top-level location</p>
              )}

              {childLocations.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Sub-locations:</p>
                  <ul className="mt-1 space-y-1">
                    {childLocations.map((child) => (
                      <li key={child.id} className="flex items-center gap-2 text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span>{child.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Inventory Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="text-2xl font-bold">{locationItems.length}</p>
                </div>
                <div className="rounded-md border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">
                    {inventoryService.formatCurrency(
                      locationItems.reduce((total, item) => total + item.currentStock * item.costPrice, 0),
                    )}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="py-4">
            {locationItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Items</h3>
                <p className="text-sm text-muted-foreground mt-1">This location has no items in inventory yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/inventory/items/create">Add Item</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {locationItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-9 w-9 rounded-md border p-2" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-medium">
                          {item.currentStock} {item.unitOfMeasure}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {inventoryService.formatCurrency(item.currentStock * item.costPrice)}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/inventory/items/${item.id}`}>
                          <span className="sr-only">View item</span>
                          <Package className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="movements" className="py-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ArrowRightLeft className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Stock Movements</h3>
              <p className="text-sm text-muted-foreground mt-1">View and manage stock movements for this location.</p>
              <div className="flex gap-2 mt-4">
                <Button asChild>
                  <Link href={`/inventory/stock-movements/create?toLocation=${locationId}`}>Add Stock</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/inventory/stock-movements">View All Movements</Link>
                </Button>
              </div>
            </div>
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
