"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building,
  Landmark,
  BookOpen,
  FileText,
  Receipt,
  CreditCard,
  FileCheck,
  FileBarChart,
  Calculator,
  PieChart,
  Globe,
  Settings,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

export function FinanceSidebar() {
  const pathname = usePathname()

  return (
    <div className={`flex h-full flex-col overflow-y-auto`}>
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <CreditCard className="h-6 w-6" />
        <span className="text-lg font-semibold">Finance Module</span>
      </div>
      <div className="flex-1 overflow-y-auto h-full py-2">
        <nav className="grid h-full overflow-y-auto gap-1 px-2">
          <Link
            href="apps.alnubrasstudio.com"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "apps.alnubrasstudio.com" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/banking"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/banking") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Building className="h-4 w-4" />
            <span>Banking</span>
          </Link>

          <Link
            href="/accounts"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/accounts") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Landmark className="h-4 w-4" />
            <span>Chart of Accounts</span>
          </Link>

          <Link
            href="/journal-entries"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/journal-entries") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <BookOpen className="h-4 w-4" />
            <span>Journal Entries</span>
          </Link>

          <Link
            href="/invoices"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/invoices") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Invoices</span>
          </Link>

          <Link
            href="/expenses"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/expenses") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Receipt className="h-4 w-4" />
            <span>Expenses</span>
          </Link>

          <Link
            href="/payments"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/payments") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </Link>

          <Link
            href="/bank-reconciliation"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/bank-reconciliation") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <FileCheck className="h-4 w-4" />
            <span>Bank Reconciliation</span>
          </Link>

          <Link
            href="/reports"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/reports") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <FileBarChart className="h-4 w-4" />
            <span>Reports</span>
          </Link>

          <Link
            href="/taxes"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/taxes") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Calculator className="h-4 w-4" />
            <span>Taxes</span>
          </Link>

          <Link
            href="/budgeting"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/budgeting") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <PieChart className="h-4 w-4" />
            <span>Budgeting</span>
          </Link>

          <Link
            href="/exchange-rates"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/exchange-rates") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Globe className="h-4 w-4" />
            <span>Multi-Currency</span>
          </Link>

          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/settings") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
