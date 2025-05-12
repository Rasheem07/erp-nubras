"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  BarChart2,
  TrendingDown,
  Package,
  Truck,
  Layers,
  Scissors,
  Download,
  Calendar,
  Clock,
  FileSpreadsheet,
  FileIcon as FilePdf,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@nubras/ui"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function InventoryReports() {
  const [activeTab, setActiveTab] = useState("all")
  const [scheduledReports, setScheduledReports] = useState<string[]>([])

  const reports = [
    {
      id: "stock-levels",
      title: "Stock Level Report",
      description: "Current stock levels across all inventory items and locations",
      icon: <Package className="h-5 w-5" />,
      href: "/reports/stock-levels",
      category: "inventory",
      lastGenerated: "2 days ago",
      insights: "5 items below reorder point, 2 locations at capacity",
    },
    {
      id: "valuation",
      title: "Inventory Valuation Report",
      description: "Total value of current inventory with breakdown by category",
      icon: <BarChart2 className="h-5 w-5" />,
      href: "/reports/valuation",
      category: "financial",
      lastGenerated: "1 week ago",
      insights: "Total value: AED 245,780 (↑4.2% from last month)",
    },
    {
      id: "dead-stock",
      title: "Dead Stock Report",
      description: "Items not used in over 6 months with suggested actions",
      icon: <TrendingDown className="h-5 w-5" />,
      href: "/reports/dead-stock",
      category: "optimization",
      lastGenerated: "2 weeks ago",
      insights: "12 items identified as dead stock, potential recovery: AED 15,400",
    },
    {
      id: "material-usage",
      title: "Material Usage Report",
      description: "Analysis of material consumption by project and product type",
      icon: <Layers className="h-5 w-5" />,
      href: "/reports/material-usage",
      category: "production",
      lastGenerated: "3 days ago",
      insights: "Premium fabrics usage ↑18%, thread consumption ↓7%",
    },
    {
      id: "waste-analysis",
      title: "Waste Analysis Report",
      description: "Breakdown of material waste by reason and project",
      icon: <Scissors className="h-5 w-5" />,
      href: "/reports/waste-analysis",
      category: "optimization",
      lastGenerated: "1 month ago",
      insights: "Cutting waste reduced by 12% after new technique implementation",
    },
    {
      id: "supplier-performance",
      title: "Supplier Performance Report",
      description: "Evaluation of suppliers based on delivery time and quality",
      icon: <Truck className="h-5 w-5" />,
      href: "/reports/supplier-performance",
      category: "procurement",
      lastGenerated: "2 weeks ago",
      insights: "Top performer: Emirates Fabrics (98.5% on-time delivery)",
    },
  ]

  const filteredReports = activeTab === "all" ? reports : reports.filter((report) => report.category === activeTab)

  const handleScheduleReport = (reportId: string, frequency: string, email: string) => {
    setScheduledReports([...scheduledReports, reportId])
    toast({
      title: "Report Scheduled",
      description: `This report will be generated ${frequency} and sent to ${email}`,
      variant: "default",
    })
  }

  const handleDownloadReport = (reportId: string, format: string) => {
    toast({
      title: "Report Downloaded",
      description: `Your report has been downloaded in ${format} format`,
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Inventory Reports</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Generate and view reports to analyze your inventory data
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/reports/generate">
            <FileText className="h-3.5 w-3.5" />
            Generate Custom Report
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="all" className="text-xs">
            All Reports
          </TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs">
            Inventory
          </TabsTrigger>
          <TabsTrigger value="financial" className="text-xs">
            Financial
          </TabsTrigger>
          <TabsTrigger value="optimization" className="text-xs">
            Optimization
          </TabsTrigger>
          <TabsTrigger value="production" className="text-xs">
            Production
          </TabsTrigger>
          <TabsTrigger value="procurement" className="text-xs">
            Procurement
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-2">
          <div className="grid gap-3 md:grid-cols-2">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className="overflow-hidden flex flex-col border-muted/60 hover:border-primary/30 transition-colors"
              >
                <CardHeader className="flex flex-row items-start gap-3 py-3 px-4">
                  <div className="rounded-md border p-1.5 bg-muted/20 shrink-0">{report.icon}</div>
                  <div>
                    <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{report.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="bg-muted/10 p-2 rounded-md border-muted/30 border text-xs">
                    <span className="font-medium text-xs">Key Insights:</span> {report.insights}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center py-2 px-4 border-t border-muted/30 bg-muted/5">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {report.lastGenerated}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          Schedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-base">Schedule Report</DialogTitle>
                          <DialogDescription className="text-xs">
                            Set up automatic generation and delivery
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-3">
                          <div className="grid gap-1.5">
                            <Label htmlFor="frequency" className="text-xs">
                              Frequency
                            </Label>
                            <Select defaultValue="weekly">
                              <SelectTrigger id="frequency" className="h-8 text-xs">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-xs">
                              Email Delivery
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter email address"
                              defaultValue="admin@example.com"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="dashboard" defaultChecked />
                            <Label htmlFor="dashboard" className="text-xs">
                              Also deliver to dashboard
                            </Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            size="sm"
                            className="text-xs"
                            onClick={() => handleScheduleReport(report.id, "weekly", "admin@example.com")}
                          >
                            Schedule Report
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem className="text-xs" onClick={() => handleDownloadReport(report.id, "PDF")}>
                          <FilePdf className="h-3.5 w-3.5 mr-1.5" />
                          PDF Format
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs" onClick={() => handleDownloadReport(report.id, "Excel")}>
                          <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                          Excel Format
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs" onClick={() => handleDownloadReport(report.id, "CSV")}>
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          CSV Format
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <Link href={`${report.href}/generate`}>Generate</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/5 border-dashed border-muted/40">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">Need a specialized report?</CardTitle>
          <CardDescription className="text-xs">
            Create a custom report tailored to your specific requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <Button asChild size="sm" className="text-xs gap-1">
            <Link href="/reports/custom">
              <FileText className="h-3.5 w-3.5" />
              Build Custom Report
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
