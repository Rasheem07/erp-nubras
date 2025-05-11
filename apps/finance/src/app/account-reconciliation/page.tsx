"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { FilterIcon, PlusIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react"
import {Button} from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { AccountReconciliationDrawer } from "@/components/account-reconciliation-drawer"
import { Progress } from "@/components/ui/progress"

// Sample reconciliation data
const reconciliations = [
  {
    id: "1",
    accountName: "Operating Account",
    accountNumber: "1001-0001",
    period: "October 2023",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-10-31"),
    status: "Completed",
    assignedTo: "John Doe",
    bookBalance: 45250.75,
    statementBalance: 45250.75,
    difference: 0,
    reconciledItems: 42,
    totalItems: 42,
    description: "Monthly reconciliation of the main operating account.",
    transactions: [
      {
        date: new Date("2023-10-05"),
        description: "Office Supplies",
        amount: -125.5,
        reconciled: true,
      },
      {
        date: new Date("2023-10-10"),
        description: "Client Payment - ABC Corp",
        amount: 5000.0,
        reconciled: true,
      },
      {
        date: new Date("2023-10-15"),
        description: "Rent Payment",
        amount: -2500.0,
        reconciled: true,
      },
      {
        date: new Date("2023-10-20"),
        description: "Utility Bill",
        amount: -350.25,
        reconciled: true,
      },
      {
        date: new Date("2023-10-25"),
        description: "Client Payment - XYZ Inc",
        amount: 3500.0,
        reconciled: true,
      },
    ],
  },
  {
    id: "2",
    accountName: "Payroll Account",
    accountNumber: "1001-0002",
    period: "October 2023",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-10-31"),
    status: "In Progress",
    assignedTo: "Jane Smith",
    bookBalance: 28750.5,
    statementBalance: 29250.5,
    difference: -500.0,
    reconciledItems: 18,
    totalItems: 25,
    description: "Monthly reconciliation of the payroll account.",
    transactions: [
      {
        date: new Date("2023-10-05"),
        description: "Payroll Transfer",
        amount: -15000.0,
        reconciled: true,
      },
      {
        date: new Date("2023-10-10"),
        description: "Tax Payment",
        amount: -4250.75,
        reconciled: true,
      },
      {
        date: new Date("2023-10-15"),
        description: "Payroll Transfer",
        amount: -15000.0,
        reconciled: true,
      },
      {
        date: new Date("2023-10-20"),
        description: "Benefits Payment",
        amount: -2500.0,
        reconciled: false,
      },
      {
        date: new Date("2023-10-25"),
        description: "Payroll Transfer",
        amount: -15000.0,
        reconciled: false,
      },
    ],
  },
  {
    id: "3",
    accountName: "Tax Reserve Account",
    accountNumber: "1001-0003",
    period: "October 2023",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-10-31"),
    status: "Pending",
    assignedTo: "Mike Johnson",
    bookBalance: 18500.25,
    statementBalance: 18500.25,
    difference: 0,
    reconciledItems: 0,
    totalItems: 12,
    description: "Monthly reconciliation of the tax reserve account.",
    transactions: [
      {
        date: new Date("2023-10-05"),
        description: "Tax Transfer",
        amount: 5000.0,
        reconciled: false,
      },
      {
        date: new Date("2023-10-15"),
        description: "Tax Transfer",
        amount: 5000.0,
        reconciled: false,
      },
      {
        date: new Date("2023-10-25"),
        description: "Tax Transfer",
        amount: 5000.0,
        reconciled: false,
      },
    ],
  },
  {
    id: "4",
    accountName: "Savings Account",
    accountNumber: "1001-0004",
    period: "October 2023",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-10-31"),
    status: "Completed",
    assignedTo: "Sarah Williams",
    bookBalance: 125000.0,
    statementBalance: 125125.5,
    difference: -125.5,
    reconciledItems: 8,
    totalItems: 8,
    description: "Monthly reconciliation of the savings account.",
    transactions: [
      {
        date: new Date("2023-10-10"),
        description: "Transfer from Operating",
        amount: 10000.0,
        reconciled: true,
      },
      {
        date: new Date("2023-10-20"),
        description: "Transfer from Operating",
        amount: 15000.0,
        reconciled: true,
      },
      {
        date: new Date("2023-10-31"),
        description: "Interest Income",
        amount: 125.5,
        reconciled: true,
      },
    ],
  },
  {
    id: "5",
    accountName: "Investment Account",
    accountNumber: "1001-0005",
    period: "October 2023",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-10-31"),
    status: "In Progress",
    assignedTo: "Robert Brown",
    bookBalance: 350000.0,
    statementBalance: 352500.0,
    difference: -2500.0,
    reconciledItems: 3,
    totalItems: 5,
    description: "Monthly reconciliation of the investment account.",
    transactions: [
      {
        date: new Date("2023-10-05"),
        description: "Stock Purchase",
        amount: -15000.0,
        reconciled: true,
      },
      {
        date: new Date("2023-10-15"),
        description: "Dividend Income",
        amount: 2500.0,
        reconciled: false,
      },
      {
        date: new Date("2023-10-25"),
        description: "Bond Purchase",
        amount: -20000.0,
        reconciled: true,
      },
    ],
  },
]

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "in progress":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "pending":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export default function AccountReconciliationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReconciliation, setSelectedReconciliation] = useState<any | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPeriod, setFilterPeriod] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")

  // Filter and sort reconciliations
  const filteredReconciliations = reconciliations
    .filter((reconciliation) => {
      const matchesSearch =
        reconciliation.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reconciliation.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reconciliation.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === "all" || reconciliation.status.toLowerCase() === filterStatus.toLowerCase()
      const matchesPeriod =
        filterPeriod === "all" || reconciliation.period.toLowerCase().includes(filterPeriod.toLowerCase())

      return matchesSearch && matchesStatus && matchesPeriod
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.startDate.getTime() - a.startDate.getTime()
        case "date-asc":
          return a.startDate.getTime() - b.startDate.getTime()
        case "name-asc":
          return a.accountName.localeCompare(b.accountName)
        case "name-desc":
          return b.accountName.localeCompare(a.accountName)
        default:
          return 0
      }
    })

  const handleReconciliationClick = (reconciliation: any) => {
    setSelectedReconciliation(reconciliation)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSelectedReconciliation(null)
  }

  // Get unique periods for filter
  const periods = Array.from(new Set(reconciliations.map((reconciliation) => reconciliation.period)))

  return (
    <div className="flex flex-col space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Reconciliation</h1>
          <p className="text-muted-foreground">Reconcile and balance your accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Reconciliation
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search accounts..."
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
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("in progress")}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pending</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Period</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilterPeriod("all")}>All Periods</DropdownMenuItem>
              {periods.map((period, index) => (
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
              <SlidersHorizontalIcon className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortBy("date-desc")}>Date (Newest first)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date-asc")}>Date (Oldest first)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name-asc")}>Account Name (A-Z)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name-desc")}>Account Name (Z-A)</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Account</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Period</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Assigned To</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Book Balance</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Statement Balance</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Difference</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredReconciliations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-24 text-center">
                      No reconciliations found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredReconciliations.map((reconciliation) => (
                    <tr
                      key={reconciliation.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                      onClick={() => handleReconciliationClick(reconciliation)}
                    >
                      <td className="p-4 align-middle">
                        <div>
                          <p className="font-medium">{reconciliation.accountName}</p>
                          <p className="text-xs text-muted-foreground">{reconciliation.accountNumber}</p>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{reconciliation.period}</td>
                      <td className="p-4 align-middle">
                        <Badge className={getStatusColor(reconciliation.status)}>{reconciliation.status}</Badge>
                      </td>
                      <td className="p-4 align-middle">{reconciliation.assignedTo}</td>
                      <td className="p-4 align-middle">${reconciliation.bookBalance.toFixed(2)}</td>
                      <td className="p-4 align-middle">${reconciliation.statementBalance.toFixed(2)}</td>
                      <td
                        className={`p-4 align-middle ${reconciliation.difference === 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ${Math.abs(reconciliation.difference).toFixed(2)}
                        {reconciliation.difference !== 0 && (reconciliation.difference < 0 ? " (Short)" : " (Over)")}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="w-full space-y-1">
                          <Progress
                            value={
                              reconciliation.totalItems === 0
                                ? 0
                                : (reconciliation.reconciledItems / reconciliation.totalItems) * 100
                            }
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground text-right">
                            {reconciliation.reconciledItems} / {reconciliation.totalItems} items
                          </p>
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

      {/* Account Reconciliation Drawer */}
      <AccountReconciliationDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        reconciliation={selectedReconciliation}
      />
    </div>
  )
}
