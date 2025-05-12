"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Eye, FileText, Plus, Search } from "lucide-react"
import Link from "next/link"
import { inventoryService, type MaterialAllocation } from "@/lib/inventory/inventory-service"
import { MaterialAllocationDrawer } from "./material-allocation-drawer"

export function MaterialAllocationsList() {
  const [allocations, setAllocations] = useState<MaterialAllocation[]>(inventoryService.getMaterialAllocations())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAllocationId, setSelectedAllocationId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredAllocations = allocations.filter((allocation) => {
    const matchesSearch =
      allocation.allocationNumber!.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allocation.department!.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || allocation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewAllocation = (id: string) => {
    setSelectedAllocationId(id)
    setDrawerOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "Allocated":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Allocated
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search allocations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Allocated">Allocated</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href="/material-allocations/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Allocation
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Allocation #</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Required By</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAllocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No material allocations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAllocations.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell className="font-medium">{allocation.allocationNumber}</TableCell>
                  <TableCell>{allocation.projectName}</TableCell>
                  <TableCell>{format(new Date(allocation.allocatedAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(allocation.requiredByDate as Date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{allocation.department}</TableCell>
                  <TableCell>{getStatusBadge(allocation.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewAllocation(allocation.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Print Allocation">
                        <Link href={`/material-allocations/${allocation.id}/print`}>
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

      <MaterialAllocationDrawer allocationId={selectedAllocationId} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}
