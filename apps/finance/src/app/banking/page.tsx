"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import {
  Plus,
  Search,
  Eye,
  Pencil,
  List,
  Network,
  Trello,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  FileCheck,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { TreeView, type TreeNode } from "@nubras/ui"
import { Kanban, type KanbanColumn, type KanbanItem } from "@nubras/ui"
import { formatCurrency } from "@nubras/utils"
import { BankAccountDrawer } from "@/components/bank-account-drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nubras/ui"

// Sample data for bank accounts
const bankAccounts = [
  {
    id: "BA-001",
    accountName: "Operating Account",
    accountNumber: "1234567890",
    bank: "Emirates NBD",
    currency: "AED",
    balance: 125000.0,
    status: "Active",
    lastUpdated: "2023-04-20",
    type: "Checking",
    description: "Main operating account for business expenses",
  },
  {
    id: "BA-002",
    accountName: "Savings Account",
    accountNumber: "0987654321",
    bank: "Abu Dhabi Commercial Bank",
    currency: "AED",
    balance: 250000.0,
    status: "Active",
    lastUpdated: "2023-04-20",
    type: "Savings",
    description: "Reserve funds for future investments",
  },
  {
    id: "BA-003",
    accountName: "Payroll Account",
    accountNumber: "5678901234",
    bank: "Emirates NBD",
    currency: "AED",
    balance: 75000.0,
    status: "Active",
    lastUpdated: "2023-04-19",
    type: "Checking",
    description: "Account used for employee salary payments",
  },
  {
    id: "BA-004",
    accountName: "USD Account",
    accountNumber: "1122334455",
    bank: "HSBC",
    currency: "USD",
    balance: 50000.0,
    status: "Active",
    lastUpdated: "2023-04-18",
    type: "Checking",
    description: "Account for international transactions",
  },
  {
    id: "BA-005",
    accountName: "Fixed Deposit",
    accountNumber: "9876543210",
    bank: "Dubai Islamic Bank",
    currency: "AED",
    balance: 500000.0,
    status: "Inactive",
    lastUpdated: "2023-04-15",
    type: "Fixed Deposit",
    description: "12-month fixed deposit at 3.5% interest rate",
  },
]

// Sample data for transactions
const transactions = [
  {
    id: "TR-001",
    date: "2023-04-20",
    description: "Customer Payment - Dubai Fashion LLC",
    accountId: "BA-001",
    type: "Deposit",
    amount: 15000.0,
    reference: "INV-001",
    status: "Completed",
  },
  {
    id: "TR-002",
    date: "2023-04-19",
    description: "Rent Payment",
    accountId: "BA-001",
    type: "Withdrawal",
    amount: 8000.0,
    reference: "EXP-001",
    status: "Completed",
  },
  {
    id: "TR-003",
    date: "2023-04-18",
    description: "Supplier Payment - Fabric Wholesalers",
    accountId: "BA-001",
    type: "Withdrawal",
    amount: 12500.0,
    reference: "PO-005",
    status: "Completed",
  },
  {
    id: "TR-004",
    date: "2023-04-17",
    description: "Customer Payment - Al Ain Retail Group",
    accountId: "BA-001",
    type: "Deposit",
    amount: 25000.0,
    reference: "INV-002",
    status: "Completed",
  },
  {
    id: "TR-005",
    date: "2023-04-16",
    description: "Utility Bills",
    accountId: "BA-001",
    type: "Withdrawal",
    amount: 1500.0,
    reference: "EXP-002",
    status: "Completed",
  },
  {
    id: "TR-006",
    date: "2023-04-15",
    description: "Transfer to Savings",
    accountId: "BA-001",
    type: "Transfer",
    amount: 10000.0,
    reference: "TRF-001",
    status: "Completed",
  },
  {
    id: "TR-007",
    date: "2023-04-15",
    description: "Transfer from Operating Account",
    accountId: "BA-002",
    type: "Transfer",
    amount: 10000.0,
    reference: "TRF-001",
    status: "Completed",
  },
  {
    id: "TR-008",
    date: "2023-04-14",
    description: "Payroll Processing",
    accountId: "BA-003",
    type: "Withdrawal",
    amount: 35000.0,
    reference: "PAY-APR1",
    status: "Completed",
  },
  {
    id: "TR-009",
    date: "2023-04-13",
    description: "International Supplier Payment",
    accountId: "BA-004",
    type: "Withdrawal",
    amount: 5000.0,
    reference: "PO-006",
    status: "Completed",
  },
  {
    id: "TR-010",
    date: "2023-04-12",
    description: "Fixed Deposit Interest",
    accountId: "BA-005",
    type: "Deposit",
    amount: 1458.33,
    reference: "INT-APR",
    status: "Completed",
  },
]

// Tree view data
const generateTreeData = () => {
  const byBank: { [key: string]: any[] } = {}
  const byType: { [key: string]: any[] } = {}
  const byCurrency: { [key: string]: any[] } = {}

  // Group accounts by bank, type, and currency
  bankAccounts.forEach((account) => {
    if (!byBank[account.bank]) byBank[account.bank] = []
    byBank[account.bank].push(account)

    if (!byType[account.type]) byType[account.type] = []
    byType[account.type].push(account)

    if (!byCurrency[account.currency]) byCurrency[account.currency] = []
    byCurrency[account.currency].push(account)
  })

  const treeData: TreeNode[] = [
    {
      id: "by-bank",
      name: "By Bank",
      children: Object.keys(byBank).map((bank) => ({
        id: `bank-${bank}`,
        name: bank,
        children: byBank[bank].map((account) => ({
          id: account.id,
          name: `${account.accountName} (${account.accountNumber})`,
          meta: { account },
        })),
      })),
    },
    {
      id: "by-type",
      name: "By Account Type",
      children: Object.keys(byType).map((type) => ({
        id: `type-${type}`,
        name: type,
        children: byType[type].map((account) => ({
          id: account.id,
          name: `${account.accountName} (${account.accountNumber})`,
          meta: { account },
        })),
      })),
    },
    {
      id: "by-currency",
      name: "By Currency",
      children: Object.keys(byCurrency).map((currency) => ({
        id: `currency-${currency}`,
        name: currency,
        children: byCurrency[currency].map((account) => ({
          id: account.id,
          name: `${account.accountName} (${account.accountNumber})`,
          meta: { account },
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
      id: "checking",
      title: "Checking Accounts",
      items: bankAccounts
        .filter((account) => account.type === "Checking")
        .map((account) => ({
          id: account.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{account.accountName}</div>
              <div className="text-xs text-muted-foreground">{account.bank}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{account.currency}</Badge>
                <span className="font-semibold">{formatCurrency(account.balance)}</span>
              </div>
            </div>
          ),
          meta: account,
        })),
    },
    {
      id: "savings",
      title: "Savings Accounts",
      items: bankAccounts
        .filter((account) => account.type === "Savings")
        .map((account) => ({
          id: account.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{account.accountName}</div>
              <div className="text-xs text-muted-foreground">{account.bank}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{account.currency}</Badge>
                <span className="font-semibold">{formatCurrency(account.balance)}</span>
              </div>
            </div>
          ),
          meta: account,
        })),
    },
    {
      id: "fixed-deposit",
      title: "Fixed Deposits",
      items: bankAccounts
        .filter((account) => account.type === "Fixed Deposit")
        .map((account) => ({
          id: account.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{account.accountName}</div>
              <div className="text-xs text-muted-foreground">{account.bank}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{account.currency}</Badge>
                <span className="font-semibold">{formatCurrency(account.balance)}</span>
              </div>
            </div>
          ),
          meta: account,
        })),
    },
  ]

  return columns
}

export default function BankingPage() {
  const [activeTab, setActiveTab] = useState("accounts")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [searchTerm, setSearchTerm] = useState("")
  const [bankFilter, setBankFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"table" | "tree" | "kanban">("table")
  const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode | null>(null)
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(generateKanbanData())

  const router = useRouter()

  const filteredAccounts = bankAccounts.filter((account) => {
    const matchesSearch =
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.includes(searchTerm) ||
      account.bank.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBank = bankFilter === "All" || account.bank === bankFilter
    const matchesType = typeFilter === "All" || account.type === typeFilter

    return matchesSearch && matchesBank && matchesType
  })

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
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
    router.push("/banking/create")
  }

  const handleBankReconciliation = () => {
    router.push("/bank-reconciliation")
  }

  const handleImportStatement = () => {
    router.push("/banking/import")
  }

  const handleTreeNodeSelect = (node: TreeNode) => {
    setSelectedTreeNode(node)
    // If the node has a meta field with account data, open the drawer
    if (node.meta?.account) {
      setSelectedAccount(node.meta.account)
      setMode("view")
      setIsDrawerOpen(true)
    }
  }

  const handleKanbanDragEnd = (result: any) => {
    if (!result.destination) return

    // In a real app, this would update the account type based on the column it was moved to
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
          <h2 className="text-3xl font-bold tracking-tight">Banking</h2>
          <p className="text-muted-foreground">Manage your bank accounts and transactions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreate} size="lg" className="flex gap-2">
            <Plus className="h-5 w-5" />
            <span>Add Bank Account</span>
          </Button>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="flex flex-wrap gap-2 pb-2">
        <Link href="/bank-reconciliation">
          <Button variant="outline" size="sm" className="flex gap-2">
            <FileCheck className="h-4 w-4" />
            <span>Bank Reconciliation</span>
          </Button>
        </Link>
        <Link href="/bank-reconciliation/new">
          <Button variant="outline" size="sm" className="flex gap-2">
            <Plus className="h-4 w-4" />
            <span>New Reconciliation</span>
          </Button>
        </Link>
        <Link href="/banking/import">
          <Button variant="outline" size="sm" className="flex gap-2">
            <Upload className="h-4 w-4" />
            <span>Import Statement</span>
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>View and manage your bank accounts</CardDescription>
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
                      <Select value={bankFilter} onValueChange={setBankFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Banks</SelectItem>
                          <SelectItem value="Emirates NBD">Emirates NBD</SelectItem>
                          <SelectItem value="Abu Dhabi Commercial Bank">Abu Dhabi Commercial Bank</SelectItem>
                          <SelectItem value="HSBC">HSBC</SelectItem>
                          <SelectItem value="Dubai Islamic Bank">Dubai Islamic Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-[200px]">
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Types</SelectItem>
                          <SelectItem value="Checking">Checking</SelectItem>
                          <SelectItem value="Savings">Savings</SelectItem>
                          <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] whitespace-nowrap">
                            <div className="flex items-center">
                              ID
                              <ArrowUpDown className="ml-1 h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead className="whitespace-nowrap">Account Name</TableHead>
                          <TableHead className="whitespace-nowrap">Bank</TableHead>
                          <TableHead className="whitespace-nowrap">Account Number</TableHead>
                          <TableHead className="whitespace-nowrap">Type</TableHead>
                          <TableHead className="whitespace-nowrap">Currency</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Balance</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccounts.map((account) => (
                          <TableRow key={account.id}>
                            <TableCell className="font-medium whitespace-nowrap">{account.id}</TableCell>
                            <TableCell className="whitespace-nowrap">{account.accountName}</TableCell>
                            <TableCell className="whitespace-nowrap">{account.bank}</TableCell>
                            <TableCell className="whitespace-nowrap">{account.accountNumber}</TableCell>
                            <TableCell className="whitespace-nowrap">{account.type}</TableCell>
                            <TableCell className="whitespace-nowrap">{account.currency}</TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              {formatCurrency(account.balance)}
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
                    {selectedTreeNode?.meta?.account ? (
                      <div className="space-y-4 border rounded-lg p-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-semibold">{selectedTreeNode.meta.account.accountName}</h3>
                          <Badge variant={selectedTreeNode.meta.account.status === "Active" ? "success" : "secondary"}>
                            {selectedTreeNode.meta.account.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Bank</p>
                            <p className="text-lg">{selectedTreeNode.meta.account.bank}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                            <p className="text-lg">{selectedTreeNode.meta.account.accountNumber}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Type</p>
                            <p className="text-lg">{selectedTreeNode.meta.account.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Currency</p>
                            <p className="text-lg">{selectedTreeNode.meta.account.currency}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Balance</p>
                          <p className="text-2xl font-bold">{formatCurrency(selectedTreeNode.meta.account.balance)}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Description</p>
                          <p className="text-lg">{selectedTreeNode.meta.account.description}</p>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(selectedTreeNode.meta!.account)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(selectedTreeNode.meta!.account)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-[300px] items-center justify-center text-muted-foreground border rounded-lg">
                        Select a bank account from the tree to view its details
                      </div>
                    )}
                  </div>
                </div>
              )}

              {viewMode === "kanban" && (
                <div className="mt-4">
                  <Kanban columns={kanbanColumns} onDragEnd={handleKanbanDragEnd} onItemClick={handleKanbanItemClick} />
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    Click on any card to view account details. Drag cards between columns to change account type.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>View and manage your bank transactions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex gap-1">
                    <Upload className="h-4 w-4" />
                    <span>Import</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex gap-1">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex gap-1">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-[200px]">
                  <Select defaultValue="All">
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Accounts</SelectItem>
                      {bankAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select defaultValue="All">
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="Deposit">Deposit</SelectItem>
                      <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] whitespace-nowrap">
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Description</TableHead>
                      <TableHead className="whitespace-nowrap">Account</TableHead>
                      <TableHead className="whitespace-nowrap">Reference</TableHead>
                      <TableHead className="whitespace-nowrap">Type</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => {
                      const account = bankAccounts.find((a) => a.id === transaction.accountId)
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="whitespace-nowrap">{transaction.date}</TableCell>
                          <TableCell className="whitespace-nowrap">{transaction.description}</TableCell>
                          <TableCell className="whitespace-nowrap">{account?.accountName}</TableCell>
                          <TableCell className="whitespace-nowrap">{transaction.reference}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              variant={
                                transaction.type === "Deposit"
                                  ? "success"
                                  : transaction.type === "Withdrawal"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right whitespace-nowrap ${
                              transaction.type === "Deposit" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "Deposit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="secondary">{transaction.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BankAccountDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        account={selectedAccount}
        mode={mode}
      />
    </div>
  )
}
