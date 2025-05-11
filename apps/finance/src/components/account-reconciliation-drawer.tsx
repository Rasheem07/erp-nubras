"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CheckIcon, FileTextIcon, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@nubras/ui"

interface AccountReconciliationDrawerProps {
  open: boolean
  onClose: () => void
  reconciliation: any | null
}

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "in progress":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "pending":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export function AccountReconciliationDrawer({ open, onClose, reconciliation }: AccountReconciliationDrawerProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)

  if (!reconciliation) return null

  const handleComplete = () => {
    // Handle completion logic
    console.log("Reconciliation completed:", reconciliation.id)
    onClose()
  }

  const handleSave = () => {
    // Handle save logic
    console.log("Reconciliation saved:", reconciliation.id)
    setIsEditing(false)
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold">Account Reconciliation</SheetTitle>
          <SheetDescription>View and manage account reconciliation details</SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            {!isEditing ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{reconciliation.accountName}</h3>
                    <p className="text-muted-foreground text-sm">Reconciliation ID: {reconciliation.id}</p>
                  </div>
                  <Badge className={getStatusColor(reconciliation.status)}>{reconciliation.status}</Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Period</p>
                    <p className="font-medium">{reconciliation.period}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p>{format(reconciliation.startDate, "MMMM d, yyyy")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p>{format(reconciliation.endDate, "MMMM d, yyyy")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {reconciliation.assignedTo
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{reconciliation.assignedTo}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{reconciliation.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Book Balance</p>
                    <p className="font-medium">${reconciliation.bookBalance.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Statement Balance</p>
                    <p className="font-medium">${reconciliation.statementBalance.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Difference</p>
                    <p className={`font-medium ${reconciliation.difference === 0 ? "text-green-600" : "text-red-600"}`}>
                      ${reconciliation.difference.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Reconciled Items</p>
                    <p className="font-medium">
                      {reconciliation.reconciledItems} / {reconciliation.totalItems}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <div className="space-x-2">
                    {reconciliation.status === "In Progress" && (
                      <Button variant="default" onClick={handleComplete}>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Complete Reconciliation
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Reconciliation</CardTitle>
                  <CardDescription>Make changes to the reconciliation details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Account Name</label>
                      <Input defaultValue={reconciliation.accountName} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Period</label>
                      <Input defaultValue={reconciliation.period} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" defaultValue={format(reconciliation.startDate, "yyyy-MM-dd")} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <Input type="date" defaultValue={format(reconciliation.endDate, "yyyy-MM-dd")} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Book Balance</label>
                      <Input type="number" step="0.01" defaultValue={reconciliation.bookBalance} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Statement Balance</label>
                      <Input type="number" step="0.01" defaultValue={reconciliation.statementBalance} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assigned To</label>
                    <Select defaultValue={reconciliation.assignedTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="John Doe">John Doe</SelectItem>
                        <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                        <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                        <SelectItem value="Sarah Williams">Sarah Williams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea defaultValue={reconciliation.description} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Transactions</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50">
                  Reconciled: {reconciliation.reconciledItems}
                </Badge>
                <Badge variant="outline" className="bg-red-50">
                  Unreconciled: {reconciliation.totalItems - reconciliation.reconciledItems}
                </Badge>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Description</th>
                    <th className="text-right py-2 px-4">Amount</th>
                    <th className="text-center py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliation.transactions.map((transaction: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4">{format(transaction.date, "MMM d, yyyy")}</td>
                      <td className="py-2 px-4">{transaction.description}</td>
                      <td className={`py-2 px-4 text-right ${transaction.amount < 0 ? "text-red-600" : ""}`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {transaction.reconciled ? (
                          <Badge className="bg-green-100 text-green-800">Reconciled</Badge>
                        ) : (
                          <Badge variant="outline">Unreconciled</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reconciliation.status === "In Progress" && (
              <div className="flex justify-end pt-4">
                <Button>Reconcile Selected</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileTextIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Reconciliation started</p>
                  <p className="text-xs text-muted-foreground">
                    {format(reconciliation.startDate, "MMMM d, yyyy")} at 10:30 AM
                  </p>
                  <p className="text-sm">{reconciliation.assignedTo} started this reconciliation</p>
                </div>
              </div>

              {reconciliation.status === "Completed" && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Reconciliation completed</p>
                    <p className="text-xs text-muted-foreground">
                      {format(reconciliation.endDate, "MMMM d, yyyy")} at 2:15 PM
                    </p>
                    <p className="text-sm">{reconciliation.assignedTo} completed this reconciliation</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Reconciliation reviewed</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(reconciliation.endDate.getTime() + 86400000), "MMMM d, yyyy")} at 11:45 AM
                  </p>
                  <p className="text-sm">Finance Manager reviewed this reconciliation</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
