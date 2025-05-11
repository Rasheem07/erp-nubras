"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JournalEntryDrawer } from "@/components/journal-entry-drawer"
import { Plus, Search, Eye, Pencil, List, Network, Trello, ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TreeView, type TreeNode } from "@nubras/ui"
import { Kanban, type KanbanColumn, type KanbanItem } from "@nubras/ui"
import { formatCurrency } from "@nubras/utils"

// Sample data for journal entries
const journalEntries = [
  {
    id: "JE-001",
    date: "2023-04-01",
    reference: "INV-001",
    description: "Sales Invoice #001",
    status: "Posted",
    debitTotal: 1050.0,
    creditTotal: 1050.0,
    entries: [
      {
        account: "1100",
        debit: 1050.0,
        credit: 0,
      },
      {
        account: "4000",
        debit: 0,
        credit: 1000.0,
      },
      {
        account: "2200",
        debit: 0,
        credit: 50.0,
      },
    ],
    notes: "Recording sales invoice #001 to Dubai Fashion LLC",
  },
  {
    id: "JE-002",
    date: "2023-04-02",
    reference: "EXP-001",
    description: "Rent Payment",
    status: "Posted",
    debitTotal: 800.0,
    creditTotal: 800.0,
    entries: [
      {
        account: "6000",
        debit: 800.0,
        credit: 0,
      },
      {
        account: "1000",
        debit: 0,
        credit: 800.0,
      },
    ],
    notes: "Monthly rent payment for April 2023",
  },
  {
    id: "JE-003",
    date: "2023-04-05",
    reference: "INV-002",
    description: "Sales Invoice #002",
    status: "Posted",
    debitTotal: 2625.0,
    creditTotal: 2625.0,
    entries: [
      {
        account: "1100",
        debit: 2625.0,
        credit: 0,
      },
      {
        account: "4000",
        debit: 0,
        credit: 2500.0,
      },
      {
        account: "2200",
        debit: 0,
        credit: 125.0,
      },
    ],
    notes: "Recording sales invoice #002 to Al Ain Retail Group",
  },
  {
    id: "JE-004",
    date: "2023-04-10",
    reference: "EXP-002",
    description: "Utility Bills",
    status: "Posted",
    debitTotal: 150.0,
    creditTotal: 150.0,
    entries: [
      {
        account: "6100",
        debit: 150.0,
        credit: 0,
      },
      {
        account: "1000",
        debit: 0,
        credit: 150.0,
      },
    ],
    notes: "Payment for electricity and water bills",
  },
  {
    id: "JE-005",
    date: "2023-04-15",
    reference: "INV-003",
    description: "Sales Invoice #003",
    status: "Draft",
    debitTotal: 3360.0,
    creditTotal: 3360.0,
    entries: [
      {
        account: "1100",
        debit: 3360.0,
        credit: 0,
      },
      {
        account: "4000",
        debit: 0,
        credit: 3200.0,
      },
      {
        account: "2200",
        debit: 0,
        credit: 160.0,
      },
    ],
    notes: "Draft journal entry for sales invoice #003 to Sharjah Hotels Ltd",
  },
]

// Tree view data
const generateTreeData = () => {
  const months = ["January", "February", "March", "April", "May", "June"]
  const statusGroups = ["Posted", "Draft", "Rejected"]

  const byMonth: { [key: string]: any[] } = {}
  const byStatus: { [key: string]: any[] } = {}
  const byReference: { [key: string]: any[] } = {}

  // Group journal entries by month, status, and reference
  journalEntries.forEach((entry) => {
    const month = new Date(entry.date).toLocaleString("default", { month: "long" })

    if (!byMonth[month]) byMonth[month] = []
    byMonth[month].push(entry)

    if (!byStatus[entry.status]) byStatus[entry.status] = []
    byStatus[entry.status].push(entry)

    const refType = entry.reference.split("-")[0]
    if (!byReference[refType]) byReference[refType] = []
    byReference[refType].push(entry)
  })

  const treeData: TreeNode[] = [
    {
      id: "by-date",
      name: "By Date",
      children: Object.keys(byMonth).map((month) => ({
        id: `month-${month}`,
        name: month,
        children: byMonth[month].map((entry) => ({
          id: entry.id,
          name: `${entry.id} - ${entry.description}`,
          meta: { entry },
        })),
      })),
    },
    {
      id: "by-status",
      name: "By Status",
      children: statusGroups.map((status) => ({
        id: `status-${status}`,
        name: status,
        children: (byStatus[status] || []).map((entry) => ({
          id: entry.id,
          name: `${entry.id} - ${entry.description}`,
          meta: { entry },
        })),
      })),
    },
    {
      id: "by-reference",
      name: "By Reference Type",
      children: Object.keys(byReference).map((refType) => ({
        id: `ref-${refType}`,
        name: refType,
        children: byReference[refType].map((entry) => ({
          id: entry.id,
          name: `${entry.id} - ${entry.description}`,
          meta: { entry },
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
      items: journalEntries
        .filter((entry) => entry.status === "Draft")
        .map((entry) => ({
          id: entry.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{entry.id}</div>
              <div className="text-xs text-muted-foreground">{entry.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{entry.date}</Badge>
                <span className="font-semibold">{formatCurrency(entry.debitTotal)}</span>
              </div>
            </div>
          ),
          meta: entry,
        })),
    },
    {
      id: "posted",
      title: "Posted",
      items: journalEntries
        .filter((entry) => entry.status === "Posted")
        .map((entry) => ({
          id: entry.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{entry.id}</div>
              <div className="text-xs text-muted-foreground">{entry.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{entry.date}</Badge>
                <span className="font-semibold">{formatCurrency(entry.debitTotal)}</span>
              </div>
            </div>
          ),
          meta: entry,
        })),
    },
    {
      id: "rejected",
      title: "Rejected",
      items: journalEntries
        .filter((entry) => entry.status === "Rejected")
        .map((entry) => ({
          id: entry.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{entry.id}</div>
              <div className="text-xs text-muted-foreground">{entry.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{entry.date}</Badge>
                <span className="font-semibold">{formatCurrency(entry.debitTotal)}</span>
              </div>
            </div>
          ),
          meta: entry,
        })),
    },
  ]

  return columns
}

export default function JournalEntriesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"table" | "tree" | "kanban">("table")
  const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode | null>(null)
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(generateKanbanData())

  const router = useRouter()

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || entry.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleView = (entry: any) => {
    setSelectedEntry(entry)
    setMode("view")
    setIsDrawerOpen(true)
  }

  const handleEdit = (entry: any) => {
    setSelectedEntry(entry)
    setMode("edit")
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    router.push("/journal-entries/create")
  }

  const handleTreeNodeSelect = (node: TreeNode) => {
    setSelectedTreeNode(node)
    // If the node has a meta field with entry data, open the drawer
    if (node.meta?.entry) {
      setSelectedEntry(node.meta.entry)
      setMode("view")
      setIsDrawerOpen(true)
    }
  }

  const handleKanbanDragEnd = (result: any) => {
    if (!result.destination) return

    // In a real app, this would update the entry status based on the column it was moved to
    console.log("Drag ended:", result)
  }

  const handleKanbanItemClick = (item: KanbanItem) => {
    if (item.meta) {
      setSelectedEntry(item.meta)
      setMode("view")
      setIsDrawerOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Journal Entries</h2>
          <p className="text-muted-foreground">Manage your general ledger journal entries</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            <span>Create Journal Entry</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>All Journal Entries</CardTitle>
            <CardDescription>View and manage your general ledger journal entries</CardDescription>
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
                    placeholder="Search journal entries..."
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
                      <SelectItem value="Posted">Posted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
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
                          Entry #
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Reference</TableHead>
                      <TableHead className="whitespace-nowrap">Description</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Debit Total</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Credit Total</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium whitespace-nowrap">{entry.id}</TableCell>
                        <TableCell className="whitespace-nowrap">{entry.date}</TableCell>
                        <TableCell className="whitespace-nowrap">{entry.reference}</TableCell>
                        <TableCell className="whitespace-nowrap">{entry.description}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {formatCurrency(entry.debitTotal)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {formatCurrency(entry.creditTotal)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={entry.status === "Posted" ? "default" : "secondary"}>{entry.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleView(entry)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
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
                {selectedTreeNode?.meta?.entry ? (
                  <div className="space-y-4 border rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Journal Entry #{selectedTreeNode.meta.entry.id}</h3>
                      <Badge
                        variant={
                          selectedTreeNode.meta.entry.status === "Posted"
                            ? "default"
                            : selectedTreeNode.meta.entry.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {selectedTreeNode.meta.entry.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                        <p className="text-lg">{selectedTreeNode.meta.entry.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reference</p>
                        <p className="text-lg">{selectedTreeNode.meta.entry.reference}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-lg">{selectedTreeNode.meta.entry.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(selectedTreeNode.meta.entry.debitTotal)}</p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(selectedTreeNode.meta!.entry)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(selectedTreeNode.meta!.entry)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground border rounded-lg">
                    Select a journal entry from the tree to view its details
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === "kanban" && (
            <div className="mt-4">
              <Kanban columns={kanbanColumns} onDragEnd={handleKanbanDragEnd} onItemClick={handleKanbanItemClick} />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Click on any card to view journal entry details. Drag cards between columns to change status.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <JournalEntryDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entry={selectedEntry}
        mode={mode}
      />
    </div>
  )
}
