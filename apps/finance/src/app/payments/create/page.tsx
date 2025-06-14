"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Check,
  ChevronsUpDown,
  DollarSign,
  Save,
  X,
  FileText,
  Upload,
  Building,
  User,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Mock bank account data
const bankAccounts = [
  {
    id: "1",
    accountName: "Operating Account",
    accountNumber: "1234567890",
    bank: "Emirates NBD",
    branch: "Dubai Main Branch",
    balance: 25000.0,
    currency: "AED",
    status: "Active",
  },
  {
    id: "2",
    accountName: "Payroll Account",
    accountNumber: "0987654321",
    bank: "Abu Dhabi Commercial Bank",
    branch: "Abu Dhabi Main",
    balance: 15000.0,
    currency: "AED",
    status: "Active",
  },
  {
    id: "3",
    accountName: "USD Account",
    accountNumber: "5678901234",
    bank: "HSBC",
    branch: "Dubai International",
    balance: 10000.0,
    currency: "USD",
    status: "Active",
  },
]

// Mock vendor data
const vendors = [
  {
    id: "1",
    name: "Al Futtaim Textiles",
    type: "Supplier",
    contactPerson: "Ahmed Al Futtaim",
    email: "ahmed@alfuttaim.ae",
    phone: "+971 4 123 4567",
    balance: 5000.0,
  },
  {
    id: "2",
    name: "Dubai Fabric Suppliers",
    type: "Supplier",
    contactPerson: "Mohammed Al Zaabi",
    email: "mohammed@dubaifabric.ae",
    phone: "+971 4 234 5678",
    balance: 3500.0,
  },
  {
    id: "3",
    name: "Emirates Thread & Buttons",
    type: "Supplier",
    contactPerson: "Fatima Al Mansouri",
    email: "fatima@emiratesthread.ae",
    phone: "+971 4 345 6789",
    balance: 2000.0,
  },
  {
    id: "4",
    name: "Gulf Textile Industries",
    type: "Supplier",
    contactPerson: "Khalid Al Maktoum",
    email: "khalid@gulftextile.ae",
    phone: "+971 4 456 7890",
    balance: 7500.0,
  },
  {
    id: "5",
    name: "Luxury Garments LLC",
    type: "Customer",
    contactPerson: "Sara Al Hashimi",
    email: "sara@luxurygarments.ae",
    phone: "+971 4 567 8901",
    balance: -12000.0,
  },
  {
    id: "6",
    name: "Royal Fashion House",
    type: "Customer",
    contactPerson: "Abdullah Al Qasimi",
    email: "abdullah@royalfashion.ae",
    phone: "+971 4 678 9012",
    balance: -8500.0,
  },
]

// Mock employees for payroll
const employees = [
  {
    id: "1",
    name: "Aisha Al Suwaidi",
    position: "Senior Tailor",
    department: "Production",
    employeeId: "EMP-001",
    salary: 8000.0,
  },
  {
    id: "2",
    name: "Omar Al Farsi",
    position: "Pattern Designer",
    department: "Design",
    employeeId: "EMP-002",
    salary: 9500.0,
  },
  {
    id: "3",
    name: "Layla Al Shamsi",
    position: "Quality Control",
    department: "Production",
    employeeId: "EMP-003",
    salary: 7500.0,
  },
]

// Bank-related payment methods
const bankRelatedPaymentMethods = ["bank_transfer", "credit_card", "debit_card", "online", "check"]

export default function CreatePaymentPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedBankAccount, setSelectedBankAccount] = useState<string | null>(null)
  const [bankSelectorOpen, setBankSelectorOpen] = useState(false)
  const [vendorSelectorOpen, setVendorSelectorOpen] = useState(false)
  const [employeeSelectorOpen, setEmployeeSelectorOpen] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [paymentType, setPaymentType] = useState<string>("outgoing")
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [payeeType, setPayeeType] = useState<string>("vendor")
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [attachments, setAttachments] = useState<File[]>([])

  // Get the selected bank account details
  const selectedBank = bankAccounts.find((account) => account.id === selectedBankAccount)

  // Get the selected vendor details
  const selectedVendorDetails = vendors.find((vendor) => vendor.id === selectedVendor)

  // Get the selected employee details
  const selectedEmployeeDetails = employees.find((employee) => employee.id === selectedEmployee)

  // Check if payment method requires a bank account
  const requiresBankAccount = bankRelatedPaymentMethods.includes(paymentMethod)

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...fileArray])
    }
  }

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (requiresBankAccount && !selectedBankAccount) {
      toast.error("Please select a bank account")
      return
    }

    if (payeeType === "vendor" && !selectedVendor) {
      toast("Please select a vendor/customer")
      return
    }

    if (payeeType === "employee" && !selectedEmployee) {
      toast.error("Please select an employee")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Payment has been created successfully")

    router.push("/finance/payments")
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/finance/payments")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Payment</h1>
          <p className="text-muted-foreground">Record a new payment transaction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Payment Details</TabsTrigger>
            <TabsTrigger value="additional">Additional Information</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Enter the basic details of this payment transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Payment Type</Label>
                  <RadioGroup value={paymentType} onValueChange={setPaymentType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="outgoing" id="outgoing" />
                      <Label htmlFor="outgoing" className="flex items-center cursor-pointer">
                        <ArrowUpRight className="h-4 w-4 mr-1 text-red-500" />
                        Outgoing Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="incoming" id="incoming" />
                      <Label htmlFor="incoming" className="flex items-center cursor-pointer">
                        <ArrowDownLeft className="h-4 w-4 mr-1 text-green-500" />
                        Incoming Payment
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="paymentDate" className="text-base">
                      Payment Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-11",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="paymentMethod" className="text-base">
                      Payment Method
                    </Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="paymentMethod" className="h-11">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                        <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {requiresBankAccount && (
                  <div className="space-y-3">
                    <Label className="text-base">Bank Account</Label>
                    <Popover open={bankSelectorOpen} onOpenChange={setBankSelectorOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={bankSelectorOpen}
                          className="w-full justify-between h-11"
                        >
                          {selectedBank ? selectedBank.accountName : "Select bank account"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[800px] p-0">
                        <Command>
                          <CommandInput placeholder="Search bank accounts..." />
                          <CommandEmpty>No bank account found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[50px]"></TableHead>
                                      <TableHead>Account Name</TableHead>
                                      <TableHead>Account Number</TableHead>
                                      <TableHead>Bank</TableHead>
                                      <TableHead>Balance</TableHead>
                                      <TableHead>Currency</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {bankAccounts.map((account) => (
                                      <TableRow
                                        key={account.id}
                                        className={cn(
                                          "cursor-pointer hover:bg-accent",
                                          selectedBankAccount === account.id && "bg-accent",
                                        )}
                                        onClick={() => {
                                          setSelectedBankAccount(account.id)
                                          setBankSelectorOpen(false)
                                        }}
                                      >
                                        <TableCell>
                                          {selectedBankAccount === account.id && (
                                            <Check className="h-4 w-4 text-primary" />
                                          )}
                                        </TableCell>
                                        <TableCell className="font-medium">{account.accountName}</TableCell>
                                        <TableCell>{account.accountNumber}</TableCell>
                                        <TableCell>{account.bank}</TableCell>
                                        <TableCell>
                                          {account.currency} {account.balance.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{account.currency}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {selectedBank && (
                      <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                        <p>
                          <span className="font-medium">Selected Account:</span> {selectedBank.accountName}
                        </p>
                        <p>
                          <span className="font-medium">Bank:</span> {selectedBank.bank}
                        </p>
                        <p>
                          <span className="font-medium">Available Balance:</span> {selectedBank.currency}{" "}
                          {selectedBank.balance.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-base">Payee Type</Label>
                  <RadioGroup value={payeeType} onValueChange={setPayeeType} className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label htmlFor="vendor" className="flex items-center cursor-pointer">
                        <Building className="h-4 w-4 mr-1" />
                        Vendor/Customer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employee" id="employee" />
                      <Label htmlFor="employee" className="flex items-center cursor-pointer">
                        <User className="h-4 w-4 mr-1" />
                        Employee
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {payeeType === "vendor" && (
                  <div className="space-y-3">
                    <Label className="text-base">Vendor/Customer</Label>
                    <Popover open={vendorSelectorOpen} onOpenChange={setVendorSelectorOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={vendorSelectorOpen}
                          className="w-full justify-between h-11"
                        >
                          {selectedVendorDetails ? selectedVendorDetails.name : "Select vendor/customer"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[800px] p-0">
                        <Command>
                          <CommandInput placeholder="Search vendors and customers..." />
                          <CommandEmpty>No vendor or customer found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[50px]"></TableHead>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Contact Person</TableHead>
                                      <TableHead>Email</TableHead>
                                      <TableHead>Balance</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {vendors.map((vendor) => (
                                      <TableRow
                                        key={vendor.id}
                                        className={cn(
                                          "cursor-pointer hover:bg-accent",
                                          selectedVendor === vendor.id && "bg-accent",
                                        )}
                                        onClick={() => {
                                          setSelectedVendor(vendor.id)
                                          setVendorSelectorOpen(false)
                                        }}
                                      >
                                        <TableCell>
                                          {selectedVendor === vendor.id && <Check className="h-4 w-4 text-primary" />}
                                        </TableCell>
                                        <TableCell className="font-medium">{vendor.name}</TableCell>
                                        <TableCell>
                                          <Badge variant={vendor.type === "Supplier" ? "outline" : "secondary"}>
                                            {vendor.type}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>{vendor.contactPerson}</TableCell>
                                        <TableCell>{vendor.email}</TableCell>
                                        <TableCell className={vendor.balance < 0 ? "text-green-600" : "text-red-600"}>
                                          AED {Math.abs(vendor.balance).toFixed(2)}
                                          {vendor.balance < 0 ? " (Credit)" : " (Debit)"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {selectedVendorDetails && (
                      <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                        <p>
                          <span className="font-medium">Selected {selectedVendorDetails.type}:</span>{" "}
                          {selectedVendorDetails.name}
                        </p>
                        <p>
                          <span className="font-medium">Contact:</span> {selectedVendorDetails.contactPerson}
                        </p>
                        <p>
                          <span className="font-medium">Current Balance:</span> AED{" "}
                          {Math.abs(selectedVendorDetails.balance).toFixed(2)}
                          {selectedVendorDetails.balance < 0 ? " (Credit)" : " (Debit)"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {payeeType === "employee" && (
                  <div className="space-y-3">
                    <Label className="text-base">Employee</Label>
                    <Popover open={employeeSelectorOpen} onOpenChange={setEmployeeSelectorOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={employeeSelectorOpen}
                          className="w-full justify-between h-11"
                        >
                          {selectedEmployeeDetails ? selectedEmployeeDetails.name : "Select employee"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[800px] p-0">
                        <Command>
                          <CommandInput placeholder="Search employees..." />
                          <CommandEmpty>No employee found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[50px]"></TableHead>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Position</TableHead>
                                      <TableHead>Department</TableHead>
                                      <TableHead>Employee ID</TableHead>
                                      <TableHead>Salary</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {employees.map((employee) => (
                                      <TableRow
                                        key={employee.id}
                                        className={cn(
                                          "cursor-pointer hover:bg-accent",
                                          selectedEmployee === employee.id && "bg-accent",
                                        )}
                                        onClick={() => {
                                          setSelectedEmployee(employee.id)
                                          setEmployeeSelectorOpen(false)
                                        }}
                                      >
                                        <TableCell>
                                          {selectedEmployee === employee.id && (
                                            <Check className="h-4 w-4 text-primary" />
                                          )}
                                        </TableCell>
                                        <TableCell className="font-medium">{employee.name}</TableCell>
                                        <TableCell>{employee.position}</TableCell>
                                        <TableCell>{employee.department}</TableCell>
                                        <TableCell>{employee.employeeId}</TableCell>
                                        <TableCell>AED {employee.salary.toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {selectedEmployeeDetails && (
                      <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                        <p>
                          <span className="font-medium">Selected Employee:</span> {selectedEmployeeDetails.name}
                        </p>
                        <p>
                          <span className="font-medium">Position:</span> {selectedEmployeeDetails.position}
                        </p>
                        <p>
                          <span className="font-medium">Department:</span> {selectedEmployeeDetails.department}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {payeeType === "other" && (
                  <div className="space-y-3">
                    <Label htmlFor="otherPayee" className="text-base">
                      Payee Name
                    </Label>
                    <Input id="otherPayee" placeholder="Enter payee name" className="h-11" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-base">
                      Payment Amount
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="amount" type="number" step="0.01" placeholder="0.00" className="pl-10 h-11" required />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="currency" className="text-base">
                      Currency
                    </Label>
                    <Select defaultValue="AED">
                      <SelectTrigger id="currency" className="h-11">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="category" className="text-base">
                    Payment Category
                  </Label>
                  <Select>
                    <SelectTrigger id="category" className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Salaries">Salaries</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter additional details about this payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="reference" className="text-base">
                      Reference Number
                    </Label>
                    <Input id="reference" placeholder="e.g., INV-2023-001 or Check #1234" className="h-11" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="invoiceNumber" className="text-base">
                      Invoice Number
                    </Label>
                    <Input id="invoiceNumber" placeholder="e.g., INV-2023-001" className="h-11" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter payment details or notes"
                    className="resize-none"
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recurring" className="text-base cursor-pointer">
                      Recurring Payment
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                      <span>{isRecurring ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>

                {isRecurring && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted rounded-md">
                    <div className="space-y-3">
                      <Label htmlFor="frequency" className="text-base">
                        Frequency
                      </Label>
                      <Select>
                        <SelectTrigger id="frequency" className="h-11">
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

                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="text-base">
                        Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-11",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="occurrences" className="text-base">
                        Number of Occurrences
                      </Label>
                      <Input id="occurrences" type="number" min="1" placeholder="e.g., 12" className="h-11" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="paymentStatus" className="text-base">
                      Payment Status
                    </Label>
                    <Select defaultValue="completed">
                      <SelectTrigger id="paymentStatus" className="h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="paymentDate" className="text-base">
                      Cleared Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-11")}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Select date (optional)</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {paymentMethod === "check" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted rounded-md">
                    <div className="space-y-3">
                      <Label htmlFor="checkNumber" className="text-base">
                        Check Number
                      </Label>
                      <Input id="checkNumber" placeholder="e.g., 1001" className="h-11" />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="checkDate" className="text-base">
                        Check Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-11")}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Select date</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent mode="single" initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted rounded-md">
                    <div className="space-y-3">
                      <Label htmlFor="cardType" className="text-base">
                        Card Type
                      </Label>
                      <Select>
                        <SelectTrigger id="cardType" className="h-11">
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visa">Visa</SelectItem>
                          <SelectItem value="mastercard">Mastercard</SelectItem>
                          <SelectItem value="amex">American Express</SelectItem>
                          <SelectItem value="discover">Discover</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="lastFourDigits" className="text-base">
                        Last 4 Digits
                      </Label>
                      <Input
                        id="lastFourDigits"
                        placeholder="e.g., 1234"
                        className="h-11"
                        maxLength={4}
                        pattern="[0-9]{4}"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Upload supporting documents and add more details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="attachments" className="text-base">
                    Attachments
                  </Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <input type="file" id="file-upload" className="hidden" multiple onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                        <Button type="button" variant="outline" size="sm">
                          Browse Files
                        </Button>
                      </div>
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: PDF, JPG, PNG (Max size: 10MB)
                    </p>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-base">Uploaded Files</Label>
                      <div className="border rounded-md divide-y">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-blue-500 mr-2" />
                              <span>{file.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({(file.size / 1024).toFixed(2)} KB)
                              </span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="taxDeductible" className="text-base">
                      Tax Deductible
                    </Label>
                    <Select>
                      <SelectTrigger id="taxDeductible" className="h-11">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="partial">Partially</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="taxAmount" className="text-base">
                      Tax Amount
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="taxAmount" type="number" step="0.01" placeholder="0.00" className="pl-10 h-11" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="approvalStatus" className="text-base">
                      Approval Status
                    </Label>
                    <Select>
                      <SelectTrigger id="approvalStatus" className="h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="not_required">Not Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="approvedBy" className="text-base">
                      Approved By
                    </Label>
                    <Input id="approvedBy" placeholder="Name of approver" className="h-11" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tags" className="text-base">
                    Tags
                  </Label>
                  <Input id="tags" placeholder="Enter tags separated by commas" className="h-11" />
                  <p className="text-xs text-muted-foreground">
                    Tags help you categorize and filter payments (e.g., project-alpha, office-expenses)
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base">
                    Internal Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any internal notes or comments"
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/finance/payments")} className="px-6">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-6">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Payment"}
          </Button>
        </div>
      </form>
    </div>
  )
}
