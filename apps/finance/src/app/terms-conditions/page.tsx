"use client"

import type React from "react"

import { useState } from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Pencil, Trash, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Sample data for terms & conditions
const termsConditions = [
  {
    id: "TC-001",
    title: "Standard Terms",
    category: "Sales",
    content:
      "1. Payment is due within 30 days of invoice date.\n2. Late payments are subject to a 2% monthly interest charge.\n3. All goods remain the property of Nubras Tailoring until paid in full.\n4. Returns accepted within 14 days with original receipt.",
    isDefault: true,
    lastUpdated: "2023-03-15",
  },
  {
    id: "TC-002",
    title: "Custom Order Terms",
    category: "Sales",
    content:
      "1. 50% deposit required for all custom orders.\n2. Custom orders cannot be cancelled once production has begun.\n3. Delivery timeframes are estimates only.\n4. Customer is responsible for providing accurate measurements.",
    isDefault: false,
    lastUpdated: "2023-03-20",
  },
  {
    id: "TC-003",
    title: "Corporate Client Terms",
    category: "Sales",
    content:
      "1. Net 45 payment terms for approved corporate accounts.\n2. Minimum order quantities apply.\n3. Bulk discounts available for orders over AED 10,000.\n4. Free delivery for orders over AED 5,000.",
    isDefault: false,
    lastUpdated: "2023-04-01",
  },
  {
    id: "TC-004",
    title: "Supplier Terms",
    category: "Purchasing",
    content:
      "1. Payment will be made within 30 days of receipt of goods and invoice.\n2. Goods must match specifications exactly.\n3. Nubras Tailoring reserves the right to reject goods that do not meet quality standards.\n4. Delivery must be made during business hours.",
    isDefault: true,
    lastUpdated: "2023-03-10",
  },
  {
    id: "TC-005",
    title: "Employee Handbook Terms",
    category: "HR",
    content:
      "1. Employees must adhere to all company policies.\n2. Working hours are 9am to 6pm, Sunday to Thursday.\n3. Overtime must be approved in advance.\n4. Confidentiality of company information must be maintained at all times.",
    isDefault: true,
    lastUpdated: "2023-02-15",
  },
]

interface TermsConditionsDrawerProps {
  open: boolean
  onClose: () => void
  terms: any
  mode: "view" | "edit"
}

function TermsConditionsDrawer({ open, onClose, terms, mode: initialMode }: TermsConditionsDrawerProps) {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState(
    terms || {
      id: "",
      title: "",
      category: "",
      content: "",
      isDefault: false,
      lastUpdated: new Date().toISOString().split("T")[0],
    },
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">
            {mode === "view" ? "Terms & Conditions Details" : "Edit Terms & Conditions"}
          </SheetTitle>
          <SheetDescription>
            {mode === "view"
              ? "View terms and conditions details"
              : "Fill in the information below to update the terms and conditions"}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue={initialMode} onValueChange={(value) => setMode(value as "view" | "edit")}>
          <TabsList className="mb-6">
            <TabsTrigger value="view" disabled={!terms}>
              View
            </TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6">
            {terms && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{terms.title}</CardTitle>
                      {terms.isDefault && <Badge variant="default">Default</Badge>}
                    </div>
                    <CardDescription>
                      ID: {terms.id} | Category: {terms.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Content</p>
                      <div className="mt-2 whitespace-pre-line rounded-md border p-4 bg-muted/50">{terms.content}</div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-sm">{terms.lastUpdated}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={() => setMode("edit")}>Edit</Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="edit">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="e.g., TC-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Purchasing">Purchasing</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter terms and conditions content"
                  rows={10}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleCheckboxChange("isDefault", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isDefault">Set as default for this category</Label>
              </div>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

export default function TermsConditionsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedTerms, setSelectedTerms] = useState<any>(null)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const filteredTerms = termsConditions.filter((terms) => {
    const matchesSearch =
      terms.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      terms.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      terms.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || terms.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleView = (terms: any) => {
    setSelectedTerms(terms)
    setMode("view")
    setIsDrawerOpen(true)
  }

  const handleEdit = (terms: any) => {
    setSelectedTerms(terms)
    setMode("edit")
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    setSelectedTerms(null)
    setMode("edit")
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Terms & Conditions</h2>
          <p className="text-muted-foreground">Manage standard terms and conditions for various business activities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            <span>Create New</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Terms & Conditions</CardTitle>
          <CardDescription>View and manage your standard terms and conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search terms & conditions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Purchasing">Purchasing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] whitespace-nowrap">ID</TableHead>
                  <TableHead className="whitespace-nowrap">Title</TableHead>
                  <TableHead className="whitespace-nowrap">Category</TableHead>
                  <TableHead className="whitespace-nowrap">Last Updated</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTerms.map((terms) => (
                  <TableRow key={terms.id}>
                    <TableCell className="font-medium whitespace-nowrap">{terms.id}</TableCell>
                    <TableCell className="whitespace-nowrap">{terms.title}</TableCell>
                    <TableCell className="whitespace-nowrap">{terms.category}</TableCell>
                    <TableCell className="whitespace-nowrap">{terms.lastUpdated}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {terms.isDefault && <Badge variant="default">Default</Badge>}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(terms)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(terms)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TermsConditionsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        terms={selectedTerms}
        mode={mode}
      />
    </div>
  )
}
