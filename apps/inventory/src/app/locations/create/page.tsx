import { LocationForm } from "@/components/location-form"

export default function CreateLocationPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Create New Location</h2>

      <LocationForm />
    </div>
  )
}
