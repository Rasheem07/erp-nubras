"use client";

import { useState } from "react";
import Link from "next/link";
import { KanbanColumn } from "@/components/ui/kanban";
import {TreeNode} from "@/components/ui/tree-view"
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Filter,
  Plus,
  Search,
  Download,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { BankReconciliationDrawer } from "@/components/bank-reconciliation-drawer";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TreeView } from "@/components/ui/tree-view";
import { Kanban } from "@/components/ui/kanban";
import { Button } from "@/components/ui/button";

// Mock data for bank reconciliation
const mockReconciliations = [
  {
    id: "1",
    accountName: "Main Checking Account",
    bankBalance: 15420.75,
    bookBalance: 15320.75,
    difference: 100.0,
    lastReconciled: "2023-04-15",
    status: "In Progress",
    items: 12,
    matchedItems: 10,
  },
  {
    id: "2",
    accountName: "Savings Account",
    bankBalance: 45750.25,
    bookBalance: 45750.25,
    difference: 0.0,
    lastReconciled: "2023-04-01",
    status: "Completed",
    items: 5,
    matchedItems: 5,
  },
  {
    id: "3",
    accountName: "Business Credit Card",
    bankBalance: 2340.5,
    bookBalance: 2540.5,
    difference: -200.0,
    lastReconciled: "2023-03-28",
    status: "In Progress",
    items: 24,
    matchedItems: 20,
  },
  {
    id: "4",
    accountName: "Payroll Account",
    bankBalance: 8750.0,
    bookBalance: 8750.0,
    difference: 0.0,
    lastReconciled: "2023-03-15",
    status: "Completed",
    items: 8,
    matchedItems: 8,
  },
  {
    id: "5",
    accountName: "Tax Reserve Account",
    bankBalance: 12500.0,
    bookBalance: 12500.0,
    difference: 0.0,
    lastReconciled: "2023-03-10",
    status: "Completed",
    items: 3,
    matchedItems: 3,
  },
];

// Tree view data
const treeData = [
  {
    id: "checking",
    name: "Checking Accounts",
    children: [
      {
        id: "1",
        name: "Main Checking Account",
        meta: "In Progress • $100.00 difference",
      },
      {
        id: "4",
        name: "Payroll Account",
        meta: "Completed • $0.00 difference",
      },
    ],
  },
  {
    id: "savings",
    name: "Savings Accounts",
    children: [
      {
        id: "2",
        name: "Savings Account",
        meta: "Completed • $0.00 difference",
      },
      {
        id: "5",
        name: "Tax Reserve Account",
        meta: "Completed • $0.00 difference",
      },
    ],
  },
  {
    id: "credit",
    name: "Credit Accounts",
    children: [
      {
        id: "3",
        name: "Business Credit Card",
        meta: "In Progress • $200.00 difference",
      },
    ],
  },
];

// Kanban data
const kanbanData = {
  columns: [
    {
      id: "not-started",
      title: "Not Started",
      cards: [],
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [
        {
          id: "1",
          title: "Main Checking Account",
          description: "$100.00 difference",
          tags: ["12 items", "10 matched"],
        },
        {
          id: "3",
          title: "Business Credit Card",
          description: "$200.00 difference",
          tags: ["24 items", "20 matched"],
        },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      cards: [
        {
          id: "2",
          title: "Savings Account",
          description: "$0.00 difference",
          tags: ["5 items", "5 matched"],
        },
        {
          id: "4",
          title: "Payroll Account",
          description: "$0.00 difference",
          tags: ["8 items", "8 matched"],
        },
        {
          id: "5",
          title: "Tax Reserve Account",
          description: "$0.00 difference",
          tags: ["3 items", "3 matched"],
        },
      ],
    },
  ],
};

export default function BankReconciliationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReconciliation, setSelectedReconciliation] = useState<
    string | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  // Filter reconciliations based on search query and status
  const filteredReconciliations = mockReconciliations.filter(
    (reconciliation) => {
      const matchesSearch = reconciliation.accountName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "completed" &&
          reconciliation.status === "Completed") ||
        (selectedStatus === "in-progress" &&
          reconciliation.status === "In Progress");
      return matchesSearch && matchesStatus;
    }
  );

  const handleViewReconciliation = (id: string) => {
    if (id === "new") {
      window.location.href = "/bank-reconciliation/create";
      return;
    }
    setSelectedReconciliation(id);
    setIsDrawerOpen(true);
  };

  const treeNodes: TreeNode[] = [
    {
      id: "checking",
      name: "Checking Accounts",
      children: [
        {
          id: "1",
          name: "Main Checking Account",
          meta: { info: "In Progress • $100.00 difference" },
        },
        {
          id: "4",
          name: "Payroll Account",
          meta: { info: "Completed • $0.00 difference" },
        },
      ],
    },
    {
      id: "savings",
      name: "Savings Accounts",
      children: [
        {
          id: "2",
          name: "Savings Account",
          meta: { info: "Completed • $0.00 difference" },
        },
        {
          id: "5",
          name: "Tax Reserve Account",
          meta: { info: "Completed • $0.00 difference" },
        },
      ],
    },
    {
      id: "credit",
      name: "Credit Accounts",
      children: [
        {
          id: "3",
          name: "Business Credit Card",
          meta: { info: "In Progress • $200.00 difference" },
        },
      ],
    },
  ];

  const kanbanColumns: KanbanColumn[] = kanbanData.columns.map((col) => ({
    id: col.id,
    title: col.title,
    items: col.cards.map((c) => ({
      id: c.id,
      content: (
        <div>
          <div className="font-medium">{c.title}</div>
          <div className="text-sm text-muted-foreground">{c.description}</div>
          <div className="text-xs mt-1">{c.tags.join(", ")}</div>
        </div>
      ),
      meta: { tags: c.tags },
    })),
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bank Reconciliation
          </h1>
          <p className="text-muted-foreground">
            Reconcile your bank accounts with your accounting records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/bank-reconciliation/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Reconciliation
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="flex flex-wrap gap-2 pb-2">
        <Link href="/banking">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            <span>Banking</span>
          </Button>
        </Link>
        <Link href="/banking/import">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Import Statement</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search accounts..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            <Badge className="ml-1">{selectedStatus !== "all" ? 1 : 0}</Badge>
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table View</SelectItem>
              <SelectItem value="tree">Tree View</SelectItem>
              <SelectItem value="kanban">Kanban Board</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">to</span>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Account Type</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="checking">Checking</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {viewMode === "table" && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Bank Balance</TableHead>
                      <TableHead>Book Balance</TableHead>
                      <TableHead>Difference</TableHead>
                      <TableHead>Last Reconciled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReconciliations.map((reconciliation) => (
                      <TableRow key={reconciliation.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">
                          {reconciliation.accountName}
                        </TableCell>
                        <TableCell>
                          ${reconciliation.bankBalance.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${reconciliation.bookBalance.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={
                            reconciliation.difference !== 0
                              ? "text-destructive font-medium"
                              : "text-green-600 font-medium"
                          }
                        >
                          ${Math.abs(reconciliation.difference).toFixed(2)}
                          {reconciliation.difference !== 0 && (
                            <span>
                              {reconciliation.difference < 0
                                ? " short"
                                : " over"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{reconciliation.lastReconciled}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              reconciliation.status === "Completed"
                                ? "outline"
                                : "secondary"
                            }
                            className={
                              reconciliation.status === "Completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                          >
                            {reconciliation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reconciliation.matchedItems}/{reconciliation.items}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleViewReconciliation(reconciliation.id)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>
                                  Download Statement
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Mark as Complete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {viewMode === "tree" && (
            <Card>
              <CardContent className="p-6">
                <TreeView
                  data={treeNodes}
                  onNodeSelect={(node) => handleViewReconciliation(node.id)}
                />
              </CardContent>
            </Card>
          )}

          {viewMode === "kanban" && (
            <Kanban
              columns={kanbanColumns}
              onDragEnd={() => {}}
              onItemClick={(cardId: any) => handleViewReconciliation(cardId)}
            />
          )}
        </TabsContent>

        <TabsContent value="checking" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Checking Accounts</CardTitle>
              <CardDescription>
                View and reconcile your checking accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar content as "all" tab but filtered for checking accounts */}
              <p>Checking accounts reconciliation data would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Savings Accounts</CardTitle>
              <CardDescription>
                View and reconcile your savings accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar content as "all" tab but filtered for savings accounts */}
              <p>Savings accounts reconciliation data would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Credit Card Accounts</CardTitle>
              <CardDescription>
                View and reconcile your credit card accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar content as "all" tab but filtered for credit card accounts */}
              <p>Credit card accounts reconciliation data would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isDrawerOpen && (
        <BankReconciliationDrawer
          id={selectedReconciliation}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
}
