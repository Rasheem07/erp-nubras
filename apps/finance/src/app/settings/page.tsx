"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Shield,
  Bell,
  Users,
  Link2,
  CreditCard,
  Mail,
  Building,
  DollarSign,
  UserPlus,
  BellRing,
  Webhook,
  CreditCardIcon,
  FileCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { financeService } from "@/lib/finance/finance-service";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const accounts = financeService.getChartOfAccounts();
  const currencies = financeService.getCurrencies();
  const taxRates = financeService.getTaxRates();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your finance module settings and preferences
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your general finance module settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        Company Information
                      </CardTitle>
                      <CardDescription>
                        Update your company details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          defaultValue="Nubras Tailoring LLC"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
                        <Input id="tax-id" defaultValue="AE123456789" />
                      </div>
                      <Button variant="outline" className="w-full">
                        Update Company Information
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Fiscal Year</CardTitle>
                      <CardDescription>
                        Configure your fiscal year settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fiscal-start">Fiscal Year Start</Label>
                        <Select defaultValue="1">
                          <SelectTrigger id="fiscal-start">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fiscal-end">Fiscal Year End</Label>
                        <Select defaultValue="12">
                          <SelectTrigger id="fiscal-end">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">March</SelectItem>
                            <SelectItem value="6">June</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" className="w-full">
                        Update Fiscal Year
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        Number Formats
                      </CardTitle>
                      <CardDescription>
                        Configure number and date formats
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select defaultValue="dd/mm/yyyy">
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd/mm/yyyy">
                              DD/MM/YYYY
                            </SelectItem>
                            <SelectItem value="mm/dd/yyyy">
                              MM/DD/YYYY
                            </SelectItem>
                            <SelectItem value="yyyy-mm-dd">
                              YYYY-MM-DD
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number-format">Number Format</Label>
                        <Select defaultValue="comma">
                          <SelectTrigger id="number-format">
                            <SelectValue placeholder="Select number format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comma">1,234.56</SelectItem>
                            <SelectItem value="dot">1.234,56</SelectItem>
                            <SelectItem value="space">1 234,56</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" className="w-full">
                        Update Formats
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        Default Currency
                      </CardTitle>
                      <CardDescription>
                        Set your default currency
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="base-currency">Base Currency</Label>
                        <Select defaultValue="AED">
                          <SelectTrigger id="base-currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem
                                key={currency.code}
                                value={currency.code}
                              >
                                {currency.code} - {currency.name} (
                                {currency.symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-currency" defaultChecked />
                        <Label htmlFor="auto-currency">
                          Auto-update exchange rates
                        </Label>
                      </div>
                      <Button variant="outline" className="w-full">
                        Update Currency Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Default Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Accounts Configuration</CardTitle>
              <CardDescription>
                Configure default accounts for various transaction types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sales & Receivables</h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-ar">
                        Default Accounts Receivable
                      </Label>
                      <Select defaultValue="1100">
                        <SelectTrigger id="default-ar">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Asset")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-sales">
                        Default Sales Revenue
                      </Label>
                      <Select defaultValue="4000">
                        <SelectTrigger id="default-sales">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Revenue")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-sales-discount">
                        Sales Discount Account
                      </Label>
                      <Select defaultValue="4900">
                        <SelectTrigger id="default-sales-discount">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Revenue")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-sales-tax">
                        Sales Tax Payable
                      </Label>
                      <Select defaultValue="2200">
                        <SelectTrigger id="default-sales-tax">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Liability")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Purchases & Payables</h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-ap">
                        Default Accounts Payable
                      </Label>
                      <Select defaultValue="2000">
                        <SelectTrigger id="default-ap">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Liability")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-purchase">
                        Default Purchase Account
                      </Label>
                      <Select defaultValue="5000">
                        <SelectTrigger id="default-purchase">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Expense")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-purchase-discount">
                        Purchase Discount Account
                      </Label>
                      <Select defaultValue="5900">
                        <SelectTrigger id="default-purchase-discount">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Expense")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-purchase-tax">
                        Purchase Tax Receivable
                      </Label>
                      <Select defaultValue="1200">
                        <SelectTrigger id="default-purchase-tax">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Asset")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Banking & Cash</h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-cash">Default Cash Account</Label>
                      <Select defaultValue="1000">
                        <SelectTrigger id="default-cash">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter(
                              (account) =>
                                account.type === "Asset" &&
                                account.subtype === "Current Asset"
                            )
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-bank">Default Bank Account</Label>
                      <Select defaultValue="1010">
                        <SelectTrigger id="default-bank">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter(
                              (account) =>
                                account.type === "Asset" &&
                                account.subtype === "Current Asset"
                            )
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-credit-card">
                        Default Credit Card Account
                      </Label>
                      <Select defaultValue="2100">
                        <SelectTrigger id="default-credit-card">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Liability")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-undeposited">
                        Undeposited Funds Account
                      </Label>
                      <Select defaultValue="1050">
                        <SelectTrigger id="default-undeposited">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Asset")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payroll</h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-payroll-expense">
                        Payroll Expense Account
                      </Label>
                      <Select defaultValue="6000">
                        <SelectTrigger id="default-payroll-expense">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Expense")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-payroll-liability">
                        Payroll Liability Account
                      </Label>
                      <Select defaultValue="2300">
                        <SelectTrigger id="default-payroll-liability">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Liability")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Other Default Accounts
                  </h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-retained-earnings">
                        Retained Earnings
                      </Label>
                      <Select defaultValue="3900">
                        <SelectTrigger id="default-retained-earnings">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Equity")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-opening-balance">
                        Opening Balance Equity
                      </Label>
                      <Select defaultValue="3000">
                        <SelectTrigger id="default-opening-balance">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Equity")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-exchange-gain-loss">
                        Exchange Gain/Loss
                      </Label>
                      <Select defaultValue="7000">
                        <SelectTrigger id="default-exchange-gain-loss">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter(
                              (account) =>
                                account.type === "Expense" ||
                                account.type === "Revenue"
                            )
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-bad-debt">Bad Debt Expense</Label>
                      <Select defaultValue="6500">
                        <SelectTrigger id="default-bad-debt">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts
                            .filter((account) => account.type === "Expense")
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Default Account Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>
                Manage security settings for the finance module
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Access Control</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Require two-factor authentication for all finance
                          module users
                        </p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="session-timeout">Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out inactive users after a period of
                          time
                        </p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger
                          id="session-timeout"
                          className="w-[180px]"
                        >
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Transaction Security</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="approval-required">
                          Approval Required
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Require approval for transactions above a certain
                          amount
                        </p>
                      </div>
                      <Switch id="approval-required" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="approval-threshold">
                          Approval Threshold
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Transactions above this amount require approval
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">AED</span>
                        <Input
                          id="approval-threshold"
                          type="number"
                          defaultValue="5000"
                          className="w-[150px]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="audit-log">Audit Logging</Label>
                        <p className="text-sm text-muted-foreground">
                          Keep detailed logs of all financial transactions and
                          changes
                        </p>
                      </div>
                      <Switch id="audit-log" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Protection</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-encryption">Data Encryption</Label>
                        <p className="text-sm text-muted-foreground">
                          Encrypt sensitive financial data at rest
                        </p>
                      </div>
                      <Switch id="data-encryption" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="backup-frequency">
                          Backup Frequency
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          How often to back up financial data
                        </p>
                      </div>
                      <Select defaultValue="daily">
                        <SelectTrigger
                          id="backup-frequency"
                          className="w-[180px]"
                        >
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>
                Configure notifications for financial events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Transaction Notifications
                  </h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-invoice">New Invoices</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when new invoices are created
                        </p>
                      </div>
                      <Switch id="notify-invoice" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-payment">
                          Payments Received
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when payments are received
                        </p>
                      </div>
                      <Switch id="notify-payment" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-expense">New Expenses</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when new expenses are recorded
                        </p>
                      </div>
                      <Switch id="notify-expense" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alert Notifications</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-overdue">Overdue Invoices</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about overdue invoices
                        </p>
                      </div>
                      <Switch id="notify-overdue" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-low-balance">
                          Low Account Balance
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when account balance falls below
                          threshold
                        </p>
                      </div>
                      <Switch id="notify-low-balance" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="balance-threshold">
                          Balance Threshold
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when balance falls below this amount
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">AED</span>
                        <Input
                          id="balance-threshold"
                          type="number"
                          defaultValue="5000"
                          className="w-[150px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Delivery</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-email">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to email
                        </p>
                      </div>
                      <Switch id="notify-email" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-sms">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via SMS
                        </p>
                      </div>
                      <Switch id="notify-sms" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-app">In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Show notifications within the application
                        </p>
                      </div>
                      <Switch id="notify-app" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>User Management</CardTitle>
              </div>
              <CardDescription>
                Manage user access to the finance module
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Finance Module Users
                    </h3>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                  <Separator />
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b">
                      <div>User</div>
                      <div>Role</div>
                      <div>Access Level</div>
                      <div>Status</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {[
                        {
                          name: "Ahmed Hassan",
                          email: "ahmed@example.com",
                          role: "Finance Manager",
                          access: "Full Access",
                          status: "Active",
                        },
                        {
                          name: "Fatima Ali",
                          email: "fatima@example.com",
                          role: "Accountant",
                          access: "Edit",
                          status: "Active",
                        },
                        {
                          name: "Mohammed Khalid",
                          email: "mohammed@example.com",
                          role: "Bookkeeper",
                          access: "Limited",
                          status: "Active",
                        },
                        {
                          name: "Sara Ahmed",
                          email: "sara@example.com",
                          role: "Auditor",
                          access: "View Only",
                          status: "Inactive",
                        },
                      ].map((user, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-5 p-4 items-center"
                        >
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                          <div>{user.role}</div>
                          <div>{user.access}</div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                            >
                              {user.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Role Permissions</h3>
                  <Separator />
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b">
                      <div>Role</div>
                      <div>Transactions</div>
                      <div>Reports</div>
                      <div>Settings</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {[
                        {
                          role: "Finance Manager",
                          transactions: "Full Access",
                          reports: "Full Access",
                          settings: "Full Access",
                        },
                        {
                          role: "Accountant",
                          transactions: "Create/Edit",
                          reports: "View",
                          settings: "Limited",
                        },
                        {
                          role: "Bookkeeper",
                          transactions: "Create/Edit",
                          reports: "No Access",
                          settings: "No Access",
                        },
                        {
                          role: "Auditor",
                          transactions: "View Only",
                          reports: "View Only",
                          settings: "No Access",
                        },
                      ].map((role, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-5 p-4 items-center"
                        >
                          <div className="font-medium">{role.role}</div>
                          <div>{role.transactions}</div>
                          <div>{role.reports}</div>
                          <div>{role.settings}</div>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">
                              Edit Permissions
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <CardTitle>Integrations</CardTitle>
              </div>
              <CardDescription>
                Connect your finance module with other systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connected Systems</h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: "Banking Integration",
                        description:
                          "Connect to your bank accounts for automatic transaction import",
                        connected: true,
                        icon: <Building className="h-8 w-8 text-primary" />,
                      },
                      {
                        name: "Tax Filing System",
                        description:
                          "Connect to tax filing systems for automated compliance",
                        connected: false,
                        icon: <FileCheck className="h-8 w-8 text-primary" />,
                      },
                      {
                        name: "Payment Gateway",
                        description:
                          "Process online payments directly through your invoices",
                        connected: true,
                        icon: (
                          <CreditCardIcon className="h-8 w-8 text-primary" />
                        ),
                      },
                      {
                        name: "Payroll System",
                        description:
                          "Integrate with payroll for automatic expense recording",
                        connected: false,
                        icon: <Users className="h-8 w-8 text-primary" />,
                      },
                    ].map((integration, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            {integration.icon}
                            <Switch checked={integration.connected} />
                          </div>
                          <CardTitle className="text-base mt-2">
                            {integration.name}
                          </CardTitle>
                          <CardDescription>
                            {integration.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            {integration.connected ? "Configure" : "Connect"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Access</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="api-access">Enable API Access</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow external systems to access finance data via API
                        </p>
                      </div>
                      <Switch id="api-access" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id="api-key"
                          value="••••••••••••••••••••••••••••••"
                          disabled
                          className="flex-1"
                        />
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="webhook-url"
                          placeholder="https://your-system.com/webhook"
                          className="flex-1"
                        />
                        <Button variant="outline">
                          <Webhook className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Integration Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Payment Settings</CardTitle>
              </div>
              <CardDescription>
                Configure payment methods and processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <Separator />
                  <div className="space-y-4">
                    {[
                      {
                        name: "Cash",
                        enabled: true,
                        icon: <Banknote className="h-5 w-5" />,
                      },
                      {
                        name: "Bank Transfer",
                        enabled: true,
                        icon: <Building className="h-5 w-5" />,
                      },
                      {
                        name: "Credit Card",
                        enabled: true,
                        icon: <CreditCard className="h-5 w-5" />,
                      },
                      {
                        name: "Cheque",
                        enabled: true,
                        icon: <FileText className="h-5 w-5" />,
                      },
                      {
                        name: "Digital Wallet",
                        enabled: false,
                        icon: <Smartphone className="h-5 w-5" />,
                      },
                    ].map((method, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {method.icon}
                          <div className="space-y-0.5">
                            <Label>{method.name}</Label>
                            <p className="text-sm text-muted-foreground">
                              Accept payments via {method.name.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <Switch checked={method.enabled} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Processing</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-payment-terms">
                        Default Payment Terms
                      </Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="default-payment-terms">
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Due on Receipt</SelectItem>
                          <SelectItem value="15">Net 15</SelectItem>
                          <SelectItem value="30">Net 30</SelectItem>
                          <SelectItem value="60">Net 60</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-payment-method">
                        Default Payment Method
                      </Label>
                      <Select defaultValue="bank">
                        <SelectTrigger id="default-payment-method">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-payment-reminders">
                          Automatic Payment Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send automatic reminders for upcoming and overdue
                          payments
                        </p>
                      </div>
                      <Switch id="auto-payment-reminders" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Online Payment Gateways
                  </h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: "Credit Card Processor",
                        description: "Process credit card payments directly",
                        connected: true,
                        icon: <CreditCard className="h-8 w-8 text-primary" />,
                      },
                      {
                        name: "PayPal",
                        description: "Accept payments via PayPal",
                        connected: false,
                        icon: <DollarSign className="h-8 w-8 text-primary" />,
                      },
                    ].map((gateway, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            {gateway.icon}
                            <Switch checked={gateway.connected} />
                          </div>
                          <CardTitle className="text-base mt-2">
                            {gateway.name}
                          </CardTitle>
                          <CardDescription>
                            {gateway.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            {gateway.connected ? "Configure" : "Connect"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Payment Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Email Settings</CardTitle>
              </div>
              <CardDescription>
                Configure email templates and settings for financial
                communications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Configuration</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-from">From Email Address</Label>
                      <Input
                        id="email-from"
                        defaultValue="finance@nubras-tailoring.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-reply-to">
                        Reply-To Email Address
                      </Label>
                      <Input
                        id="email-reply-to"
                        defaultValue="accounts@nubras-tailoring.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signature">Email Signature</Label>
                      <Textarea
                        id="email-signature"
                        rows={4}
                        defaultValue="Nubras Tailoring LLC
Finance Department
Dubai, UAE
+971 4 123 4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Templates</h3>
                  <Separator />
                  <div className="space-y-4">
                    {[
                      {
                        name: "Invoice Email",
                        description:
                          "Template for sending invoices to customers",
                        icon: <FileText className="h-5 w-5" />,
                      },
                      {
                        name: "Payment Receipt",
                        description: "Template for payment confirmation emails",
                        icon: <Receipt className="h-5 w-5" />,
                      },
                      {
                        name: "Payment Reminder",
                        description: "Template for payment reminder emails",
                        icon: <BellRing className="h-5 w-5" />,
                      },
                      {
                        name: "Statement Email",
                        description: "Template for sending account statements",
                        icon: <FileBarChart className="h-5 w-5" />,
                      },
                    ].map((template, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {template.icon}
                          <div className="space-y-0.5">
                            <Label>{template.name}</Label>
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline">Edit Template</Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Scheduling</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-invoice-email">
                          Automatic Invoice Emails
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically email invoices when they are created
                        </p>
                      </div>
                      <Switch id="auto-invoice-email" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-receipt-email">
                          Automatic Receipt Emails
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically email receipts when payments are
                          received
                        </p>
                      </div>
                      <Switch id="auto-receipt-email" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-schedule">
                        Payment Reminder Schedule
                      </Label>
                      <Select defaultValue="7,1,0">
                        <SelectTrigger id="reminder-schedule">
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7,1,0">
                            7 days before, 1 day before, due date
                          </SelectItem>
                          <SelectItem value="14,7,0">
                            14 days before, 7 days before, due date
                          </SelectItem>
                          <SelectItem value="0,3,7">
                            Due date, 3 days after, 7 days after
                          </SelectItem>
                          <SelectItem value="custom">
                            Custom Schedule
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Email Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Tab */}
        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>
                Manage your legal documents and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">
                          Terms & Conditions
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Manage your terms and conditions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/finance/terms-conditions">
                        <Button variant="outline" className="w-full">
                          View & Edit
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">
                          Privacy Policy
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Manage your privacy policy
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        View & Edit
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">
                          Invoice Disclaimers
                        </CardTitle>
                      </div>
                      <CardDescription>
                        Manage invoice disclaimers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        View & Edit
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Legal Text</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-footer">
                        Invoice Footer Text
                      </Label>
                      <Textarea
                        id="invoice-footer"
                        rows={3}
                        defaultValue="Thank you for your business. Payment is due within the terms specified above. Late payments may be subject to a 2% monthly fee."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote-disclaimer">
                        Quotation Disclaimer
                      </Label>
                      <Textarea
                        id="quote-disclaimer"
                        rows={3}
                        defaultValue="This quote is valid for 30 days from the date of issue. Prices are subject to change after this period."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receipt-text">Receipt Text</Label>
                      <Textarea
                        id="receipt-text"
                        rows={3}
                        defaultValue="This receipt is proof of payment. Please retain for your records. All sales are final unless otherwise specified in our return policy."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Compliance Settings</h3>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="vat-registered">VAT Registered</Label>
                        <p className="text-sm text-muted-foreground">
                          Company is registered for Value Added Tax
                        </p>
                      </div>
                      <Switch id="vat-registered" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vat-number">
                        VAT Registration Number
                      </Label>
                      <Input id="vat-number" defaultValue="AE123456789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-year-end">Tax Year End</Label>
                      <Select defaultValue="12">
                        <SelectTrigger id="tax-year-end">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">March</SelectItem>
                          <SelectItem value="6">June</SelectItem>
                          <SelectItem value="9">September</SelectItem>
                          <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-6">Save Legal Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Additional components needed for the settings page
import {
  Eye,
  RefreshCw,
  Banknote,
  Smartphone,
  Receipt,
  FileBarChart,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
