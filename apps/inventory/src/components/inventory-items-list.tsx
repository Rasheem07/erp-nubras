"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Edit,
  Filter,
  Package,
  Plus,
  Search,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Trash2,
  Copy,
  History,
  MoveDown,
  Scan,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { inventoryService, type InventoryItem } from "@/lib/inventory/inventory-service"
import { BarcodeScannerButton } from "@/components/barcode-scanner-button"

export function InventoryItemsList() {
  const [items, setItems] = useState<InventoryItem[]>(inventoryService.getInventoryItems())
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortField, setSortField] = useState<keyof InventoryItem>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)

  // Get unique categories for filter
  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]

  // Handle barcode scan
  const handleBarcodeScan = (barcode: string) => {
    // Find the item with the scanned barcode
    const item = items.find((item) => item.barcode === barcode)

    if (item) {
      // Highlight the found item
      setHighlightedItem(item.id)

      // Scroll to the item (in a real app, you would implement this)
      setTimeout(() => {
        setHighlightedItem(null)
      }, 3000)
    }
  }

  // Filter and sort items
  const filteredItems = items
    .filter(
      (item) =>
        (categoryFilter === "all" || item.category === categoryFilter) &&
        (searchQuery === "" ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.barcode?.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      const aString = String(aValue).toLowerCase()
      const bString = String(bValue).toLowerCase()

      return sortDirection === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString)
    })

  // Handle sort change
  const handleSort = (field: keyof InventoryItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Render sort indicator
  const renderSortIndicator = (field: keyof InventoryItem) => {
    if (field !== sortField) return <ArrowUpDown className="ml-1 h-3 w-3" />
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Items</h2>
          <p className="text-muted-foreground">Manage your inventory items and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <BarcodeScannerButton onScan={handleBarcodeScan} mode="search" buttonText="Scan to Find" />
          <Link href="/items/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search items..."
                  className="pl-8 sm:w-[200px] md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="sm:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <button className="flex items-center font-semibold" onClick={() => handleSort("name")}>
                      Item {renderSortIndicator("name")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center font-semibold" onClick={() => handleSort("sku")}>
                      SKU {renderSortIndicator("sku")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center font-semibold" onClick={() => handleSort("category")}>
                      Category {renderSortIndicator("category")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      className="flex items-center font-semibold ml-auto"
                      onClick={() => handleSort("currentStock")}
                    >
                      Stock {renderSortIndicator("currentStock")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button className="flex items-center font-semibold ml-auto" onClick={() => handleSort("costPrice")}>
                      Cost {renderSortIndicator("costPrice")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className={highlightedItem === item.id ? "bg-primary/10 transition-colors" : ""}
                    >
                      <TableCell className="font-medium text-nowrap">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-nowrap">{item.name}</span>
                          {item.barcode && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              <Scan className="mr-1 h-3 w-3" />
                              {item.barcode}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>
                            {item.currentStock} {item.unitOfMeasure}
                          </span>
                          {item.currentStock <= item.minimumStock && (
                            <Badge variant="destructive" className="ml-2">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{inventoryService.formatCurrency(item.costPrice)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <BarcodeScannerButton
                            onScan={(_, quantity) => {
                              // In a real app, this would update the stock
                              console.log(`Scanned item ${item.id} with quantity ${quantity || 1}`)
                            }}
                            mode="count"
                            showQuantity={true}
                            variant="ghost"
                            size="icon"
                          />
                          <Link href={`/items/${item.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <History className="mr-2 h-4 w-4" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MoveDown className="mr-2 h-4 w-4" />
                                Move Stock
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
