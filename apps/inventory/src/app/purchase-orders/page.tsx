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
import {
  Calendar,
  Filter,
  Plus,
  Search,
  FileText,
  ShoppingCart,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { inventoryService } from "@/lib/inventory/inventory-service"
import { BarcodeScannerButton } from "@/components/barcode-scanner-button"

export default function PurchaseOrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)

  // Mock purchase order data
  const purchaseOrders = [
    {
      id: "po-001",
      poNumber: "PO-2023-0042",
      date: "2023-07-15",
      supplier: "Emirates Fabrics",
      status: "received",
      totalAmount: 12500,
      currency: "AED",
      items: [
        { id: "item-001", name: "Premium Cotton Fabric", sku: "FAB-COT-001", barcode: "1234567890123" },
        { id: "item-002", name: "Silk Fabric", sku: "FAB-SLK-001", barcode: "2345678901234" },
      ],
      expectedDelivery: "2023-07-20",
      receivedDate: "2023-07-18",
      createdBy: "Ahmed Al Mansouri",
    },
    {
      id: "po-002",
      poNumber: "PO-2023-0043",
      date: "2023-07-16",
      supplier: "Dubai Thread Suppliers",
      status: "pending",
      totalAmount: 4800,
      currency: "AED",
      items: [
        { id: "item-003", name: "Gold Thread", sku: "THR-GLD-001", barcode: "3456789012345" },
        { id: "item-004", name: "Silver Thread", sku: "THR-SLV-001", barcode: "4567890123456" },
      ],
      expectedDelivery: "2023-07-25",
      receivedDate: null,
      createdBy: "Fatima Al Hashimi",
    },
    {
      id: "po-003",
      poNumber: "PO-2023-0044",
      date: "2023-07-17",
      supplier: "Sharjah Buttons & Accessories",
      status: "partial",
      totalAmount: 3200,
      currency: "AED",
      items: [
        { id: "item-005", name: "Pearl Buttons", sku: "BTN-PRL-001", barcode: "5678901234567" },
        { id: "item-006", name: "Gold Buttons", sku: "BTN-GLD-001", barcode: "6789012345678" },
      ],
      expectedDelivery: "2023-07-22",
      receivedDate: "2023-07-20",
      createdBy: "Mohammed Al Zaabi",
    },
    {
      id: "po-004",
      poNumber: "PO-2023-0045",
      date: "2023-07-18",
      supplier: "Abu Dhabi Packaging",
      status: "draft",
      totalAmount: 1500,
      currency: "AED",
      items: [
        { id: "item-007", name: "Premium Boxes", sku: "PKG-BOX-001", barcode: "7890123456789" },
        { id: "item-008", name: "Garment Bags", sku: "PKG-BAG-001", barcode: "8901234567890" },
      ],
      expectedDelivery: "2023-07-28",
      receivedDate: null,
      createdBy: "Layla Al Qasimi",
    },
    {
      id: "po-005",
      poNumber: "PO-2023-0046",
      date: "2023-07-19",
      supplier: "Emirates Fabrics",
      status: "cancelled",
      totalAmount: 8900,
      currency: "AED",
      items: [
        { id: "item-009", name: "Linen Fabric", sku: "FAB-LIN-001", barcode: "9012345678901" },
        { id: "item-010", name: "Cotton Blend", sku: "FAB-CTB-001", barcode: "0123456789012" },
      ],
      expectedDelivery: "2023-07-30",
      receivedDate: null,
      createdBy: "Ahmed Al Mansouri",
    },
  ]

  // Handle barcode scan
  const handleBarcodeScan = (barcode: string) => {
    // Find purchase orders containing the scanned item
    const order = purchaseOrders.find((po) => po.items.some((item) => item.barcode === barcode))

    if (order) {
      // Highlight the found order
      setHighlightedItem(order.id)

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedItem(null)
      }, 3000)
    }
  }

  // Filter purchase orders based on active tab and filters
  const filteredOrders = purchaseOrders.filter((order) => {
    // Filter by tab (order status)
    if (activeTab !== "all" && order.status !== activeTab) return false

    // Filter by search query
    if (
      searchQuery &&
      !order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.barcode?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    ) {
      return false
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date()
      const orderDate = new Date(order.date)

      if (
        dateFilter === "today" &&
        !(
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        )
      ) {
        return false
      }

      if (dateFilter === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(today.getDate() - 7)
        if (orderDate < weekAgo) return false
      }

      if (dateFilter === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(today.getMonth() - 1)
        if (orderDate < monthAgo) return false
      }
    }

    // Filter by status
    if (statusFilter !== "all" && order.status !== statusFilter) return false

    return true
  })

  // Get order status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Draft
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 flex items-center gap-1"
          >
            <Truck className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "partial":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            Partial
          </Badge>
        )
      case "received":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-600 hover:bg-green-500/10 flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            Received
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 hover:bg-red-500/10 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchase Orders</h2>
          <p className="text-muted-foreground">Manage purchase orders for inventory items</p>
        </div>
        <div className="flex items-center gap-2">
          <BarcodeScannerButton onScan={handleBarcodeScan} mode="search" buttonText="Find by Item" />
          <Link href="/purchase-orders/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>View and manage all purchase orders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <TabsList>
                <TabsTrigger value="all" className="text-xs">
                  All Orders
                </TabsTrigger>
                <TabsTrigger value="draft" className="text-xs">
                  Draft
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="partial" className="text-xs">
                  Partial
                </TabsTrigger>
                <TabsTrigger value="received" className="text-xs">
                  Received
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
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

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="sm:w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No purchase orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className={highlightedItem === order.id ? "bg-primary/10 transition-colors" : ""}
                        >
                          <TableCell className="font-medium">{order.poNumber}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>{order.supplier}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {order.items.slice(0, 2).map((item) => (
                                <div key={item.id} className="text-xs">
                                  {item.name}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{order.items.length - 2} more items
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {inventoryService.formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>
                            {order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/purchase-orders/${order.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 gap-1">
                                  <FileText className="h-3.5 w-3.5" />
                                  View
                                </Button>
                              </Link>
                              {order.status === "pending" && (
                                <Link href={`/purchase-orders/${order.id}/receive`}>
                                  <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <ShoppingCart className="h-3.5 w-3.5" />
                                    Receive
                                  </Button>
                                </Link>
                              )}
                            </div>
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
