"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@nubras/ui"
import { Label } from "@nubras/ui"
import { Tabs, TabsList, TabsTrigger } from "@nubras/ui"
import {
  ArrowUpDown,
  Calendar,
  Check,
  ChevronsUpDown,
  Edit,
  Plus,
  RefreshCw,
  Search,
  Star,
  StarOff,
} from "lucide-react"
import { financeService, type Currency } from "@/lib/finance/finance-service"

export default function ExchangeRatesPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditRateDialogOpen, setIsEditRateDialogOpen] = useState(false)
  const [currentCurrency, setCurrentCurrency] = useState<Currency | null>(null)
  const [newRate, setNewRate] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const router = useRouter()

  // Load currencies
  useEffect(() => {
    const loadedCurrencies = financeService.getCurrencies()
    setCurrencies(loadedCurrencies)
  }, [])

  // Filter currencies based on search term and active tab
  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch =
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "base" && currency.isBaseCurrency) ||
      (activeTab === "foreign" && !currency.isBaseCurrency)

    return matchesSearch && matchesTab
  })

  // Open edit rate dialog
  const openEditRateDialog = (currency: Currency) => {
    setCurrentCurrency(currency)
    setNewRate(currency.exchangeRate.toString())
    setIsEditRateDialogOpen(true)
  }

  // Handle update rate
  const handleUpdateRate = () => {
    if (!currentCurrency) return

    try {
      const rate = Number.parseFloat(newRate)
      if (isNaN(rate) || rate <= 0) {
        throw new Error("Invalid exchange rate")
      }

      // In a real app, this would call an API to update the rate
      const updatedCurrency = {
        ...currentCurrency,
        exchangeRate: rate,
      }

      setCurrencies((prev) => prev.map((curr) => (curr.code === updatedCurrency.code ? updatedCurrency : curr)))

      setIsEditRateDialogOpen(false)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to update rate:", error)
      alert("Failed to update rate. Please enter a valid number.")
    }
  }

  // Handle refresh rates
  const handleRefreshRates = () => {
    // In a real app, this would call an API to fetch the latest rates
    alert("Refreshing exchange rates from external service...")

    // Simulate a refresh with random rate changes
    setTimeout(() => {
      setCurrencies((prev) =>
        prev.map((curr) => {
          if (curr.isBaseCurrency) return curr

          // Random adjustment between -5% and +5%
          const adjustment = 1 + (Math.random() * 0.1 - 0.05)
          return {
            ...curr,
            exchangeRate: Number.parseFloat((curr.exchangeRate * adjustment).toFixed(6)),
          }
        }),
      )

      setLastUpdated(new Date())
      alert("Exchange rates updated successfully!")
    }, 1500)
  }

  // Set base currency
  const setAsBaseCurrency = (currencyCode: string) => {
    // In a real app, this would call an API to update the base currency
    if (
      window.confirm(
        `Are you sure you want to set ${currencyCode} as the base currency? This will recalculate all exchange rates.`,
      )
    ) {
      const currentBase = currencies.find((c) => c.isBaseCurrency)
      const newBase = currencies.find((c) => c.code === currencyCode)

      if (!currentBase || !newBase) return

      // Calculate new rates relative to the new base currency
      setCurrencies((prev) =>
        prev.map((curr) => {
          if (curr.code === currencyCode) {
            return { ...curr, isBaseCurrency: true, exchangeRate: 1 }
          } else if (curr.isBaseCurrency) {
            return { ...curr, isBaseCurrency: false, exchangeRate: 1 / newBase.exchangeRate }
          } else {
            return {
              ...curr,
              exchangeRate: curr.exchangeRate / newBase.exchangeRate,
            }
          }
        }),
      )

      setLastUpdated(new Date())
    }
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCreateCurrency = () => {
    router.push("/exchange-rates/create")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exchange Rates</h2>
          <p className="text-muted-foreground">Manage currency exchange rates for multi-currency transactions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshRates} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Rates</span>
          </Button>
          <Button onClick={handleCreateCurrency} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Currency</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Currency Exchange Rates</CardTitle>
            <CardDescription>Last updated: {formatDate(lastUpdated)}</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search currencies..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="base">Base</TabsTrigger>
                <TabsTrigger value="foreign">Foreign</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center">
                      Code
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Currency Name
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Exchange Rate</TableHead>
                  <TableHead>Base Currency</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCurrencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No currencies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCurrencies.map((currency) => (
                    <TableRow key={currency.code}>
                      <TableCell className="font-medium">{currency.code}</TableCell>
                      <TableCell>{currency.name}</TableCell>
                      <TableCell>{currency.symbol}</TableCell>
                      <TableCell className="text-right font-mono">
                        {currency.isBaseCurrency ? "1.000000" : currency.exchangeRate.toFixed(6)}
                      </TableCell>
                      <TableCell>
                        {currency.isBaseCurrency ? (
                          <Badge variant="success" className="gap-1">
                            <Star className="h-3 w-3" />
                            Base
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 h-7"
                            onClick={() => setAsBaseCurrency(currency.code)}
                          >
                            <StarOff className="h-3 w-3" />
                            Set as Base
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditRateDialog(currency)}
                          disabled={currency.isBaseCurrency}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Convert amounts between different currencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-amount">Amount</Label>
                <Input id="from-amount" type="number" placeholder="Enter amount" defaultValue="1000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-currency">From Currency</Label>
                <div className="relative">
                  <select
                    id="from-currency"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue={currencies.find((c) => c.isBaseCurrency)?.code || "AED"}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to-amount">Converted Amount</Label>
                <Input id="to-amount" type="number" readOnly value="270.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-currency">To Currency</Label>
                <div className="relative">
                  <select
                    id="to-currency"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="USD"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                </div>
              </div>
            </div>
          </div>

          <Button className="mt-6 w-full">Convert</Button>
        </CardContent>
      </Card>

      {/* Edit Rate Dialog */}
      <Dialog open={isEditRateDialogOpen} onOpenChange={setIsEditRateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Exchange Rate</DialogTitle>
            <DialogDescription>
              Update the exchange rate for {currentCurrency?.name} ({currentCurrency?.code})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">
                Exchange Rate
              </Label>
              <div className="col-span-3">
                <Input
                  id="rate"
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  1 {currentCurrency?.code} = {newRate} {currencies.find((c) => c.isBaseCurrency)?.code}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Effective Date
              </Label>
              <div className="col-span-3 relative">
                <Input id="date" type="text" value={formatDate(new Date())} readOnly />
                <Calendar className="absolute right-3 top-3 h-4 w-4 opacity-50" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRate}>
              <Check className="mr-2 h-4 w-4" />
              Update Rate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
