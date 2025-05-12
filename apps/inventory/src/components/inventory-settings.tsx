"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function InventorySettings() {
  const [vatRate, setVatRate] = useState("5")
  const [autoGeneratePOs, setAutoGeneratePOs] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [deadStockDays, setDeadStockDays] = useState("180")
  const [defaultUnitOfMeasure, setDefaultUnitOfMeasure] = useState("Meter")
  const [defaultLocation, setDefaultLocation] = useState("loc-001")
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128")
  const [language, setLanguage] = useState("en")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Settings</h2>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
          <TabsTrigger value="defaults">Default Values</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general inventory settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vatRate">Default VAT Rate (%)</Label>
                <Input
                  id="vatRate"
                  type="number"
                  min="0"
                  max="100"
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Standard UAE VAT rate is 5%</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="en-ar">Bilingual (English/Arabic)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Language for reports and documents</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcodeFormat">Barcode Format</Label>
                <Select value={barcodeFormat} onValueChange={setBarcodeFormat}>
                  <SelectTrigger id="barcodeFormat">
                    <SelectValue placeholder="Select barcode format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CODE128">Code 128</SelectItem>
                    <SelectItem value="CODE39">Code 39</SelectItem>
                    <SelectItem value="EAN13">EAN-13</SelectItem>
                    <SelectItem value="UPC">UPC</SelectItem>
                    <SelectItem value="QR">QR Code</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Default format for generating barcodes</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Configure inventory alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when items reach their reorder point
                  </p>
                </div>
                <Switch id="lowStockAlerts" checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoGeneratePOs">Auto-Generate Purchase Orders</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate purchase orders for low stock items
                  </p>
                </div>
                <Switch id="autoGeneratePOs" checked={autoGeneratePOs} onCheckedChange={setAutoGeneratePOs} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="deadStockDays">Dead Stock Threshold (Days)</Label>
                <Input
                  id="deadStockDays"
                  type="number"
                  min="30"
                  value={deadStockDays}
                  onChange={(e) => setDeadStockDays(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Number of days after which unused stock is considered &quot;dead stock&quot;
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="defaults" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Values</CardTitle>
              <CardDescription>Configure default values for new inventory items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultUnitOfMeasure">Default Unit of Measure</Label>
                <Select value={defaultUnitOfMeasure} onValueChange={setDefaultUnitOfMeasure}>
                  <SelectTrigger id="defaultUnitOfMeasure">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meter">Meter</SelectItem>
                    <SelectItem value="Yard">Yard</SelectItem>
                    <SelectItem value="Piece">Piece</SelectItem>
                    <SelectItem value="Roll">Roll</SelectItem>
                    <SelectItem value="Spool">Spool</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                    <SelectItem value="Kg">Kilogram</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultLocation">Default Location</Label>
                <Select value={defaultLocation} onValueChange={setDefaultLocation}>
                  <SelectTrigger id="defaultLocation">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loc-001">Dubai Main Workshop</SelectItem>
                    <SelectItem value="loc-002">Sharjah Warehouse</SelectItem>
                    <SelectItem value="loc-003">Dubai Mall Retail Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Configure integrations with other modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>POS Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically update inventory when sales are made through POS
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Project Management Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow project management module to reserve and allocate materials
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Finance Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync inventory values with finance module for accounting
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Manufacturing Integration</Label>
                  <p className="text-sm text-muted-foreground">Update inventory when items are used in manufacturing</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
