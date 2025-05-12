"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Check, Edit, ArrowLeft, Send, Printer } from "lucide-react"
import { inventoryService, PurchaseOrderStatus, type PurchaseOrder } from "@/lib/inventory/inventory-service"

interface PurchaseOrderDetailProps {
  purchaseOrderId: string
}

export function PurchaseOrderDetail({ purchaseOrderId }: PurchaseOrderDetailProps) {
  const router = useRouter()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load purchase order
    const po = inventoryService.getPurchaseOrderById(purchaseOrderId)
    setPurchaseOrder(po || null)
    setLoading(false)
  }, [purchaseOrderId])

  const handleSendPO = () => {
    if (purchaseOrder) {
      // Update PO status to "SENT"
      const updatedPO = inventoryService.updatePurchaseOrderStatus(purchaseOrderId,PurchaseOrderStatus.SENT)
      setPurchaseOrder(updatedPO)
    }
  }

  const handleReceiveItems = () => {
    router.push(`/purchase-orders/${purchaseOrderId}/receive`)
  }

  const handleMarkComplete = () => {
    if (purchaseOrder) {
      // Update PO status to "FULLY_RECEIVED"
      const updatedPO = inventoryService.updatePurchaseOrderStatus(purchaseOrderId, PurchaseOrderStatus.RECEIVED)
      setPurchaseOrder(updatedPO)
    }
  }

  // Helper function to get badge variant based on status
  const getStatusBadgeVariant = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.DRAFT:
        return "outline"
      case PurchaseOrderStatus.PENDING:
        return "secondary"
      case PurchaseOrderStatus.SENT:
        return "secondary"
      case PurchaseOrderStatus.APPROVED:
        return "outline"
      case PurchaseOrderStatus.PARTIALLY_RECEIVED:
        return "default"
      case PurchaseOrderStatus.RECEIVED:
        return "default"
      case PurchaseOrderStatus.CANCELLED:
        return "destructive"
      default:
        return "outline"
    }
  }

  // Helper function to get human-readable status
  const getStatusDisplay = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.DRAFT:
        return PurchaseOrderStatus.DRAFT
      case PurchaseOrderStatus.PENDING:
        return PurchaseOrderStatus.PENDING
      case PurchaseOrderStatus.SENT:
        return "Sent to Supplier"
        case PurchaseOrderStatus.APPROVED:
        return "Approved by supplier"
      case PurchaseOrderStatus.PARTIALLY_RECEIVED:
        return "Partially Received"
      case PurchaseOrderStatus.RECEIVED:
        return "Fully Received"
      case PurchaseOrderStatus.CANCELLED:
        return "Cancelled"
      default:
        return status
    }
  }

  if (loading) {
    return <div>Loading purchase order details...</div>
  }

  if (!purchaseOrder) {
    return <div>Purchase order not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link href="/purchase-orders">
            <ArrowLeft className="h-4 w-4" />
            Back to Purchase Orders
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {purchaseOrder.status === PurchaseOrderStatus.DRAFT && (
            <Button onClick={handleSendPO} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send to Supplier
            </Button>
          )}
          {(purchaseOrder.status === PurchaseOrderStatus.SENT || purchaseOrder.status === PurchaseOrderStatus.PARTIALLY_RECEIVED) && (
            <Button onClick={handleReceiveItems} className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Receive Items
            </Button>
          )}
          {purchaseOrder.status === PurchaseOrderStatus.PARTIALLY_RECEIVED && (
            <Button onClick={handleMarkComplete} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Mark as Complete
            </Button>
          )}
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link href={`/purchase-orders/${purchaseOrderId}/edit`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">PO Number:</dt>
                <dd>{purchaseOrder.poNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Status:</dt>
                <dd>
                  <Badge variant={getStatusBadgeVariant(purchaseOrder.status)}>
                    {getStatusDisplay(purchaseOrder.status)}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Order Date:</dt>
                <dd>{purchaseOrder.orderDate.toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Expected Delivery:</dt>
                <dd>{purchaseOrder.expectedDeliveryDate?.toLocaleDateString() || "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Created By:</dt>
                <dd>{purchaseOrder.createdBy}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Name:</dt>
                <dd>{purchaseOrder.supplierName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Contact:</dt>
                <dd>{inventoryService.getSupplierById(purchaseOrder.supplierId)?.contactPerson || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Email:</dt>
                <dd>{inventoryService.getSupplierById(purchaseOrder.supplierId)?.email || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Phone:</dt>
                <dd>{inventoryService.getSupplierById(purchaseOrder.supplierId)?.phone || "N/A"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Payment Terms:</dt>
                <dd>{purchaseOrder.paymentTerms}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Shipping Method:</dt>
                <dd>{purchaseOrder.shippingMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Currency:</dt>
                <dd>{purchaseOrder.currency}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Subtotal:</dt>
                <dd>{inventoryService.formatCurrency(purchaseOrder.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">VAT ({purchaseOrder.vatRate}%):</dt>
                <dd>{inventoryService.formatCurrency(purchaseOrder.vatAmount)}</dd>
              </div>
              <div className="flex justify-between font-bold">
                <dt>Total:</dt>
                <dd>{inventoryService.formatCurrency(purchaseOrder.totalAmount || purchaseOrder.total)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Items</CardTitle>
              <CardDescription>Items included in this purchase order</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.itemName}</div>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unitOfMeasure}</TableCell>
                      <TableCell>{inventoryService.formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>
                        {inventoryService.formatCurrency(item.totalPrice || item.quantity * item.unitPrice)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.receivedQuantity === item.quantity ? "default" : "outline"}>
                          {item.receivedQuantity === item.quantity
                            ? "Received"
                            : item.receivedQuantity && item.receivedQuantity > 0
                              ? `Partial (${item.receivedQuantity}/${item.quantity})`
                              : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information about this purchase order</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{purchaseOrder.notes || "No notes available."}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Timeline of events for this purchase order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Purchase Order Created</p>
                    <p className="text-sm text-muted-foreground">
                      {purchaseOrder.createdAt.toLocaleString()} by {purchaseOrder.createdBy}
                    </p>
                  </div>
                </div>
                {purchaseOrder.status !== PurchaseOrderStatus.DRAFT && (
                  <div className="flex items-start gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Purchase Order Sent to Supplier</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchaseOrder.createdAt.getTime() + 3600000).toLocaleString()} by{" "}
                        {purchaseOrder.createdBy}
                      </p>
                    </div>
                  </div>
                )}
                {(purchaseOrder.status === PurchaseOrderStatus.PARTIALLY_RECEIVED ||
                  purchaseOrder.status === PurchaseOrderStatus.RECEIVED) && (
                  <div className="flex items-start gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Items Received</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchaseOrder.createdAt.getTime() + 86400000).toLocaleString()} by{" "}
                        {purchaseOrder.createdBy}
                      </p>
                    </div>
                  </div>
                )}
                {(purchaseOrder.status === PurchaseOrderStatus.RECEIVED) && (
                  <div className="flex items-start gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium">Purchase Order Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchaseOrder.createdAt.getTime() + 172800000).toLocaleString()} by{" "}
                        {purchaseOrder.createdBy}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
