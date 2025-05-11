"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {Button} from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeftIcon, BarChart2, FileText, PieChart, TrendingUp } from "lucide-react"

export default function GenerateReportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("financial")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [reportPeriod, setReportPeriod] = useState("current-month")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeComparisons, setIncludeComparisons] = useState(true)
  const [detailLevel, setDetailLevel] = useState("summary")

  const handleGenerateReport = () => {
    // In a real app, this would generate the report
    console.log("Generating report:", {
      reportType: selectedReport,
      period: reportPeriod,
      customStartDate,
      customEndDate,
      format: reportFormat,
      includeCharts,
      includeComparisons,
      detailLevel,
    })

    // Redirect back to reports page
    router.push("/reports")
  }

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/reports")}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Report</h1>
          <p className="text-muted-foreground">Select a report type and customize options</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "income-statement" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("income-statement")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Income Statement</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows revenue, expenses, and profit for a specific period
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "balance-sheet" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("balance-sheet")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Balance Sheet</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows assets, liabilities, and equity at a specific point in time
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "cash-flow" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("cash-flow")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Cash Flow Statement</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows cash inflows and outflows from operating, investing, and financing activities
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "trial-balance" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("trial-balance")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Trial Balance</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows the balances of all accounts in the general ledger
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "financial-ratios" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("financial-ratios")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Financial Ratios</CardTitle>
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows key financial ratios for liquidity, profitability, and solvency
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "accounts-receivable" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("accounts-receivable")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Accounts Receivable Aging</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Shows outstanding customer invoices categorized by age</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "accounts-payable" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("accounts-payable")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Accounts Payable Aging</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Shows outstanding vendor invoices categorized by age</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "inventory" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("inventory")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Inventory Report</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows current inventory levels, values, and turnover rates
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "sales-by-product" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("sales-by-product")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Sales by Product</CardTitle>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Shows sales breakdown by product or service</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "sales-by-customer" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("sales-by-customer")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Sales by Customer</CardTitle>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Shows sales breakdown by customer or client</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "expense-analysis" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("expense-analysis")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Expense Analysis</CardTitle>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Shows expense breakdown by category and department</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tax" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "vat-summary" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("vat-summary")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">VAT Summary</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows VAT collected, paid, and owed for a specific period
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "tax-liability" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("tax-liability")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Tax Liability Report</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Shows all tax liabilities for a specific period</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "tax-payment-history" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("tax-payment-history")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Tax Payment History</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Shows history of tax payments for a specific period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "budget-vs-actual" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("budget-vs-actual")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Budget vs Actual</CardTitle>
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows comparison of budgeted vs actual financial performance
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "cash-forecast" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("cash-forecast")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Cash Flow Forecast</CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows projected cash inflows and outflows for future periods
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "profitability-analysis" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("profitability-analysis")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Profitability Analysis</CardTitle>
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows profitability by product, service, customer, or department
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedReport === "kpi-dashboard" ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setSelectedReport("kpi-dashboard")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">KPI Dashboard</CardTitle>
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Shows key performance indicators for financial and operational metrics
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report</CardTitle>
              <CardDescription>Create a fully customized report with specific data points</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For advanced custom reports, please use the custom report builder where you can select specific data
                points, filters, and visualizations.
              </p>
              <Button onClick={() => router.push("/reports/custom")}>Open Custom Report Builder</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedReport && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Report Options</CardTitle>
            <CardDescription>Configure the options for your report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Period</Label>
                  <RadioGroup value={reportPeriod} onValueChange={setReportPeriod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="current-month" id="current-month" />
                      <Label htmlFor="current-month">Current Month</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="previous-month" id="previous-month" />
                      <Label htmlFor="previous-month">Previous Month</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="current-quarter" id="current-quarter" />
                      <Label htmlFor="current-quarter">Current Quarter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="previous-quarter" id="previous-quarter" />
                      <Label htmlFor="previous-quarter">Previous Quarter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="year-to-date" id="year-to-date" />
                      <Label htmlFor="year-to-date">Year to Date</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Custom Date Range</Label>
                    </div>
                  </RadioGroup>
                </div>

                {reportPeriod === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Report Format</Label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detail-level">Detail Level</Label>
                  <Select value={detailLevel} onValueChange={setDetailLevel}>
                    <SelectTrigger id="detail-level">
                      <SelectValue placeholder="Select detail level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="very-detailed">Very Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-charts"
                      checked={includeCharts}
                      onCheckedChange={(checked) => setIncludeCharts(!!checked)}
                    />
                    <Label htmlFor="include-charts">Include Charts and Graphs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-comparisons"
                      checked={includeComparisons}
                      onCheckedChange={(checked) => setIncludeComparisons(!!checked)}
                    />
                    <Label htmlFor="include-comparisons">Include Prior Period Comparisons</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleGenerateReport}>Generate Report</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
