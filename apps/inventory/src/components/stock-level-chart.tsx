"use client"

import { useEffect, useState } from "react"
import { inventoryService } from "@/lib/inventory/inventory-service"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CategoryData {
  name: string
  value: number
  color: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function StockLevelChart() {
  const [data, setData] = useState<CategoryData[]>([])

  useEffect(() => {
    const items = inventoryService.getInventoryItems()

    // Group by category and sum quantities
    const categoryMap = new Map<string, number>()

    items.forEach((item) => {
      const currentValue = categoryMap.get(item.category) || 0
      categoryMap.set(item.category, currentValue + item.currentStock)
    })

    // Convert to chart data format
    const chartData: CategoryData[] = Array.from(categoryMap.entries()).map(([category, value], index) => ({
      name: category,
      value,
      color: COLORS[index % COLORS.length],
    }))

    setData(chartData)
  }, [])

  if (data.length === 0) {
    return <div className="flex h-full items-center justify-center">Loading chart data...</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number, name: string) => [`${value} units`, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
