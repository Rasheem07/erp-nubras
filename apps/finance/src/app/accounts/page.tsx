"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { AccountDrawer } from "@/components/account-drawer"
import { Plus, Search, Eye, Pencil, List, Network, Trello, FileCheck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { TreeView, type TreeNode } from "@nubras/ui"
import { Kanban, type KanbanColumn, type KanbanItem } from "@nubras/ui"

// Sample data for chart of accounts
const accounts = [
  {
    id: "1000",
    name: "Cash",
    type: "Asset",
    subtype: "Current Asset",
    balance: 15000.0,
    status: "Active",
    description: "Cash on hand and in bank accounts",
    created: "2023-01-01",
  },
  {
    id: "1100",
    name: "Accounts Receivable",
    type: "Asset",
    subtype: "Current Asset",
    balance: 25000.0,
    status: "Active",
    description: "Amounts owed to the company by customers",
    created: "2023-01-01",
  },
  {
    id: "1200",
    name: "Inventory",
    type: "Asset",
    subtype: "Current Asset",
    balance: 35000.0,
    status: "Active",
    description: "Value of goods held for sale",
    created: "2023-01-01",
  },
  {
    id: "1500",
    name: "Equipment",
    type: "Asset",
    subtype: "Fixed Asset",
    balance: 50000.0,
    status: "Active",
    description: "Machinery and equipment owned by the company",
    created: "2023-01-01",
  },
  {
    id: "2000",
    name: "Accounts Payable",
    type: "Liability",
    subtype: "Current Liability",
    balance: 18000.0,
    status: "Active",
    description: "Amounts owed by the company to suppliers",
    created: "2023-01-01",
  },
  {
    id: "2100",
    name: "Loans Payable",
    type: "Liability",
    subtype: "Long-term Liability",
    balance: 75000.0,
    status: "Active",
    description: "Long-term debt obligations",
    created: "2023-01-01",
  },
  {
    id: "3000",
    name: "Owner's Equity",
    type: "Equity",
    subtype: "Equity",
    balance: 100000.0,
    status: "Active",
    description: "Owner's investment in the business",
    created: "2023-01-01",
  },
  {
    id: "4000",
    name: "Sales Revenue",
    type: "Revenue",
    subtype: "Operating Revenue",
    balance: 120000.0,
    status: "Active",
    description: "Income from sales of goods and services",
    created: "2023-01-01",
  },
  {
    id: "5000",
    name: "Cost of Goods Sold",
    type: "Expense",
    subtype: "Cost of Sales",
    balance: 65000.0,
    status: "Active",
    description: "Direct costs attributable to the production of goods sold",
    created: "2023-01-01",
  },
  {
    id: "6000",
    name: "Rent Expense",
    type: "Expense",
    subtype: "Operating Expense",
    balance: 12000.0,
    status: "Active",
    description: "Rent paid for office and facilities",
    created: "2023-01-01",
  },
]

// Tree view data
const generateTreeData = () => {
  const assetAccounts = accounts.filter((account) => account.type === "Asset")
  const liabilityAccounts = accounts.filter((account) => account.type === "Liability")
  const equityAccounts = accounts.filter((account) => account.type === "Equity")
  const revenueAccounts = accounts.filter((account) => account.type === "Revenue")
  const expenseAccounts = accounts.filter((account) => account.type === "Expense")

  const treeData: TreeNode[] = [
    {
      id: "assets",
      name: "Assets",
      children: [
        {
          id: "current-assets",
          name: "Current Assets",
          children: assetAccounts
            .filter((account) => account.subtype === "Current Asset")
            .map((account) => ({
              id: account.id,
              name: account.name,
              meta: { balance: account.balance, description: account.description },
            })),
        },
        {
          id: "fixed-assets",
          name: "Fixed Assets",
          children: assetAccounts
            .filter((account) => account.subtype === "Fixed Asset")
            .map((account) => ({
              id: account.id,
              name: account.name,
              meta: { balance: account.balance, description: account.description },
            })),
        },
      ],
    },
    {
      id: "liabilities",
      name: "Liabilities",
      children: [
        {
          id: "current-liabilities",
          name: "Current Liabilities",
          children: liabilityAccounts
            .filter((account) => account.subtype === "Current Liability")
            .map((account) => ({
              id: account.id,
              name: account.name,
              meta: { balance: account.balance, description: account.description },
            })),
        },
        {
          id: "long-term-liabilities",
          name: "Long-term Liabilities",
          children: liabilityAccounts
            .filter((account) => account.subtype === "Long-term Liability")
            .map((account) => ({
              id: account.id,
              name: account.name,
              meta: { balance: account.balance, description: account.description },
            })),
        },
      ],
    },
    {
      id: "equity",
      name: "Equity",
      children: equityAccounts.map((account) => ({
        id: account.id,
        name: account.name,
        meta: { balance: account.balance, description: account.description },
      })),
    },
    {
      id: "revenue",
      name: "Revenue",
      children: revenueAccounts.map((account) => ({
        id: account.id,
        name: account.name,
        meta: { balance: account.balance, description: account.description },
      })),
    },
    {
      id: "expenses",
      name: "Expenses",
      children: expenseAccounts.map((account) => ({
        id: account.id,
        name: account.name,
        meta: { balance: account.balance, description: account.description },
      })),
    },
  ]

  return treeData
}

// Kanban data
const generateKanbanData = () => {
  const columns: KanbanColumn[] = [
    {
      id: "asset",
      title: "Assets",
      items: accounts
        .filter((account) => account.type === "Asset")
        .map((account) => ({
          id: account.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{account.name}</div>
              <div className="text-xs text-muted-foreground">{account.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{account.subtype}</Badge>
                <span className="font-semibold">
                  AED {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: account,
        })),
    },
    {
      id: "liability",
      title: "Liabilities",
      items: accounts
        .filter((account) => account.type === "Liability")
        .map((account) => ({
          id: account.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{account.name}</div>
              <div className="text-xs text-muted-foreground">{account.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{account.subtype}</Badge>
                <span className="font-semibold">
                  AED {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: account,
        })),
    },
    {
      id: "equity",
      title: "Equity",
      items: accounts
        .filter((account) => account.type === "Equity")
        .map((account) => ({
          id: account.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{account.name}</div>
              <div className="text-xs text-muted-foreground">{account.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{account.subtype}</Badge>
                <span className="font-semibold">
                  AED {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: account,
        })),
    },
    {
      id: "revenue",
      title: "Revenue",
      items: accounts
        .filter((account) => account.type === "Revenue")
        .map((account) => ({
          id: account.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{account.name}</div>
              <div className="text-xs text-muted-foreground">{account.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{account.subtype}</Badge>
                <span className="font-semibold">
                  AED {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: account,
        })),
    },
    {
      id: "expense",
      title: "Expenses",
      items: accounts
        .filter((account) => account.type === "Expense")
        .map((account) => ({
          id: account.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{account.name}</div>
              <div className="text-xs text-muted-foreground">{account.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{account.subtype}</Badge>
                <span className="font-semibold">
                  AED {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ),
          meta: account,
        })),
    },
  ]

  return columns
}

export default function ChartOfAccountsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [searchTerm, setSearchTerm] = useState("")
  const [accountTypeFilter, setAccountTypeFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"table" | "tree" | "kanban">("table")
  const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode | null>(null)
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(generateKanbanData())

  const router = useRouter()

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) || account.id.includes(searchTerm)
    const matchesType = accountTypeFilter === "All" || account.type === accountTypeFilter

    return matchesSearch && matchesType
  })

  const handleView = (account: any) => {
    setSelectedAccount(account)
    setMode("view")
    setIsDrawerOpen(true)
  }

  const handleEdit = (account: any) => {
    setSelectedAccount(account)
    setMode("edit")
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    router.push("/accounts/create")
  }

  const handleAccountReconciliation = () => {
    router.push("/account-reconciliation")
  }

  const handleTreeNodeSelect = (node: TreeNode) => {
    setSelectedTreeNode(node)
    // If the node has a meta field with account data, open the drawer
    if (node.meta?.balance !== undefined) {
      const account = accounts.find((a) => a.id === node.id)
      if (account) {
        setSelectedAccount(account)
        setMode("view")
        setIsDrawerOpen(true)
      }
    }
  }

  const handleKanbanDragEnd = (result: any) => {
    if (!result.destination) return

    // We're not actually moving accounts between types, just demonstrating the functionality
    console.log("Drag ended:", result)
  }

  const handleKanbanItemClick = (item: KanbanItem) => {
    if (item.meta) {
      setSelectedAccount(item.meta)
      setMode("view")
      setIsDrawerOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chart of Accounts</h2>
          <p className="text-muted-foreground">Manage your company's financial accounts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreate} size="lg" className="flex gap-2">
            <Plus className="h-5 w-5" />
            <span>Add Account</span>
          </Button>
          <Button onClick={handleAccountReconciliation} variant="outline" size="lg" className="flex gap-2">
            <FileCheck className="h-5 w-5" />
            <span>Account Reconciliation</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>View and manage all financial accounts</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex gap-1"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </Button>
            <Button
              variant={viewMode === "tree" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("tree")}
              className="flex gap-1"
            >
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Tree</span>
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="flex gap-1"
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
                    placeholder="Search accounts..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-[200px]">
                  <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Liability">Liability</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Revenue">Revenue</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] whitespace-nowrap">Account #</TableHead>
                      <TableHead className="whitespace-nowrap">Account Name</TableHead>
                      <TableHead className="whitespace-nowrap">Type</TableHead>
                      <TableHead className="whitespace-nowrap">Subtype</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Balance (AED)</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium whitespace-nowrap">{account.id}</TableCell>
                        <TableCell className="whitespace-nowrap">{account.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{account.type}</TableCell>
                        <TableCell className="whitespace-nowrap">{account.subtype}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {account.balance.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={account.status === "Active" ? "success" : "secondary"}>
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleView(account)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(account)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
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
                {selectedTreeNode ? (
                  <div className="space-y-4 border rounded-lg p-6">
                    <h3 className="text-xl font-semibold">{selectedTreeNode.name}</h3>

                    {selectedTreeNode.meta?.balance !== undefined && (
                      <>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Current Balance</div>
                          <div className="mt-1 text-2xl font-bold">
                            AED {selectedTreeNode.meta.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        {selectedTreeNode.meta.description && (
                          <div className="rounded-lg border p-4">
                            <div className="text-sm font-medium text-muted-foreground">Description</div>
                            <div className="mt-1">{selectedTreeNode.meta.description}</div>
                          </div>
                        )}
                      </>
                    )}

                    {selectedTreeNode.children && selectedTreeNode.children.length > 0 && (
                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium text-muted-foreground">Sub-accounts</div>
                        <div className="mt-2">
                          <ul className="space-y-1">
                            {selectedTreeNode.children.map((child) => (
                              <li key={child.id} className="flex items-center justify-between">
                                <span>{child.name}</span>
                                {child.meta?.balance !== undefined && (
                                  <span className="font-medium">
                                    AED {child.meta.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground border rounded-lg">
                    Select an account from the tree to view its details
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === "kanban" && (
            <div className="mt-4">
              <Kanban columns={kanbanColumns} onDragEnd={handleKanbanDragEnd} onItemClick={handleKanbanItemClick} />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Click on any card to view account details. Drag cards to reorganize (for demonstration only).
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AccountDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} account={selectedAccount} mode={mode} />
    </div>
  )
}
