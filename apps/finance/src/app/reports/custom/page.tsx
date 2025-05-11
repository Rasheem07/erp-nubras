"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {Button} from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CustomReportPage() {
  const router = useRouter()
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([])
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [filters, setFilters] = useState<any[]>([])
  const [groupBy, setGroupBy] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("data-sources")

  // Available data sources
  const dataSources = [
    { id: "accounts", name: "Chart of Accounts" },
    { id: "transactions", name: "Transactions" },
    { id: "customers", name: "Customers" },
    { id: "vendors", name: "Vendors" },
    { id: "invoices", name: "Invoices" },
    { id: "expenses", name: "Expenses" },
    { id: "budgets", name: "Budgets" },
    { id: "taxes", name: "Taxes" },
  ]

  // Available fields based on selected data sources
  const availableFields = [
    { id: "account_name", name: "Account Name", source: "accounts" },
    { id: "account_number", name: "Account Number", source: "accounts" },
    { id: "account_type", name: "Account Type", source: "accounts" },
    { id: "account_balance", name: "Account Balance", source: "accounts" },
    { id: "transaction_date", name: "Transaction Date", source: "transactions" },
    { id: "transaction_type", name: "Transaction Type", source: "transactions" },
    { id: "transaction_amount", name: "Transaction Amount", source: "transactions" },
    { id: "transaction_description", name: "Transaction Description", source: "transactions" },
    { id: "customer_name", name: "Customer Name", source: "customers" },
    { id: "customer_email", name: "Customer Email", source: "customers" },
    { id: "customer_phone", name: "Customer Phone", source: "customers" },
    { id: "customer_address", name: "Customer Address", source: "customers" },
    { id: "vendor_name", name: "Vendor Name", source: "vendors" },
    { id: "vendor_email", name: "Vendor Email", source: "vendors" },
    { id: "vendor_phone", name: "Vendor Phone", source: "vendors" },
    { id: "vendor_address", name: "Vendor Address", source: "vendors" },
    { id: "invoice_number", name: "Invoice Number", source: "invoices" },
    { id: "invoice_date", name: "Invoice Date", source: "invoices" },
    { id: "invoice_due_date", name: "Invoice Due Date", source: "invoices" },
    { id: "invoice_amount", name: "Invoice Amount", source: "invoices" },
    { id: "invoice_status", name: "Invoice Status", source: "invoices" },
    { id: "expense_date", name: "Expense Date", source: "expenses" },
    { id: "expense_category", name: "Expense Category", source: "expenses" },
    { id: "expense_amount", name: "Expense Amount", source: "expenses" },
    { id: "expense_description", name: "Expense Description", source: "expenses" },
    { id: "budget_name", name: "Budget Name", source: "budgets" },
    { id: "budget_amount", name: "Budget Amount", source: "budgets" },
    { id: "budget_period", name: "Budget Period", source: "budgets" },
    { id: "budget_category", name: "Budget Category", source: "budgets" },
    { id: "tax_name", name: "Tax Name", source: "taxes" },
    { id: "tax_rate", name: "Tax Rate", source: "taxes" },
    { id: "tax_amount", name: "Tax Amount", source: "taxes" },
    { id: "tax_period", name: "Tax Period", source: "taxes" },
  ]

  // Filter operators
  const filterOperators = [
    { id: "equals", name: "Equals" },
    { id: "not_equals", name: "Not Equals" },
    { id: "greater_than", name: "Greater Than" },
    { id: "less_than", name: "Less Than" },
    { id: "contains", name: "Contains" },
    { id: "starts_with", name: "Starts With" },
    { id: "ends_with", name: "Ends With" },
    { id: "between", name: "Between" },
    { id: "in", name: "In List" },
  ]

  // Filter available fields based on selected data sources
  const filteredFields = availableFields.filter((field) => selectedDataSources.includes(field.source))

  const handleDataSourceToggle = (sourceId: string) => {
    setSelectedDataSources((prev) => {
      if (prev.includes(sourceId)) {
        // Remove data source and any fields from that source
        const newSelectedFields = selectedFields.filter(
          (fieldId) => !availableFields.find((f) => f.id === fieldId && f.source === sourceId),
        )
        setSelectedFields(newSelectedFields)
        return prev.filter((id) => id !== sourceId)
      } else {
        return [...prev, sourceId]
      }
    })
  }

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) => {
      if (prev.includes(fieldId)) {
        return prev.filter((id) => id !== fieldId)
      } else {
        return [...prev, fieldId]
      }
    })
  }

  const addFilter = () => {
    setFilters([...filters, { field: "", operator: "equals", value: "" }])
  }

  const updateFilter = (index: number, field: string, value: any) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], [field]: value }
    setFilters(newFilters)
  }

  const removeFilter = (index: number) => {
    const newFilters = [...filters]
    newFilters.splice(index, 1)
    setFilters(newFilters)
  }

  const handleGroupByToggle = (fieldId: string) => {
    setGroupBy((prev) => {
      if (prev.includes(fieldId)) {
        return prev.filter((id) => id !== fieldId)
      } else {
        return [...prev, fieldId]
      }
    })
  }

  const handleSortByToggle = (fieldId: string) => {
    setSortBy((prev) => {
      if (prev.includes(fieldId)) {
        return prev.filter((id) => id !== fieldId)
      } else {
        return [...prev, fieldId]
      }
    })
  }

  const handleGenerateReport = () => {
    // In a real app, this would generate the custom report
    console.log("Generating custom report:", {
      name: reportName,
      description: reportDescription,
      dataSources: selectedDataSources,
      fields: selectedFields,
      filters,
      groupBy,
      sortBy,
    })

    // Redirect back to reports page
    router.push("/reports")
  }

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/reports")}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Report Builder</h1>
          <p className="text-muted-foreground">Create a fully customized report with specific data points</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>Enter basic information about your report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              placeholder="Enter report name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-description">Description</Label>
            <Textarea
              id="report-description"
              placeholder="Enter report description"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="layout">Layout & Format</TabsTrigger>
        </TabsList>

        <TabsContent value="data-sources" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Data Sources</CardTitle>
              <CardDescription>Choose the data sources to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source.id}`}
                      checked={selectedDataSources.includes(source.id)}
                      onCheckedChange={() => handleDataSourceToggle(source.id)}
                    />
                    <Label htmlFor={`source-${source.id}`}>{source.name}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/reports")}>
                Cancel
              </Button>
              <Button onClick={() => setActiveTab("fields")}>Next: Select Fields</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Fields</CardTitle>
              <CardDescription>Choose the fields to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDataSources.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Please select at least one data source first</p>
                  <Button className="mt-2" onClick={() => setActiveTab("data-sources")}>
                    Go to Data Sources
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedDataSources.map((sourceId) => {
                    const source = dataSources.find((s) => s.id === sourceId)
                    const sourceFields = availableFields.filter((field) => field.source === sourceId)

                    return (
                      <div key={sourceId} className="space-y-2">
                        <h3 className="font-medium">{source?.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {sourceFields.map((field) => (
                            <div key={field.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`field-${field.id}`}
                                checked={selectedFields.includes(field.id)}
                                onCheckedChange={() => handleFieldToggle(field.id)}
                              />
                              <Label htmlFor={`field-${field.id}`}>{field.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("data-sources")}>
                Previous: Data Sources
              </Button>
              <Button onClick={() => setActiveTab("filters")}>Next: Set Filters</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Filters</CardTitle>
              <CardDescription>Define conditions to filter your report data</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFields.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Please select at least one field first</p>
                  <Button className="mt-2" onClick={() => setActiveTab("fields")}>
                    Go to Fields
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filters.map((filter, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <div className="flex-1 space-y-2">
                        <Label>Field</Label>
                        <Select value={filter.field} onValueChange={(value) => updateFilter(index, "field", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedFields.map((fieldId) => {
                              const field = availableFields.find((f) => f.id === fieldId)
                              return (
                                <SelectItem key={fieldId} value={fieldId}>
                                  {field?.name}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Operator</Label>
                        <Select
                          value={filter.operator}
                          onValueChange={(value) => updateFilter(index, "operator", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOperators.map((operator) => (
                              <SelectItem key={operator.id} value={operator.id}>
                                {operator.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={filter.value}
                          onChange={(e) => updateFilter(index, "value", e.target.value)}
                          placeholder="Enter value"
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFilter(index)} className="mb-0.5">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFilter} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Filter
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("fields")}>
                Previous: Fields
              </Button>
              <Button onClick={() => setActiveTab("layout")}>Next: Layout & Format</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout & Format</CardTitle>
              <CardDescription>Configure how your report will be organized and displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Group By</h3>
                <p className="text-sm text-muted-foreground">Select fields to group your data by</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedFields.map((fieldId) => {
                    const field = availableFields.find((f) => f.id === fieldId)
                    return (
                      <div key={fieldId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`group-${fieldId}`}
                          checked={groupBy.includes(fieldId)}
                          onCheckedChange={() => handleGroupByToggle(fieldId)}
                        />
                        <Label htmlFor={`group-${fieldId}`}>{field?.name}</Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Sort By</h3>
                <p className="text-sm text-muted-foreground">Select fields to sort your data by</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedFields.map((fieldId) => {
                    const field = availableFields.find((f) => f.id === fieldId)
                    return (
                      <div key={fieldId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sort-${fieldId}`}
                          checked={sortBy.includes(fieldId)}
                          onCheckedChange={() => handleSortByToggle(fieldId)}
                        />
                        <Label htmlFor={`sort-${fieldId}`}>{field?.name}</Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Report Format</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select defaultValue="portrait">
                      <SelectTrigger id="orientation">
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="page-size">Page Size</Label>
                    <Select defaultValue="a4">
                      <SelectTrigger id="page-size">
                        <SelectValue placeholder="Select page size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-charts" defaultChecked />
                  <Label htmlFor="include-charts">Include Charts and Graphs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-totals" defaultChecked />
                  <Label htmlFor="include-totals">Include Totals and Subtotals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-header" defaultChecked />
                  <Label htmlFor="include-header">Include Header and Footer</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("filters")}>
                Previous: Filters
              </Button>
              <Button onClick={handleGenerateReport}>Generate Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
