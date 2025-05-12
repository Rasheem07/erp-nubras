"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, Plus, Search, Filter, MoreHorizontal, FileText, Truck, Check } from "lucide-react"
import { inventoryService, type PurchaseOrder , PurchaseOrderStatus} from "@/lib/inventory/inventory-service"

export function PurchaseOrdersList() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [supplierFilter, setSupplierFilter] = useState<string>("all")

  useEffect(() => {
    // Load all purchase orders
    setPurchaseOrders(inventoryService.getPurchaseOrders())
  }, [])

  // Get unique PO statuses and suppliers for filters
  const poStatuses = Array.from(new Set(purchaseOrders.map((po) => po.status)))
  const suppliers = Array.from(new Set(purchaseOrders.map((po) => po.supplierId))).map((id) => ({
    id,
    name: purchaseOrders.find((po) => po.supplierId === id)?.supplierName || "Unknown",
  }))

  // Filter purchase orders based on search query and filters
  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      searchQuery === "" ||
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.notes!.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || po.status === statusFilter
    const matchesSupplier = supplierFilter === "all" || po.supplierId === supplierFilter

    return matchesSearch && matchesStatus && matchesSupplier
  })

  // Sort purchase orders by date (newest first)
  const sortedPOs = [...filteredPOs].sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())

  // Function to handle auto-generation of purchase orders
  const handleGeneratePOs = () => {
    const generatedPOs = inventoryService.generateAutoPurchaseOrders("current-user")
    if (Array.isArray(generatedPOs)) {
      setPurchaseOrders([...purchaseOrders, ...generatedPOs])
    } else {
      console.error("Failed to generate purchase orders: Result is not an array.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGeneratePOs} className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Auto-Generate POs
          </Button>
          <Button asChild>
            <Link href="/purchase-orders/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create PO
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>Manage purchase orders for inventory replenishment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search purchase orders..."
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {poStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
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
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPOs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No purchase orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedPOs.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell>
                          <div className="font-medium">{po.poNumber}</div>
                        </TableCell>
                        <TableCell>{po.supplierName}</TableCell>
                        <TableCell>{po.orderDate.toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(po.expectedDeliveryDate! as Date)?.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              po.status === PurchaseOrderStatus.DRAFT
                                ? "outline"
                                : po.status === PurchaseOrderStatus.SENT
                                  ? "secondary"
                                  : po.status === PurchaseOrderStatus.PARTIALLY_RECEIVED 
                                    ? "default"
                                    : po.status === PurchaseOrderStatus.RECEIVED
                                      ? "default"
                                      : "destructive"
                            }
                          >
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {po.totalAmount !== undefined
                            ? inventoryService.formatCurrency(po.totalAmount)
                            : inventoryService.formatCurrency(po.total)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/purchase-orders/${po.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/purchase-orders/${po.id}/edit`}>Edit PO</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/purchase-orders/${po.id}/print`}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Print PO
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/purchase-orders/${po.id}/receive`}>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Receive Items
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/purchase-orders/${po.id}/complete`}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Mark as Complete
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {sortedPOs.length} of {purchaseOrders.length} purchase orders
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
