"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, DownloadIcon, FilterIcon, PlusIcon, PrinterIcon, SearchIcon, ShareIcon, Eye } from "lucide-react"
import {Button} from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ReportDrawer } from "@/components/report-drawer"
import { format } from "date-fns"

// Sample report data
const reports = [
  {
    id: "1",
    title: "Income Statement",
    type: "Financial Statement",
    period: "Q3 2023",
    dateGenerated: new Date("2023-10-15"),
    status: "Final",
    format: "PDF",
    createdBy: "John Doe",
    description: "Quarterly income statement showing revenue, expenses, and profit/loss.",
    tags: ["Quarterly", "Income"],
  },
  {
    id: "2",
    title: "Balance Sheet",
    type: "Financial Statement",
    period: "Q3 2023",
    dateGenerated: new Date("2023-10-15"),
    status: "Final",
    format: "PDF",
    createdBy: "John Doe",
    description: "Quarterly balance sheet showing assets, liabilities, and equity.",
    tags: ["Quarterly", "Balance"],
  },
  {
    id: "3",
    title: "Cash Flow Statement",
    type: "Financial Statement",
    period: "Q3 2023",
    dateGenerated: new Date("2023-10-15"),
    status: "Final",
    format: "PDF",
    createdBy: "John Doe",
    description: "Quarterly cash flow statement showing operating, investing, and financing activities.",
    tags: ["Quarterly", "Cash Flow"],
  },
  {
    id: "4",
    title: "Accounts Receivable Aging",
    type: "Operational",
    period: "October 2023",
    dateGenerated: new Date("2023-10-16"),
    status: "Draft",
    format: "Excel",
    createdBy: "Jane Smith",
    description: "Monthly accounts receivable aging report showing outstanding customer invoices.",
    tags: ["Monthly", "AR"],
  },
  {
    id: "5",
    title: "Accounts Payable Aging",
    type: "Operational",
    period: "October 2023",
    dateGenerated: new Date("2023-10-16"),
    status: "Draft",
    format: "Excel",
    createdBy: "Jane Smith",
    description: "Monthly accounts payable aging report showing outstanding vendor invoices.",
    tags: ["Monthly", "AP"],
  },
  {
    id: "6",
    title: "Budget vs Actual",
    type: "Management",
    period: "Q3 2023",
    dateGenerated: new Date("2023-10-17"),
    status: "Final",
    format: "PDF",
    createdBy: "Mike Johnson",
    description: "Quarterly comparison of budgeted vs actual financial performance.",
    tags: ["Quarterly", "Budget"],
  },
  {
    id: "7",
    title: "Tax Summary",
    type: "Tax",
    period: "Q3 2023",
    dateGenerated: new Date("2023-10-18"),
    status: "Final",
    format: "PDF",
    createdBy: "Sarah Williams",
    description: "Quarterly tax summary for filing purposes.",
    tags: ["Quarterly", "Tax"],
  },
  {
    id: "8",
    title: "Expense Analysis",
    type: "Management",
    period: "Q3 2023",
    dateGenerated: new Date("2023-10-19"),
    status: "Draft",
    format: "Excel",
    createdBy: "Robert Brown",
    description: "Detailed analysis of expenses by category and department.",
    tags: ["Quarterly", "Expenses"],
  },
  {
    id: "9",
    title: "Revenue by Customer",
    type: "Management",
    period: "Q3 2023",
    dateGenerated: new Date("2023-10-20"),
    status: "Final",
    format: "PDF",
    createdBy: "Emily Davis",
    description: "Analysis of revenue by customer and product/service.",
    tags: ["Quarterly", "Revenue"],
  },
  {
    id: "10",
    title: "Financial Ratios",
    type: "Management",
    period: "Q3 2023",
    dateGenerated: new Date("2023-10-21"),
    status: "Final",
    format: "PDF",
    createdBy: "David Wilson",
    description: "Key financial ratios and performance indicators.",
    tags: ["Quarterly", "Ratios"],
  },
]

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "final":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "draft":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "in progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Format badge colors
const getFormatColor = (format: string) => {
  switch (format.toLowerCase()) {
    case "pdf":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "excel":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "csv":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export default function ReportsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPeriod, setFilterPeriod] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [activeTab, setActiveTab] = useState("all")

  // Filter and sort reports
  const filteredReports = reports
    .filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.createdBy.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = filterType === "all" || report.type.toLowerCase() === filterType.toLowerCase()
      const matchesPeriod = filterPeriod === "all" || report.period.toLowerCase().includes(filterPeriod.toLowerCase())
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "financial" && report.type === "Financial Statement") ||
        (activeTab === "operational" && report.type === "Operational") ||
        (activeTab === "management" && report.type === "Management") ||
        (activeTab === "tax" && report.type === "Tax")

      return matchesSearch && matchesType && matchesPeriod && matchesTab
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.dateGenerated.getTime() - a.dateGenerated.getTime()
        case "date-asc":
          return a.dateGenerated.getTime() - b.dateGenerated.getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

  const handleReportClick = (report: any) => {
    setSelectedReport(report)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSelectedReport(null)
  }

  const handleViewReport = (reportId: string) => {
    router.push(`/reports/view/${reportId}`)
  }

  const handleDownloadReport = (report: any, format = "pdf") => {
    // In a real app, this would trigger a download of the report
    console.log(`Downloading report ${report.id} in ${format} format`)

    // Simulate download
    setTimeout(() => {
      alert(`Report "${report.title}" downloaded in ${format.toUpperCase()} format`)
    }, 1000)
  }

  // Get unique report types for filter
  const reportTypes = Array.from(new Set(reports.map((report) => report.type)))
  const reportPeriods = Array.from(new Set(reports.map((report) => report.period)))

  return (
    <div className="flex flex-col space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Generate and view financial reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/reports/generate")}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Statements</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
              {reportTypes.map((type, index) => (
                <DropdownMenuItem key={index} onClick={() => setFilterType(type.toLowerCase())}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Period</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilterPeriod("all")}>All Periods</DropdownMenuItem>
              {reportPeriods.map((period, index) => (
                <DropdownMenuItem key={index} onClick={() => setFilterPeriod(period.toLowerCase())}>
                  {period}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortBy("date-desc")}>Date (Newest first)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date-asc")}>Date (Oldest first)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title-asc")}>Title (A-Z)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title-desc")}>Title (Z-A)</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="outline" onClick={() => router.push("/reports/generate?type=income")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Income Statement
        </Button>
        <Button variant="outline" onClick={() => router.push("/reports/generate?type=balance")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Balance Sheet
        </Button>
        <Button variant="outline" onClick={() => router.push("/reports/generate?type=cashflow")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Cash Flow
        </Button>
        <Button variant="outline" onClick={() => router.push("/reports/custom")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Custom Report
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Period</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Date Generated</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Format</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Created By</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-24 text-center">
                      No reports found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                    >
                      <td className="p-4 align-middle font-medium">{report.title}</td>
                      <td className="p-4 align-middle">{report.type}</td>
                      <td className="p-4 align-middle">{report.period}</td>
                      <td className="p-4 align-middle">{format(report.dateGenerated, "MMM d, yyyy")}</td>
                      <td className="p-4 align-middle">
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge className={getFormatColor(report.format)}>{report.format}</Badge>
                      </td>
                      <td className="p-4 align-middle">{report.createdBy}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewReport(report.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownloadReport(report)}
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <PrinterIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ShareIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Report Drawer */}
      <ReportDrawer open={isDrawerOpen} onClose={handleDrawerClose} report={selectedReport} />
    </div>
  )
}
