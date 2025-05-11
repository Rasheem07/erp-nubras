"use client"

import { useState } from "react"
import { TreeView, type TreeNode } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CreditCard,
  Building,
  Wallet,
  DollarSign,
  Receipt,
  Landmark,
  Banknote,
  PiggyBank,
  ShoppingCart,
  Home,
  Car,
  Briefcase,
} from "lucide-react"

// Sample account structure data
const accountsData: TreeNode[] = [
  {
    id: "assets",
    name: "Assets",
    icon: <Wallet className="h-4 w-4 text-blue-500" />,
    children: [
      {
        id: "current-assets",
        name: "Current Assets",
        icon: <DollarSign className="h-4 w-4 text-blue-400" />,
        children: [
          {
            id: "cash",
            name: "Cash",
            icon: <Banknote className="h-4 w-4 text-blue-300" />,
            meta: { balance: 15000 },
          },
          {
            id: "accounts-receivable",
            name: "Accounts Receivable",
            icon: <Receipt className="h-4 w-4 text-blue-300" />,
            meta: { balance: 25000 },
          },
          {
            id: "inventory",
            name: "Inventory",
            icon: <ShoppingCart className="h-4 w-4 text-blue-300" />,
            meta: { balance: 35000 },
          },
        ],
      },
      {
        id: "fixed-assets",
        name: "Fixed Assets",
        icon: <Building className="h-4 w-4 text-blue-400" />,
        children: [
          {
            id: "equipment",
            name: "Equipment",
            icon: <Briefcase className="h-4 w-4 text-blue-300" />,
            meta: { balance: 50000 },
          },
          {
            id: "buildings",
            name: "Buildings",
            icon: <Home className="h-4 w-4 text-blue-300" />,
            meta: { balance: 120000 },
          },
          {
            id: "vehicles",
            name: "Vehicles",
            icon: <Car className="h-4 w-4 text-blue-300" />,
            meta: { balance: 35000 },
          },
        ],
      },
    ],
  },
  {
    id: "liabilities",
    name: "Liabilities",
    icon: <CreditCard className="h-4 w-4 text-red-500" />,
    children: [
      {
        id: "current-liabilities",
        name: "Current Liabilities",
        icon: <Receipt className="h-4 w-4 text-red-400" />,
        children: [
          {
            id: "accounts-payable",
            name: "Accounts Payable",
            icon: <Receipt className="h-4 w-4 text-red-300" />,
            meta: { balance: 18000 },
          },
        ],
      },
      {
        id: "long-term-liabilities",
        name: "Long-term Liabilities",
        icon: <Landmark className="h-4 w-4 text-red-400" />,
        children: [
          {
            id: "loans-payable",
            name: "Loans Payable",
            icon: <Landmark className="h-4 w-4 text-red-300" />,
            meta: { balance: 75000 },
          },
        ],
      },
    ],
  },
  {
    id: "equity",
    name: "Equity",
    icon: <PiggyBank className="h-4 w-4 text-green-500" />,
    children: [
      {
        id: "owners-equity",
        name: "Owner's Equity",
        icon: <PiggyBank className="h-4 w-4 text-green-400" />,
        meta: { balance: 100000 },
      },
    ],
  },
]

export default function AccountStructurePage() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)

  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account Structure</h2>
        <p className="text-muted-foreground">Hierarchical view of your chart of accounts</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Account Hierarchy</CardTitle>
            <CardDescription>Click on an account to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <TreeView data={accountsData} onNodeSelect={handleNodeSelect} defaultExpanded={false} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Information about the selected account</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {selectedNode.icon}
                  <h3 className="text-xl font-semibold">{selectedNode.name}</h3>
                </div>

                {selectedNode.meta?.balance !== undefined && (
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Current Balance</div>
                    <div className="mt-1 text-2xl font-bold">
                      AED {selectedNode.meta.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                )}

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Account ID</div>
                  <div className="mt-1">{selectedNode.id}</div>
                </div>

                {selectedNode.children && (
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Sub-accounts</div>
                    <div className="mt-2">
                      <ul className="space-y-1">
                        {selectedNode.children.map((child) => (
                          <li key={child.id} className="flex items-center gap-2">
                            {child.icon}
                            <span>{child.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                Select an account from the tree to view its details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
