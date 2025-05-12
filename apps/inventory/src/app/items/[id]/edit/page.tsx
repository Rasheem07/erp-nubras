'use client'
import { InventoryItemForm } from "@/components/inventory-item-form"
import { useParams } from "next/navigation"


export default function EditInventoryItemPage() {

  const params = useParams() as {id: string}
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Edit Inventory Item</h2>

      <InventoryItemForm itemId={params.id} />
    </div>
  )
}
