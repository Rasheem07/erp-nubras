"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@nubras/ui"

export default function CreateBankAccountPage() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createCOA, setCreateCOA] = useState(true)
  const [accountType, setAccountType] = useState("")

  // COA fields
  const [coaAccountNumber, setCoaAccountNumber] = useState("")
  const [coaAccountName, setCoaAccountName] = useState("")
  const [coaSubtype, setCoaSubtype] = useState("Current Asset")

  const handleBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-update the COA account name when bank name changes
    if (createCOA) {
      setCoaAccountName(e.target.value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Success",
      description: createCOA
        ? "Bank account and Chart of Account entry created successfully"
        : "Bank account created successfully",
    })

    // Redirect back to banking page
    router.push("/finance/banking")
  }

  const handleCancel = () => {
    router.push("/finance/banking")
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Bank Account</h1>
          <p className="text-muted-foreground">Add a new bank account to your financial system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Enter the basic details of the bank account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="accountName" className="text-base">
                  Account Name
                </Label>
                <Input
                  id="accountName"
                  placeholder="e.g. Operating Account"
                  required
                  className="h-11"
                  onChange={handleBankNameChange}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="accountNumber" className="text-base">
                  Account Number
                </Label>
                <Input id="accountNumber" placeholder="Enter account number" required className="h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="bank" className="text-base">
                  Bank Name
                </Label>
                <Input id="bank" placeholder="e.g. Emirates NBD" required className="h-11" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="branch" className="text-base">
                  Branch
                </Label>
                <Input id="branch" placeholder="e.g. Dubai Main Branch" className="h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="accountType" className="text-base">
                  Account Type
                </Label>
                <Select onValueChange={setAccountType}>
                  <SelectTrigger id="accountType" className="h-11">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="fixed-deposit">Fixed Deposit</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="currency" className="text-base">
                  Currency
                </Label>
                <Select>
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

              <div className="space-y-3">
                <Label htmlFor="openingBalance" className="text-base">
                  Opening Balance
                </Label>
                <Input id="openingBalance" type="number" step="0.01" placeholder="0.00" className="h-11" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive" className="text-base">
                  Account Status
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                  <span>{isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chart of Accounts Integration</CardTitle>
            <CardDescription>Link this bank account to your chart of accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">Automatically create Chart of Accounts entry</h3>
                <p className="text-sm text-muted-foreground">
                  This will create a corresponding account in your Chart of Accounts
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="createCOA" checked={createCOA} onCheckedChange={setCreateCOA} />
                <span>{createCOA ? "Yes" : "No"}</span>
              </div>
            </div>

            {createCOA && (
              <div className="p-4 bg-muted rounded-md space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    This will create a new account in your Chart of Accounts with the details below.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="coaAccountNumber" className="text-base">
                      COA Account Number
                    </Label>
                    <Input
                      id="coaAccountNumber"
                      placeholder="e.g., 1010"
                      value={coaAccountNumber}
                      onChange={(e) => setCoaAccountNumber(e.target.value)}
                      required={createCOA}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="coaAccountName" className="text-base">
                      COA Account Name
                    </Label>
                    <Input
                      id="coaAccountName"
                      placeholder="e.g., Operating Account"
                      value={coaAccountName}
                      onChange={(e) => setCoaAccountName(e.target.value)}
                      required={createCOA}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="coaType" className="text-base">
                      Account Type
                    </Label>
                    <Select defaultValue="Asset" disabled>
                      <SelectTrigger id="coaType" className="h-11">
                        <SelectValue placeholder="Asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asset">Asset</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Bank accounts are always assets</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="coaSubtype" className="text-base">
                      Account Subtype
                    </Label>
                    <Select value={coaSubtype} onValueChange={setCoaSubtype}>
                      <SelectTrigger id="coaSubtype" className="h-11">
                        <SelectValue placeholder="Select subtype" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Current Asset">Current Asset</SelectItem>
                        <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>Provide more information about this account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this account"
                className="resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="swiftCode" className="text-base">
                  SWIFT/BIC Code
                </Label>
                <Input id="swiftCode" placeholder="e.g. EBILAEAD" className="h-11" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="iban" className="text-base">
                  IBAN
                </Label>
                <Input id="iban" placeholder="e.g. AE123456789012345678901" className="h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="contactPerson" className="text-base">
                  Bank Contact Person
                </Label>
                <Input id="contactPerson" placeholder="e.g. John Smith" className="h-11" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="contactNumber" className="text-base">
                  Contact Number
                </Label>
                <Input id="contactNumber" placeholder="e.g. +971 4 123 4567" className="h-11" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel} className="px-6">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-6">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Account"}
          </Button>
        </div>
      </form>
    </div>
  )
}
