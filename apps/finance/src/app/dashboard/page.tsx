"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Plus,
  RefreshCw,
  Settings,
} from "lucide-react"
import { FinanceOverviewChart } from "@/components/finance-overview-chart"
import { CashFlowChart } from "@/components/cash-flow-chart"
import { ExpenseBreakdown } from "@/components/expense-breakdown"
import { AccountBalances } from "@/components/account-balances"
import { InventoryForecasting } from "@/components/inventory-forecasting"
import { financeService } from "@/lib/finance-service"

export default function FinanceDashboardPage() {
  const router = useRouter()
  const [timePeriod, setTimePeriod] = useState("month")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for the dashboard
  const dashboardData = {
    totalRevenue: 125000,
    revenueChange: 15,
    totalExpenses: 85000,
    expensesChange: 8,
    netProfit: 40000,
    netProfitChange: 22,
    cashBalance: 75000,
    cashBalanceChange: 5,
    accountsReceivable: 45000,
    accountsReceivableChange: -10,
    accountsPayable: 30000,
    accountsPayableChange: 12,
    upcomingPayments: [
      {
        id: "pay-001",
        description: "Supplier Invoice #SI-1234",
        amount: 2500,
        dueDate: "2023-04-28",
      },
      {
        id: "pay-002",
        description: "Rent Payment",
        amount: 5000,
        dueDate: "2023-04-30",
      },
      {
        id: "pay-003",
        description: "Utility Bills",
        amount: 750,
        dueDate: "2023-05-01",
      },
    ],
    recentTransactions: [
      {
        id: "tr-001",
        description: "Customer Payment - ABC Corp",
        amount: 15000,
        type: "credit",
        date: "2023-04-20",
      },
      {
        id: "tr-002",
        description: "Supplier Payment - XYZ Suppliers",
        amount: -8500,
        type: "debit",
        date: "2023-04-19",
      },
      {
        id: "tr-003",
        description: "Payroll",
        amount: -25000,
        type: "debit",
        date: "2023-04-15",
      },
      {
        id: "tr-004",
        description: "Customer Payment - 123 Industries",
        amount: 12000,
        type: "credit",
        date: "2023-04-14",
      },
      {
        id: "tr-005",
        description: "Office Supplies",
        amount: -750,
        type: "debit",
        date: "2023-04-12",
      },
    ],
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return financeService.formatCurrency(amount)
  }

  // Handle refresh data
  const handleRefreshData = () => {
    setIsRefreshing(true)

    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Handle download report
  const handleDownloadReport = (reportType: string) => {
    // In a real app, this would generate and download the report
    alert(`Downloading ${reportType} report...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
          <p className="text-muted-foreground">Financial overview and key performance indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range...</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefreshData} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${dashboardData.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {dashboardData.revenueChange >= 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4" />
                )}
                {Math.abs(dashboardData.revenueChange)}%
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${dashboardData.expensesChange <= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {dashboardData.expensesChange <= 0 ? (
                  <ArrowDown className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowUp className="mr-1 h-4 w-4" />
                )}
                {Math.abs(dashboardData.expensesChange)}%
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.netProfit)}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${dashboardData.netProfitChange >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {dashboardData.netProfitChange >= 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4" />
                )}
                {Math.abs(dashboardData.netProfitChange)}%
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.cashBalance)}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${dashboardData.cashBalanceChange >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {dashboardData.cashBalanceChange >= 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4" />
                )}
                {Math.abs(dashboardData.cashBalanceChange)}%
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Income vs Expenses for the current period</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <FinanceOverviewChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className={`font-medium ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount >= 0 ? "+" : ""}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ArrowRight className="h-4 w-4" />
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Accounts Receivable</CardTitle>
                <CardDescription>Outstanding customer invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.accountsReceivable)}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${dashboardData.accountsReceivableChange <= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {dashboardData.accountsReceivableChange <= 0 ? (
                      <ArrowDown className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowUp className="mr-1 h-4 w-4" />
                    )}
                    {Math.abs(dashboardData.accountsReceivableChange)}%
                  </span>{" "}
                  from last period
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push("/invoices")}
                  >
                    View Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Accounts Payable</CardTitle>
                <CardDescription>Outstanding vendor bills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.accountsPayable)}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${dashboardData.accountsPayableChange <= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {dashboardData.accountsPayableChange <= 0 ? (
                      <ArrowDown className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowUp className="mr-1 h-4 w-4" />
                    )}
                    {Math.abs(dashboardData.accountsPayableChange)}%
                  </span>{" "}
                  from last period
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push("/payments")}
                  >
                    View Bills
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>Payments due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{payment.description}</p>
                        <p className="text-xs text-muted-foreground">Due: {payment.dueDate}</p>
                      </div>
                      <div className="font-medium">{formatCurrency(payment.amount)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push("/payments")}
                  >
                    View All Payments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Quick Reports</CardTitle>
                  <CardDescription>Generate common financial reports</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto flex-col items-center justify-center p-6"
                    onClick={() => handleDownloadReport("income-statement")}
                  >
                    <FileText className="h-10 w-10 mb-2" />
                    <span className="text-sm font-medium">Income Statement</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col items-center justify-center p-6"
                    onClick={() => handleDownloadReport("balance-sheet")}
                  >
                    <FileText className="h-10 w-10 mb-2" />
                    <span className="text-sm font-medium">Balance Sheet</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col items-center justify-center p-6"
                    onClick={() => handleDownloadReport("cash-flow")}
                  >
                    <FileText className="h-10 w-10 mb-2" />
                    <span className="text-sm font-medium">Cash Flow</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col items-center justify-center p-6"
                    onClick={() => router.push("/reports")}
                  >
                    <Plus className="h-10 w-10 mb-2" />
                    <span className="text-sm font-medium">More Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>Monthly cash inflows and outflows</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CashFlowChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Distribution of expenses by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ExpenseBreakdown />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Balances</CardTitle>
              <CardDescription>Current balances across all accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountBalances />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryForecasting />
        </TabsContent>
      </Tabs>
    </div>
  )
}
