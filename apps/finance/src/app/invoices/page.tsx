"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { InvoiceDrawer } from "@/components/invoice-drawer"
import { Plus, Search, Eye, Pencil, List, Network, Trello, Printer } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { TreeView, type TreeNode } from "@nubras/ui"
import { Kanban, type KanbanColumn, type KanbanItem } from "@nubras/ui"

// Sample data for invoices
const invoices = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    customer: "Dubai Fashion LLC",
    issueDate: "2023-04-01",
    dueDate: "2023-05-01",
    status: "Paid",
    subtotal: 1000.0,
    tax: 50.0,
    total: 1050.0,
    items: [
      {
        description: "Custom Tailored Suit",
        quantity: 1,
        price: 800.0,
      },
      {
        description: "Alterations",
        quantity: 2,
        price: 100.0,
      },
    ],
    notes: "Thank you for your business!",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    customer: "Al Ain Retail Group",
    issueDate: "2023-04-05",
    dueDate: "2023-05-05",
    status: "Pending",
    subtotal: 2500.0,
    tax: 125.0,
    total: 2625.0,
    items: [
      {
        description: "Uniform Shirts",
        quantity: 10,
        price: 150.0,
      },
      {
        description: "Uniform Pants",
        quantity: 10,
        price: 100.0,
      },
    ],
    notes: "",
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    customer: "Sharjah Hotels Ltd",
    issueDate: "2023-04-10",
    dueDate: "2023-05-10",
    status: "Overdue",
    subtotal: 3200.0,
    tax: 160.0,
    total: 3360.0,
    items: [
      {
        description: "Staff Uniforms",
        quantity: 20,
        price: 160.0,
      },
    ],
    notes: "Please pay within 7 days",
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    customer: "Abu Dhabi Events Co",
    issueDate: "2023-04-15",
    dueDate: "2023-05-15",
    status: "Draft",
    subtotal: 1800.0,
    tax: 90.0,
    total: 1890.0,
    items: [
      {
        description: "Event Staff Attire",
        quantity: 6,
        price: 300.0,
      },
    ],
    notes: "Draft - not yet sent to customer",
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    customer: "Ras Al Khaimah Resorts",
    issueDate: "2023-04-20",
    dueDate: "2023-05-20",
    status: "Paid",
    subtotal: 4500.0,
    tax: 225.0,
    total: 4725.0,
    items: [
      {
        description: "Custom Uniforms",
        quantity: 15,
        price: 250.0,
      },
      {
        description: "Embroidery Service",
        quantity: 15,
        price: 50.0,
      },
    ],
    notes: "Thank you for your prompt payment!",
  },
]

// Tree view data
const generateTreeData = () => {
  const months = ["January", "February", "March", "April", "May", "June"]
  const statusGroups = ["Paid", "Pending", "Overdue", "Draft", "Cancelled"]

  const byMonth: { [key: string]: any[] } = {}
  const byStatus: { [key: string]: any[] } = {}
  const byCustomer: { [key: string]: any[] } = {}

  // Group invoices by month, status, and customer
  invoices.forEach((invoice) => {
    const month = new Date(invoice.issueDate).toLocaleString("default", { month: "long" })

    if (!byMonth[month]) byMonth[month] = []
    byMonth[month].push(invoice)

    if (!byStatus[invoice.status]) byStatus[invoice.status] = []
    byStatus[invoice.status].push(invoice)

    if (!byCustomer[invoice.customer]) byCustomer[invoice.customer] = []
    byCustomer[invoice.customer].push(invoice)
  })

  const treeData: TreeNode[] = [
    {
      id: "by-date",
      name: "By Date",
      children: Object.keys(byMonth).map((month) => ({
        id: `month-${month}`,
        name: month,
        children: byMonth[month].map((invoice) => ({
          id: invoice.id,
          name: `${invoice.invoiceNumber} - ${invoice.customer}`,
          meta: { invoice },
        })),
      })),
    },
    {
      id: "by-status",
      name: "By Status",
      children: statusGroups.map((status) => ({
        id: `status-${status}`,
        name: status,
        children: (byStatus[status] || []).map((invoice) => ({
          id: invoice.id,
          name: `${invoice.invoiceNumber} - ${invoice.customer}`,
          meta: { invoice },
        })),
      })),
    },
    {
      id: "by-customer",
      name: "By Customer",
      children: Object.keys(byCustomer).map((customer) => ({
        id: `customer-${customer}`,
        name: customer,
        children: byCustomer[customer].map((invoice) => ({
          id: invoice.id,
          name: `${invoice.invoiceNumber} - ${invoice.issueDate}`,
          meta: { invoice },
        })),
      })),
    },
  ]

  return treeData
}

// Kanban data
const generateKanbanData = () => {
  const columns: KanbanColumn[] = [
    {
      id: "draft",
      title: "Draft",
      items: invoices
        .filter((invoice) => invoice.status === "Draft")
        .map((invoice) => ({
          id: invoice.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{invoice.invoiceNumber}</div>
              <div className="text-xs text-muted-foreground">{invoice.customer}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{invoice.issueDate}</Badge>
                <span className="font-semibold">
                  AED {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: invoice,
        })),
    },
    {
      id: "pending",
      title: "Pending",
      items: invoices
        .filter((invoice) => invoice.status === "Pending")
        .map((invoice) => ({
          id: invoice.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{invoice.invoiceNumber}</div>
              <div className="text-xs text-muted-foreground">{invoice.customer}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{invoice.issueDate}</Badge>
                <span className="font-semibold">
                  AED {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: invoice,
        })),
    },
    {
      id: "paid",
      title: "Paid",
      items: invoices
        .filter((invoice) => invoice.status === "Paid")
        .map((invoice) => ({
          id: invoice.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{invoice.invoiceNumber}</div>
              <div className="text-xs text-muted-foreground">{invoice.customer}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{invoice.issueDate}</Badge>
                <span className="font-semibold">
                  AED {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: invoice,
        })),
    },
    {
      id: "overdue",
      title: "Overdue",
      items: invoices
        .filter((invoice) => invoice.status === "Overdue")
        .map((invoice) => ({
          id: invoice.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{invoice.invoiceNumber}</div>
              <div className="text-xs text-muted-foreground">{invoice.customer}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{invoice.issueDate}</Badge>
                <span className="font-semibold">
                  AED {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: invoice,
        })),
    },
  ]

  return columns
}

export default function InvoicesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"table" | "tree" | "kanban">("table")
  const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode | null>(null)
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(generateKanbanData())
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()

  // Set isClient to true when component mounts
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleView = (invoice: any) => {
    setSelectedInvoice(invoice)
    setMode("view")
    setIsDrawerOpen(true)
  }

  const handleEdit = (invoice: any) => {
    setSelectedInvoice(invoice)
    setMode("edit")
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    router.push("/invoices/create")
  }

  const handleTreeNodeSelect = (node: TreeNode) => {
    setSelectedTreeNode(node)
    // If the node has a meta field with invoice data, open the drawer
    if (node.meta?.invoice) {
      setSelectedInvoice(node.meta.invoice)
      setMode("view")
      setIsDrawerOpen(true)
    }
  }

  const handleKanbanDragEnd = (result: any) => {
    if (!result.destination) return

    // In a real app, this would update the invoice status based on the column it was moved to
    console.log("Drag ended:", result)
  }

  const handleKanbanItemClick = (item: KanbanItem) => {
    if (item.meta) {
      setSelectedInvoice(item.meta)
      setMode("view")
      setIsDrawerOpen(true)
    }
  }

  // Update the handlePrintInvoice function in the invoices page
  const handlePrintInvoice = (invoice: any) => {
    // Navigate to the invoice view page
    router.push(`/invoices/view/${invoice.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">Manage your sales invoices</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            <span>Create Invoice</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>View and manage your sales invoices</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-1"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </Button>
            <Button
              variant={viewMode === "tree" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("tree")}
              className="gap-1"
            >
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Tree</span>
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="gap-1"
            >
              <Trello className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" && (
            <>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-[200px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] whitespace-nowrap">Invoice #</TableHead>
                      <TableHead className="whitespace-nowrap">Customer</TableHead>
                      <TableHead className="whitespace-nowrap">Issue Date</TableHead>
                      <TableHead className="whitespace-nowrap">Due Date</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Amount (AED)</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium whitespace-nowrap">{invoice.invoiceNumber}</TableCell>
                        <TableCell className="whitespace-nowrap">{invoice.customer}</TableCell>
                        <TableCell className="whitespace-nowrap">{invoice.issueDate}</TableCell>
                        <TableCell className="whitespace-nowrap">{invoice.dueDate}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {invoice.total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            variant={
                              invoice.status === "Paid"
                                ? "success"
                                : invoice.status === "Overdue"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleView(invoice)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(invoice)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handlePrintInvoice(invoice)}>
                              <Printer className="h-4 w-4" />
                              <span className="sr-only">Print</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {viewMode === "tree" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <TreeView data={generateTreeData()} onNodeSelect={handleTreeNodeSelect} defaultExpanded={false} />
              </div>
              <div className="md:col-span-2">
                {selectedTreeNode?.meta?.invoice ? (
                  <div className="space-y-4 border rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Invoice #{selectedTreeNode.meta.invoice.invoiceNumber}</h3>
                      <Badge
                        variant={
                          selectedTreeNode.meta.invoice.status === "Paid"
                            ? "success"
                            : selectedTreeNode.meta.invoice.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {selectedTreeNode.meta.invoice.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Customer</p>
                        <p className="text-lg font-semibold">{selectedTreeNode.meta.invoice.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold">
                          AED{" "}
                          {selectedTreeNode.meta.invoice.total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                        <p className="text-lg">{selectedTreeNode.meta.invoice.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                        <p className="text-lg">{selectedTreeNode.meta.invoice.dueDate}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(selectedTreeNode.meta!.invoice)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(selectedTreeNode.meta!.invoice)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintInvoice(selectedTreeNode.meta!.invoice)}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground border rounded-lg">
                    Select an invoice from the tree to view its details
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === "kanban" && (
            <div className="mt-4">
              <Kanban columns={kanbanColumns} onDragEnd={handleKanbanDragEnd} onItemClick={handleKanbanItemClick} />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Click on any card to view invoice details. Drag cards between columns to change status.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <InvoiceDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} invoice={selectedInvoice} mode={mode} />
    </div>
  )
}
