"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const transactions = [
  {
    id: "INV-001",
    date: "2023-04-01",
    description: "Sales Invoice #001",
    amount: 1250.0,
    type: "income",
  },
  {
    id: "EXP-001",
    date: "2023-04-02",
    description: "Rent Payment",
    amount: 800.0,
    type: "expense",
  },
  {
    id: "INV-002",
    date: "2023-04-05",
    description: "Sales Invoice #002",
    amount: 750.0,
    type: "income",
  },
  {
    id: "EXP-002",
    date: "2023-04-10",
    description: "Utility Bills",
    amount: 150.0,
    type: "expense",
  },
  {
    id: "INV-003",
    date: "2023-04-15",
    description: "Sales Invoice #003",
    amount: 2000.0,
    type: "income",
  },
]

export function RecentTransactions() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-base whitespace-nowrap">ID</TableHead>
            <TableHead className="w-[120px] text-base whitespace-nowrap">Date</TableHead>
            <TableHead className="text-base whitespace-nowrap">Description</TableHead>
            <TableHead className="w-[120px] text-right text-base whitespace-nowrap">Amount</TableHead>
            <TableHead className="w-[100px] text-base whitespace-nowrap">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium text-base whitespace-nowrap">{transaction.id}</TableCell>
              <TableCell className="text-base whitespace-nowrap">{transaction.date}</TableCell>
              <TableCell className="text-base whitespace-nowrap">{transaction.description}</TableCell>
              <TableCell className="text-right text-base whitespace-nowrap">
                AED {transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge
                  variant={transaction.type === "income" ? "default" : "destructive"}
                  className="px-3 py-1 text-sm"
                >
                  {transaction.type === "income" ? "Income" : "Expense"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
