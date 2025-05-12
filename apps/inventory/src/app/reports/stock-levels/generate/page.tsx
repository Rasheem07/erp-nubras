"use client"

import { useState } from "react"
import { ArrowLeft, FileIcon as FilePdf, FileSpreadsheet, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { toast } from "@nubras/ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function StockLevelsReportGeneratePage() {
  const [reportTab, setReportTab] = useState("configure")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeReorderAlerts, setIncludeReorderAlerts] = useState(true)
  const [includeLocationBreakdown, setIncludeLocationBreakdown] = useState(true)
  const [includeValueAnalysis, setIncludeValueAnalysis] = useState(true)
  const [includeHistoricalComparison, setIncludeHistoricalComparison] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
      setReportTab("preview")
      toast({
        title: "Report Generated Successfully",
        description: "Your stock levels report is now ready to view and download",
        variant: "default",
      })
    }, 2000)
  }

  const handleScheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "This report will be generated weekly and sent to your email",
      variant: "default",
    })
  }

  const handleDownload = (format: string) => {
    toast({
      title: `Report Downloaded as ${format}`,
      description: "Your report has been downloaded to your device",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Generate Stock Levels Report</h2>
        </div>
      </div>

      <Tabs value={reportTab} onValueChange={setReportTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configure Report</TabsTrigger>
          <TabsTrigger value="preview" disabled={!isGenerated}>
            Preview Report
          </TabsTrigger>
          <TabsTrigger value="schedule">Schedule Report</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Parameters</CardTitle>
              <CardDescription>Customize what data to include in your stock levels report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      placeholder="Stock Levels Report"
                      defaultValue="Stock Levels Report - April 2023"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select defaultValue="last-30-days">
                      <SelectTrigger id="date-range">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="last-7-days">Last 7 days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 days</SelectItem>
                        <SelectItem value="this-month">This month</SelectItem>
                        <SelectItem value="last-month">Last month</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="main-warehouse">Main Warehouse</SelectItem>
                        <SelectItem value="production-floor">Production Floor</SelectItem>
                        <SelectItem value="retail-store">Retail Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="fabric">Fabric</SelectItem>
                        <SelectItem value="thread">Thread</SelectItem>
                        <SelectItem value="buttons">Buttons</SelectItem>
                        <SelectItem value="zippers">Zippers</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Report Sections</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="charts"
                          checked={includeCharts}
                          onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                        />
                        <Label htmlFor="charts" className="font-normal">
                          Include visual charts and graphs
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="reorder-alerts"
                          checked={includeReorderAlerts}
                          onCheckedChange={(checked) => setIncludeReorderAlerts(checked as boolean)}
                        />
                        <Label htmlFor="reorder-alerts" className="font-normal">
                          Include reorder point alerts
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="location-breakdown"
                          checked={includeLocationBreakdown}
                          onCheckedChange={(checked) => setIncludeLocationBreakdown(checked as boolean)}
                        />
                        <Label htmlFor="location-breakdown" className="font-normal">
                          Include location breakdown
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="value-analysis"
                          checked={includeValueAnalysis}
                          onCheckedChange={(checked) => setIncludeValueAnalysis(checked as boolean)}
                        />
                        <Label htmlFor="value-analysis" className="font-normal">
                          Include inventory value analysis
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="historical-comparison"
                          checked={includeHistoricalComparison}
                          onCheckedChange={(checked) => setIncludeHistoricalComparison(checked as boolean)}
                        />
                        <Label htmlFor="historical-comparison" className="font-normal">
                          Include historical comparison (last 3 months)
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Label className="text-base">Sort Order</Label>
                    <RadioGroup defaultValue="name" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="name" id="sort-name" />
                        <Label htmlFor="sort-name" className="font-normal">
                          Sort by item name
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stock" id="sort-stock" />
                        <Label htmlFor="sort-stock" className="font-normal">
                          Sort by stock level (high to low)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="value" id="sort-value" />
                        <Label htmlFor="sort-value" className="font-normal">
                          Sort by inventory value
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reorder" id="sort-reorder" />
                        <Label htmlFor="sort-reorder" className="font-normal">
                          Sort by reorder priority
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/reports">Cancel</Link>
              </Button>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stock Levels Report - April 2023</CardTitle>
                <CardDescription>Generated on April 28, 2023 at 12:01 PM</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("PDF")}>
                  <FilePdf className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("Excel")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {includeCharts && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inventory Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Stock Level by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] bg-muted/40 rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground">Stock Level Chart</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Stock Value by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] bg-muted/40 rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground">Stock Value Chart</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {includeReorderAlerts && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Reorder Alerts</h3>
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-red-700">Items Below Reorder Point</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-red-900">
                          <div>Item</div>
                          <div>Current Stock</div>
                          <div>Reorder Point</div>
                          <div>Minimum Stock</div>
                          <div>Action Required</div>
                        </div>
                        <Separator className="bg-red-200" />
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>Premium Cotton Fabric</div>
                          <div>85</div>
                          <div>100</div>
                          <div>50</div>
                          <div>Order 100 meters</div>
                        </div>
                        <Separator className="bg-red-100" />
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>Gold Thread</div>
                          <div>15</div>
                          <div>20</div>
                          <div>10</div>
                          <div>Order 20 spools</div>
                        </div>
                        <Separator className="bg-red-100" />
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>Pearl Buttons</div>
                          <div>120</div>
                          <div>200</div>
                          <div>100</div>
                          <div>Order 200 pieces</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {includeLocationBreakdown && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Location Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Main Warehouse</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Items:</span>
                            <span className="text-sm font-medium">1,245</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Value:</span>
                            <span className="text-sm font-medium">AED 185,750</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Space Utilization:</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Production Floor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Items:</span>
                            <span className="text-sm font-medium">320</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Value:</span>
                            <span className="text-sm font-medium">AED 45,230</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Space Utilization:</span>
                            <span className="text-sm font-medium">65%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Retail Store</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Items:</span>
                            <span className="text-sm font-medium">175</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Value:</span>
                            <span className="text-sm font-medium">AED 14,800</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Space Utilization:</span>
                            <span className="text-sm font-medium">42%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {includeValueAnalysis && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inventory Value Analysis</h3>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Value Distribution by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="h-[200px] bg-muted/40 rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground">Value Distribution Chart</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-muted/20 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">Fabric</div>
                            <div className="text-lg font-medium">AED 145,600</div>
                            <div className="text-xs text-green-600">59% of total</div>
                          </div>
                          <div className="bg-muted/20 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">Thread</div>
                            <div className="text-lg font-medium">AED 35,780</div>
                            <div className="text-xs text-green-600">15% of total</div>
                          </div>
                          <div className="bg-muted/20 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">Buttons & Zippers</div>
                            <div className="text-lg font-medium">AED 28,400</div>
                            <div className="text-xs text-green-600">12% of total</div>
                          </div>
                          <div className="bg-muted/20 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">Accessories</div>
                            <div className="text-lg font-medium">AED 36,000</div>
                            <div className="text-xs text-green-600">14% of total</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {includeHistoricalComparison && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Historical Comparison</h3>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">3-Month Trend Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="h-[200px] bg-muted/40 rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground">Historical Trend Chart</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm text-muted-foreground">February 2023</div>
                            <div className="text-lg font-medium">AED 235,400</div>
                            <div className="text-xs text-red-600">-2.1% from Jan</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">March 2023</div>
                            <div className="text-lg font-medium">AED 240,800</div>
                            <div className="text-xs text-green-600">+2.3% from Feb</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">April 2023</div>
                            <div className="text-lg font-medium">AED 245,780</div>
                            <div className="text-xs text-green-600">+2.1% from Mar</div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                          <h4 className="text-sm font-medium text-blue-800 mb-1">Analysis Insights:</h4>
                          <p className="text-sm text-blue-700">
                            Inventory value has shown steady growth over the past 3 months, with a total increase of
                            4.4%. This aligns with the seasonal production increase for summer collections. The fabric
                            category has seen the most significant growth at 7.2%, while buttons and zippers have
                            decreased by 3.1% due to a shift toward fabric-focused designs.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setReportTab("configure")}>
                Back to Configure
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Mail className="h-4 w-4 mr-1" />
                    Email Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Email Report</DialogTitle>
                    <DialogDescription>Send this report to yourself or team members</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email-to">Recipients</Label>
                      <Input id="email-to" placeholder="Enter email addresses" defaultValue="admin@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email-subject">Subject</Label>
                      <Input id="email-subject" defaultValue="Stock Levels Report - April 2023" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email-message">Message (Optional)</Label>
                      <Input id="email-message" placeholder="Add a message to the email" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-pdf" defaultChecked />
                      <Label htmlFor="include-pdf">Include PDF attachment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-excel" />
                      <Label htmlFor="include-excel">Include Excel attachment</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Report Emailed",
                          description: "The report has been sent to the specified recipients",
                          variant: "default",
                        })
                      }}
                    >
                      Send Email
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Recurring Report</CardTitle>
              <CardDescription>Set up automatic generation and delivery of this report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-name">Schedule Name</Label>
                    <Input
                      id="schedule-name"
                      placeholder="Weekly Stock Levels Report"
                      defaultValue="Weekly Stock Levels Report"
                    />
                  </div>

                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="day">Day of Week</Label>
                    <Select defaultValue="monday">
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Select defaultValue="8am">
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6am">6:00 AM</SelectItem>
                        <SelectItem value="7am">7:00 AM</SelectItem>
                        <SelectItem value="8am">8:00 AM</SelectItem>
                        <SelectItem value="9am">9:00 AM</SelectItem>
                        <SelectItem value="10am">10:00 AM</SelectItem>
                        <SelectItem value="11am">11:00 AM</SelectItem>
                        <SelectItem value="12pm">12:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Delivery Options</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-delivery" defaultChecked />
                        <Label htmlFor="email-delivery" className="font-normal">
                          Email delivery
                        </Label>
                      </div>
                      <div className="pl-6 space-y-2">
                        <Label htmlFor="email-recipients">Recipients</Label>
                        <Input
                          id="email-recipients"
                          placeholder="Enter email addresses"
                          defaultValue="admin@example.com, manager@example.com"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dashboard-delivery" defaultChecked />
                        <Label htmlFor="dashboard-delivery" className="font-normal">
                          Save to dashboard
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cloud-storage" />
                        <Label htmlFor="cloud-storage" className="font-normal">
                          Save to cloud storage
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Label className="text-base">Report Formats</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="format-pdf" defaultChecked />
                        <Label htmlFor="format-pdf" className="font-normal">
                          PDF Format
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="format-excel" defaultChecked />
                        <Label htmlFor="format-excel" className="font-normal">
                          Excel Format
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="format-csv" />
                        <Label htmlFor="format-csv" className="font-normal">
                          CSV Format
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/reports">Cancel</Link>
              </Button>
              <Button onClick={handleScheduleReport}>
                <Clock className="h-4 w-4 mr-1" />
                Schedule Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
