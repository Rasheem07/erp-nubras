'use client'
import { SupplierForm } from "@/components/supplier-form"
import { useParams } from "next/navigation"

export default function EditSupplierPage() {

  const params = useParams() as {id : string}
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Edit Supplier</h2>

      <SupplierForm supplierId={params.id} />
    </div>
  )
}
