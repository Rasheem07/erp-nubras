"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { inventoryService, type StockMovement, type InventoryItem } from "@/lib/inventory/inventory-service"

export function StockMovementsList() {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [itemFilter, setItemFilter] = useState<string>("all")

  useEffect(() => {
    // Load all stock movements
    const allMovements = inventoryService
      .getInventoryItems()
      .flatMap((item) => inventoryService.getStockMovementsByItemId(item.id))
    setMovements(allMovements)
    setItems(inventoryService.getInventoryItems())
  }, [])

  // Get unique movement types for filters
  const movementTypes = Array.from(new Set(movements.map((movement) => movement.type)))

  // Filter movements based on search query and filters
  const filteredMovements = movements.filter((movement) => {
    const item = inventoryService.getInventoryItemById(movement.itemId)
    const itemName = item ? item.name : ""
    const itemSku = item ? item.sku : ""
    const notes = movement.notes || ""

    const matchesSearch =
      searchQuery === "" ||
      itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itemSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notes.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || movement.type === typeFilter
    const matchesItem = itemFilter === "all" || movement.itemId === itemFilter

    return matchesSearch && matchesType && matchesItem
  })

  // Sort movements by date (newest first)
  const sortedMovements = [...filteredMovements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Stock Movements</h2>
        <Button asChild>
          <Link href="/stock-movements/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Movement
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Movements</CardTitle>
          <CardDescription>
            Track all stock movements including purchases, sales, transfers, and adjustments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search movements..."
                    className="pl-8 w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Filter:</span>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Movement Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {movementTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={itemFilter} onValueChange={setItemFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>From/To</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMovements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No stock movements found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedMovements.map((movement) => {
                      const item = inventoryService.getInventoryItemById(movement.itemId)
                      const fromLocation = movement.fromLocation
                        ? inventoryService.getLocationById(movement.fromLocation)?.name
                        : null
                      const toLocation = movement.toLocation
                        ? inventoryService.getLocationById(movement.toLocation)?.name
                        : null

                      return (
                        <TableRow key={movement.id}>
                          <TableCell>{movement.createdAt.toLocaleDateString()}</TableCell>
                          <TableCell>
                            {item ? (
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.sku}</p>
                              </div>
                            ) : (
                              "Unknown Item"
                            )}
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            {movement.quantity} {item?.unitOfMeasure || "units"}
                          </TableCell>
                          <TableCell>
                            {fromLocation && <div>From: {fromLocation}</div>}
                            {toLocation && <div>To: {toLocation}</div>}
                          </TableCell>
                          <TableCell>
                            {movement.referenceId ? (
                              <div>
                                <p>{movement.referenceId}</p>
                                <p className="text-sm text-muted-foreground">{movement.referenceType}</p>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>{movement.notes || "N/A"}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {sortedMovements.length} of {movements.length} movements
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
