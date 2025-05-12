import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingDown } from "lucide-react"
import { inventoryService, type InventoryItem } from "@/lib/inventory/inventory-service"

interface DeadStockItemsProps {
  items: InventoryItem[]
}

export function DeadStockItems({ items }: DeadStockItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-destructive" />
          Dead Stock Items
        </CardTitle>
        <CardDescription>Items that have not been used in over 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">No dead stock items found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Last Movement</TableHead>
                <TableHead>Suggested Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>{inventoryService.formatCurrency(item.currentStock * item.costPrice)}</TableCell>
                  <TableCell>{"Over 6 months ago"}</TableCell>
                  <TableCell>{"Discount or repurpose"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
