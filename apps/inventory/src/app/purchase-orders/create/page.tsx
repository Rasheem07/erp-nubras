import { PurchaseOrderForm } from "@/components/purchase-order-form"

export default function CreatePurchaseOrderPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Create Purchase Order</h2>
      <p className="text-muted-foreground">Create a new purchase order to replenish inventory items from suppliers.</p>

      <PurchaseOrderForm />
    </div>
  )
}
