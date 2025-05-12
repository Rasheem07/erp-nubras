'use client'
import { InventoryItemDetail } from "@/components/inventory-item-detail"
import { useParams } from "next/navigation"

export default function InventoryItemPage() {
  const params = useParams() as {id: string}
  return <InventoryItemDetail itemId={params.id} />
}
