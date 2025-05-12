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
import { Building2, Mail, Phone, Globe, MapPin, FileText, CreditCard, Package } from "lucide-react"
import { inventoryService, type Supplier, type InventoryItem } from "@/lib/inventory/inventory-service"
import Link from "next/link"

interface SupplierDrawerProps {
  supplierId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierDrawer({ supplierId, open, onOpenChange }: SupplierDrawerProps) {
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [supplierItems, setSupplierItems] = useState<InventoryItem[]>([])

  useEffect(() => {
    if (open && supplierId) {
      // Load supplier details
      const supplierData = inventoryService.getSupplierById(supplierId)
      if (supplierData) {
        setSupplier(supplierData)

        // Load items from this supplier
        const items = inventoryService.getInventoryItems().filter((item) => item.supplier === supplierId)
        setSupplierItems(items)
      }
    }
  }, [supplierId, open])

  if (!supplier) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>{supplier.name}</SheetTitle>
          <SheetDescription>Supplier details and related information</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={supplier.isActive ? "default" : "secondary"}>
                {supplier.isActive ? "Active" : "Inactive"}
              </Badge>
              {supplier.isPreferred && <Badge variant="outline">Preferred</Badge>}
              <Badge>{supplier.category}</Badge>
            </div>
            <Button variant="outline" asChild size="sm">
              <Link href={`/suppliers/${supplierId}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="items">Items ({supplierItems.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
              <div className="grid gap-2">
                {supplier.contactPerson && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.contactPerson}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.website}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{supplier.address}</p>
                  <p>
                    {supplier.city}
                    {supplier.postalCode ? `, ${supplier.postalCode}` : ""}
                  </p>
                  <p>{supplier.country}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Business Information</h3>
              <div className="grid gap-2">
                {supplier.taxId && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Tax ID: {supplier.taxId}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Payment Terms: {supplier.paymentTerms === "0" ? "Immediate" : `${supplier.paymentTerms} Days`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Currency: {supplier.currency}</span>
                </div>
              </div>
            </div>

            {supplier.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                  <p className="text-sm">{supplier.notes}</p>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="items" className="py-4">
            {supplierItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Items</h3>
                <p className="text-sm text-muted-foreground mt-1">This supplier has no items in your inventory yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/items/create">Add Item</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {supplierItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-9 w-9 rounded-md border p-2" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/items/${item.id}`}>
                          <span className="sr-only">View item</span>
                          <FileText className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="py-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Purchase Orders</h3>
              <p className="text-sm text-muted-foreground mt-1">View and manage purchase orders for this supplier.</p>
              <Button className="mt-4" asChild>
                <Link href={`/purchase-orders/create?supplierId=${supplierId}`}>Create Purchase Order</Link>
              </Button>
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
