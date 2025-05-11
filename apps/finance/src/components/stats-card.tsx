"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@nubras/ui"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        {trend && (
          <div className="mt-3 flex items-center text-sm">
            <span
              className={`mr-1 flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
