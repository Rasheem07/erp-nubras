"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Filter, Plus, Search, ArrowUp, ArrowDown, FileText } from "lucide-react"
import { BarcodeScannerButton } from "@/components/barcode-scanner-button"

export default function StockMovementsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [highlightedMovement, setHighlightedMovement] = useState<string | null>(null)

  // Mock stock movement data
  const stockMovements = [
    {
      id: "mov-001",
      date: "2023-07-15",
      type: "receipt",
      reference: "PO-2023-0042",
      itemName: "Premium Cotton Fabric",
      itemSku: "FAB-COT-001",
      quantity: 50,
      unitOfMeasure: "meters",
      fromLocation: "Supplier",
      toLocation: "Main Warehouse",
      notes: "Received from supplier Emirates Fabrics",
      createdBy: "Ahmed Al Mansouri",
      barcode: "1234567890123",
    },
    {
      id: "mov-002",
      date: "2023-07-14",
      type: "transfer",
      reference: "TRF-2023-0018",
      itemName: "Silk Fabric",
      itemSku: "FAB-SLK-001",
      quantity: 20,
      unitOfMeasure: "meters",
      fromLocation: "Main Warehouse",
      toLocation: "Production Floor",
      notes: "Transfer for production order #PRD-2023-0089",
      createdBy: "Fatima Al Hashimi",
      barcode: "2345678901234",
    },
    {
      id: "mov-003",
      date: "2023-07-13",
      type: "issue",
      reference: "ISS-2023-0076",
      itemName: "Gold Thread",
      itemSku: "THR-GLD-001",
      quantity: 5,
      unitOfMeasure: "spools",
      fromLocation: "Main Warehouse",
      toLocation: "Production",
      notes: "Issued for embroidery work on order #ORD-2023-0156",
      createdBy: "Mohammed Al Zaabi",
      barcode: "3456789012345",
    },
    {
      id: "mov-004",
      date: "2023-07-12",
      type: "adjustment",
      reference: "ADJ-2023-0034",
      itemName: "Premium Cotton Fabric",
      itemSku: "FAB-COT-001",
      quantity: -3,
      unitOfMeasure: "meters",
      fromLocation: "Main Warehouse",
      toLocation: "N/A",
      notes: "Inventory adjustment after physical count",
      createdBy: "Layla Al Qasimi",
      barcode: "1234567890123",
    },
    {
      id: "mov-005",
      date: "2023-07-10",
      type: "return",
      reference: "RET-2023-0012",
      itemName: "Silk Fabric",
      itemSku: "FAB-SLK-001",
      quantity: 5,
      unitOfMeasure: "meters",
      fromLocation: "Production Floor",
      toLocation: "Main Warehouse",
      notes: "Returned unused material from production",
      createdBy: "Ahmed Al Mansouri",
      barcode: "2345678901234",
    },
  ]

  // Handle barcode scan
  const handleBarcodeScan = (barcode: string) => {
    // Find movements with the scanned barcode
    const movement = stockMovements.find((mov) => mov.barcode === barcode)

    if (movement) {
      // Highlight the found movement
      setHighlightedMovement(movement.id)

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedMovement(null)
      }, 3000)
    }
  }

  // Filter stock movements based on active tab and filters
  const filteredMovements = stockMovements.filter((movement) => {
    // Filter by tab (movement type)
    if (activeTab !== "all" && movement.type !== activeTab) return false

    // Filter by search query
    if (
      searchQuery &&
      !movement.itemName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !movement.itemSku.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !movement.reference.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !movement.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date()
      const movementDate = new Date(movement.date)

      if (
        dateFilter === "today" &&
        !(
          movementDate.getDate() === today.getDate() &&
          movementDate.getMonth() === today.getMonth() &&
          movementDate.getFullYear() === today.getFullYear()
        )
      ) {
        return false
      }

      if (dateFilter === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(today.getDate() - 7)
        if (movementDate < weekAgo) return false
      }

      if (dateFilter === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(today.getMonth() - 1)
        if (movementDate < monthAgo) return false
      }
    }

    // Filter by type
    if (typeFilter !== "all" && movement.type !== typeFilter) return false

    return true
  })

  // Get movement type badge
  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case "receipt":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
            Receipt
          </Badge>
        )
      case "issue":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10">
            Issue
          </Badge>
        )
      case "transfer":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10">
            Transfer
          </Badge>
        )
      case "adjustment":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/10">
            Adjustment
          </Badge>
        )
      case "return":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/10">
            Return
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Get quantity display with arrow
  const getQuantityDisplay = (type: string, quantity: number, unitOfMeasure: string) => {
    switch (type) {
      case "receipt":
      case "return":
        return (
          <div className="flex items-center text-green-600">
            <ArrowUp className="mr-1 h-3 w-3" />
            <span>
              +{quantity} {unitOfMeasure}
            </span>
          </div>
        )
      case "issue":
        return (
          <div className="flex items-center text-red-600">
            <ArrowDown className="mr-1 h-3 w-3" />
            <span>
              -{quantity} {unitOfMeasure}
            </span>
          </div>
        )
      case "transfer":
        return (
          <div className="flex items-center text-blue-600">
            <ArrowRight className="mr-1 h-3 w-3" />
            <span>
              {quantity} {unitOfMeasure}
            </span>
          </div>
        )
      case "adjustment":
        return quantity >= 0 ? (
          <div className="flex items-center text-green-600">
            <ArrowUp className="mr-1 h-3 w-3" />
            <span>
              +{quantity} {unitOfMeasure}
            </span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <ArrowDown className="mr-1 h-3 w-3" />
            <span>
              {quantity} {unitOfMeasure}
            </span>
          </div>
        )
      default:
        return (
          <span>
            {quantity} {unitOfMeasure}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stock Movements</h2>
          <p className="text-muted-foreground">Track and manage inventory movements between locations</p>
        </div>
        <div className="flex items-center gap-2">
          <BarcodeScannerButton onScan={handleBarcodeScan} mode="search" buttonText="Scan Item" />
          <Link href="/stock-movements/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Movement
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Stock Movement History</CardTitle>
          <CardDescription>View all inventory receipts, issues, transfers, and adjustments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <TabsList>
                <TabsTrigger value="all" className="text-xs">
                  All Movements
                </TabsTrigger>
                <TabsTrigger value="receipt" className="text-xs">
                  Receipts
                </TabsTrigger>
                <TabsTrigger value="issue" className="text-xs">
                  Issues
                </TabsTrigger>
                <TabsTrigger value="transfer" className="text-xs">
                  Transfers
                </TabsTrigger>
                <TabsTrigger value="adjustment" className="text-xs">
                  Adjustments
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search movements..."
                    className="pl-8 sm:w-[200px] md:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="sm:w-[130px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="sm:w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="receipt">Receipts</SelectItem>
                    <SelectItem value="issue">Issues</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                    <SelectItem value="adjustment">Adjustments</SelectItem>
                    <SelectItem value="return">Returns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No stock movements found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMovements.map((movement) => (
                        <TableRow
                          key={movement.id}
                          className={highlightedMovement === movement.id ? "bg-primary/10 transition-colors" : ""}
                        >
                          <TableCell>{new Date(movement.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="font-medium">{movement.reference}</div>
                          </TableCell>
                          <TableCell>{getMovementTypeBadge(movement.type)}</TableCell>
                          <TableCell>
                            <div className="font-medium">{movement.itemName}</div>
                            <div className="text-xs text-muted-foreground">{movement.itemSku}</div>
                          </TableCell>
                          <TableCell>
                            {getQuantityDisplay(movement.type, movement.quantity, movement.unitOfMeasure)}
                          </TableCell>
                          <TableCell>{movement.fromLocation}</TableCell>
                          <TableCell>{movement.toLocation}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
