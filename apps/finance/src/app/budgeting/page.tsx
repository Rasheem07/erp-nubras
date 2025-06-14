"use client";

import { useState } from "react";
import {Button} from "@/components/ui/button"
import {  KanbanColumn } from "@/components/ui/kanban";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban } from "@/components/ui/kanban";
import { TreeView } from "@/components/ui/tree-view";
import { BudgetDrawer } from "@/components/budget-drawer";
import {
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock,
  LayoutGrid,
  List,
  Columns,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for budgets
const mockBudgets = [
  {
    id: "budget-001",
    name: "Q2 2023 Operating Budget",
    type: "Operating",
    period: "Quarterly",
    startDate: "2023-04-01",
    endDate: "2023-06-30",
    status: "Active",
    totalBudget: 250000.0,
    spent: 120000.0,
    remaining: 130000.0,
    percentUsed: 48,
    departments: ["Sales", "Marketing", "Operations", "Administration"],
  },
  {
    id: "budget-002",
    name: "2023 Capital Expenditure",
    type: "Capital",
    period: "Annual",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Active",
    totalBudget: 500000.0,
    spent: 175000.0,
    remaining: 325000.0,
    percentUsed: 35,
    departments: ["IT", "Facilities", "Equipment"],
  },
  {
    id: "budget-003",
    name: "Marketing Campaign - Summer 2023",
    type: "Project",
    period: "Custom",
    startDate: "2023-05-01",
    endDate: "2023-08-31",
    status: "Active",
    totalBudget: 75000.0,
    spent: 25000.0,
    remaining: 50000.0,
    percentUsed: 33,
    departments: ["Marketing"],
  },
  {
    id: "budget-004",
    name: "Q1 2023 Operating Budget",
    type: "Operating",
    period: "Quarterly",
    startDate: "2023-01-01",
    endDate: "2023-03-31",
    status: "Closed",
    totalBudget: 240000.0,
    spent: 235000.0,
    remaining: 5000.0,
    percentUsed: 98,
    departments: ["Sales", "Marketing", "Operations", "Administration"],
  },
  {
    id: "budget-005",
    name: "IT Infrastructure Upgrade",
    type: "Project",
    period: "Custom",
    startDate: "2023-02-15",
    endDate: "2023-06-30",
    status: "Active",
    totalBudget: 120000.0,
    spent: 95000.0,
    remaining: 25000.0,
    percentUsed: 79,
    departments: ["IT"],
  },
  {
    id: "budget-006",
    name: "2023 Staff Training",
    type: "Operating",
    period: "Annual",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Active",
    totalBudget: 50000.0,
    spent: 22000.0,
    remaining: 28000.0,
    percentUsed: 44,
    departments: ["HR", "All Departments"],
  },
  {
    id: "budget-007",
    name: "New Product Development",
    type: "Project",
    period: "Custom",
    startDate: "2023-03-01",
    endDate: "2023-09-30",
    status: "Draft",
    totalBudget: 180000.0,
    spent: 0.0,
    remaining: 180000.0,
    percentUsed: 0,
    departments: ["R&D", "Marketing", "Production"],
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Draft":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case "Draft":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "Closed":
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge className={`flex items-center ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
};

// Budget usage progress component
const BudgetProgress = ({ percentUsed }: { percentUsed: number }) => {
  const getProgressColor = (percent: number) => {
    if (percent < 50) return "bg-green-500";
    if (percent < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span>{percentUsed}% Used</span>
        <span>{100 - percentUsed}% Remaining</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getProgressColor(percentUsed)}`}
          style={{ width: `${percentUsed}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function BudgetingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  // Filter budgets based on search term, type filter, and status filter
  const filteredBudgets = mockBudgets.filter((budget) => {
    const matchesSearch =
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.departments.some((dept) =>
        dept.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType =
      filterType === "all" ||
      budget.type.toLowerCase() === filterType.toLowerCase();

    const matchesStatus =
      filterStatus === "all" ||
      budget.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate totals
  const totalBudgeted = filteredBudgets.reduce(
    (sum, budget) => sum + budget.totalBudget,
    0
  );

  const totalSpent = filteredBudgets.reduce(
    (sum, budget) => sum + budget.spent,
    0
  );

  const totalRemaining = filteredBudgets.reduce(
    (sum, budget) => sum + budget.remaining,
    0
  );

  // Transform data for tree view
  const treeData = [
    {
      id: "all-budgets",
      name: "All Budgets",
      children: [
        {
          id: "by-type",
          name: "By Type",
          children: Array.from(
            new Set(filteredBudgets.map((budget) => budget.type))
          ).map((type) => ({
            id: `type-${type}`,
            name: type,
            children: filteredBudgets
              .filter((budget) => budget.type === type)
              .map((budget) => ({
                id: budget.id,
                name: budget.name,
                meta: {
                  period: budget.period,
                  total: `AED ${budget.totalBudget.toFixed(2)}`,
                  status: budget.status,
                },
              })),
          })),
        },
        {
          id: "by-department",
          name: "By Department",
          children: Array.from(
            new Set(filteredBudgets.flatMap((budget) => budget.departments))
          ).map((dept) => ({
            id: `dept-${dept}`,
            name: dept,
            children: filteredBudgets
              .filter((budget) => budget.departments.includes(dept))
              .map((budget) => ({
                id: budget.id,
                name: budget.name,
                meta: {
                  period: budget.period,
                  total: `AED ${budget.totalBudget.toFixed(2)}`,
                  status: budget.status,
                },
              })),
          })),
        },
      ],
    },
  ];

  // Transform data for kanban view
  const kanbanData = {
    columns: [
      {
        id: "draft",
        title: "Draft",
        cards: filteredBudgets
          .filter((budget) => budget.status === "Draft")
          .map((budget) => ({
            id: budget.id,
            title: budget.name,
            description: `${budget.period}: ${budget.startDate} to ${budget.endDate}`,
            tags: [`AED ${budget.totalBudget.toFixed(2)}`, budget.type],
          })),
      },
      {
        id: "active",
        title: "Active",
        cards: filteredBudgets
          .filter((budget) => budget.status === "Active")
          .map((budget) => ({
            id: budget.id,
            title: budget.name,
            description: `${budget.period}: ${budget.startDate} to ${budget.endDate}`,
            tags: [`AED ${budget.totalBudget.toFixed(2)}`, budget.type],
          })),
      },
      {
        id: "closed",
        title: "Closed",
        cards: filteredBudgets
          .filter((budget) => budget.status === "Closed")
          .map((budget) => ({
            id: budget.id,
            title: budget.name,
            description: `${budget.period}: ${budget.startDate} to ${budget.endDate}`,
            tags: [`AED ${budget.totalBudget.toFixed(2)}`, budget.type],
          })),
      },
    ],
  };

  const kanbanColumns: KanbanColumn[] = kanbanData.columns.map((col) => ({
    id: col.id,
    title: col.title,
    items: col.cards.map((card) => ({
      id: card.id,
      content: (
        <div>
          <div className="font-medium">{card.title}</div>
          <div className="text-sm text-muted-foreground">
            {card.description}
          </div>
          <div className="text-xs mt-1">{card.tags.join(", ")}</div>
        </div>
      ),
      meta: { tags: card.tags },
    })),
  }));

  const handleBudgetClick = (node: any) => {
    // Only open the drawer if the node has an id that matches a budget id pattern
    if (node.id && node.id.startsWith("budget-")) {
      setSelectedBudget(node.id);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgeting</h1>
        <Button
          onClick={() => {
            router.push("/budgeting/create");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Budget
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription>
              Overview of your budget allocations and spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">
                  Total Budgeted
                </div>
                <div className="text-2xl font-bold mt-1">
                  AED {totalBudgeted.toFixed(2)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">
                  Total Spent
                </div>
                <div className="text-2xl font-bold mt-1">
                  AED {totalSpent.toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">
                  Total Remaining
                </div>
                <div className="text-2xl font-bold mt-1">
                  AED {totalRemaining.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search budgets..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="operating">Operating</SelectItem>
                  <SelectItem value="capital">Capital</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <div className="border rounded-md flex">
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "tree" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("tree")}
                >
                  <Columns className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("kanban")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {viewMode === "table" && (
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Budget Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Total Budget</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.map((budget) => (
                    <TableRow
                      key={budget.id}
                      onClick={() => handleBudgetClick(budget.id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {budget.name}
                      </TableCell>
                      <TableCell>{budget.type}</TableCell>
                      <TableCell>{budget.period}</TableCell>
                      <TableCell className="text-right">
                        AED {budget.totalBudget.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        AED {budget.spent.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        AED {budget.remaining.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <BudgetProgress percentUsed={budget.percentUsed} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={budget.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBudgetClick(budget.id);
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                            >
                              Budget Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                            >
                              Export to Excel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {viewMode === "tree" && (
            <div className="border rounded-lg p-4">
              <TreeView
                data={treeData}
                onNodeSelect={(id) => handleBudgetClick(id)}
              />
            </div>
          )}

          {viewMode === "kanban" && (
            <div className="border rounded-lg p-4">
              <Kanban
                columns={kanbanColumns}
                onDragEnd={() => {}}
                onItemClick={(id: any) => handleBudgetClick(id)}
              />
            </div>
          )}
        </div>
      </div>

      <BudgetDrawer
        open={drawerOpen}
        onOpenChange={() => setDrawerOpen(false)}
        budgetId={selectedBudget ?? undefined}
      />
    </div>
  );
}
