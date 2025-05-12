"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, ShoppingCart } from "lucide-react"
import { inventoryService, type InventoryItem } from "@/lib/inventory/inventory-service"

interface LowStockItemsProps {
  items: InventoryItem[]
  onGeneratePOs: () => void
}

export function LowStockItems({ items, onGeneratePOs }: LowStockItemsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Low Stock Items
          </CardTitle>
          <CardDescription>Items that are below their reorder point</CardDescription>
        </div>
        <Button onClick={onGeneratePOs} className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Generate Purchase Orders
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">No low stock items found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell className="text-destructive">{item.currentStock}</TableCell>
                  <TableCell>{item.reorderPoint}</TableCell>
                  <TableCell>{inventoryService.formatCurrency(item.costPrice)}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
