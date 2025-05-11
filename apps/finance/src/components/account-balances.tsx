"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const accounts = [
  {
    id: 1,
    name: "Operating Account",
    type: "Bank",
    balance: 15432.56,
    lastUpdated: "2023-04-20",
  },
  {
    id: 2,
    name: "Savings Account",
    type: "Bank",
    balance: 8342.55,
    lastUpdated: "2023-04-20",
  },
  {
    id: 3,
    name: "Petty Cash",
    type: "Cash",
    balance: 500.0,
    lastUpdated: "2023-04-19",
  },
  {
    id: 4,
    name: "Credit Card",
    type: "Credit Card",
    balance: -2500.0,
    lastUpdated: "2023-04-18",
  },
  {
    id: 5,
    name: "Investment Account",
    type: "Investment",
    balance: 10000.0,
    lastUpdated: "2023-04-15",
  },
]

export function AccountBalances() {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Balances</CardTitle>
        <CardDescription>Current balances across all accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Balance (AED)</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell className={`text-right ${account.balance < 0 ? "text-red-500" : ""}`}>
                    {account.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{account.lastUpdated}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="font-bold">
                  Total Balance
                </TableCell>
                <TableCell className={`text-right font-bold ${totalBalance < 0 ? "text-red-500" : ""}`}>
                  {totalBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
