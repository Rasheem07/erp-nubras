"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@nubras/ui"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

const data = [
  { name: "Rent", value: 5000 },
  { name: "Salaries", value: 8000 },
  { name: "Materials", value: 4000 },
  { name: "Utilities", value: 1500 },
  { name: "Marketing", value: 2000 },
  { name: "Other", value: 1000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function ExpenseBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Distribution of expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[350px]">
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
                label={({ name, percent }) => (name && percent ? `${name} ${(percent * 100).toFixed(0)}%` : "")}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent /> as unknown as string} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
