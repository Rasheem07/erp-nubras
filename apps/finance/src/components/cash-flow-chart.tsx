"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    month: "Jan",
    inflow: 12000,
    outflow: 8000,
    netflow: 4000,
  },
  {
    month: "Feb",
    inflow: 15000,
    outflow: 10000,
    netflow: 5000,
  },
  {
    month: "Mar",
    inflow: 18000,
    outflow: 12000,
    netflow: 6000,
  },
  {
    month: "Apr",
    inflow: 14000,
    outflow: 9000,
    netflow: 5000,
  },
  {
    month: "May",
    inflow: 21000,
    outflow: 15000,
    netflow: 6000,
  },
  {
    month: "Jun",
    inflow: 19000,
    outflow: 14000,
    netflow: 5000,
  },
]

export function CashFlowChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Analysis</CardTitle>
        <CardDescription>Monthly cash inflows and outflows</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            inflow: {
              label: "Cash Inflow",
              color: "hsl(var(--primary))",
            },
            outflow: {
              label: "Cash Outflow",
              color: "hsl(var(--muted-foreground))",
            },
            netflow: {
              label: "Net Cash Flow",
              color: "hsl(var(--accent))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent /> } />
              <Legend />
              <Bar dataKey="inflow" fill="var(--color-inflow, hsl(var(--primary)))" name="Cash Inflow" />
              <Bar dataKey="outflow" fill="var(--color-outflow, hsl(var(--muted-foreground)))" name="Cash Outflow" />
              <Bar dataKey="netflow" fill="var(--color-netflow, hsl(var(--accent)))" name="Net Cash Flow" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
