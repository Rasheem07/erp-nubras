"use client"

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Download,
  HelpCircle,
  Info,
  LineChart,
  Package,
  RefreshCw,
  Settings,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { inventoryService } from "@/lib/inventory/inventory-service"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

export function InventoryForecasting() {
  const [forecastPeriod, setForecastPeriod] = useState("6months")
  const [forecastModel, setForecastModel] = useState("trend")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for forecasting
  const forecastData = {
    inventoryValue: {
      current: 245780,
      projected: 267500,
      change: 8.8,
      trend: "up",
    },
    stockouts: {
      current: 5,
      projected: 2,
      change: -60,
      trend: "down",
    },
    turnoverRate: {
      current: 4.2,
      projected: 4.8,
      change: 14.3,
      trend: "up",
    },
    holdingCost: {
      current: 24578,
      projected: 26750,
      change: 8.8,
      trend: "up",
    },
    categories: {
      fabric: {
        current: 145000,
        projected: 162000,
        change: 11.7,
        trend: "up",
      },
      thread: {
        current: 35000,
        projected: 38500,
        change: 10,
        trend: "up",
      },
      accessories: {
        current: 42000,
        projected: 45000,
        change: 7.1,
        trend: "up",
      },
      packaging: {
        current: 23780,
        projected: 22000,
        change: -7.5,
        trend: "down",
      },
    },
    topItems: [
      {
        name: "Premium Cotton Fabric",
        sku: "FAB-COT-001",
        current: 250,
        projected: 220,
        change: -12,
        trend: "down",
      },
      {
        name: "Silk Fabric",
        sku: "FAB-SLK-001",
        current: 100,
        projected: 130,
        change: 30,
        trend: "up",
      },
      {
        name: "Gold Thread",
        sku: "THR-GLD-001",
        current: 50,
        projected: 65,
        change: 30,
        trend: "up",
      },
    ],
  }

  // Line chart data for inventory value forecast
  const valueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Historical Value",
        data: [210000, 215000, 225000, 230000, 240000, 245780],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Forecasted Value",
        data: [245780, 250000, 255000, 260000, 265000, 267500],
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        tension: 0.3,
        fill: false,
      },
    ],
  }

  // Bar chart data for category forecast
  const categoryChartData = {
    labels: ["Fabric", "Thread", "Accessories", "Packaging"],
    datasets: [
      {
        label: "Current Value",
        data: [145000, 35000, 42000, 23780],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 4,
      },
      {
        label: "Projected Value",
        data: [162000, 38500, 45000, 22000],
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderRadius: 4,
      },
    ],
  }

  // Line chart data for stock levels forecast
  const stockLevelChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Premium Cotton Fabric",
        data: [280, 270, 260, 255, 250, 245, 240, 235, 230, 225, 220, 215],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
      {
        label: "Silk Fabric",
        data: [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135],
        borderColor: "rgba(236, 72, 153, 1)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
      {
        label: "Gold Thread",
        data: [40, 42, 45, 48, 50, 52, 55, 57, 60, 62, 65, 68],
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  }

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += inventoryService.formatCurrency(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => inventoryService.formatCurrency(value),
        },
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += inventoryService.formatCurrency(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => inventoryService.formatCurrency(value),
        },
      },
    },
  }

  // Handle refresh data
  const handleRefreshData = () => {
    setIsRefreshing(true)

    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Get trend icon
  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") {
      return change > 0 ? (
        <TrendingUp className={`h-3.5 w-3.5 ${change > 0 ? "text-green-500" : "text-red-500"}`} />
      ) : (
        <TrendingUp className="h-3.5 w-3.5 text-red-500" />
      )
    } else {
      return change < 0 ? (
        <TrendingDown className={`h-3.5 w-3.5 ${change < 0 ? "text-green-500" : "text-red-500"}`} />
      ) : (
        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-lg font-medium tracking-tight flex items-center gap-2">
            Inventory Forecasting
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </h2>
          <p className="text-muted-foreground text-xs mt-0.5">
            Predictive analytics for inventory planning and optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue placeholder="Forecast Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Next 3 Months</SelectItem>
              <SelectItem value="6months">Next 6 Months</SelectItem>
              <SelectItem value="12months">Next 12 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={forecastModel} onValueChange={setForecastModel}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <LineChart className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue placeholder="Forecast Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trend">Trend Analysis</SelectItem>
              <SelectItem value="seasonal">Seasonal Analysis</SelectItem>
              <SelectItem value="ml">Machine Learning</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Projected Inventory Value</CardTitle>
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {inventoryService.formatCurrency(forecastData.inventoryValue.projected)}
            </div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className={`text-xs gap-1 ${forecastData.inventoryValue.trend === "up" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}
              >
                {getTrendIcon(forecastData.inventoryValue.trend, forecastData.inventoryValue.change)}
                {forecastData.inventoryValue.change}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">from current</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Projected Stockouts</CardTitle>
            <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{forecastData.stockouts.projected}</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className={`text-xs gap-1 ${forecastData.stockouts.trend === "down" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}
              >
                {getTrendIcon(forecastData.stockouts.trend, forecastData.stockouts.change)}
                {Math.abs(forecastData.stockouts.change)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">from current</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Projected Turnover Rate</CardTitle>
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{forecastData.turnoverRate.projected.toFixed(1)}x</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className={`text-xs gap-1 ${forecastData.turnoverRate.trend === "up" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}
              >
                {getTrendIcon(forecastData.turnoverRate.trend, forecastData.turnoverRate.change)}
                {forecastData.turnoverRate.change}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">from current</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Projected Holding Cost</CardTitle>
            <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {inventoryService.formatCurrency(forecastData.holdingCost.projected)}
            </div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className={`text-xs gap-1 ${forecastData.holdingCost.trend === "up" ? "text-red-500 bg-red-500/10" : "text-green-500 bg-green-500/10"}`}
              >
                {getTrendIcon(forecastData.holdingCost.trend, forecastData.holdingCost.change)}
                {forecastData.holdingCost.change}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">from current</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="h-8">
          <TabsTrigger value="overview" className="text-xs">
            Value Forecast
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs">
            Category Analysis
          </TabsTrigger>
          <TabsTrigger value="items" className="text-xs">
            Item Forecasts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value Forecast</CardTitle>
              <CardDescription className="text-xs">
                Projected inventory value over the next{" "}
                {forecastPeriod === "3months" ? "3" : forecastPeriod === "6months" ? "6" : "12"} months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Line data={valueChartData} options={lineChartOptions} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Forecast Insights</CardTitle>
                <CardDescription className="text-xs">Key insights from the inventory forecast analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 p-2 rounded-md bg-blue-500/10 border border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Seasonal Demand Increase</p>
                    <p className="text-xs text-muted-foreground">
                      Prepare for a projected 11.7% increase in fabric demand over the next quarter due to seasonal
                      trends.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Potential Stock Issues</p>
                    <p className="text-xs text-muted-foreground">
                      Premium Cotton Fabric is projected to decrease by 12%, which may lead to stockouts if not
                      addressed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-md bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Improved Turnover</p>
                    <p className="text-xs text-muted-foreground">
                      Inventory turnover rate is projected to improve by 14.3%, indicating better inventory efficiency.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recommended Actions</CardTitle>
                <CardDescription className="text-xs">
                  Suggested inventory management actions based on forecast
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 p-2 rounded-md bg-muted/20 border border-muted/30">
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Increase Premium Cotton Fabric Orders</p>
                    <p className="text-xs text-muted-foreground">
                      Place orders for additional 50 meters of Premium Cotton Fabric to prevent projected stockouts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-md bg-muted/20 border border-muted/30">
                  <TrendingDown className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Reduce Packaging Inventory</p>
                    <p className="text-xs text-muted-foreground">
                      Consider reducing packaging inventory by 7.5% to align with projected demand and reduce holding
                      costs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-md bg-muted/20 border border-muted/30">
                  <Settings className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Adjust Reorder Points</p>
                    <p className="text-xs text-muted-foreground">
                      Update reorder points for Silk Fabric and Gold Thread to accommodate projected 30% increase in
                      demand.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Category Value Forecast</CardTitle>
              <CardDescription className="text-xs">Projected inventory value by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar data={categoryChartData} options={barChartOptions} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(forecastData.categories).map(([category, data]) => (
              <Card key={category}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium capitalize">{category}</CardTitle>
                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-base font-bold">{inventoryService.formatCurrency(data.projected)}</div>
                  <div className="flex items-center mt-1">
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${data.trend === "up" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}
                    >
                      {getTrendIcon(data.trend, data.change)}
                      {data.change}%
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">from current</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Item Stock Level Forecast</CardTitle>
              <CardDescription className="text-xs">Projected stock levels for key inventory items</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Line
                data={stockLevelChartData}
                options={{
                  ...lineChartOptions,
                  scales: {
                    ...lineChartOptions.scales,
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value: any) => value,
                      },
                    },
                  },
                  plugins: {
                    ...lineChartOptions.plugins,
                    tooltip: {
                      ...lineChartOptions.plugins.tooltip,
                      callbacks: {
                        label: (context: any) => {
                          let label = context.dataset.label || ""
                          if (label) {
                            label += ": "
                          }
                          if (context.parsed.y !== null) {
                            label += context.parsed.y + " units"
                          }
                          return label
                        },
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Projected Stock</TableHead>
                  <TableHead className="text-center">Change</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecastData.topItems.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell className="text-right">{item.current}</TableCell>
                    <TableCell className="text-right">{item.projected}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`gap-1 ${item.trend === "up" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}
                      >
                        {getTrendIcon(item.trend, item.change)}
                        {item.change}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="text-xs gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Export Forecast
        </Button>
      </div>
    </div>
  )
}
