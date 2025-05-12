"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { AlertTriangle, FileText, Pencil, Printer, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { inventoryService, type WasteRecord } from "@/lib/inventory/inventory-service"

interface WasteTrackingDrawerProps {
  wasteId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WasteTrackingDrawer({ wasteId, open, onOpenChange }: WasteTrackingDrawerProps) {
  const router = useRouter()
  const [wasteRecord, setWasteRecord] = useState<WasteRecord | null>(null)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    if (wasteId && open) {
      const data = inventoryService.getWasteRecordById(wasteId)
      setWasteRecord(data!)
    }
  }, [wasteId, open])

  if (!wasteRecord) {
    return null
  }

  const handleEdit = () => {
    router.push(`/waste-tracking/${wasteRecord.id}/edit`)
    onOpenChange(false)
  }

  const handlePrint = () => {
    window.print()
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex justify-between items-center">
            <span>Waste Record #{wasteRecord.id}</span>
            {getWasteTypeBadge(wasteRecord.wasteType!)}
          </SheetTitle>
          <SheetDescription>Recorded on {format(new Date(wasteRecord.recordedAt), "PPP")}</SheetDescription>
        </SheetHeader>

        <div className="flex justify-end gap-2 py-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="items">Materials</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Project</h4>
                <p className="font-medium">{wasteRecord.projectName || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Order Number</h4>
                <p className="font-medium">{wasteRecord.orderNumber || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Record Date</h4>
                <p className="font-medium">{format(new Date(wasteRecord.recordDate as Date), "PPP")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                <p className="font-medium">{wasteRecord.department}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Recorded By</h4>
                <p className="font-medium">{wasteRecord.createdBy}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Waste Type</h4>
                <p className="font-medium">{wasteRecord.wasteType}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Reason for Waste</h4>
              <p className="mt-1">{wasteRecord.reason || "No reason provided."}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Preventive Measures</h4>
              <p className="mt-1">{wasteRecord.preventiveMeasures || "No preventive measures provided."}</p>
            </div>

            <Separator />

            <div className="rounded-md border p-4 bg-amber-50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium">Waste Cost Impact</p>
                  <p className="text-sm">Total Cost: {inventoryService.formatCurrency(wasteRecord.totalCost || 0)}</p>
                  {wasteRecord.costImpact && <p className="text-sm mt-1">{wasteRecord.costImpact}</p>}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-2 px-4 text-left font-medium">Item</th>
                    <th className="py-2 px-4 text-left font-medium">Quantity</th>
                    <th className="py-2 px-4 text-left font-medium">Unit</th>
                    <th className="py-2 px-4 text-right font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteRecord.items!.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                      <td className="py-2 px-4">{item.itemName}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">{item.unitOfMeasure}</td>
                      <td className="py-2 px-4 text-right">{inventoryService.formatCurrency(item.cost)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={3} className="py-2 px-4 text-right font-medium">
                      Total:
                    </td>
                    <td className="py-2 px-4 text-right font-medium">
                      {inventoryService.formatCurrency(wasteRecord.totalCost || 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="rounded-md border p-4 bg-muted/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Disposal Information
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Disposal Method:</span>{" "}
                  {wasteRecord.disposalMethod || "Standard Disposal"}
                </p>
                <p>
                  <span className="font-medium">Recyclable:</span> {wasteRecord.isRecyclable ? "Yes" : "No"}
                </p>
                {wasteRecord.disposalNotes && (
                  <p>
                    <span className="font-medium">Disposal Notes:</span> {wasteRecord.disposalNotes}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Waste Analysis</h4>

              <div className="rounded-md border p-4">
                <h5 className="font-medium mb-2">Root Cause Analysis</h5>
                <p className="text-sm">{wasteRecord.rootCause || "No root cause analysis provided."}</p>
              </div>

              <div className="rounded-md border p-4">
                <h5 className="font-medium mb-2">Impact Assessment</h5>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Financial Impact:</span>{" "}
                    {inventoryService.formatCurrency(wasteRecord.totalCost || 0)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Production Delay:</span> {wasteRecord.productionDelay || "None"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Environmental Impact:</span>{" "}
                    {wasteRecord.environmentalImpact || "Minimal"}
                  </p>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h5 className="font-medium mb-2">Preventive Actions</h5>
                <p className="text-sm">{wasteRecord.preventiveMeasures || "No preventive actions specified."}</p>
              </div>

              <div className="rounded-md border p-4 bg-red-50">
                <div className="flex items-start gap-2">
                  <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Waste Metrics</p>
                    <p className="text-sm">
                      This waste represents approximately {wasteRecord.wastePercentage || "N/A"}% of the total material
                      allocated for this project.
                    </p>
                    {wasteRecord.wastePercentage && wasteRecord.wastePercentage > 5 && (
                      <p className="text-sm mt-1 text-red-600 font-medium">
                        This exceeds the target waste threshold of 5%.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
