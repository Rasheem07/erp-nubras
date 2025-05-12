import { SupplierForm } from "@/components/supplier-form"

export default function CreateSupplierPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Create New Supplier</h2>

      <SupplierForm />
    </div>
  )
}
