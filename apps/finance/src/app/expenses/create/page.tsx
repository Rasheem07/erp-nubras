"use client"

import type { Resolver } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nubras/ui"
import { Button } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Label } from "@nubras/ui"
import { Textarea } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { Separator } from "@nubras/ui"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@nubras/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nubras/ui"
import { Switch } from "@nubras/ui"
import {
  ArrowLeftIcon,
  TrashIcon,
  UploadIcon,
  FileTextIcon,
  CalendarIcon,
  DollarSign,
  TagIcon,
  InfoIcon,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@nubras/ui"
import { Popover, PopoverContent, PopoverTrigger } from "@nubras/ui"
import { cn } from "@nubras/utils"
import { toast } from "@nubras/ui"

// 1) Define schema so that output = exactly your form type
const expenseFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  date: z.date({ required_error: "Please select a date" }),
  category: z.string({ required_error: "Please select a category" }),
  paymentMethod: z.string({ required_error: "Please select a payment method" }),

  // optional text fields
  description: z.string().optional(),
  tags:        z.string().optional(),
  notes:       z.string().optional(),
  vendor:      z.string().optional(),

  // **make these required booleans** — defaulting lives in defaultValues
  billable:       z.boolean(),
  recurring:      z.boolean(),
  taxDeductible:  z.boolean(),
  receiptRequired:z.boolean(),
})

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

// your defaultValues still lives here:
const defaultValues: Partial<ExpenseFormValues> = {
  title:           "",
  amount:          0,
  date:            new Date(),
  category:        "",
  paymentMethod:   "",
  description:     "",
  tags:            "",
  notes:           "",
  vendor:          "",
  billable:        false,
  recurring:       false,
  taxDeductible:   false,
  receiptRequired: true,
}
export default function CreateExpensePage() {
  const router = useRouter()
  const [attachments, setAttachments] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("details")

const form = useForm<ExpenseFormValues>({
  resolver: 
    zodResolver(expenseFormSchema) as Resolver<ExpenseFormValues, any, ExpenseFormValues>,
  defaultValues,
})


  // Handle form submission
  function onSubmit(data: ExpenseFormValues) {
    // In a real app, you would send this data to your API
    console.log("Form submitted:", data)

    // Show success toast
    toast({
      title: "Expense created",
      description: "Your expense has been successfully created.",
    })

    // Redirect to expenses list
    router.push("/expenses")
  }

  const handleCancel = () => {
    router.push("/expenses")
  }

  const handleAttachmentUpload = () => {
    // Simulate file upload
    setAttachments([...attachments, `Receipt-${attachments.length + 1}.jpg`])
  }

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  return (
    <div className="flex flex-col space-y-8 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-4" onClick={handleCancel}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Expense</h1>
            <p className="text-muted-foreground mt-2">Submit a new expense for approval</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" form="expense-form">
            Submit Expense
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form id="expense-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Basic Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Information</CardTitle>
                    <CardDescription>Enter the basic details about this expense</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expense Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter expense title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  className="pl-9"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="office">Office Supplies</SelectItem>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="meals">Meals & Entertainment</SelectItem>
                              <SelectItem value="software">Software & Subscriptions</SelectItem>
                              <SelectItem value="professional">Professional Development</SelectItem>
                              <SelectItem value="utilities">Utilities</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="credit-card">Credit Card</SelectItem>
                              <SelectItem value="company-card">Company Card</SelectItem>
                              <SelectItem value="personal-card">Personal Card</SelectItem>
                              <SelectItem value="direct-debit">Direct Debit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vendor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor/Merchant</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter vendor name" {...field} />
                          </FormControl>
                          <FormDescription>The name of the business or person you paid</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>Provide more context about this expense</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide details about this expense"
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <TagIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="e.g. client, project, department" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Separate tags with commas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="billable">Billable Expense</Label>
                          <p className="text-sm text-muted-foreground">Can this expense be billed to a client?</p>
                        </div>
                        <FormField
                          control={form.control}
                          name="billable"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="taxDeductible">Tax Deductible</Label>
                          <p className="text-sm text-muted-foreground">Is this expense tax deductible?</p>
                        </div>
                        <FormField
                          control={form.control}
                          name="taxDeductible"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receipts & Attachments</CardTitle>
                  <CardDescription>Upload receipts or supporting documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <UploadIcon className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-base text-muted-foreground">Drag and drop files here, or click to browse</p>
                    <Button variant="outline" className="mt-6 px-6" onClick={handleAttachmentUpload}>
                      Upload Files
                    </Button>
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-3 mt-6">
                      <Label className="text-base">Uploaded Files</Label>
                      <div className="space-y-3">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center">
                              <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                                <FileTextIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <span className="ml-3 text-base">{file}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveAttachment(index)}>
                              <TrashIcon className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Receipt Requirements</p>
                      <p className="text-sm text-muted-foreground">
                        Receipts are required for expenses over $25. Make sure they clearly show the date, vendor, and
                        amount.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="receiptRequired"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information about this expense"
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Options</CardTitle>
                  <CardDescription>Configure additional expense settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="recurring">Recurring Expense</Label>
                      <p className="text-sm text-muted-foreground">Does this expense repeat on a regular basis?</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="recurring"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("recurring") && (
                    <div className="rounded-md border p-4 mt-4">
                      <h3 className="font-medium mb-2">Recurring Schedule</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <Select defaultValue="monthly">
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Pick a date</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <InfoIcon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Approval Workflow</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Approval Required</Label>
                        <Select defaultValue="yes">
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Approver</Label>
                        <Select defaultValue="manager">
                          <SelectTrigger>
                            <SelectValue placeholder="Select approver" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manager">Department Manager</SelectItem>
                            <SelectItem value="finance">Finance Department</SelectItem>
                            <SelectItem value="custom">Custom Approver</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <InfoIcon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Accounting Details</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cost Center</Label>
                        <Select defaultValue="operations">
                          <SelectTrigger>
                            <SelectValue placeholder="Select cost center" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="admin">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>GL Account</Label>
                        <Select defaultValue="6000">
                          <SelectTrigger>
                            <SelectValue placeholder="Select GL account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6000">6000 - General Expenses</SelectItem>
                            <SelectItem value="6100">6100 - Office Supplies</SelectItem>
                            <SelectItem value="6200">6200 - Travel Expenses</SelectItem>
                            <SelectItem value="6300">6300 - Professional Services</SelectItem>
                            <SelectItem value="6400">6400 - Utilities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleCancel} size="lg">
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Submit Expense
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
