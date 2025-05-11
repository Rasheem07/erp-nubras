"use client"

import { Button } from "@nubras/ui"
import { FileText, Plus, Receipt, CreditCard, ArrowLeftRight, FileBarChart } from "lucide-react"

const actions = [
  {
    name: "Create Invoice",
    icon: FileText,
    href: "/invoices/new",
  },
  {
    name: "Record Expense",
    icon: Receipt,
    href: "/expenses/new",
  },
  {
    name: "Add Payment",
    icon: CreditCard,
    href: "/payments/new",
  },
  {
    name: "Bank Transfer",
    icon: ArrowLeftRight,
    href: "/banking/transfer",
  },
  {
    name: "Journal Entry",
    icon: Plus,
    href: "/journal-entries/new",
  },
  {
    name: "Generate Report",
    icon: FileBarChart,
    href: "/reports/new",
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {actions.map((action) => (
        <Button key={action.name} variant="outline" className="h-auto justify-start gap-3 p-6 text-lg" asChild>
          <a href={action.href}>
            <action.icon className="h-6 w-6" />
            <span>{action.name}</span>
          </a>
        </Button>
      ))}
    </div>
  )
}
