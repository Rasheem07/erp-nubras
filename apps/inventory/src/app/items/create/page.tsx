import { InventoryItemForm } from "@/components/inventory-item-form"

export default function CreateInventoryItemPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Create New Inventory Item</h2>
      <InventoryItemForm />
    </div>
  )
}
