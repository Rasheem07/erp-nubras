"use client"

import { FinanceOverviewChart } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { FinancialRatios } from "@/components/financial-ratios"
import { QuickActions } from "@/components/quick-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinanceDashboard() {
  return (
    <div className="space-y-6 max-w-full">
      <h2 className="text-3xl font-bold tracking-tight">Finance Dashboard</h2>

      {/* Financial Overview Chart - Full Width */}
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Financial Overview</CardTitle>
          <CardDescription>Income vs Expenses for the current year</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
            <FinanceOverviewChart />
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions - Full Width */}
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
          <CardDescription>Latest financial transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <RecentTransactions />
        </CardContent>
      </Card>

      {/* Financial Ratios - Full Width */}
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Financial Ratios</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FinancialRatios />
        </CardContent>
      </Card>

      {/* Quick Actions - Full Width */}
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Common financial tasks</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <QuickActions />
        </CardContent>
      </Card>

      {/* Upcoming Payments - Full Width */}
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Upcoming Payments</CardTitle>
          <CardDescription>Payments due in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="font-medium">Supplier Invoice #SI-1234</p>
                <p className="text-sm text-muted-foreground">Due: Apr 28, 2023</p>
              </div>
              <div className="font-medium">AED 2,500.00</div>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="font-medium">Rent Payment</p>
                <p className="text-sm text-muted-foreground">Due: Apr 30, 2023</p>
              </div>
              <div className="font-medium">AED 5,000.00</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Utility Bills</p>
                <p className="text-sm text-muted-foreground">Due: May 1, 2023</p>
              </div>
              <div className="font-medium">AED 750.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
