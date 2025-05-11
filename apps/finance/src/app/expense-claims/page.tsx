"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { Plus, Search, Eye, Pencil, List, Network, Trello, ArrowUpDown, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { TreeView, type TreeNode } from "@nubras/ui"
import { Kanban, type KanbanColumn, type KanbanItem } from "@nubras/ui"
import { formatCurrency } from "@nubras/utils"
import { ExpenseClaimDrawer } from "@/components/expense-claim-drawer"

// Sample data for expense claims
const expenseClaims = [
  {
    id: "EC-001",
    employee: "Ahmed Hassan",
    department: "Sales",
    date: "2023-04-01",
    total: 1250.0,
    status: "Approved",
    paymentStatus: "Paid",
    description: "Client meeting expenses",
    items: [
      {
        category: "Travel",
        description: "Taxi fare",
        amount: 150.0,
        date: "2023-03-28",
      },
      {
        category: "Meals",
        description: "Client lunch",
        amount: 450.0,
        date: "2023-03-28",
      },
      {
        category: "Accommodation",
        description: "Hotel stay",
        amount: 650.0,
        date: "2023-03-28",
      },
    ],
  },
  {
    id: "EC-002",
    employee: "Fatima Ali",
    department: "Marketing",
    date: "2023-04-05",
    total: 850.0,
    status: "Approved",
    paymentStatus: "Pending",
    description: "Marketing event expenses",
    items: [
      {
        category: "Supplies",
        description: "Promotional materials",
        amount: 550.0,
        date: "2023-04-02",
      },
      {
        category: "Travel",
        description: "Fuel reimbursement",
        amount: 100.0,
        date: "2023-04-02",
      },
      {
        category: "Meals",
        description: "Team lunch",
        amount: 200.0,
        date: "2023-04-02",
      },
    ],
  },
  {
    id: "EC-003",
    employee: "Mohammed Al Mansoori",
    department: "Operations",
    date: "2023-04-10",
    total: 2000.0,
    status: "Pending",
    paymentStatus: "Not Paid",
    description: "Equipment purchase",
    items: [
      {
        category: "Equipment",
        description: "Laptop accessories",
        amount: 1200.0,
        date: "2023-04-08",
      },
      {
        category: "Software",
        description: "Software licenses",
        amount: 800.0,
        date: "2023-04-08",
      },
    ],
  },
  {
    id: "EC-004",
    employee: "Sara Khan",
    department: "HR",
    date: "2023-04-15",
    total: 1500.0,
    status: "Rejected",
    paymentStatus: "Not Paid",
    description: "Training program expenses",
    items: [
      {
        category: "Training",
        description: "Workshop registration",
        amount: 1000.0,
        date: "2023-04-12",
      },
      {
        category: "Supplies",
        description: "Training materials",
        amount: 300.0,
        date: "2023-04-12",
      },
      {
        category: "Meals",
        description: "Catering for training",
        amount: 200.0,
        date: "2023-04-12",
      },
    ],
  },
  {
    id: "EC-005",
    employee: "Khalid Rahman",
    department: "IT",
    date: "2023-04-20",
    total: 3500.0,
    status: "Approved",
    paymentStatus: "Paid",
    description: "IT conference expenses",
    items: [
      {
        category: "Travel",
        description: "Flight tickets",
        amount: 2000.0,
        date: "2023-04-15",
      },
      {
        category: "Accommodation",
        description: "Hotel stay",
        amount: 1000.0,
        date: "2023-04-15",
      },
      {
        category: "Registration",
        description: "Conference registration",
        amount: 500.0,
        date: "2023-04-15",
      },
    ],
  },
]

// Tree view data
const generateTreeData = () => {
  const byDepartment: { [key: string]: any[] } = {}
  const byStatus: { [key: string]: any[] } = {}
  const byEmployee: { [key: string]: any[] } = {}

  // Group expense claims by department, status, and employee
  expenseClaims.forEach((claim) => {
    if (!byDepartment[claim.department]) byDepartment[claim.department] = []
    byDepartment[claim.department].push(claim)

    if (!byStatus[claim.status]) byStatus[claim.status] = []
    byStatus[claim.status].push(claim)

    if (!byEmployee[claim.employee]) byEmployee[claim.employee] = []
    byEmployee[claim.employee].push(claim)
  })

  const treeData: TreeNode[] = [
    {
      id: "by-department",
      name: "By Department",
      children: Object.keys(byDepartment).map((department) => ({
        id: `department-${department}`,
        name: department,
        children: byDepartment[department].map((claim) => ({
          id: claim.id,
          name: `${claim.id} - ${claim.description}`,
          meta: { claim },
        })),
      })),
    },
    {
      id: "by-status",
      name: "By Status",
      children: Object.keys(byStatus).map((status) => ({
        id: `status-${status}`,
        name: status,
        children: byStatus[status].map((claim) => ({
          id: claim.id,
          name: `${claim.id} - ${claim.description}`,
          meta: { claim },
        })),
      })),
    },
    {
      id: "by-employee",
      name: "By Employee",
      children: Object.keys(byEmployee).map((employee) => ({
        id: `employee-${employee}`,
        name: employee,
        children: byEmployee[employee].map((claim) => ({
          id: claim.id,
          name: `${claim.id} - ${claim.description}`,
          meta: { claim },
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
      id: "pending",
      title: "Pending",
      items: expenseClaims
        .filter((claim) => claim.status === "Pending")
        .map((claim) => ({
          id: claim.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{claim.id}</div>
              <div className="text-xs text-muted-foreground">{claim.employee}</div>
              <div className="text-xs text-muted-foreground">{claim.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{claim.department}</Badge>
                <span className="font-semibold">{formatCurrency(claim.total)}</span>
              </div>
            </div>
          ),
          meta: claim,
        })),
    },
    {
      id: "approved",
      title: "Approved",
      items: expenseClaims
        .filter((claim) => claim.status === "Approved")
        .map((claim) => ({
          id: claim.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{claim.id}</div>
              <div className="text-xs text-muted-foreground">{claim.employee}</div>
              <div className="text-xs text-muted-foreground">{claim.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{claim.department}</Badge>
                <span className="font-semibold">{formatCurrency(claim.total)}</span>
              </div>
            </div>
          ),
          meta: claim,
        })),
    },
    {
      id: "rejected",
      title: "Rejected",
      items: expenseClaims
        .filter((claim) => claim.status === "Rejected")
        .map((claim) => ({
          id: claim.id,
          content: (
            <div className="space-y-2">
              <div className="font-medium">{claim.id}</div>
              <div className="text-xs text-muted-foreground">{claim.employee}</div>
              <div className="text-xs text-muted-foreground">{claim.description}</div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{claim.department}</Badge>
                <span className="font-semibold">{formatCurrency(claim.total)}</span>
              </div>
            </div>
          ),
          meta: claim,
        })),
    },
  ]

  return columns
}

export default function ExpenseClaimsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"table" | "tree" | "kanban">("table")
  const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode | null>(null)
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(generateKanbanData())

  const router = useRouter()

  const filteredClaims = expenseClaims.filter((claim) => {
    const matchesSearch =
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "All" || claim.department === departmentFilter
    const matchesStatus = statusFilter === "All" || claim.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleView = (claim: any) => {
    setSelectedClaim(claim)
    setMode("view")
    setIsDrawerOpen(true)
  }

  const handleEdit = (claim: any) => {
    setSelectedClaim(claim)
    setMode("edit")
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    router.push("/expense-claims/create")
  }

  const handleTreeNodeSelect = (node: TreeNode) => {
    setSelectedTreeNode(node)
    // If the node has a meta field with claim data, open the drawer
    if (node.meta?.claim) {
      setSelectedClaim(node.meta.claim)
      setMode("view")
      setIsDrawerOpen(true)
    }
  }

  const handleKanbanDragEnd = (result: any) => {
    if (!result.destination) return

    // In a real app, this would update the claim status based on the column it was moved to
    console.log("Drag ended:", result)
  }

  const handleKanbanItemClick = (item: KanbanItem) => {
    if (item.meta) {
      setSelectedClaim(item.meta)
      setMode("view")
      setIsDrawerOpen(true)
    }
  }

  const handleApprove = (claim: any) => {
    // In a real app, this would update the claim status to Approved
    console.log("Approving claim:", claim.id)
  }

  const handleReject = (claim: any) => {
    // In a real app, this would update the claim status to Rejected
    console.log("Rejecting claim:", claim.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expense Claims</h2>
          <p className="text-muted-foreground">Manage employee expense claims</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            <span>Create Expense Claim</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>All Expense Claims</CardTitle>
            <CardDescription>View and manage employee expense claims</CardDescription>
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
                    placeholder="Search expense claims..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-[200px]">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Departments</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
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
                          ID
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Employee</TableHead>
                      <TableHead className="whitespace-nowrap">Department</TableHead>
                      <TableHead className="whitespace-nowrap">
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Description</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Total</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Payment</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium whitespace-nowrap">{claim.id}</TableCell>
                        <TableCell className="whitespace-nowrap">{claim.employee}</TableCell>
                        <TableCell className="whitespace-nowrap">{claim.department}</TableCell>
                        <TableCell className="whitespace-nowrap">{claim.date}</TableCell>
                        <TableCell className="whitespace-nowrap">{claim.description}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{formatCurrency(claim.total)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            variant={
                              claim.status === "Approved"
                                ? "success"
                                : claim.status === "Rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            variant={
                              claim.paymentStatus === "Paid"
                                ? "success"
                                : claim.paymentStatus === "Pending"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {claim.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleView(claim)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(claim)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            {claim.status === "Pending" && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleApprove(claim)}>
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleReject(claim)}>
                                  <X className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </>
                            )}
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
                {selectedTreeNode?.meta?.claim ? (
                  <div className="space-y-4 border rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Expense Claim #{selectedTreeNode.meta.claim.id}</h3>
                      <Badge
                        variant={
                          selectedTreeNode.meta.claim.status === "Approved"
                            ? "success"
                            : selectedTreeNode.meta.claim.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {selectedTreeNode.meta.claim.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Employee</p>
                        <p className="text-lg">{selectedTreeNode.meta.claim.employee}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Department</p>
                        <p className="text-lg">{selectedTreeNode.meta.claim.department}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                        <p className="text-lg">{selectedTreeNode.meta.claim.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                        <Badge
                          variant={
                            selectedTreeNode.meta.claim.paymentStatus === "Paid"
                              ? "success"
                              : selectedTreeNode.meta.claim.paymentStatus === "Pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {selectedTreeNode.meta.claim.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-lg">{selectedTreeNode.meta.claim.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(selectedTreeNode.meta.claim.total)}</p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(selectedTreeNode.meta!.claim)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(selectedTreeNode.meta!.claim)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      {selectedTreeNode.meta.claim.status === "Pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(selectedTreeNode.meta!.claim)}
                          >
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleReject(selectedTreeNode.meta!.claim)}>
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground border rounded-lg">
                    Select an expense claim from the tree to view its details
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === "kanban" && (
            <div className="mt-4">
              <Kanban columns={kanbanColumns} onDragEnd={handleKanbanDragEnd} onItemClick={handleKanbanItemClick} />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Click on any card to view expense claim details. Drag cards between columns to change status.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ExpenseClaimDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        claim={selectedClaim}
        mode={mode}
      />
    </div>
  )
}
