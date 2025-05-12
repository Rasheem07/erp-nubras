"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { inventoryService, type Location } from "@/lib/inventory/inventory-service"

interface LocationFormProps {
  locationId?: string
}

export function LocationForm({ locationId }: LocationFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<Location>>({
    name: "",
    description: "",
    type: "Warehouse",
    address: "",
    city: "",
    country: "UAE",
    postalCode: "",
    contactPerson: "",
    contactPhone: "",
    isActive: true,
    isDefault: false,
    parentLocationId: "",
  })

  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    // Load all locations for parent location selection
    setLocations(inventoryService.getLocations())

    // If editing an existing location, load its data
    if (locationId) {
      const location = inventoryService.getLocationById(locationId)
      if (location) {
        setFormData(location)
      }
    }
  }, [locationId])

  const handleChange = (field: keyof Location, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (locationId) {
        // Update existing location
        inventoryService.updateLocation(locationId, formData)
      } else {
        // Create new location
        inventoryService.createLocation(formData as Omit<Location, "id" | "createdAt" | "updatedAt">)
      }

      // Redirect back to locations list
      router.push("/locations")
    } catch (error: any) {
      alert(error.message)
    }
  }

  // Filter out the current location from parent location options to prevent circular references
  const parentLocationOptions = locations.filter((loc) => loc.id !== locationId)

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{locationId ? "Edit Location" : "Create New Location"}</CardTitle>
          <CardDescription>
            {locationId
              ? "Update the details of an existing location."
              : "Add a new location to your inventory system."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input
                  id="name"
                  placeholder="Enter location name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Location Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Store">Store</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Production">Production Facility</SelectItem>
                    <SelectItem value="Supplier">Supplier Location</SelectItem>
                    <SelectItem value="Customer">Customer Location</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter location description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentLocationId">Parent Location (Optional)</Label>
                <Select
                  value={formData.parentLocationId || ""}
                  onValueChange={(value) => handleChange("parentLocationId", value || null)}
                >
                  <SelectTrigger id="parentLocationId">
                    <SelectValue placeholder="Select parent location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {parentLocationOptions.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">If this is a sub-location, select its parent location</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="Enter postal code"
                    value={formData.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAE">United Arab Emirates</SelectItem>
                    <SelectItem value="KSA">Saudi Arabia</SelectItem>
                    <SelectItem value="Qatar">Qatar</SelectItem>
                    <SelectItem value="Bahrain">Bahrain</SelectItem>
                    <SelectItem value="Kuwait">Kuwait</SelectItem>
                    <SelectItem value="Oman">Oman</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  placeholder="Enter contact phone number"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status</h3>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange("isActive", checked)}
                  />
                  <Label htmlFor="isActive">Active Location</Label>
                </div>
                <p className="text-sm text-muted-foreground">Inactive locations won&quot;t appear in regular searches</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => handleChange("isDefault", checked)}
                  />
                  <Label htmlFor="isDefault">Default Location</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Default location will be pre-selected in forms and reports
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/locations")}>
            Cancel
          </Button>
          <Button type="submit">{locationId ? "Update Location" : "Create Location"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
