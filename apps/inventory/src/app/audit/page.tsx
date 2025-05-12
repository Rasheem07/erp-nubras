"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { toast } from "@nubras/ui"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Loader2,
  Plus,
  Printer,
  Scan,
  Search,
} from "lucide-react"

export default function InventoryAuditPage() {
  const [activeTab, setActiveTab] = useState("ongoing")
  const [showScanner, setShowScanner] = useState(false)
  const [isCreatingAudit, setIsCreatingAudit] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("all") // Changed from empty string to "all"
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null)
  const [isSubmittingCounts, setIsSubmittingCounts] = useState(false)

  // Mock audit data
  const auditData = [
    {
      id: "audit-001",
      name: "Q2 2023 Full Inventory Audit",
      status: "completed",
      startDate: "2023-04-10",
      endDate: "2023-04-15",
      location: "Main Warehouse",
      itemsAudited: 120,
      discrepancies: 8,
      accuracy: "93.3%",
      conductor: "Ahmed Al Mansouri",
      notes: "Annual inventory verification completed successfully with minor discrepancies.",
    },
    {
      id: "audit-002",
      name: "Premium Fabrics Spot Check",
      status: "completed",
      startDate: "2023-05-20",
      endDate: "2023-05-21",
      location: "Main Warehouse",
      itemsAudited: 35,
      discrepancies: 2,
      accuracy: "94.3%",
      conductor: "Fatima Al Hashimi",
      notes: "Spot check of high-value fabrics after supplier delivery.",
    },
    {
      id: "audit-003",
      name: "Q3 2023 Cycle Count - Threads",
      status: "ongoing",
      startDate: "2023-07-05",
      endDate: null,
      location: "Production Floor",
      itemsAudited: 28,
      discrepancies: 5,
      accuracy: "82.1%",
      conductor: "Mohammed Al Zaabi",
      notes: "Cycle count in progress for thread inventory.",
    },
    {
      id: "audit-004",
      name: "New Shipment Verification",
      status: "ongoing",
      startDate: "2023-07-12",
      endDate: null,
      location: "Receiving Area",
      itemsAudited: 15,
      discrepancies: 1,
      accuracy: "93.3%",
      conductor: "Layla Al Qasimi",
      notes: "Verification of new shipment from Emirates Fabrics.",
    },
    {
      id: "audit-005",
      name: "Q3 2023 Cycle Count - Fabrics",
      status: "planned",
      startDate: "2023-08-01",
      endDate: null,
      location: "Main Warehouse",
      itemsAudited: 0,
      discrepancies: 0,
      accuracy: "N/A",
      conductor: "Ahmed Al Mansouri",
      notes: "Scheduled cycle count for all fabric inventory.",
    },
  ]

  // Filter audits based on active tab
  const filteredAudits = auditData.filter((audit) => {
    if (activeTab === "all") return true
    return audit.status === activeTab
  })

  // Mock audit items for the selected audit
  const auditItems = [
    {
      id: "item-001",
      name: "Premium Cotton Fabric",
      sku: "FAB-COT-001",
      location: "Main Warehouse",
      expectedQty: 250,
      countedQty: 245,
      status: "counted",
      discrepancy: -5,
      lastCounted: "2023-07-12 14:30",
      notes: "Found some rolls in secondary location",
    },
    {
      id: "item-002",
      name: "Silk Fabric",
      sku: "FAB-SLK-001",
      location: "Main Warehouse",
      expectedQty: 100,
      countedQty: 98,
      status: "counted",
      discrepancy: -2,
      lastCounted: "2023-07-12 15:15",
      notes: "",
    },
    {
      id: "item-003",
      name: "Gold Thread",
      sku: "THR-GLD-001",
      location: "Production Floor",
      expectedQty: 50,
      countedQty: null,
      status: "pending",
      discrepancy: null,
      lastCounted: "",
      notes: "",
    },
  ]

  // Handle barcode scan
  const handleBarcodeScan = (barcode: string, quantity?: number) => {
    // In a real app, this would look up the item by barcode and update the count
    toast({
      title: "Item Scanned",
      description: `Barcode ${barcode} scanned with quantity ${quantity || 1}`,
    })
    setShowScanner(false)
  }

  // Handle creating a new audit
  const handleCreateAudit = () => {
    setIsCreatingAudit(true)
    // Simulate API call
    setTimeout(() => {
      setIsCreatingAudit(false)
      toast({
        title: "Audit Created",
        description: "New inventory audit has been created successfully",
      })
      setActiveTab("ongoing")
    }, 1500)
  }

  // Handle submitting counts for an audit
  const handleSubmitCounts = () => {
    setIsSubmittingCounts(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingCounts(false)
      toast({
        title: "Counts Submitted",
        description: "Inventory counts have been submitted successfully",
      })
      setSelectedAudit(null)
    }, 1500)
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500/80">
            Completed
          </Badge>
        )
      case "ongoing":
        return (
          <Badge variant="default" className="bg-blue-500/80">
            Ongoing
          </Badge>
        )
      case "planned":
        return <Badge variant="outline">Planned</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Get discrepancy badge color
  const getDiscrepancyBadge = (discrepancy: number | null) => {
    if (discrepancy === null) return null
    if (discrepancy === 0)
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
          Match
        </Badge>
      )
    if (discrepancy > 0)
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10">
          +{discrepancy}
        </Badge>
      )
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-600 hover:bg-red-500/10">
        {discrepancy}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Inventory Audit</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Manage and conduct inventory audits and cycle counts</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Inventory Audit</DialogTitle>
                <DialogDescription>Set up a new inventory audit or cycle count</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="audit-name">Audit Name</Label>
                  <Input id="audit-name" placeholder="Enter audit name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="audit-type">Audit Type</Label>
                    <Select defaultValue="full">
                      <SelectTrigger id="audit-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Inventory</SelectItem>
                        <SelectItem value="cycle">Cycle Count</SelectItem>
                        <SelectItem value="spot">Spot Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="audit-location">Location</Label>
                    <Select defaultValue="loc-001">
                      {" "}
                      {/* Added defaultValue */}
                      <SelectTrigger id="audit-location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loc-001">Main Warehouse</SelectItem>
                        <SelectItem value="loc-002">Production Floor</SelectItem>
                        <SelectItem value="loc-003">Retail Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date (Optional)</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="audit-notes">Notes</Label>
                  <Input id="audit-notes" placeholder="Enter any notes or instructions" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAudit} disabled={isCreatingAudit}>
                  {isCreatingAudit ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Creating...
                    </>
                  ) : (
                    "Create Audit"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ongoing" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-4 w-[400px]">
            <TabsTrigger value="all" className="text-xs">
              All Audits
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="text-xs">
              Ongoing
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Completed
            </TabsTrigger>
            <TabsTrigger value="planned" className="text-xs">
              Planned
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search audits..."
                className="pl-8 h-8 text-xs w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="h-8 text-xs w-[150px]">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem> {/* Changed from empty string to "all" */}
                <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                <SelectItem value="Production Floor">Production Floor</SelectItem>
                <SelectItem value="Receiving Area">Receiving Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0 space-y-4">
          {selectedAudit ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setSelectedAudit(null)}>
                  <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                  Back to Audits
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowScanner(true)}>
                    <Scan className="h-3.5 w-3.5" />
                    Scan Items
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem className="text-xs">
                        <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                        Excel Format
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        CSV Format
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">
                        <Printer className="h-3.5 w-3.5 mr-1.5" />
                        Print Count Sheets
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button size="sm" className="gap-1.5" onClick={handleSubmitCounts} disabled={isSubmittingCounts}>
                    {isSubmittingCounts ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Submit Counts
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader className="py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-medium">
                        {auditData.find((a) => a.id === selectedAudit)?.name}
                      </CardTitle>
                      <CardDescription>
                        {auditData.find((a) => a.id === selectedAudit)?.location} • Started on{" "}
                        {auditData.find((a) => a.id === selectedAudit)?.startDate}
                      </CardDescription>
                    </div>
                    {getStatusBadge(auditData.find((a) => a.id === selectedAudit)?.status || "")}
                  </div>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-muted/20 p-3 rounded-md border border-muted/30">
                      <p className="text-xs text-muted-foreground">Items Audited</p>
                      <p className="text-lg font-medium">
                        {auditData.find((a) => a.id === selectedAudit)?.itemsAudited}
                      </p>
                    </div>
                    <div className="bg-muted/20 p-3 rounded-md border border-muted/30">
                      <p className="text-xs text-muted-foreground">Discrepancies</p>
                      <p className="text-lg font-medium">
                        {auditData.find((a) => a.id === selectedAudit)?.discrepancies}
                      </p>
                    </div>
                    <div className="bg-muted/20 p-3 rounded-md border border-muted/30">
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="text-lg font-medium">{auditData.find((a) => a.id === selectedAudit)?.accuracy}</p>
                    </div>
                    <div className="bg-muted/20 p-3 rounded-md border border-muted/30">
                      <p className="text-xs text-muted-foreground">Conductor</p>
                      <p className="text-lg font-medium">{auditData.find((a) => a.id === selectedAudit)?.conductor}</p>
                    </div>
                  </div>

                  <div className="relative overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Item</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right">Expected</TableHead>
                          <TableHead className="text-right">Counted</TableHead>
                          <TableHead className="text-center">Discrepancy</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell className="text-right">{item.expectedQty}</TableCell>
                            <TableCell className="text-right">
                              {item.countedQty !== null ? item.countedQty : "-"}
                            </TableCell>
                            <TableCell className="text-center">{getDiscrepancyBadge(item.discrepancy)}</TableCell>
                            <TableCell>
                              {item.status === "counted" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 text-green-600 hover:bg-green-500/10"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Counted
                                </Badge>
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Scan className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Audit Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Discrepancies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudits
                    .filter(
                      (audit) =>
                        (selectedLocation === "all" ? true : audit.location === selectedLocation) && // Updated condition
                        (searchQuery
                          ? audit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            audit.conductor.toLowerCase().includes(searchQuery.toLowerCase())
                          : true),
                    )
                    .map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">{audit.name}</TableCell>
                        <TableCell>{audit.location}</TableCell>
                        <TableCell>{audit.startDate}</TableCell>
                        <TableCell>{audit.endDate || "-"}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(audit.status)}</TableCell>
                        <TableCell className="text-right">{audit.itemsAudited}</TableCell>
                        <TableCell className="text-right">{audit.discrepancies}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1"
                            onClick={() => setSelectedAudit(audit.id)}
                          >
                            <ClipboardCheck className="h-3.5 w-3.5" />
                            {audit.status === "planned" ? "Start" : "View"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showScanner && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onClose={() => setShowScanner(false)}
            mode="count"
            showQuantity={true}
            title="Scan Inventory Items"
            description="Scan barcodes to count items for this audit"
          />
        </div>
      )}
    </div>
  )
}
