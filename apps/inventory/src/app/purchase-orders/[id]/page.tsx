'use client'
import { PurchaseOrderDetail } from "@/components/purchase-order-detail"
import { useParams } from "next/navigation"

export default function PurchaseOrderDetailPage() {
  const params = useParams() as {id: string}
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Purchase Order Details</h2>

      <PurchaseOrderDetail purchaseOrderId={params.id} />
    </div>
  )
}
