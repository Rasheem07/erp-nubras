"use client"

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

const ratios = [
  {
    name: "Current Ratio",
    value: 2.4,
    change: 0.3,
    isPositive: true,
    description: "Assets to liabilities",
  },
  {
    name: "Quick Ratio",
    value: 1.8,
    change: 0.2,
    isPositive: true,
    description: "Liquid assets to liabilities",
  },
  {
    name: "Debt to Equity",
    value: 0.7,
    change: 0.1,
    isPositive: true,
    description: "Total debt to shareholders' equity",
  },
  {
    name: "Profit Margin",
    value: 18.2,
    change: 2.1,
    isPositive: true,
    description: "Net income percentage",
  },
]

export function FinancialRatios() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {ratios.map((ratio) => (
        <div key={ratio.name} className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{ratio.name}</h3>
              <span
                className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  ratio.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {ratio.isPositive ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                {ratio.name.includes("Margin") ? `${ratio.change}%` : ratio.change}
              </span>
            </div>
            <div className="text-3xl font-bold">{ratio.name.includes("Margin") ? `${ratio.value}%` : ratio.value}</div>
            <p className="text-sm text-muted-foreground">{ratio.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
