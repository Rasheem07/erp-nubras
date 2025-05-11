"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { financeService, type ExpenseCategory } from "@/lib/finance/finance-service"

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<ExpenseCategory | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultTaxRate: "",
    defaultGLAccount: "",
    isActive: true,
  })
  const [accounts, setAccounts] = useState<{ id: string; code: string; name: string }[]>([])
  const [taxRates, setTaxRates] = useState<{ id: string; name: string; rate: number }[]>([])

  // Load data
  useEffect(() => {
    // Load expense categories
    const loadedCategories = financeService.getExpenseCategories()
    setCategories(loadedCategories)

    // Load accounts for dropdown
    const loadedAccounts = financeService
      .getChartOfAccounts()
      .filter((account) => account.type === "Expense")
      .map((account) => ({
        id: account.id,
        code: account.code,
        name: account.name,
      }))
    setAccounts(loadedAccounts)

    // Load tax rates for dropdown
    const loadedTaxRates = financeService.getTaxRates().map((tax) => ({
      id: tax.id,
      name: tax.name,
      rate: tax.rate,
    }))
    setTaxRates(loadedTaxRates)
  }, [])

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle switch change
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      defaultTaxRate: "",
      defaultGLAccount: "",
      isActive: true,
    })
    setCurrentCategory(null)
  }

  // Open edit dialog
  const openEditDialog = (category: ExpenseCategory) => {
    setCurrentCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      defaultTaxRate: category.defaultTaxRate?.toString() || "",
      defaultGLAccount: category.defaultGLAccount || "",
      isActive: category.isActive,
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (category: ExpenseCategory) => {
    setCurrentCategory(category)
    setIsDeleteDialogOpen(true)
  }

  // Handle add category
  const handleAddCategory = () => {
    try {
      const newCategory = financeService.createExpenseCategory({
        name: formData.name,
        description: formData.description,
        defaultTaxRate: formData.defaultTaxRate ? Number.parseFloat(formData.defaultTaxRate) : undefined,
        defaultGLAccount: formData.defaultGLAccount || undefined,
        isActive: formData.isActive,
      })

      setCategories((prev) => [...prev, newCategory])
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to add category:", error)
      alert("Failed to add category. Please try again.")
    }
  }

  // Handle update category
  const handleUpdateCategory = () => {
    if (!currentCategory) return

    try {
      const updatedCategory = financeService.updateExpenseCategory(currentCategory.id, {
        name: formData.name,
        description: formData.description,
        defaultTaxRate: formData.defaultTaxRate ? Number.parseFloat(formData.defaultTaxRate) : undefined,
        defaultGLAccount: formData.defaultGLAccount || undefined,
        isActive: formData.isActive,
      })

      if (updatedCategory) {
        setCategories((prev) => prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
      }

      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to update category:", error)
      alert("Failed to update category. Please try again.")
    }
  }

  // Handle delete category
  const handleDeleteCategory = () => {
    if (!currentCategory) return

    // In a real app, you would call an API to delete the category
    // For now, we'll just filter it out from our local state
    setCategories((prev) => prev.filter((cat) => cat.id !== currentCategory.id))
    setIsDeleteDialogOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expense Categories</h2>
          <p className="text-muted-foreground">Manage expense categories for better expense tracking and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              resetForm()
              setIsAddDialogOpen(true)
            }}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>View and manage expense categories</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[300px]">Description</TableHead>
                  <TableHead>Default Tax Rate</TableHead>
                  <TableHead>Default GL Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No expense categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        {category.defaultTaxRate !== undefined ? `${category.defaultTaxRate}%` : "-"}
                      </TableCell>
                      <TableCell>{category.defaultGLAccount || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(category)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Expense Category</DialogTitle>
            <DialogDescription>Create a new expense category to organize and track expenses.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="defaultTaxRate" className="text-right">
                Default Tax Rate
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("defaultTaxRate", value)}
                value={formData.defaultTaxRate}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a tax rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {taxRates.map((tax) => (
                    <SelectItem key={tax.id} value={tax.rate.toString()}>
                      {tax.name} ({tax.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="defaultGLAccount" className="text-right">
                Default GL Account
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("defaultGLAccount", value)}
                value={formData.defaultGLAccount}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.code}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isActive">{formData.isActive ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Expense Category</DialogTitle>
            <DialogDescription>Update the expense category details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-defaultTaxRate" className="text-right">
                Default Tax Rate
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("defaultTaxRate", value)}
                value={formData.defaultTaxRate}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a tax rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {taxRates.map((tax) => (
                    <SelectItem key={tax.id} value={tax.rate.toString()}>
                      {tax.name} ({tax.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-defaultGLAccount" className="text-right">
                Default GL Account
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("defaultGLAccount", value)}
                value={formData.defaultGLAccount}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.code}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isActive" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="edit-isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="edit-isActive">{formData.isActive ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Expense Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentCategory && (
              <div className="border rounded-md p-4">
                <p className="font-medium">{currentCategory.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{currentCategory.description}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
