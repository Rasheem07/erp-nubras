'use client'
import { LocationForm } from "@/components/location-form"
import { useParams } from "next/navigation"

export default function EditLocationPage() {
  const params = useParams() as {id: string}
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Edit Location</h2>

      <LocationForm locationId={params.id} />
    </div>
  )
}
