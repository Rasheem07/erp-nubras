"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Package, AlertTriangle, TrendingDown, Banknote, BarChart3, ShoppingCart, Clock, Layers } from "lucide-react"
import { inventoryService, type InventoryItem } from "@/lib/inventory/inventory-service"
import { StockLevelChart } from "@/components/stock-level-chart"
import { InventoryValueChart } from "@/components/inventory-value-chart"
import { LowStockItems } from "@/components/low-stock-items"
import { DeadStockItems } from "@/components/dead-stock-items"

export function InventoryDashboard() {
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([])
  const [deadStockItems, setDeadStockItems] = useState<InventoryItem[]>([])
  const [totalStockValue, setTotalStockValue] = useState(0)
  const [topItems, setTopItems] = useState<{ item: InventoryItem; value: number }[]>([])
  const [stockAgingSummary, setStockAgingSummary] = useState<{ ageRange: string; count: number; value: number }[]>([])

  useEffect(() => {
    // Load dashboard data
    setLowStockItems(inventoryService.getLowStockItems())
    setDeadStockItems(inventoryService.getDeadStockItems())
    setTotalStockValue(inventoryService.getTotalStockValue())
    setTopItems(inventoryService.getTopItemsByValue(5))
    setStockAgingSummary(inventoryService.getStockAgingSummary())
  }, [])

  const handleGeneratePurchaseOrders = () => {
    inventoryService.generateAutoPurchaseOrders("current-user")
    // Refresh low stock items
    setLowStockItems(inventoryService.getLowStockItems())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handleGeneratePurchaseOrders} className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Generate Purchase Orders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryService.formatCurrency(totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">Total value of all inventory items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items below reorder point</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dead Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items not used in 6+ months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryService.getInventoryItems().length}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Alert variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            {lowStockItems.length} items are below reorder point. Consider generating purchase orders.
          </AlertDescription>
        </Alert>
      )}

      {deadStockItems.length > 0 && (
        <Alert variant="destructive">
          <TrendingDown className="h-4 w-4" />
          <AlertTitle>Dead Stock Alert</AlertTitle>
          <AlertDescription>
            {deadStockItems.length} items have not been used in over 6 months. Consider repurposing or discounting.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Low Stock
          </TabsTrigger>
          <TabsTrigger value="dead-stock" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Dead Stock
          </TabsTrigger>
          <TabsTrigger value="stock-aging" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Stock Aging
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Stock Levels by Category</CardTitle>
                <CardDescription>Current stock distribution by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <StockLevelChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Inventory Value by Category</CardTitle>
                <CardDescription>Value distribution by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <InventoryValueChart />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Items by Value</CardTitle>
              <CardDescription>Highest value inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topItems.map(({ item, value }) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.currentStock} {item.unitOfMeasure}(s) in stock
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{inventoryService.formatCurrency(value)}</p>
                      <p className="text-sm text-muted-foreground">
                        {inventoryService.formatCurrency(item.costPrice)} per {item.unitOfMeasure}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <LowStockItems items={lowStockItems} onGeneratePOs={handleGeneratePurchaseOrders} />
        </TabsContent>

        <TabsContent value="dead-stock">
          <DeadStockItems items={deadStockItems} />
        </TabsContent>

        <TabsContent value="stock-aging">
          <Card>
            <CardHeader>
              <CardTitle>Stock Aging Summary</CardTitle>
              <CardDescription>Age distribution of current inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockAgingSummary.map((item) => (
                  <div key={item.ageRange} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.ageRange}</p>
                        <p className="text-sm text-muted-foreground">{item.count} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{inventoryService.formatCurrency(item.value)}</p>
                      <Badge
                        variant={
                          item.ageRange.includes("Over 365")
                            ? "destructive"
                            : item.ageRange.includes("181-365")
                              ? "default"
                              : "secondary"
                        }
                      >
                        {Math.round((item.value / totalStockValue) * 100)}% of total
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
