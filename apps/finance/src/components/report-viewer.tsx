"use client"

import { useState, useEffect } from "react"
import { Button } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@nubras/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nubras/ui"
import { Separator } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import { Download, Printer, Share, FileText, TrendingUp, Mail, Eye } from "lucide-react"
import { format } from "date-fns"

interface ReportViewerProps {
  reportId: string
  onClose?: () => void
}

export function ReportViewer({ reportId, onClose }: ReportViewerProps) {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("preview")
  const [exportFormat, setExportFormat] = useState("pdf")

  useEffect(() => {
    // In a real app, this would fetch the report data from your API
    const fetchReport = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock data for demo
        const mockReport = {
          id: reportId,
          title: "Income Statement",
          type: "Financial Statement",
          period: "Q3 2023",
          dateGenerated: new Date(),
          status: "Final",
          format: "PDF",
          createdBy: "John Doe",
          description: "Quarterly income statement showing revenue, expenses, and profit/loss.",
          tags: ["Quarterly", "Income"],
          data: {
            revenue: 325000,
            costOfSales: 142300,
            grossProfit: 182700,
            expenses: {
              salaries: 85000,
              rent: 12000,
              utilities: 5500,
              officeSupplies: 3200,
              marketing: 8500,
              insurance: 4800,
              depreciation: 7200,
              total: 126200,
            },
            netIncome: 56500,
          },
        }

        setReport(mockReport)
      } catch (error) {
        console.error("Error fetching report:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [reportId])

  const handleDownload = (format: string) => {
    // In a real app, this would trigger a download of the report in the specified format
    console.log(`Downloading report ${reportId} in ${format} format`)

    // Simulate download
    setTimeout(() => {
      alert(`Report downloaded in ${format.toUpperCase()} format`)
    }, 1000)
  }

  const handlePrint = () => {
    // In a real app, this would open the print dialog
    window.print()
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    console.log(`Sharing report ${reportId}`)

    // Simulate share
    setTimeout(() => {
      alert("Share dialog would open here")
    }, 500)
  }

  const handleEmail = () => {
    // In a real app, this would open an email dialog
    console.log(`Emailing report ${reportId}`)

    // Simulate email
    setTimeout(() => {
      alert("Email dialog would open here")
    }, 500)
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-8 w-1/3 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-1/2 rounded"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(8)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="animate-pulse bg-muted h-6 rounded"></div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!report) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Report Not Found</CardTitle>
          <CardDescription>The requested report could not be found.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check the report ID and try again.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-2xl">{report.title}</CardTitle>
          <CardDescription>
            {report.description} <span className="font-medium">Period: {report.period}</span>
          </CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{report.type}</Badge>
            <Badge className="bg-green-100 text-green-800">{report.status}</Badge>
            <Badge className="bg-blue-100 text-blue-800">{format(report.dateGenerated, "MMM d, yyyy")}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-6">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="p-6">
          <div className="border rounded-lg p-6 bg-white">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Nubras Tailoring LLC</h2>
              <h3 className="text-xl font-semibold mt-2">Income Statement</h3>
              <p className="text-muted-foreground">For the period ending {report.period}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium text-lg">Revenue</h4>
                <div className="flex justify-between border-b pb-1">
                  <span>Sales Revenue</span>
                  <span className="font-medium">${report.data.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Revenue</span>
                  <span>${report.data.revenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-lg">Cost of Goods Sold</h4>
                <div className="flex justify-between border-b pb-1">
                  <span>Cost of Goods Sold</span>
                  <span className="font-medium">${report.data.costOfSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Gross Profit</span>
                  <span>${report.data.grossProfit.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-lg">Operating Expenses</h4>
                <div className="flex justify-between border-b pb-1">
                  <span>Salaries and Wages</span>
                  <span>${report.data.expenses.salaries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Rent</span>
                  <span>${report.data.expenses.rent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Utilities</span>
                  <span>${report.data.expenses.utilities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Office Supplies</span>
                  <span>${report.data.expenses.officeSupplies.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Marketing</span>
                  <span>${report.data.expenses.marketing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Insurance</span>
                  <span>${report.data.expenses.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Depreciation</span>
                  <span>${report.data.expenses.depreciation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Operating Expenses</span>
                  <span>${report.data.expenses.total.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Net Income</span>
                <span>${report.data.netIncome.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Generated on {format(report.dateGenerated, "MMMM d, yyyy 'at' h:mm a")}</p>
              <p>Created by {report.createdBy}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="download" className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:border-primary" onClick={() => handleDownload("pdf")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-red-500" />
                    PDF Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Download as a PDF document</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleDownload("pdf")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardFooter>
              </Card>

              <Card className="cursor-pointer hover:border-primary" onClick={() => handleDownload("excel")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-500" />
                    Excel Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Download as an Excel spreadsheet</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleDownload("excel")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                </CardFooter>
              </Card>

              <Card className="cursor-pointer hover:border-primary" onClick={() => handleDownload("csv")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    CSV Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Download as a CSV file</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleDownload("csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Additional Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => handleDownload("json")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download Raw Data (JSON)
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="share" className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Email Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Send this report via email</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Report
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Share Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Share a link to this report</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Schedule Report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set up automatic generation and delivery of this report on a schedule
              </p>
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Schedule Recurring Report
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("download")}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={() => setActiveTab("preview")}>
            <Eye className="h-4 w-4 mr-2" />
            View Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
