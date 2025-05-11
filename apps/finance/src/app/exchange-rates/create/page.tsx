"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Label } from "@nubras/ui"
import { Textarea } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { Switch } from "@nubras/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nubras/ui"
import { ArrowLeft, Check, Info } from "lucide-react"
import { Separator } from "@nubras/ui"

export default function CreateCurrencyPage() {
  const [currencyCode, setCurrencyCode] = useState("")
  const [currencyName, setCurrencyName] = useState("")
  const [currencySymbol, setCurrencySymbol] = useState("")
  const [exchangeRate, setExchangeRate] = useState("1.0")
  const [isBaseCurrency, setIsBaseCurrency] = useState(false)
  const [decimalPlaces, setDecimalPlaces] = useState("2")
  const [format, setFormat] = useState("symbol_before")
  const [isActive, setIsActive] = useState(true)
  const [notes, setNotes] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the currency to the database
    console.log({
      currencyCode,
      currencyName,
      currencySymbol,
      exchangeRate: Number.parseFloat(exchangeRate),
      isBaseCurrency,
      decimalPlaces: Number.parseInt(decimalPlaces),
      format,
      isActive,
      notes,
    })

    // Navigate back to the exchange rates page
    router.push("/exchange-rates")
  }

  const handleCancel = () => {
    router.push("/exchange-rates")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Add Currency</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Currency Details</CardTitle>
                <CardDescription>Enter the basic information about the currency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currencyCode">Currency Code</Label>
                    <Input
                      id="currencyCode"
                      placeholder="e.g. USD, EUR, GBP"
                      value={currencyCode}
                      onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
                      maxLength={3}
                      required
                    />
                    <p className="text-sm text-muted-foreground">3-letter ISO code (e.g., USD, EUR)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currencyName">Currency Name</Label>
                    <Input
                      id="currencyName"
                      placeholder="e.g. US Dollar, Euro, British Pound"
                      value={currencyName}
                      onChange={(e) => setCurrencyName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currencySymbol">Currency Symbol</Label>
                    <Input
                      id="currencySymbol"
                      placeholder="e.g. $, €, £"
                      value={currencySymbol}
                      onChange={(e) => setCurrencySymbol(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exchangeRate">Exchange Rate</Label>
                    <Input
                      id="exchangeRate"
                      type="number"
                      step="0.000001"
                      min="0.000001"
                      placeholder="1.0"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                      disabled={isBaseCurrency}
                      required
                    />
                    <p className="text-sm text-muted-foreground">Rate relative to your base currency (AED)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isBaseCurrency"
                    checked={isBaseCurrency}
                    onCheckedChange={(checked) => {
                      setIsBaseCurrency(checked)
                      if (checked) {
                        setExchangeRate("1.0")
                      }
                    }}
                  />
                  <Label htmlFor="isBaseCurrency">Set as base currency</Label>
                </div>

                {isBaseCurrency && (
                  <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-950">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Warning: Changing Base Currency
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                          <p>
                            Setting this as your base currency will recalculate all existing exchange rates. This action
                            cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure additional currency settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="decimalPlaces">Decimal Places</Label>
                    <Select value={decimalPlaces} onValueChange={setDecimalPlaces}>
                      <SelectTrigger id="decimalPlaces">
                        <SelectValue placeholder="Select decimal places" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (e.g., 123)</SelectItem>
                        <SelectItem value="1">1 (e.g., 123.4)</SelectItem>
                        <SelectItem value="2">2 (e.g., 123.45)</SelectItem>
                        <SelectItem value="3">3 (e.g., 123.456)</SelectItem>
                        <SelectItem value="4">4 (e.g., 123.4567)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="symbol_before">Symbol before amount (e.g., $123.45)</SelectItem>
                        <SelectItem value="symbol_after">Symbol after amount (e.g., 123.45$)</SelectItem>
                        <SelectItem value="code_before">Code before amount (e.g., USD 123.45)</SelectItem>
                        <SelectItem value="code_after">Code after amount (e.g., 123.45 USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional information about this currency"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how the currency will be displayed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Currency Code</p>
                        <p className="text-lg font-bold">{currencyCode || "---"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Currency Name</p>
                        <p className="text-lg">{currencyName || "---"}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Symbol</p>
                        <p className="text-lg">{currencySymbol || "---"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Exchange Rate</p>
                        <p className="text-lg">{exchangeRate || "1.0"}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Example Format</p>
                      <p className="text-lg">
                        {format === "symbol_before"
                          ? `${currencySymbol || "$"}123${"." + "0".repeat(Number.parseInt(decimalPlaces))}`
                          : format === "symbol_after"
                            ? `123${"." + "0".repeat(Number.parseInt(decimalPlaces))}${currencySymbol || "$"}`
                            : format === "code_before"
                              ? `${currencyCode || "USD"} 123${"." + "0".repeat(Number.parseInt(decimalPlaces))}`
                              : `123${"." + "0".repeat(Number.parseInt(decimalPlaces))} ${currencyCode || "USD"}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Check className="mr-2 h-4 w-4" />
            Save Currency
          </Button>
        </div>
      </form>
    </div>
  )
}
