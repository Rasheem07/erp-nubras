import { MaterialAllocationsList } from "@/components/material-allocations-list"

export default function MaterialAllocationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Material Allocations</h1>
        <p className="text-muted-foreground">Manage material allocations for projects and production orders.</p>
      </div>
      <MaterialAllocationsList />
    </div>
  )
}
