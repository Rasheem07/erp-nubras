"use client"
import { ReceiveItemsForm } from "@/components/receive-items-form"
import { useParams } from "next/navigation"

export default function ReceiveItemsPage() {
  const params = useParams() as { id: string }
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Receive Items</h2>
      <p className="text-muted-foreground">Record receipt of items from purchase order.</p>

      <ReceiveItemsForm purchaseOrderId={params.id} />
    </div>
  )
}
