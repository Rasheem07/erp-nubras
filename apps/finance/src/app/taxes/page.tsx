"use client";

import { useState } from "react";
import { Button, KanbanColumn, TreeNode } from "@nubras/ui";
import { Input } from "@nubras/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nubras/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nubras/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nubras/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nubras/ui";
import { Badge } from "@nubras/ui";
import { Kanban } from "@nubras/ui";
import { TreeView } from "@nubras/ui";
import { TaxDrawer } from "@/components/tax-drawer";
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

// Mock data for taxes
const mockTaxes = [
  {
    id: "tax-001",
    name: "Value Added Tax (VAT)",
    type: "Sales Tax",
    rate: 5.0,
    frequency: "Monthly",
    nextDueDate: "2023-05-15",
    status: "Upcoming",
    lastFiled: "2023-04-15",
    amountDue: 12500.0,
    description: "Standard UAE VAT on goods and services",
  },
  {
    id: "tax-002",
    name: "Corporate Income Tax",
    type: "Income Tax",
    rate: 9.0,
    frequency: "Annually",
    nextDueDate: "2023-12-31",
    status: "Upcoming",
    lastFiled: "2022-12-31",
    amountDue: 45000.0,
    description: "UAE corporate income tax",
  },
  {
    id: "tax-003",
    name: "Employee Income Tax",
    type: "Withholding Tax",
    rate: 0.0,
    frequency: "Monthly",
    nextDueDate: "2023-05-10",
    status: "Upcoming",
    lastFiled: "2023-04-10",
    amountDue: 0.0,
    description: "UAE has no personal income tax",
  },
  {
    id: "tax-004",
    name: "Customs Duty",
    type: "Import Tax",
    rate: 5.0,
    frequency: "Per Import",
    nextDueDate: "2023-05-05",
    status: "Overdue",
    lastFiled: "2023-03-20",
    amountDue: 3750.0,
    description: "Standard GCC customs duty on imported goods",
  },
  {
    id: "tax-005",
    name: "Excise Tax",
    type: "Excise Tax",
    rate: 50.0,
    frequency: "Quarterly",
    nextDueDate: "2023-06-30",
    status: "Upcoming",
    lastFiled: "2023-03-31",
    amountDue: 8200.0,
    description: "Tax on specific goods like tobacco, energy drinks, etc.",
  },
  {
    id: "tax-006",
    name: "Municipality Fee",
    type: "Local Tax",
    rate: 10.0,
    frequency: "Annually",
    nextDueDate: "2023-08-15",
    status: "Upcoming",
    lastFiled: "2022-08-15",
    amountDue: 15000.0,
    description: "Local municipality fee for business operations",
  },
  {
    id: "tax-007",
    name: "Stamp Duty",
    type: "Transaction Tax",
    rate: 0.25,
    frequency: "Per Transaction",
    nextDueDate: "2023-04-30",
    status: "Filed",
    lastFiled: "2023-04-30",
    amountDue: 0.0,
    description: "Tax on legal documents and transactions",
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Filed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Filed":
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case "Upcoming":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "Overdue":
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

export default function TaxesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedTax, setSelectedTax] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Filter taxes based on search term, type filter, and status filter
  const filteredTaxes = mockTaxes.filter((tax) => {
    const matchesSearch =
      tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" ||
      tax.type.toLowerCase() === filterType.toLowerCase();

    const matchesStatus =
      filterStatus === "all" ||
      tax.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate totals
  const totalTaxDue = filteredTaxes.reduce(
    (sum, tax) => sum + tax.amountDue,
    0
  );

  const overdueTaxes = filteredTaxes
    .filter((tax) => tax.status === "Overdue")
    .reduce((sum, tax) => sum + tax.amountDue, 0);

  const upcomingTaxes = filteredTaxes
    .filter((tax) => tax.status === "Upcoming")
    .reduce((sum, tax) => sum + tax.amountDue, 0);

  // Transform data for tree view
  const treeNodes: TreeNode[] = [
    {
      id: "root-all-taxes",
      name: "All Taxes",
      children: [
        {
          id: "group-by-type",
          name: "By Type",
          children: Array.from(new Set(filteredTaxes.map((t) => t.type))).map(
            (type) => ({
              id: `type-${type}`,
              name: type,
              children: filteredTaxes
                .filter((t) => t.type === type)
                .map((t) => ({
                  id: t.id,
                  name: t.name,
                  meta: {
                    rate: `${t.rate}%`,
                    amount: `AED ${t.amountDue.toFixed(2)}`,
                    status: t.status,
                  },
                })),
            })
          ),
        },
        {
          id: "group-by-status",
          name: "By Status",
          children: Array.from(new Set(filteredTaxes.map((t) => t.status))).map(
            (status) => ({
              id: `status-${status}`,
              name: status,
              children: filteredTaxes
                .filter((t) => t.status === status)
                .map((t) => ({
                  id: t.id,
                  name: t.name,
                  meta: {
                    rate: `${t.rate}%`,
                    amount: `AED ${t.amountDue.toFixed(2)}`,
                    type: t.type,
                  },
                })),
            })
          ),
        },
      ],
    },
  ];
  // Transform data for kanban view
  const kanbanData = {
    columns: [
      {
        id: "filed",
        title: "Filed",
        cards: filteredTaxes
          .filter((tax) => tax.status === "Filed")
          .map((tax) => ({
            id: tax.id,
            title: tax.name,
            description: tax.description,
            tags: [`${tax.rate}%`, `AED ${tax.amountDue.toFixed(2)}`],
          })),
      },
      {
        id: "upcoming",
        title: "Upcoming",
        cards: filteredTaxes
          .filter((tax) => tax.status === "Upcoming")
          .map((tax) => ({
            id: tax.id,
            title: tax.name,
            description: tax.description,
            tags: [`${tax.rate}%`, `AED ${tax.amountDue.toFixed(2)}`],
          })),
      },
      {
        id: "overdue",
        title: "Overdue",
        cards: filteredTaxes
          .filter((tax) => tax.status === "Overdue")
          .map((tax) => ({
            id: tax.id,
            title: tax.name,
            description: tax.description,
            tags: [`${tax.rate}%`, `AED ${tax.amountDue.toFixed(2)}`],
          })),
      },
    ],
  };

  const kanbanColumns: KanbanColumn[] = kanbanData.columns.map((col) => ({
    id: col.id,
    title: col.title,
    items: col.cards.map((card) => ({
      id: card.id,
      // build the UI you want inside each card:
      content: (
        <div>
          <div className="font-medium">{card.title}</div>
          <div className="text-sm text-muted-foreground">
            {card.description}
          </div>
        </div>
      ),
      meta: { tags: card.tags },
    })),
  }));

  const handleTaxClick = (id: string) => {
    setSelectedTax(id);
    setDrawerOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tax Management</h1>
        <Button
          onClick={() => {
            setSelectedTax(null);
            setDrawerOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Tax
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Tax Summary</CardTitle>
            <CardDescription>Overview of your tax obligations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">
                  Total Tax Due
                </div>
                <div className="text-2xl font-bold mt-1">
                  AED {totalTaxDue.toFixed(2)}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">
                  Overdue Taxes
                </div>
                <div className="text-2xl font-bold mt-1">
                  AED {overdueTaxes.toFixed(2)}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">
                  Upcoming Taxes
                </div>
                <div className="text-2xl font-bold mt-1">
                  AED {upcomingTaxes.toFixed(2)}
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
                  placeholder="Search taxes..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
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
                  <SelectItem value="sales tax">Sales Tax</SelectItem>
                  <SelectItem value="income tax">Income Tax</SelectItem>
                  <SelectItem value="withholding tax">
                    Withholding Tax
                  </SelectItem>
                  <SelectItem value="import tax">Import Tax</SelectItem>
                  <SelectItem value="excise tax">Excise Tax</SelectItem>
                  <SelectItem value="local tax">Local Tax</SelectItem>
                  <SelectItem value="transaction tax">
                    Transaction Tax
                  </SelectItem>
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
                  <SelectItem value="filed">Filed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Due Date</TableHead>
                    <TableHead className="text-right">Amount Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTaxes.map((tax) => (
                    <TableRow
                      key={tax.id}
                      onClick={() => handleTaxClick(tax.id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">{tax.name}</TableCell>
                      <TableCell>{tax.type}</TableCell>
                      <TableCell className="text-right">{tax.rate}%</TableCell>
                      <TableCell>{tax.frequency}</TableCell>
                      <TableCell>{tax.nextDueDate}</TableCell>
                      <TableCell className="text-right">
                        AED {tax.amountDue.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tax.status} />
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
                              onClick={(e: any) => {
                                e.stopPropagation();
                                handleTaxClick(tax.id);
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e: any) => e.stopPropagation()}
                            >
                              File Tax Return
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e: any) => e.stopPropagation()}
                            >
                              Generate Report
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
                data={treeNodes}
                onNodeSelect={(id: any) => handleTaxClick(id)}
              />
            </div>
          )}

          {viewMode === "kanban" && (
            <Kanban
              columns={kanbanColumns}
              // required by DragDropContext even if you don't reorder yet:
              onDragEnd={() => {}}
              // rename your handler to match onItemClick signature:
              onItemClick={(item) => handleTaxClick(item.id)}
            />
          )}
        </div>
      </div>

      <TaxDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        taxId={selectedTax}
      />
    </div>
  );
}
