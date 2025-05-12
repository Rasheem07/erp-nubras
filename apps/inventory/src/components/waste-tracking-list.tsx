"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, FileText, Plus, Search } from "lucide-react"
import Link from "next/link"
import { inventoryService, type WasteTracking } from "@/lib/inventory/inventory-service"
import { WasteTrackingDrawer } from "./waste-tracking-drawer"

export function WasteTrackingList() {
  const [wasteRecords, setWasteRecords] = useState<WasteTracking[]>(inventoryService.getWasteTrackings())
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedWasteId, setSelectedWasteId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredRecords = wasteRecords.filter((record) => {
    const matchesSearch =
      record.trackingNumber!.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.projectName!.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.department?.toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || record.wasteType === typeFilter

    return matchesSearch && matchesType
  })

  const handleViewWasteRecord = (id: string) => {
    setSelectedWasteId(id)
    setDrawerOpen(true)
  }

  const getWasteTypeBadge = (type: string) => {
    switch (type) {
      case "Cutting Waste":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Cutting Waste
          </Badge>
        )
      case "Defective Material":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Defective Material
          </Badge>
        )
      case "Excess Material":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Excess Material
          </Badge>
        )
      case "Damaged in Production":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Damaged in Production
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search waste records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Fabric Scraps">Fabric Scraps</SelectItem>
              <SelectItem value="Thread Waste">Thread Waste</SelectItem>
              <SelectItem value="Cutting Waste">Cutting Waste</SelectItem>
              <SelectItem value="Defective Material">Defective Material</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href="/waste-tracking/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Waste Record
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Record #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Waste Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No waste records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.trackingNumber}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.projectName || "N/A"}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{getWasteTypeBadge(record.wasteType!)}</TableCell>
                  <TableCell>
                    {record.quantity} {record.unitOfMeasure}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewWasteRecord(record.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Print Record">
                        <Link href={`/waste-tracking/${record.id}/print`}>
                          <FileText className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <WasteTrackingDrawer wasteId={selectedWasteId} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}
