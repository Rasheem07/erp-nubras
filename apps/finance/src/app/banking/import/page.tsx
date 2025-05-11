"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@nubras/ui"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@nubras/ui"
import { Input } from "@nubras/ui"
import { Label } from "@nubras/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nubras/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nubras/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nubras/ui"
import { Checkbox } from "@nubras/ui"
import { Badge } from "@nubras/ui"
import { AlertCircle, Check, Download, FileSpreadsheet, FileText, HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@nubras/ui"
import { Progress } from "@nubras/ui"
import { financeService } from "@/lib/finance-service"

export default function BankStatementImportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedBank, setSelectedBank] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [mappingFields, setMappingFields] = useState({
    date: "",
    description: "",
    amount: "",
    type: "",
    reference: "",
  })
  const [matchedTransactions, setMatchedTransactions] = useState<any[]>([])
  const [unmatchedTransactions, setUnmatchedTransactions] = useState<any[]>([])
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [importStep, setImportStep] = useState(1)

  // Bank accounts from the finance service
  const bankAccounts = financeService
    .getChartOfAccounts()
    .filter((account) => account.type === "Asset" && account.subtype === "Current Asset")
    .map((account) => ({
      id: account.id,
      name: account.name,
    }))

  // Sample bank list
  const banks = [
    { id: "emirates-nbd", name: "Emirates NBD" },
    { id: "adcb", name: "Abu Dhabi Commercial Bank" },
    { id: "dib", name: "Dubai Islamic Bank" },
    { id: "hsbc", name: "HSBC" },
    { id: "other", name: "Other Bank" },
  ]

  // Sample CSV column options
  const csvColumns = [
    { value: "date", label: "Date" },
    { value: "description", label: "Description" },
    { value: "amount", label: "Amount" },
    { value: "debit", label: "Debit" },
    { value: "credit", label: "Credit" },
    { value: "balance", label: "Balance" },
    { value: "reference", label: "Reference" },
    { value: "type", label: "Transaction Type" },
  ]

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handle file upload
  const handleUpload = () => {
    if (!selectedFile || !selectedBank || !selectedAccount) {
      alert("Please select a bank, account, and file to upload")
      return
    }

    setIsUploading(true)

    // Simulate file upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        setUploadComplete(true)

        // Generate sample preview data
        const sampleData = generateSamplePreviewData()
        setPreviewData(sampleData)

        // Move to mapping step
        setImportStep(2)
      }
    }, 300)
  }

  // Generate sample preview data
  const generateSamplePreviewData = () => {
    return [
      { col1: "2023-04-15", col2: "PAYMENT RECEIVED - ABC CORP", col3: "15000.00", col4: "", col5: "INV-2023-042" },
      { col1: "2023-04-16", col2: "UTILITY PAYMENT - DEWA", col3: "", col4: "1500.00", col5: "UTIL-042023" },
      { col1: "2023-04-18", col2: "SALARY PAYMENT", col3: "", col4: "8500.00", col5: "SAL-042023" },
      { col1: "2023-04-20", col2: "CUSTOMER PAYMENT - XYZ LTD", col3: "5000.00", col4: "", col5: "INV-2023-043" },
      { col1: "2023-04-22", col2: "OFFICE SUPPLIES", col3: "", col4: "750.00", col5: "PO-2023-015" },
    ]
  }

  // Handle mapping fields
  const handleMapping = () => {
    // Validate all required fields are mapped
    if (!mappingFields.date || !mappingFields.description || !mappingFields.amount) {
      alert("Please map the required fields: Date, Description, and Amount")
      return
    }

    // In a real app, this would process the file with the mapping
    // For demo, generate sample matched/unmatched transactions
    const matched = [
      {
        id: "tr-001",
        date: "2023-04-15",
        description: "PAYMENT RECEIVED - ABC CORP",
        amount: 15000.0,
        type: "credit",
        reference: "INV-2023-042",
        matchedWith: "Invoice #INV-2023-042",
        confidence: 95,
      },
      {
        id: "tr-004",
        date: "2023-04-20",
        description: "CUSTOMER PAYMENT - XYZ LTD",
        amount: 5000.0,
        type: "credit",
        reference: "INV-2023-043",
        matchedWith: "Invoice #INV-2023-043",
        confidence: 90,
      },
    ]

    const unmatched = [
      {
        id: "tr-002",
        date: "2023-04-16",
        description: "UTILITY PAYMENT - DEWA",
        amount: -1500.0,
        type: "debit",
        reference: "UTIL-042023",
        possibleMatches: ["Utility Expense", "Office Expenses"],
      },
      {
        id: "tr-003",
        date: "2023-04-18",
        description: "SALARY PAYMENT",
        amount: -8500.0,
        type: "debit",
        reference: "SAL-042023",
        possibleMatches: ["Salary Expense", "Payroll"],
      },
      {
        id: "tr-005",
        date: "2023-04-22",
        description: "OFFICE SUPPLIES",
        amount: -750.0,
        type: "debit",
        reference: "PO-2023-015",
        possibleMatches: ["Office Supplies", "General Expenses"],
      },
    ]

    setMatchedTransactions(matched)
    setUnmatchedTransactions(unmatched)
    setImportStep(3)
  }

  // Handle transaction selection
  const handleTransactionSelect = (id: string) => {
    setSelectedTransactions((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle select all transactions
  const handleSelectAll = () => {
    if (selectedTransactions.length === unmatchedTransactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(unmatchedTransactions.map((t) => t.id))
    }
  }

  // Handle import completion
  const handleCompleteImport = () => {
    // In a real app, this would finalize the import process
    alert("Import completed successfully!")
    router.push("/banking")
  }

  // Download sample template
  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV template
    alert("Downloading sample template...")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Bank Statement</h1>
          <p className="text-muted-foreground">Import and reconcile your bank transactions</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="upload" disabled={importStep !== 1}>
            1. Upload Statement
          </TabsTrigger>
          <TabsTrigger value="map" disabled={importStep < 2}>
            2. Map Fields
          </TabsTrigger>
          <TabsTrigger value="reconcile" disabled={importStep < 3}>
            3. Reconcile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Bank Statement</CardTitle>
                <CardDescription>Upload your bank statement file to import transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Select Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload Statement File</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your CSV, OFX, or QFX file here, or click to browse
                    </p>
                    <Input
                      id="file"
                      type="file"
                      accept=".csv,.ofx,.qfx,.xlsx"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="file">Browse Files</label>
                    </Button>
                    {selectedFile && (
                      <div className="mt-4 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadComplete && (
                  <Alert variant="default">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Upload Complete</AlertTitle>
                    <AlertDescription>
                      Your file has been uploaded successfully. Please proceed to map the fields.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/banking")}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !selectedBank || !selectedAccount || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload & Continue"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Help & Instructions</CardTitle>
                <CardDescription>Learn how to prepare and import your bank statement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Supported File Formats
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We support CSV, OFX, QFX, and Excel (XLSX) file formats. Most banks allow you to export your
                    statements in one of these formats.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    How to Export from Your Bank
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Log in to your online banking portal, navigate to your account statements, and look for an "Export"
                    or "Download" option. Select CSV or OFX format if available.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Need a Sample Template?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    If you're preparing your own file, you can download our sample template to ensure the correct
                    format.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleDownloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important Note</AlertTitle>
                  <AlertDescription>
                    Make sure your file includes transaction dates, descriptions, and amounts at minimum. Additional
                    fields like reference numbers will improve matching accuracy.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Map Statement Fields</CardTitle>
              <CardDescription>Map the columns in your statement to the required fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column 1</TableHead>
                      <TableHead>Column 2</TableHead>
                      <TableHead>Column 3</TableHead>
                      <TableHead>Column 4</TableHead>
                      <TableHead>Column 5</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.col1}</TableCell>
                        <TableCell>{row.col2}</TableCell>
                        <TableCell>{row.col3}</TableCell>
                        <TableCell>{row.col4}</TableCell>
                        <TableCell>{row.col5}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-field" className="flex items-center">
                      Date Field <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      value={mappingFields.date}
                      onValueChange={(value) => setMappingFields((prev) => ({ ...prev, date: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="col1">Column 1</SelectItem>
                        <SelectItem value="col2">Column 2</SelectItem>
                        <SelectItem value="col3">Column 3</SelectItem>
                        <SelectItem value="col4">Column 4</SelectItem>
                        <SelectItem value="col5">Column 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description-field" className="flex items-center">
                      Description Field <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      value={mappingFields.description}
                      onValueChange={(value) => setMappingFields((prev) => ({ ...prev, description: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select description column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="col1">Column 1</SelectItem>
                        <SelectItem value="col2">Column 2</SelectItem>
                        <SelectItem value="col3">Column 3</SelectItem>
                        <SelectItem value="col4">Column 4</SelectItem>
                        <SelectItem value="col5">Column 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount-field" className="flex items-center">
                      Amount Field <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      value={mappingFields.amount}
                      onValueChange={(value) => setMappingFields((prev) => ({ ...prev, amount: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="col1">Column 1</SelectItem>
                        <SelectItem value="col2">Column 2</SelectItem>
                        <SelectItem value="col3">Column 3</SelectItem>
                        <SelectItem value="col4">Column 4</SelectItem>
                        <SelectItem value="col5">Column 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type-field">Transaction Type Field (Optional)</Label>
                    <Select
                      value={mappingFields.type}
                      onValueChange={(value) => setMappingFields((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not Available</SelectItem>
                        <SelectItem value="col1">Column 1</SelectItem>
                        <SelectItem value="col2">Column 2</SelectItem>
                        <SelectItem value="col3">Column 3</SelectItem>
                        <SelectItem value="col4">Column 4</SelectItem>
                        <SelectItem value="col5">Column 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference-field">Reference Field (Optional)</Label>
                    <Select
                      value={mappingFields.reference}
                      onValueChange={(value) => setMappingFields((prev) => ({ ...prev, reference: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reference column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not Available</SelectItem>
                        <SelectItem value="col1">Column 1</SelectItem>
                        <SelectItem value="col2">Column 2</SelectItem>
                        <SelectItem value="col3">Column 3</SelectItem>
                        <SelectItem value="col4">Column 4</SelectItem>
                        <SelectItem value="col5">Column 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Field Mapping Tips</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4 text-sm">
                        <li>Fields marked with * are required</li>
                        <li>If your file has separate debit and credit columns, map the primary one as "Amount"</li>
                        <li>Date formats will be automatically detected</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setImportStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleMapping}
                disabled={!mappingFields.date || !mappingFields.description || !mappingFields.amount}
              >
                Continue to Reconciliation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reconcile" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Matched Transactions</CardTitle>
                <CardDescription>
                  These transactions have been automatically matched to your accounting records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Matched With</TableHead>
                        <TableHead>Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchedTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No matched transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        matchedTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                              {transaction.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{transaction.reference}</TableCell>
                            <TableCell>{transaction.matchedWith}</TableCell>
                            <TableCell>
                              <Badge variant={transaction.confidence > 90 ? "success" : "secondary"}>
                                {transaction.confidence}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unmatched Transactions</CardTitle>
                <CardDescription>These transactions need to be manually categorized</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={
                              selectedTransactions.length === unmatchedTransactions.length &&
                              unmatchedTransactions.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Suggested Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unmatchedTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No unmatched transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        unmatchedTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedTransactions.includes(transaction.id)}
                                onCheckedChange={() => handleTransactionSelect(transaction.id)}
                              />
                            </TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                              {transaction.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{transaction.reference}</TableCell>
                            <TableCell>
                              <Select defaultValue="">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {transaction.possibleMatches.map((match: any, index: number) => (
                                    <SelectItem key={index} value={match}>
                                      {match}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="other">Other Category...</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {selectedTransactions.length} of {unmatchedTransactions.length} transactions selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Categorize Selected
                    </Button>
                    <Button variant="outline" size="sm">
                      Create Rules
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setImportStep(2)}>
              Back
            </Button>
            <Button onClick={handleCompleteImport}>Complete Import</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
