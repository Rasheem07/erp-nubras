"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FilterIcon,
  GridIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  FileText,
  FolderTree,
} from "lucide-react";
import { Button, KanbanColumn } from "@nubras/ui";
import { Card, CardContent } from "@nubras/ui";
import { Input } from "@nubras/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nubras/ui";
import { Badge } from "@nubras/ui";
import { Kanban } from "@nubras/ui";
import { ExpenseDrawer } from "@/components/expense-drawer";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// Sample expense data
const expenses = [
  {
    id: "1",
    title: "Office Supplies",
    amount: 125.5,
    date: new Date("2023-10-15"),
    category: "Office",
    status: "Approved",
    submittedBy: "John Doe",
    receipt: true,
    description: "Purchased stationery and printer ink for the office.",
    tags: ["Office", "Supplies"],
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    title: "Client Lunch",
    amount: 78.25,
    date: new Date("2023-10-12"),
    category: "Meals",
    status: "Pending",
    submittedBy: "Jane Smith",
    receipt: true,
    description:
      "Lunch meeting with potential client to discuss project requirements.",
    tags: ["Client", "Meals"],
    paymentMethod: "Cash",
  },
  {
    id: "3",
    title: "Software Subscription",
    amount: 49.99,
    date: new Date("2023-10-10"),
    category: "Software",
    status: "Approved",
    submittedBy: "Mike Johnson",
    receipt: true,
    description: "Monthly subscription for design software.",
    tags: ["Software", "Subscription"],
    paymentMethod: "Company Card",
  },
  {
    id: "4",
    title: "Travel Expenses",
    amount: 345.75,
    date: new Date("2023-10-08"),
    category: "Travel",
    status: "Rejected",
    submittedBy: "Sarah Williams",
    receipt: false,
    description: "Flight and taxi for client meeting in Boston.",
    tags: ["Travel", "Client"],
    paymentMethod: "Personal Card",
  },
  {
    id: "5",
    title: "Conference Registration",
    amount: 299.0,
    date: new Date("2023-10-05"),
    category: "Professional Development",
    status: "Approved",
    submittedBy: "Robert Brown",
    receipt: true,
    description: "Registration fee for industry conference.",
    tags: ["Conference", "Professional Development"],
    paymentMethod: "Company Card",
  },
  {
    id: "6",
    title: "Office Furniture",
    amount: 450.0,
    date: new Date("2023-10-03"),
    category: "Office",
    status: "Pending",
    submittedBy: "Emily Davis",
    receipt: true,
    description: "New ergonomic chair for workstation.",
    tags: ["Office", "Furniture"],
    paymentMethod: "Company Card",
  },
  {
    id: "7",
    title: "Internet Bill",
    amount: 89.99,
    date: new Date("2023-10-01"),
    category: "Utilities",
    status: "Approved",
    submittedBy: "David Wilson",
    receipt: true,
    description: "Monthly internet service for office.",
    tags: ["Utilities", "Internet"],
    paymentMethod: "Direct Debit",
  },
];

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "rejected":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export default function ExpensesPage() {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const router = useRouter();

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        expense.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesCategory =
        filterCategory === "all" ||
        expense.category.toLowerCase() === filterCategory.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.date.getTime() - a.date.getTime();
        case "date-asc":
          return a.date.getTime() - b.date.getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  // Prepare data for Kanban view
  const kanbanData = {
    columns: [
      {
        id: "pending",
        title: "Pending",
        items: filteredExpenses
          .filter((expense) => expense.status === "Pending")
          .map((expense) => ({
            id: expense.id,
            title: expense.title,
            content: (
              <div className="p-2">
                <div className="font-medium">{expense.title}</div>
                <div className="text-sm text-muted-foreground">
                  ${expense.amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(expense.date, "MMM d, yyyy")}
                </div>
                <div className="text-xs mt-1">{expense.submittedBy}</div>
                <div className="mt-2 flex gap-1">
                  {expense.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ),
          })),
      },
      {
        id: "approved",
        title: "Approved",
        items: filteredExpenses
          .filter((expense) => expense.status === "Approved")
          .map((expense) => ({
            id: expense.id,
            title: expense.title,
            content: (
              <div className="p-2">
                <div className="font-medium">{expense.title}</div>
                <div className="text-sm text-muted-foreground">
                  ${expense.amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(expense.date, "MMM d, yyyy")}
                </div>
                <div className="text-xs mt-1">{expense.submittedBy}</div>
                <div className="mt-2 flex gap-1">
                  {expense.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ),
          })),
      },
      {
        id: "rejected",
        title: "Rejected",
        items: filteredExpenses
          .filter((expense) => expense.status === "Rejected")
          .map((expense) => ({
            id: expense.id,
            title: expense.title,
            content: (
              <div className="p-2">
                <div className="font-medium">{expense.title}</div>
                <div className="text-sm text-muted-foreground">
                  ${expense.amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(expense.date, "MMM d, yyyy")}
                </div>
                <div className="text-xs mt-1">{expense.submittedBy}</div>
                <div className="mt-2 flex gap-1">
                  {expense.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ),
          })),
      },
    ],
  };

  const kanbanColumns: KanbanColumn[] = kanbanData.columns.map((col) => ({
    id: col.id,
    title: col.title,
    items: col.items.map((card) => ({
      id: card.id,
      content: card.content, // you already have the JSX in .content
    })),
  }));

  const handleExpenseClick = (expense: any) => {
    setSelectedExpense(expense);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedExpense(null);
  };

  // Get unique categories for filter
  const categories = Array.from(
    new Set(expenses.map((expense) => expense.category))
  );

  const handleCreateExpense = () => {
    router.push("/expenses/create");
  };

  const handleExpenseClaims = () => {
    router.push("/expense-claims");
  };

  const handleExpenseCategories = () => {
    router.push("/expense-categories");
  };

  return (
    <div className="flex flex-col space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track all company expenses
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleCreateExpense}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Expense
          </Button>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="flex flex-wrap gap-2 pb-2">
        <Link href="/expense-claims">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Expense Claims</span>
          </Button>
        </Link>
        <Link href="/expense-categories">
          <Button variant="outline" size="sm" className="gap-2">
            <FolderTree className="h-4 w-4" />
            <span>Categories</span>
          </Button>
        </Link>
        <Link href="/expenses/create">
          <Button variant="outline" size="sm" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            <span>Create Expense</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("approved")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                All Categories
              </DropdownMenuItem>
              {categories.map((category, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setFilterCategory(category.toLowerCase())}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontalIcon className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
                Date (Newest first)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
                Date (Oldest first)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("amount-desc")}>
                Amount (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("amount-asc")}>
                Amount (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title-asc")}>
                Title (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title-desc")}>
                Title (Z-A)
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() => setViewMode("table")}
          variant={viewMode === "table" ? "default" : "outline"}
          size="sm"
          className="gap-1"
        >
          <ListIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Table</span>
        </Button>
        <Button
          onClick={() => setViewMode("kanban")}
          variant={viewMode === "kanban" ? "default" : "outline"}
          size="sm"
          className="gap-1"
        >
          <GridIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Kanban</span>
        </Button>
      </div>

      {viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Title
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Amount
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Category
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Submitted By
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Receipt
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="h-24 text-center">
                        No expenses found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                        onClick={() => handleExpenseClick(expense)}
                      >
                        <td className="p-4 align-middle">{expense.title}</td>
                        <td className="p-4 align-middle">
                          ${expense.amount.toFixed(2)}
                        </td>
                        <td className="p-4 align-middle">
                          {format(expense.date, "MMM d, yyyy")}
                        </td>
                        <td className="p-4 align-middle">{expense.category}</td>
                        <td className="p-4 align-middle">
                          <Badge className={getStatusColor(expense.status)}>
                            {expense.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {expense.submittedBy}
                        </td>
                        <td className="p-4 align-middle">
                          {expense.receipt ? "Yes" : "No"}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-wrap gap-1">
                            {expense.tags.map((tag, index) => (
                              <Badge key={index} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Kanban
          columns={kanbanColumns}
          onDragEnd={() => {}}
          onItemClick={(item) => {
            const expense = expenses.find((e) => e.id === item.id);
            if (expense) handleExpenseClick(expense);
          }}
        />
      )}

      {/* Expense Drawer */}
      <ExpenseDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        expense={selectedExpense}
      />
    </div>
  );
}
