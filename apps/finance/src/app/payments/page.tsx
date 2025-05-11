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
import { Tabs, TabsList, TabsTrigger } from "@nubras/ui";
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
import { PaymentDrawer } from "@/components/payment-drawer";
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
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Banknote,
  Building,
} from "lucide-react";

// Mock data for payments
const mockPayments = [
  {
    id: "pay-001",
    date: "2023-04-28",
    reference: "PAY-2023-001",
    paymentMethod: "Bank Transfer",
    type: "outgoing",
    amount: 2500.0,
    currency: "AED",
    status: "Completed",
    payee: "XYZ Suppliers Ltd",
    description: "Payment for April inventory",
    category: "Inventory",
  },
  {
    id: "pay-002",
    date: "2023-04-25",
    reference: "PAY-2023-002",
    paymentMethod: "Credit Card",
    type: "outgoing",
    amount: 750.5,
    currency: "AED",
    status: "Completed",
    payee: "Dubai Utilities",
    description: "Electricity and water bill",
    category: "Utilities",
  },
  {
    id: "pay-003",
    date: "2023-04-22",
    reference: "PAY-2023-003",
    paymentMethod: "Cash",
    type: "outgoing",
    amount: 350.0,
    currency: "AED",
    status: "Completed",
    payee: "Office Supplies Store",
    description: "Office stationery and supplies",
    category: "Office Supplies",
  },
  {
    id: "pay-004",
    date: "2023-04-20",
    reference: "REC-2023-001",
    paymentMethod: "Bank Transfer",
    type: "incoming",
    amount: 5000.0,
    currency: "AED",
    status: "Completed",
    payee: "ABC Corporation",
    description: "Payment for Invoice #INV-2023-042",
    category: "Sales",
  },
  {
    id: "pay-005",
    date: "2023-04-18",
    reference: "REC-2023-002",
    paymentMethod: "Credit Card",
    type: "incoming",
    amount: 1200.0,
    currency: "AED",
    status: "Completed",
    payee: "Individual Customer",
    description: "Payment for Invoice #INV-2023-043",
    category: "Sales",
  },
  {
    id: "pay-006",
    date: "2023-04-15",
    reference: "PAY-2023-004",
    paymentMethod: "Bank Transfer",
    type: "outgoing",
    amount: 4500.0,
    currency: "AED",
    status: "Pending",
    payee: "Commercial Rent LLC",
    description: "Office rent for May 2023",
    category: "Rent",
  },
  {
    id: "pay-007",
    date: "2023-04-10",
    reference: "PAY-2023-005",
    paymentMethod: "Bank Transfer",
    type: "outgoing",
    amount: 3200.0,
    currency: "AED",
    status: "Failed",
    payee: "Marketing Agency",
    description: "Digital marketing campaign",
    category: "Marketing",
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case "Pending":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "Failed":
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

// Payment type badge component
const PaymentTypeBadge = ({ type }: { type: string }) => {
  return (
    <Badge
      className={`flex items-center ${
        type === "incoming"
          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
          : "bg-purple-100 text-purple-800 hover:bg-purple-100"
      }`}
    >
      {type === "incoming" ? (
        <ArrowDownLeft className="h-3.5 w-3.5 mr-1" />
      ) : (
        <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
      )}
      {type === "incoming" ? "Received" : "Sent"}
    </Badge>
  );
};

// Payment method icon component
const PaymentMethodIcon = ({ method }: { method: string }) => {
  switch (method) {
    case "Bank Transfer":
      return <Building className="h-4 w-4" />;
    case "Credit Card":
      return <CreditCard className="h-4 w-4" />;
    case "Cash":
      return <Banknote className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Filter payments based on search term, type filter, and status filter
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || payment.type === filterType;

    const matchesStatus =
      filterStatus === "all" ||
      payment.status.toLowerCase() === filterStatus.toLowerCase();

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "incoming" && payment.type === "incoming") ||
      (activeTab === "outgoing" && payment.type === "outgoing");

    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  // Calculate totals
  const totalIncoming = mockPayments
    .filter((p) => p.type === "incoming" && p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOutgoing = mockPayments
    .filter((p) => p.type === "outgoing" && p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const netCashflow = totalIncoming - totalOutgoing;

  // Transform data for tree view
  const treeData = {
    name: "All Payments",
    children: [
      {
        name: "Incoming Payments",
        children: filteredPayments
          .filter((p) => p.type === "incoming")
          .map((p) => ({
            name: p.payee,
            id: p.id,
            meta: {
              amount: `AED ${p.amount.toFixed(2)}`,
              date: p.date,
              status: p.status,
            },
          })),
      },
      {
        name: "Outgoing Payments",
        children: filteredPayments
          .filter((p) => p.type === "outgoing")
          .map((p) => ({
            name: p.payee,
            id: p.id,
            meta: {
              amount: `AED ${p.amount.toFixed(2)}`,
              date: p.date,
              status: p.status,
            },
          })),
      },
    ],
  };

  // Transform data for kanban view
  const kanbanData = {
    columns: [
      {
        id: "pending",
        title: "Pending",
        cards: filteredPayments
          .filter((p) => p.status === "Pending")
          .map((p) => ({
            id: p.id,
            title: p.payee,
            description: p.description,
            tags: [
              p.type === "incoming" ? "Received" : "Sent",
              `AED ${p.amount.toFixed(2)}`,
            ],
          })),
      },
      {
        id: "completed",
        title: "Completed",
        cards: filteredPayments
          .filter((p) => p.status === "Completed")
          .map((p) => ({
            id: p.id,
            title: p.payee,
            description: p.description,
            tags: [
              p.type === "incoming" ? "Received" : "Sent",
              `AED ${p.amount.toFixed(2)}`,
            ],
          })),
      },
      {
        id: "failed",
        title: "Failed",
        cards: filteredPayments
          .filter((p) => p.status === "Failed")
          .map((p) => ({
            id: p.id,
            title: p.payee,
            description: p.description,
            tags: [
              p.type === "incoming" ? "Received" : "Sent",
              `AED ${p.amount.toFixed(2)}`,
            ],
          })),
      },
    ],
  };

  // Turn your `cards` array into `items: KanbanItem[]`
  const kanbanColumns: KanbanColumn[] = kanbanData.columns.map((col) => ({
    id: col.id,
    title: col.title,
    items: col.cards.map((c) => ({
      id: c.id,
      content: (
        <div>
          <div className="font-medium">{c.title}</div>
          <div className="text-sm text-muted-foreground">{c.description}</div>
        </div>
      ),
      meta: { tags: c.tags },
    })),
  }));

  const treeNodes: TreeNode[] = [
    {
      id: "root-all-payments",
      name: "All Payments",
      children: [
        {
          id: "group-incoming",
          name: "Incoming Payments",
          children: filteredPayments
            .filter((p) => p.type === "incoming")
            .map((p) => ({
              id: p.id,
              name: p.payee,
              meta: {
                amount: `AED ${p.amount.toFixed(2)}`,
                date: p.date,
                status: p.status,
              },
            })),
        },
        {
          id: "group-outgoing",
          name: "Outgoing Payments",
          children: filteredPayments
            .filter((p) => p.type === "outgoing")
            .map((p) => ({
              id: p.id,
              name: p.payee,
              meta: {
                amount: `AED ${p.amount.toFixed(2)}`,
                date: p.date,
                status: p.status,
              },
            })),
        },
      ],
    },
  ];

  const handlePaymentClick = (id: string) => {
    setSelectedPayment(id);
    setDrawerOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Button
          onClick={() => {
            setSelectedPayment(null);
            setDrawerOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Payment
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>
              Overview of your payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">
                  Total Received
                </div>
                <div className="text-2xl font-bold mt-1">
                  AED {totalIncoming.toFixed(2)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">
                  Total Sent
                </div>
                <div className="text-2xl font-bold mt-1">
                  AED {totalOutgoing.toFixed(2)}
                </div>
              </div>
              <div
                className={`${
                  netCashflow >= 0 ? "bg-green-50" : "bg-red-50"
                } p-4 rounded-lg`}
              >
                <div
                  className={`text-sm ${
                    netCashflow >= 0 ? "text-green-600" : "text-red-600"
                  } font-medium`}
                >
                  Net Cashflow
                </div>
                <div
                  className={`text-2xl font-bold mt-1 ${
                    netCashflow >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  AED {netCashflow.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="incoming">Received</TabsTrigger>
            <TabsTrigger value="outgoing">Sent</TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search payments..."
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
                    <SelectItem value="incoming">Received</SelectItem>
                    <SelectItem value="outgoing">Sent</SelectItem>
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
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
              <div className="rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Payee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow
                        key={payment.id}
                        onClick={() => handlePaymentClick(payment.id)}
                        className="cursor-pointer"
                      >
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell className="font-medium">
                          {payment.payee}
                        </TableCell>
                        <TableCell>
                          <PaymentTypeBadge type={payment.type} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <PaymentMethodIcon method={payment.paymentMethod} />
                            <span>{payment.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            payment.type === "incoming"
                              ? "text-blue-600"
                              : "text-purple-600"
                          }`}
                        >
                          AED {payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status} />
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
                                  handlePaymentClick(payment.id);
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                              >
                                Print Receipt
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                              >
                                Download PDF
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
                  onNodeSelect={(id: any) => handlePaymentClick(id)}
                />
              </div>
            )}

            {viewMode === "kanban" && (
              <div className="border rounded-lg p-4">
                <Kanban
                  columns={kanbanColumns}
                  onDragEnd={() => {}}
                  onItemClick={(item) => handlePaymentClick(item.id)}
                />
              </div>
            )}
          </div>
        </Tabs>
      </div>

      <PaymentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        paymentId={selectedPayment}
      />
    </div>
  );
}
