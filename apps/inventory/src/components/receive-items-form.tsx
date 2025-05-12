"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, Save } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { inventoryService, PurchaseOrderStatus, type PurchaseOrder } from "@/lib/inventory/inventory-service"

interface ReceiveItemsFormProps {
  purchaseOrderId: string
}

export function ReceiveItemsForm({ purchaseOrderId }: ReceiveItemsFormProps) {
  const router = useRouter()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [receivedItems, setReceivedItems] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState("")
  const [receiptDate, setReceiptDate] = useState<Date>(new Date())

  useEffect(() => {
    // Load purchase order
    const po = inventoryService.getPurchaseOrderById(purchaseOrderId)
    setPurchaseOrder(po || null)

    // Initialize received items with current received quantities
    if (po) {
      const initialReceivedItems: Record<string, number> = {}
      po.items.forEach((item) => {
        initialReceivedItems[item.id] = item.receivedQuantity || 0
      })
      setReceivedItems(initialReceivedItems)
    }

    setLoading(false)
  }, [purchaseOrderId])

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setReceivedItems((prev) => ({
      ...prev,
      [itemId]: quantity,
    }))
  }

  const handleReceiveAll = () => {
    if (purchaseOrder) {
      const allReceived: Record<string, number> = {}
      purchaseOrder.items.forEach((item) => {
        allReceived[item.id] = item.quantity
      })
      setReceivedItems(allReceived)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!purchaseOrder) {
        throw new Error("Purchase order not found")
      }

      // Update received quantities
      const updatedItems = purchaseOrder.items.map((item) => ({
        ...item,
        receivedQuantity: receivedItems[item.id] || 0,
      }))

      // Determine if all items are fully received
      const allItemsReceived = updatedItems.every((item) => item.receivedQuantity === item.quantity)
      const anyItemsReceived = updatedItems.some((item) => item.receivedQuantity && item.receivedQuantity > 0)

      let newStatus: PurchaseOrderStatus = purchaseOrder.status
      if (allItemsReceived) {
        newStatus = PurchaseOrderStatus.RECEIVED
      } else if (anyItemsReceived) {
        newStatus = PurchaseOrderStatus.PARTIALLY_RECEIVED
      }

      // Update purchase order
      inventoryService.updatePurchaseOrderReceived(purchaseOrderId, updatedItems, newStatus, notes, receiptDate)

      // Redirect back to purchase order details
      router.push(`/purchase-orders/${purchaseOrderId}`)
    } catch (error: any) {
      alert(error.message)
    }
  }

  if (loading) {
    return <div>Loading purchase order details...</div>
  }

  if (!purchaseOrder) {
    return <div>Purchase order not found</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link href={`/purchase-orders/${purchaseOrderId}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Purchase Order
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={handleReceiveAll}>
            Receive All Items
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Order: {purchaseOrder.poNumber}</CardTitle>
            <CardDescription>
              Supplier: {purchaseOrder.supplierName} | Status: {purchaseOrder.status}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="receiptDate">Receipt Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !receiptDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {receiptDate ? format(receiptDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={receiptDate}
                      onSelect={(date: any) => setReceiptDate(date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Previously Received</TableHead>
                    <TableHead>Receiving Now</TableHead>
                    <TableHead>Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrder.items.map((item) => {
                    const previouslyReceived = item.receivedQuantity || 0
                    const receivingNow = receivedItems[item.id] || 0
                    const remaining = item.quantity - receivingNow

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.itemName}</div>
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unitOfMeasure}
                        </TableCell>
                        <TableCell>
                          {previouslyReceived} {item.unitOfMeasure}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={receivingNow}
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={remaining === 0 ? "default" : "outline"}>
                            {remaining} {item.unitOfMeasure}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Receipt Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any notes about this receipt"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/purchase-orders/${purchaseOrderId}`}>Cancel</Link>
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Receipt
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
