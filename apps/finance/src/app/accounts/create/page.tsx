"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, DollarSign, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function CreateAccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accNo: null,
    name: "",
    type: undefined,
    subType: undefined,
    balance: "0.00",
    enabled: true,
    description: "",
  });

  // Bank account specific fields
  const [isBankAccount, setIsBankAccount] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    branch: "",
    swiftCode: "",
    iban: "",
    accountType: "checking",
    createBankAccount: true,
  });

  useEffect(() => {
    // Check if this is a bank account based on subtype
    setIsBankAccount(formData.subType === "Bank Account");
  }, [formData.subType]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankSelectChange = (name: string, value: string) => {
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? true : false,
    }));
  };

  const handleBankSwitchChange = (name: string, checked: boolean) => {
    setBankDetails((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate bank details if this is a bank account
    if (isBankAccount && bankDetails.createBankAccount) {
      if (!bankDetails.bankName || !bankDetails.accountNumber) {
        toast.error("Missing required fields for bank", {
          position: "top-right",
        });
        return;
      }
    }
    const { accNo, ...rest } = formData;

    const payload = accNo != null ? { ...rest, accNo: Number(accNo) } : rest;

    const response = await fetch("http://localhost:5005/api/v1/accounts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    if (!response.ok) {
      toast.error(json.message, {
        position: "top-right",
      });
      return;
    }
    toast.success("Account created successfully", {
      position: "top-right",
    });

    router.push("/accounts");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create New Account
          </h2>
          <p className="text-muted-foreground">
            Add a new account to your chart of accounts
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Enter the details for the new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">Account Number (auto incremented if left blank)</Label>
                <Input
                  id="accNo"
                  name="accNo"
                  value={formData?.accNo || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.enabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("enabled", checked)
                    }
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    {formData.enabled ? "enabled" : "disabled"}
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Cash"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset">Asset</SelectItem>
                    <SelectItem value="liability">Liability</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subType">Account Subtype</Label>
                <Select
                  value={formData.subType}
                  onValueChange={(value) =>
                    handleSelectChange("subType", value)
                  }
                  required
                >
                  <SelectTrigger id="subType">
                    <SelectValue placeholder="Select subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Current Asset">Current Asset</SelectItem>
                    <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                    <SelectItem value="Bank Account">Bank Account</SelectItem>
                    <SelectItem value="Current Liability">
                      Current Liability
                    </SelectItem>
                    <SelectItem value="Long-term Liability">
                      Long-term Liability
                    </SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Operating Revenue">
                      Operating Revenue
                    </SelectItem>
                    <SelectItem value="Other Revenue">Other Revenue</SelectItem>
                    <SelectItem value="Cost of Sales">Cost of Sales</SelectItem>
                    <SelectItem value="Operating Expense">
                      Operating Expense
                    </SelectItem>
                    <SelectItem value="Other Expense">Other Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">Opening Balance (AED)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter account description"
                rows={3}
              />
            </div>

            {isBankAccount && (
              <>
                <Separator className="my-6" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">
                        Create Bank Account
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This will create a corresponding bank account in your
                        banking module
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="createBankAccount"
                        checked={bankDetails.createBankAccount}
                        onCheckedChange={(checked) =>
                          handleBankSwitchChange("createBankAccount", checked)
                        }
                      />
                      <span>
                        {bankDetails.createBankAccount ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  {bankDetails.createBankAccount && (
                    <div className="p-4 bg-muted rounded-md space-y-6">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Bank Account Required</AlertTitle>
                        <AlertDescription>
                          Since this is a bank account type, you must provide
                          bank details.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            name="bankName"
                            value={bankDetails.bankName}
                            onChange={handleBankDetailsChange}
                            placeholder="e.g., Emirates NBD"
                            required={
                              isBankAccount && bankDetails.createBankAccount
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            name="accountNumber"
                            value={bankDetails.accountNumber}
                            onChange={handleBankDetailsChange}
                            placeholder="e.g., 1234567890"
                            required={
                              isBankAccount && bankDetails.createBankAccount
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="branch">Branch</Label>
                          <Input
                            id="branch"
                            name="branch"
                            value={bankDetails.branch}
                            onChange={handleBankDetailsChange}
                            placeholder="e.g., Dubai Main Branch"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountType">Account Type</Label>
                          <Select
                            value={bankDetails.accountType}
                            onValueChange={(value) =>
                              handleBankSelectChange("accountType", value)
                            }
                          >
                            <SelectTrigger id="accountType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                              <SelectItem value="fixed-deposit">
                                Fixed Deposit
                              </SelectItem>
                              <SelectItem value="current">Current</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                          <Input
                            id="swiftCode"
                            name="swiftCode"
                            value={bankDetails.swiftCode}
                            onChange={handleBankDetailsChange}
                            placeholder="e.g., EBILAEAD"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="iban">IBAN</Label>
                          <Input
                            id="iban"
                            name="iban"
                            value={bankDetails.iban}
                            onChange={handleBankDetailsChange}
                            placeholder="e.g., AE123456789012345678901"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
