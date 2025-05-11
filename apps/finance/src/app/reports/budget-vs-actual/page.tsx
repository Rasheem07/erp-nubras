"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Tabs, TabsList, TabsTrigger } from "@nubras/ui"
import { ArrowDown, ArrowUp, Calendar, Download, FileBarChart, Filter, Printer, Share2 } from "lucide-react"
import { financeService } from "@/lib/finance-service"

export default function BudgetVsActualReportPage() {
  const router = useRouter()
  const [period, setPeriod] = useState("current-quarter")
  const [department, setDepartment] = useState("all")
  const [viewType, setViewType] = useState("summary")
  const [chartType, setChartType] = useState("bar")

  // Sample data for the report
  const reportData = {
    title: "Budget vs Actual Report",
    period: "Q2 2023 (Apr - Jun)",
    departments: ["All Departments", "Sales", "Marketing", "Operations", "Administration", "IT"],
    summary: {
      budgetTotal: 250000,
      actualTotal: 235000,
      varianceTotal: 15000,
      variancePercentage: 6,
    },
    categories: [
      {
        name: "Revenue",
        budget: 500000,
        actual: 520000,
        variance: 20000,
        variancePercentage: 4,
        isPositive: true,
      },
      {
        name: "Salaries & Wages",
        budget: 150000,
        actual: 148000,
        variance: 2000,
        variancePercentage: 1.33,
        isPositive: true,
      },
      {
        name: "Rent & Utilities",
        budget: 30000,
        actual: 29500,
        variance: 500,
        variancePercentage: 1.67,
        isPositive: true,
      },
      {
        name: "Marketing & Advertising",
        budget: 25000,
        actual: 27500,
        variance: -2500,
        variancePercentage: -10,
        isPositive: false,
      },
      {
        name: "Office Supplies",
        budget: 5000,
        actual: 4800,
        variance: 200,
        variancePercentage: 4,
        isPositive: true,
      },
      {
        name: "Travel & Entertainment",
        budget: 10000,
        actual: 8200,
        variance: 1800,
        variancePercentage: 18,
        isPositive: true,
      },
      {
        name: "Professional Services",
        budget: 15000,
        actual: 17000,
        variance: -2000,
        variancePercentage: -13.33,
        isPositive: false,
      },
      {
        name: "Software & Subscriptions",
        budget: 8000,
        actual: 8500,
        variance: -500,
        variancePercentage: -6.25,
        isPositive: false,
      },
      {
        name: "Equipment & Maintenance",
        budget: 7000,
        actual: 6500,
        variance: 500,
        variancePercentage: 7.14,
        isPositive: true,
      },
    ],
    details: [
      {
        category: "Marketing & Advertising",
        items: [
          {
            name: "Digital Marketing",
            budget: 15000,
            actual: 16800,
            variance: -1800,
            variancePercentage: -12,
            isPositive: false,
          },
          {
            name: "Print Materials",
            budget: 5000,
            actual: 4200,
            variance: 800,
            variancePercentage: 16,
            isPositive: true,
          },
          {
            name: "Events & Sponsorships",
            budget: 5000,
            actual: 6500,
            variance: -1500,
            variancePercentage: -30,
            isPositive: false,
          },
        ],
      },
      {
        category: "Salaries & Wages",
        items: [
          {
            name: "Full-time Staff",
            budget: 120000,
            actual: 122000,
            variance: -2000,
            variancePercentage: -1.67,
            isPositive: false,
          },
          {
            name: "Part-time Staff",
            budget: 20000,
            actual: 18000,
            variance: 2000,
            variancePercentage: 10,
            isPositive: true,
          },
          {
            name: "Benefits & Taxes",
            budget: 10000,
            actual: 8000,
            variance: 2000,
            variancePercentage: 20,
            isPositive: true,
          },
        ],
      },
    ],
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return financeService.formatCurrency(amount)
  }

  // Handle download report
  const handleDownloadReport = (format: string) => {
    // In a real app, this would generate and download the report
    alert(`Downloading report in ${format.toUpperCase()} format`)
  }

  // Handle print report
  const handlePrintReport = () => {
    // In a real app, this would open the print dialog
    window.print()
  }

  // Handle share report
  const handleShareReport = () => {
    // In a real app, this would open a share dialog
    alert("Sharing report...")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget vs Actual Report</h1>
          <p className="text-muted-foreground">Compare budgeted amounts with actual financial performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={() => handleDownloadReport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShareReport}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>Customize the report view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <div className="relative">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="current-quarter">Current Quarter</SelectItem>
                    <SelectItem value="year-to-date">Year to Date</SelectItem>
                    <SelectItem value="previous-quarter">Previous Quarter</SelectItem>
                    <SelectItem value="previous-year">Previous Year</SelectItem>
                    <SelectItem value="custom">Custom Range...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <div className="relative">
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">View Type</label>
              <div className="relative">
                <Select value={viewType} onValueChange={setViewType}>
                  <SelectTrigger className="w-full">
                    <FileBarChart className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select view type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary View</SelectItem>
                    <SelectItem value="detailed">Detailed View</SelectItem>
                    <SelectItem value="chart">Chart View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle>{reportData.title}</CardTitle>
              <CardDescription>
                Period: {reportData.period} | Department: {department === "all" ? "All Departments" : department}
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Favorable</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Unfavorable</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewType === "summary" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm font-medium text-muted-foreground">Total Budget</div>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(reportData.summary.budgetTotal)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm font-medium text-muted-foreground">Total Actual</div>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(reportData.summary.actualTotal)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm font-medium text-muted-foreground">Variance</div>
                    <div
                      className={`text-2xl font-bold mt-1 ${reportData.summary.varianceTotal >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(reportData.summary.varianceTotal)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm font-medium text-muted-foreground">Variance %</div>
                    <div
                      className={`text-2xl font-bold mt-1 flex items-center ${reportData.summary.variancePercentage >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {reportData.summary.variancePercentage >= 0 ? (
                        <ArrowUp className="mr-1 h-5 w-5" />
                      ) : (
                        <ArrowDown className="mr-1 h-5 w-5" />
                      )}
                      {Math.abs(reportData.summary.variancePercentage)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Category</TableHead>
                      <TableHead className="text-right">Budget</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Variance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.categories.map((category) => (
                      <TableRow key={category.name}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(category.budget)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(category.actual)}</TableCell>
                        <TableCell className={`text-right ${category.isPositive ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(category.variance)}
                        </TableCell>
                        <TableCell className={`text-right ${category.isPositive ? "text-green-600" : "text-red-600"}`}>
                          <div className="flex items-center justify-end">
                            {category.isPositive ? (
                              <ArrowUp className="mr-1 h-4 w-4" />
                            ) : (
                              <ArrowDown className="mr-1 h-4 w-4" />
                            )}
                            {Math.abs(category.variancePercentage).toFixed(2)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {viewType === "detailed" && (
            <div className="space-y-8">
              {reportData.details.map((detail) => (
                <div key={detail.category} className="space-y-4">
                  <h3 className="text-lg font-semibold">{detail.category}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Item</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Actual</TableHead>
                        <TableHead className="text-right">Variance</TableHead>
                        <TableHead className="text-right">Variance %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.items.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.budget)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                          <TableCell className={`text-right ${item.isPositive ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(item.variance)}
                          </TableCell>
                          <TableCell className={`text-right ${item.isPositive ? "text-green-600" : "text-red-600"}`}>
                            <div className="flex items-center justify-end">
                              {item.isPositive ? (
                                <ArrowUp className="mr-1 h-4 w-4" />
                              ) : (
                                <ArrowDown className="mr-1 h-4 w-4" />
                              )}
                              {Math.abs(item.variancePercentage).toFixed(2)}%
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total {detail.category}</TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(detail.items.reduce((sum, item) => sum + item.budget, 0))}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(detail.items.reduce((sum, item) => sum + item.actual, 0))}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(detail.items.reduce((sum, item) => sum + item.variance, 0))}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {/* Calculate overall variance percentage */}
                          {(() => {
                            const totalBudget = detail.items.reduce((sum, item) => sum + item.budget, 0)
                            const totalVariance = detail.items.reduce((sum, item) => sum + item.variance, 0)
                            const percentage = (totalVariance / totalBudget) * 100
                            const isPositive = percentage >= 0

                            return (
                              <div className="flex items-center justify-end">
                                {isPositive ? (
                                  <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                                ) : (
                                  <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                                )}
                                <span className={isPositive ? "text-green-600" : "text-red-600"}>
                                  {Math.abs(percentage).toFixed(2)}%
                                </span>
                              </div>
                            )
                          })()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}

          {viewType === "chart" && (
            <div className="space-y-6">
              <Tabs value={chartType} onValueChange={setChartType}>
                <TabsList>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="column">Column Chart</TabsTrigger>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="h-[400px] flex items-center justify-center border rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground">Chart visualization would appear here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing {chartType} chart for {reportData.period}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Over Budget</CardTitle>
                    <CardDescription>Categories with the highest negative variance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Variance</TableHead>
                          <TableHead className="text-right">Variance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.categories
                          .filter((c) => !c.isPositive)
                          .sort((a, b) => a.variance - b.variance)
                          .slice(0, 5)
                          .map((category) => (
                            <TableRow key={category.name}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell className="text-right text-red-600">
                                {formatCurrency(category.variance)}
                              </TableCell>
                              <TableCell className="text-right text-red-600">
                                <div className="flex items-center justify-end">
                                  <ArrowDown className="mr-1 h-4 w-4" />
                                  {Math.abs(category.variancePercentage).toFixed(2)}%
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Under Budget</CardTitle>
                    <CardDescription>Categories with the highest positive variance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Variance</TableHead>
                          <TableHead className="text-right">Variance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.categories
                          .filter((c) => c.isPositive)
                          .sort((a, b) => b.variance - a.variance)
                          .slice(0, 5)
                          .map((category) => (
                            <TableRow key={category.name}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell className="text-right text-green-600">
                                {formatCurrency(category.variance)}
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                <div className="flex items-center justify-end">
                                  <ArrowUp className="mr-1 h-4 w-4" />
                                  {Math.abs(category.variancePercentage).toFixed(2)}%
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
