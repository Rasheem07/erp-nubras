import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  FileText,
  Landmark,
  CreditCard,
  Receipt,
  FileBarChart,
  Calculator,
  PieChart,
  ArrowLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react"

export default function FinanceDocumentationPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Finance Module Documentation</h1>
      </div>

      <Tabs defaultValue="introduction" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="processes">Business Processes</TabsTrigger>
          <TabsTrigger value="interface">User Interface</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        {/* Introduction Tab */}
        <TabsContent value="introduction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Introduction to the Finance Module</CardTitle>
              <CardDescription>Overview and key capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xl font-semibold">Overview</h3>
                  <p>
                    The Finance Module in Nubras ERP is a comprehensive financial management system designed
                    specifically for tailoring businesses. It provides a complete set of tools for managing your
                    company's financial operations, from basic accounting to complex financial reporting.
                  </p>
                  <p>
                    This module integrates seamlessly with other parts of the ERP system, ensuring that financial data
                    flows automatically from sales, purchases, inventory, and other operational areas, eliminating the
                    need for manual data entry and reducing errors.
                  </p>

                  <h3 className="text-xl font-semibold mt-6">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Chart of Accounts:</strong> Customizable account structure tailored for tailoring
                      businesses
                    </li>
                    <li>
                      <strong>Banking Management:</strong> Comprehensive tools for managing bank accounts,
                      reconciliations, and electronic banking
                    </li>
                    <li>
                      <strong>Accounts Receivable:</strong> Customer invoicing, payment tracking, and aging analysis
                    </li>
                    <li>
                      <strong>Accounts Payable:</strong> Supplier bills, payment scheduling, and expense management
                    </li>
                    <li>
                      <strong>General Ledger:</strong> Detailed transaction recording and journal entries
                    </li>
                    <li>
                      <strong>Financial Reporting:</strong> Standard and customizable financial reports
                    </li>
                    <li>
                      <strong>Tax Management:</strong> VAT and other tax calculations and reporting
                    </li>
                    <li>
                      <strong>Multi-currency Support:</strong> Handle transactions in multiple currencies
                    </li>
                    <li>
                      <strong>Budgeting:</strong> Create and track financial budgets
                    </li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Module Benefits</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Accurate Financial Records</h4>
                        <p className="text-sm text-muted-foreground">
                          Maintain precise financial data with automated checks and balances
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calculator className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Simplified Tax Compliance</h4>
                        <p className="text-sm text-muted-foreground">
                          Automated tax calculations and reporting for regulatory compliance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileBarChart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Insightful Reporting</h4>
                        <p className="text-sm text-muted-foreground">
                          Gain financial insights with comprehensive reporting tools
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Streamlined Banking</h4>
                        <p className="text-sm text-muted-foreground">
                          Efficient bank reconciliation and payment processing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">How the Finance Module Solves Business Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Challenge: Financial Visibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Many tailoring businesses struggle with real-time visibility into their financial position,
                        making it difficult to make informed decisions.
                      </p>
                      <div className="mt-4 bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium">Solution:</p>
                        <p className="text-sm">
                          The Finance Module provides real-time dashboards and reports that give instant visibility into
                          cash flow, profitability, and financial health.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Challenge: Manual Processes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Traditional accounting methods involve manual data entry, spreadsheets, and paper-based
                        processes that are time-consuming and error-prone.
                      </p>
                      <div className="mt-4 bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium">Solution:</p>
                        <p className="text-sm">
                          Automated workflows, digital document management, and integration with other modules eliminate
                          manual work and reduce errors.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Challenge: Cash Flow Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Tailoring businesses often face cash flow challenges due to seasonal demand, large fabric
                        purchases, and varying project timelines.
                      </p>
                      <div className="mt-4 bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium">Solution:</p>
                        <p className="text-sm">
                          Cash flow forecasting, payment scheduling, and receivables management tools help optimize cash
                          flow and prevent shortages.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Challenge: Compliance & Reporting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Meeting tax regulations, financial reporting requirements, and audit standards can be complex
                        and time-consuming.
                      </p>
                      <div className="mt-4 bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium">Solution:</p>
                        <p className="text-sm">
                          Built-in compliance features, tax calculations, and standard financial reports ensure
                          regulatory requirements are met with minimal effort.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Processes Tab */}
        <TabsContent value="processes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Finance Business Processes</CardTitle>
              <CardDescription>Key financial workflows and processes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Core Financial Processes</h3>
                <p>
                  The Finance Module supports the following core business processes, each designed to streamline
                  financial operations and ensure accuracy:
                </p>

                <div className="mt-6 space-y-8">
                  {/* Process 1 */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h4 className="font-medium">1. Accounting Setup & Configuration</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <p>
                        The foundation of the finance module, involving setting up the chart of accounts, fiscal years,
                        and accounting policies.
                      </p>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Process Flow:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Define company fiscal year and accounting periods</li>
                          <li>Set up chart of accounts structure</li>
                          <li>Configure account types and subtypes</li>
                          <li>Establish opening balances</li>
                          <li>Define tax rates and codes</li>
                          <li>Configure financial dimensions and cost centers</li>
                          <li>Set up approval workflows</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium mb-2">Key Users:</h5>
                          <ul className="list-disc list-inside">
                            <li>Finance Manager</li>
                            <li>Chief Financial Officer</li>
                            <li>System Administrator</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Related Documents:</h5>
                          <ul className="list-disc list-inside">
                            <li>Chart of Accounts</li>
                            <li>Accounting Policies</li>
                            <li>Tax Configuration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process 2 */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h4 className="font-medium">2. Accounts Receivable Management</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <p>
                        Managing customer invoices, payments, and credit management to ensure timely collection of
                        funds.
                      </p>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Process Flow:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Create customer invoice from sales order or manually</li>
                          <li>Apply appropriate taxes and discounts</li>
                          <li>Issue invoice to customer</li>
                          <li>Record customer payments</li>
                          <li>Apply payments to invoices</li>
                          <li>Manage partial payments and installments</li>
                          <li>Process refunds when necessary</li>
                          <li>Generate aging reports and follow up on overdue invoices</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium mb-2">Key Users:</h5>
                          <ul className="list-disc list-inside">
                            <li>Accounts Receivable Clerk</li>
                            <li>Finance Manager</li>
                            <li>Sales Manager</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Related Documents:</h5>
                          <ul className="list-disc list-inside">
                            <li>Customer Invoices</li>
                            <li>Payment Receipts</li>
                            <li>Credit Notes</li>
                            <li>Aging Reports</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process 3 */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h4 className="font-medium">3. Accounts Payable Management</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <p>
                        Managing supplier invoices, payments, and expense tracking to ensure timely payment of
                        obligations.
                      </p>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Process Flow:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Record supplier invoices from purchase orders or manually</li>
                          <li>Verify invoice against goods received</li>
                          <li>Approve invoices for payment</li>
                          <li>Schedule payments based on due dates</li>
                          <li>Process supplier payments</li>
                          <li>Record and track expenses</li>
                          <li>Process expense claims</li>
                          <li>Manage advance payments and deposits</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium mb-2">Key Users:</h5>
                          <ul className="list-disc list-inside">
                            <li>Accounts Payable Clerk</li>
                            <li>Finance Manager</li>
                            <li>Procurement Manager</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Related Documents:</h5>
                          <ul className="list-disc list-inside">
                            <li>Supplier Invoices</li>
                            <li>Payment Vouchers</li>
                            <li>Expense Reports</li>
                            <li>Purchase Orders</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process 4 */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h4 className="font-medium">4. Banking & Cash Management</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <p>
                        Managing bank accounts, cash transactions, and reconciliations to maintain accurate financial
                        records.
                      </p>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Process Flow:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Set up bank accounts in the system</li>
                          <li>Record bank deposits and withdrawals</li>
                          <li>Process electronic funds transfers</li>
                          <li>Manage petty cash</li>
                          <li>Import bank statements</li>
                          <li>Reconcile bank statements with system records</li>
                          <li>Identify and resolve discrepancies</li>
                          <li>Generate bank reconciliation reports</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium mb-2">Key Users:</h5>
                          <ul className="list-disc list-inside">
                            <li>Cashier</li>
                            <li>Finance Officer</li>
                            <li>Finance Manager</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Related Documents:</h5>
                          <ul className="list-disc list-inside">
                            <li>Bank Statements</li>
                            <li>Reconciliation Reports</li>
                            <li>Cash Journals</li>
                            <li>Payment Receipts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process 5 */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h4 className="font-medium">5. General Ledger & Financial Reporting</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <p>
                        Recording financial transactions, maintaining the general ledger, and generating financial
                        reports.
                      </p>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Process Flow:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Record journal entries</li>
                          <li>Post transactions to the general ledger</li>
                          <li>Process month-end and year-end closing</li>
                          <li>Generate trial balance</li>
                          <li>Prepare financial statements (Income Statement, Balance Sheet, Cash Flow)</li>
                          <li>Create management reports</li>
                          <li>Analyze financial performance</li>
                          <li>Export data for external reporting</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium mb-2">Key Users:</h5>
                          <ul className="list-disc list-inside">
                            <li>Accountant</li>
                            <li>Finance Manager</li>
                            <li>Chief Financial Officer</li>
                            <li>External Auditors</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Related Documents:</h5>
                          <ul className="list-disc list-inside">
                            <li>Journal Entries</li>
                            <li>Trial Balance</li>
                            <li>Income Statement</li>
                            <li>Balance Sheet</li>
                            <li>Cash Flow Statement</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process 6 */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h4 className="font-medium">6. Tax Management</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <p>Managing tax calculations, reporting, and compliance to meet regulatory requirements.</p>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Process Flow:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Configure tax rates and rules</li>
                          <li>Apply taxes to sales and purchases</li>
                          <li>Track input and output VAT</li>
                          <li>Generate tax reports</li>
                          <li>Prepare tax returns</li>
                          <li>Process tax payments</li>
                          <li>Maintain tax compliance documentation</li>
                          <li>Handle tax audits and inquiries</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium mb-2">Key Users:</h5>
                          <ul className="list-disc list-inside">
                            <li>Tax Accountant</li>
                            <li>Finance Manager</li>
                            <li>External Tax Consultant</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Related Documents:</h5>
                          <ul className="list-disc list-inside">
                            <li>VAT Returns</li>
                            <li>Tax Reports</li>
                            <li>Tax Payment Receipts</li>
                            <li>Tax Compliance Certificates</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process 7 */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h4 className="font-medium">7. Budgeting & Forecasting</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <p>
                        Creating financial budgets, forecasts, and performing variance analysis to support financial
                        planning.
                      </p>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Process Flow:</h5>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Define budget periods and categories</li>
                          <li>Set budget targets</li>
                          <li>Create departmental budgets</li>
                          <li>Consolidate budgets</li>
                          <li>Approve final budget</li>
                          <li>Track actual performance against budget</li>
                          <li>Analyze variances</li>
                          <li>Adjust forecasts based on actual performance</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="font-medium mb-2">Key Users:</h5>
                          <ul className="list-disc list-inside">
                            <li>Department Managers</li>
                            <li>Finance Manager</li>
                            <li>Chief Financial Officer</li>
                            <li>Executive Management</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Related Documents:</h5>
                          <ul className="list-disc list-inside">
                            <li>Budget Plans</li>
                            <li>Forecast Reports</li>
                            <li>Variance Analysis</li>
                            <li>Budget vs. Actual Reports</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Process Integration</h3>
                <p>
                  The Finance Module integrates with other modules to create a seamless flow of financial information
                  throughout the organization:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Sales & Finance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Sales orders generate accounts receivable entries</li>
                        <li>Customer payments update AR balances</li>
                        <li>Sales tax calculations flow to tax reports</li>
                        <li>Revenue recognition based on delivery status</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Inventory & Finance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Inventory valuations update asset accounts</li>
                        <li>Cost of goods sold calculated automatically</li>
                        <li>Inventory adjustments create journal entries</li>
                        <li>Purchase receipts update inventory values</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Purchasing & Finance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Purchase orders create commitment accounting</li>
                        <li>Supplier invoices generate AP entries</li>
                        <li>Payment processing updates cash accounts</li>
                        <li>Purchase accruals for month-end closing</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Interface Tab */}
        <TabsContent value="interface" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Finance Module User Interface</CardTitle>
              <CardDescription>Navigation and key screens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Finance Dashboard</h3>
                <p>
                  The Finance Dashboard provides a comprehensive overview of your financial position with key metrics,
                  charts, and quick access to common tasks.
                </p>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">Dashboard Components</h4>
                  </div>
                  <div className="p-6">
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-4">
                      <Image src="/finance-dashboard.png" alt="Finance Dashboard" fill className="object-cover" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Key Metrics Section</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Cash Position: Current bank and cash balances</li>
                          <li>Accounts Receivable: Total outstanding customer invoices</li>
                          <li>Accounts Payable: Total outstanding supplier invoices</li>
                          <li>Revenue MTD/YTD: Month-to-date and year-to-date revenue</li>
                          <li>Expenses MTD/YTD: Month-to-date and year-to-date expenses</li>
                          <li>Profit Margin: Current profit margin percentage</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Charts and Visualizations</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Cash Flow Chart: Incoming vs outgoing cash over time</li>
                          <li>Revenue vs Expenses: Comparison chart by month</li>
                          <li>AR Aging: Breakdown of receivables by age</li>
                          <li>Expense Breakdown: Pie chart of expense categories</li>
                          <li>Budget vs Actual: Variance visualization</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium mb-2">Quick Actions</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-3 rounded-md text-center">
                          <p className="text-sm font-medium">Create Invoice</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md text-center">
                          <p className="text-sm font-medium">Record Payment</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md text-center">
                          <p className="text-sm font-medium">Bank Reconciliation</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md text-center">
                          <p className="text-sm font-medium">Generate Reports</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Navigation Structure</h3>
                <p>
                  The Finance Module is organized into logical sections for easy navigation and access to related
                  functions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-3">
                      <h4 className="font-medium">Main Navigation</h4>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
                          <LayoutDashboard className="h-4 w-4 text-primary" />
                          <span className="font-medium">Dashboard</span>
                        </li>
                        <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                          <Landmark className="h-4 w-4" />
                          <span>Chart of Accounts</span>
                        </li>
                        <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                          <CreditCard className="h-4 w-4" />
                          <span>Banking</span>
                        </li>
                        <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                          <FileText className="h-4 w-4" />
                          <span>Invoices</span>
                        </li>
                        <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                          <Receipt className="h-4 w-4" />
                          <span>Expenses</span>
                        </li>
                        <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                          <BookOpen className="h-4 w-4" />
                          <span>Journal Entries</span>
                        </li>
                        <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                          <FileBarChart className="h-4 w-4" />
                          <span>Reports</span>
                        </li>
                        <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                          <Calculator className="h-4 w-4" />
                          <span>Taxes</span>
                        </li>
                        <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                          <PieChart className="h-4 w-4" />
                          <span>Budgeting</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-span-2 border rounded-lg overflow-hidden">
                    <div className="bg-muted p-3">
                      <h4 className="font-medium">Key Screens Overview</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-3">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Landmark className="h-4 w-4" />
                            Chart of Accounts
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            View, create, and manage your accounting structure with hierarchical account organization.
                          </p>
                        </div>
                        <div className="border rounded-md p-3">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Banking
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Manage bank accounts, reconciliations, and electronic banking transactions.
                          </p>
                        </div>
                        <div className="border rounded-md p-3">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Invoices
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Create, send, and track customer invoices with payment status monitoring.
                          </p>
                        </div>
                        <div className="border rounded-md p-3">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Receipt className="h-4 w-4" />
                            Expenses
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Record and categorize business expenses with receipt management.
                          </p>
                        </div>
                        <div className="border rounded-md p-3">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Journal Entries
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Create and manage accounting entries with double-entry validation.
                          </p>
                        </div>
                        <div className="border rounded-md p-3">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <FileBarChart className="h-4 w-4" />
                            Reports
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Generate standard and custom financial reports with export capabilities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Key Interface Elements</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Account Creation Form</h4>
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                      <Image
                        src="/financial-account-form.png"
                        alt="Account Creation Form"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The account creation form allows you to add new accounts to your chart of accounts with proper
                      categorization and opening balances.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Invoice Management</h4>
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                      <Image src="/invoice-management-screen.png" alt="Invoice Management" fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The invoice management interface provides a comprehensive view of all invoices with filtering,
                      sorting, and bulk action capabilities.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Bank Reconciliation</h4>
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=600&query=Bank+reconciliation+interface+with+matching+transactions"
                        alt="Bank Reconciliation"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The bank reconciliation screen allows you to match bank statement transactions with system records
                      to ensure accuracy.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Financial Reporting</h4>
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=600&query=Financial+reporting+dashboard+with+charts+and+tables"
                        alt="Financial Reporting"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The reporting interface provides access to standard financial reports with customization options
                      and export capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <CardDescription>Managing your accounting structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Account Structure</h3>
                <p>
                  The Chart of Accounts is the foundation of your financial system, organizing all financial
                  transactions into a structured hierarchy.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="font-medium mb-3">Account Types</h4>
                    <div className="space-y-2">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <h5 className="font-medium">Assets</h5>
                        <p className="text-sm text-muted-foreground">
                          Resources owned by the business that have economic value
                        </p>
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Subtypes:</p>
                          <ul className="list-disc list-inside">
                            <li>Current Assets</li>
                            <li>Fixed Assets</li>
                            <li>Other Assets</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-md">
                        <h5 className="font-medium">Liabilities</h5>
                        <p className="text-sm text-muted-foreground">Obligations or debts owed by the business</p>
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Subtypes:</p>
                          <ul className="list-disc list-inside">
                            <li>Current Liabilities</li>
                            <li>Long-term Liabilities</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-md">
                        <h5 className="font-medium">Equity</h5>
                        <p className="text-sm text-muted-foreground">Owner's interest in the business</p>
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Subtypes:</p>
                          <ul className="list-disc list-inside">
                            <li>Owner's Equity</li>
                            <li>Retained Earnings</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Account Types (continued)</h4>
                    <div className="space-y-2">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <h5 className="font-medium">Revenue</h5>
                        <p className="text-sm text-muted-foreground">Income earned from business activities</p>
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Subtypes:</p>
                          <ul className="list-disc list-inside">
                            <li>Operating Revenue</li>
                            <li>Other Revenue</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-md">
                        <h5 className="font-medium">Expenses</h5>
                        <p className="text-sm text-muted-foreground">Costs incurred in running the business</p>
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Subtypes:</p>
                          <ul className="list-disc list-inside">
                            <li>Cost of Sales</li>
                            <li>Operating Expenses</li>
                            <li>Other Expenses</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-md">
                        <h5 className="font-medium">Bank Accounts</h5>
                        <p className="text-sm text-muted-foreground">Special asset accounts for banking operations</p>
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Subtypes:</p>
                          <ul className="list-disc list-inside">
                            <li>Checking</li>
                            <li>Savings</li>
                            <li>Fixed Deposit</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Account Numbering System</h4>
                  <p className="mb-4">
                    The system uses a structured account numbering system to organize accounts hierarchically:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border px-4 py-2 text-left">Range</th>
                          <th className="border px-4 py-2 text-left">Account Type</th>
                          <th className="border px-4 py-2 text-left">Examples</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2">1000-1999</td>
                          <td className="border px-4 py-2">Assets</td>
                          <td className="border px-4 py-2">1000: Cash, 1100: Accounts Receivable</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">2000-2999</td>
                          <td className="border px-4 py-2">Liabilities</td>
                          <td className="border px-4 py-2">2000: Accounts Payable, 2100: Loans Payable</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">3000-3999</td>
                          <td className="border px-4 py-2">Equity</td>
                          <td className="border px-4 py-2">3000: Owner's Equity, 3100: Retained Earnings</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">4000-4999</td>
                          <td className="border px-4 py-2">Revenue</td>
                          <td className="border px-4 py-2">4000: Sales Revenue, 4100: Service Revenue</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">5000-5999</td>
                          <td className="border px-4 py-2">Cost of Sales</td>
                          <td className="border px-4 py-2">5000: Cost of Goods Sold, 5100: Direct Labor</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">6000-6999</td>
                          <td className="border px-4 py-2">Expenses</td>
                          <td className="border px-4 py-2">6000: Rent Expense, 6100: Utilities Expense</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Managing Accounts</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Creating Accounts</h4>
                    <div className="space-y-2">
                      <p>To create a new account:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Navigate to Finance {">"} Chart of Accounts</li>
                        <li>Click the "Add Account" button</li>
                        <li>
                          Fill in the required fields:
                          <ul className="list-disc list-inside ml-6 mt-1">
                            <li>Account Number</li>
                            <li>Account Name</li>
                            <li>Account Type</li>
                            <li>Account Subtype</li>
                          </ul>
                        </li>
                        <li>Enter an opening balance if applicable</li>
                        <li>Add a description for reference</li>
                        <li>Click "Create Account" to save</li>
                      </ol>

                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <p className="text-sm font-medium">Important Note:</p>
                        <p className="text-sm">
                          Account numbers must be unique and follow the numbering convention. Opening balances should
                          only be entered during initial setup or at the start of a new fiscal year.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Editing and Deactivating Accounts</h4>
                    <div className="space-y-2">
                      <p>To edit an existing account:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Navigate to Finance {">"} Chart of Accounts</li>
                        <li>Find the account in the list</li>
                        <li>Click the "Edit" icon</li>
                        <li>Update the account details</li>
                        <li>Click "Save Changes"</li>
                      </ol>

                      <p className="mt-3">To deactivate an account:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Navigate to Finance {">"} Chart of Accounts</li>
                        <li>Find the account in the list</li>
                        <li>Click the "Edit" icon</li>
                        <li>Toggle the "Status" switch to "Inactive"</li>
                        <li>Click "Save Changes"</li>
                      </ol>

                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <p className="text-sm font-medium">Important Note:</p>
                        <p className="text-sm">
                          Accounts with transactions cannot be deleted but can be deactivated. Deactivated accounts will
                          not appear in transaction dropdowns but will still be visible in reports for historical data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Bank Accounts</h4>
                  <p>Bank accounts are special types of asset accounts with additional banking details:</p>

                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-md p-4">
                        <h5 className="font-medium mb-2">Creating Bank Accounts</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Navigate to Finance {">"} Banking</li>
                          <li>Click "Add Bank Account"</li>
                          <li>
                            Fill in the account details:
                            <ul className="list-disc list-inside ml-6 mt-1">
                              <li>Bank Name</li>
                              <li>Account Number</li>
                              <li>Account Type (Checking, Savings, etc.)</li>
                              <li>Currency</li>
                              <li>Opening Balance</li>
                            </ul>
                          </li>
                          <li>Add additional details if needed (SWIFT, IBAN)</li>
                          <li>Click "Create Account"</li>
                        </ol>
                      </div>

                      <div className="border rounded-md p-4">
                        <h5 className="font-medium mb-2">Bank Account Features</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Bank statement import</li>
                          <li>Automated reconciliation</li>
                          <li>Transaction matching</li>
                          <li>Electronic payments</li>
                          <li>Multi-currency support</li>
                          <li>Bank feeds integration</li>
                          <li>Transaction categorization</li>
                          <li>Balance tracking and forecasting</li>
                        </ul>
                      </div>
                    </div>

                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=400&width=800&query=Bank+account+management+interface+with+transaction+list"
                        alt="Bank Account Management"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Tab */}
        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banking Management</CardTitle>
              <CardDescription>Managing bank accounts and transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Banking Overview</h3>
                <p>
                  The Banking module provides comprehensive tools for managing your bank accounts, processing
                  transactions, and reconciling bank statements.
                </p>

                <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=800&query=Banking+dashboard+with+account+balances+and+recent+transactions"
                    alt="Banking Dashboard"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Account Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Create and manage bank accounts</li>
                        <li>Track account balances</li>
                        <li>View transaction history</li>
                        <li>Manage account details</li>
                        <li>Set up account categories</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Transaction Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Record deposits and withdrawals</li>
                        <li>Process transfers between accounts</li>
                        <li>Import transactions from bank statements</li>
                        <li>Categorize transactions</li>
                        <li>Attach receipts and documentation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Reconciliation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Match bank statement with system records</li>
                        <li>Identify and resolve discrepancies</li>
                        <li>Reconcile cleared transactions</li>
                        <li>Generate reconciliation reports</li>
                        <li>Track reconciliation history</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Bank Reconciliation Process</h3>
                <p>
                  Bank reconciliation is the process of matching your internal financial records against the
                  transactions recorded by your bank to ensure accuracy and identify discrepancies.
                </p>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">Reconciliation Workflow</h4>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Step 1: Prepare for Reconciliation</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Navigate to Finance {">"} Banking {">"} Reconciliation</li>
                          <li>Select the bank account to reconcile</li>
                          <li>Enter the statement date and ending balance</li>
                          <li>Import bank statement or enter transactions manually</li>
                          <li>Click "Start Reconciliation"</li>
                        </ol>
                      </div>
                      <div>
                        <h5 className="font-medium mb-3">Step 2: Match Transactions</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Review unreconciled transactions</li>
                          <li>Match bank statement entries with system transactions</li>
                          <li>The system will auto-match based on amount and date</li>
                          <li>Manually match transactions as needed</li>
                          <li>Mark transactions as reconciled</li>
                        </ol>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h5 className="font-medium mb-3">Step 3: Handle Discrepancies</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Identify unmatched transactions</li>
                          <li>Add missing transactions to the system</li>
                          <li>Investigate and correct errors</li>
                          <li>Adjust transactions as needed</li>
                          <li>Document reasons for adjustments</li>
                        </ol>
                      </div>
                      <div>
                        <h5 className="font-medium mb-3">Step 4: Complete Reconciliation</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Verify that the difference is zero</li>
                          <li>Review reconciliation summary</li>
                          <li>Generate reconciliation report</li>
                          <li>Approve and finalize the reconciliation</li>
                          <li>Archive bank statement for audit purposes</li>
                        </ol>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=300&width=600&query=Bank+reconciliation+interface+with+matched+and+unmatched+transactions"
                          alt="Bank Reconciliation Interface"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Banking Best Practices</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Daily Banking Operations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          <strong>Regular Updates:</strong> Record banking transactions daily to maintain accurate cash
                          positions
                        </li>
                        <li>
                          <strong>Transaction Categorization:</strong> Properly categorize all transactions for accurate
                          reporting
                        </li>
                        <li>
                          <strong>Documentation:</strong> Attach relevant documents to transactions for audit purposes
                        </li>
                        <li>
                          <strong>Separation of Duties:</strong> Implement approval workflows for large transactions
                        </li>
                        <li>
                          <strong>Cash Flow Monitoring:</strong> Regularly review cash positions across all accounts
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Reconciliation Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          <strong>Frequency:</strong> Reconcile accounts at least monthly, ideally weekly
                        </li>
                        <li>
                          <strong>Consistency:</strong> Establish a regular schedule for reconciliations
                        </li>
                        <li>
                          <strong>Documentation:</strong> Keep records of all reconciliations and adjustments
                        </li>
                        <li>
                          <strong>Investigate Discrepancies:</strong> Promptly research and resolve all differences
                        </li>
                        <li>
                          <strong>Independent Review:</strong> Have reconciliations reviewed by someone other than the
                          preparer
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Security Considerations</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>
                      <strong>Access Controls:</strong> Limit banking module access to authorized personnel only
                    </li>
                    <li>
                      <strong>Audit Trails:</strong> Maintain detailed logs of all banking activities
                    </li>
                    <li>
                      <strong>Dual Authorization:</strong> Require two approvals for large transactions
                    </li>
                    <li>
                      <strong>Regular Audits:</strong> Conduct periodic reviews of banking activities
                    </li>
                    <li>
                      <strong>Secure Credentials:</strong> Never share banking credentials or store them insecurely
                    </li>
                    <li>
                      <strong>Data Encryption:</strong> Ensure all banking data is encrypted at rest and in transit
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transactions Management</CardTitle>
              <CardDescription>Recording and managing financial transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Transaction Types</h3>
                <p>
                  The Finance Module supports various types of financial transactions to record all your business
                  activities accurately.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Sales Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Customer Invoices</li>
                        <li>Customer Payments</li>
                        <li>Credit Notes</li>
                        <li>Sales Returns</li>
                        <li>Advance Receipts</li>
                      </ul>
                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <p className="text-xs font-medium">Accounting Impact:</p>
                        <p className="text-xs">DR: Accounts Receivable / Cash</p>
                        <p className="text-xs">CR: Sales Revenue / Tax Payable</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Purchase Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Supplier Bills</li>
                        <li>Supplier Payments</li>
                        <li>Purchase Returns</li>
                        <li>Debit Notes</li>
                        <li>Advance Payments</li>
                      </ul>
                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <p className="text-xs font-medium">Accounting Impact:</p>
                        <p className="text-xs">DR: Purchases / Expenses / Assets</p>
                        <p className="text-xs">CR: Accounts Payable / Cash</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Banking Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Deposits</li>
                        <li>Withdrawals</li>
                        <li>Fund Transfers</li>
                        <li>Bank Charges</li>
                        <li>Interest Received</li>
                      </ul>
                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <p className="text-xs font-medium">Accounting Impact:</p>
                        <p className="text-xs">DR/CR: Bank Accounts</p>
                        <p className="text-xs">DR: Bank Charges (for fees)</p>
                        <p className="text-xs">CR: Interest Income (for interest)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Journal Entries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>General Journal Entries</li>
                        <li>Adjustment Entries</li>
                        <li>Opening Balance Entries</li>
                        <li>Closing Entries</li>
                        <li>Recurring Entries</li>
                      </ul>
                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <p className="text-xs font-medium">Accounting Impact:</p>
                        <p className="text-xs">DR/CR: Various accounts based on entry</p>
                        <p className="text-xs">Must balance (debits = credits)</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Expense Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Expense Claims</li>
                        <li>Petty Cash Expenses</li>
                        <li>Credit Card Expenses</li>
                        <li>Prepaid Expenses</li>
                        <li>Expense Allocations</li>
                      </ul>
                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <p className="text-xs font-medium">Accounting Impact:</p>
                        <p className="text-xs">DR: Expense Accounts</p>
                        <p className="text-xs">CR: Cash / Bank / Credit Card / Payables</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Inventory Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Inventory Purchases</li>
                        <li>Inventory Adjustments</li>
                        <li>Cost of Goods Sold</li>
                        <li>Stock Transfers</li>
                        <li>Inventory Write-offs</li>
                      </ul>
                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <p className="text-xs font-medium">Accounting Impact:</p>
                        <p className="text-xs">DR/CR: Inventory Asset</p>
                        <p className="text-xs">DR: COGS (when sold)</p>
                        <p className="text-xs">CR: Inventory Asset (when sold)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Journal Entries</h3>
                <p>
                  Journal entries are the foundation of the accounting system, allowing you to record any financial
                  transaction with complete flexibility.
                </p>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">Creating Journal Entries</h4>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Step-by-Step Process</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Navigate to Finance {">"} Journal Entries</li>
                          <li>Click "Create Journal Entry"</li>
                          <li>Enter the journal entry date</li>
                          <li>Add a reference number (optional)</li>
                          <li>Enter a description for the entry</li>
                          <li>Add line items with account, description, and debit/credit amounts</li>
                          <li>Ensure the entry is balanced (debits = credits)</li>
                          <li>Add supporting documentation if needed</li>
                          <li>Save or submit for approval</li>
                        </ol>
                      </div>
                      <div>
                        <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=300&width=500&query=Journal+entry+form+with+debit+and+credit+columns"
                            alt="Journal Entry Form"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-4 bg-muted/50 p-3 rounded-md">
                          <p className="text-sm font-medium">Important Rules:</p>
                          <ul className="list-disc list-inside text-sm">
                            <li>Total debits must equal total credits</li>
                            <li>Each line must have an account selected</li>
                            <li>Date must be within an open accounting period</li>
                            <li>Description should clearly explain the purpose</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium mb-3">Journal Entry Types</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border px-4 py-2 text-left">Type</th>
                              <th className="border px-4 py-2 text-left">Description</th>
                              <th className="border px-4 py-2 text-left">Example</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2">Standard</td>
                              <td className="border px-4 py-2">One-time manual entries</td>
                              <td className="border px-4 py-2">Recording a prepaid expense</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2">Recurring</td>
                              <td className="border px-4 py-2">Entries that repeat on a schedule</td>
                              <td className="border px-4 py-2">Monthly depreciation</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2">Reversing</td>
                              <td className="border px-4 py-2">Entries that automatically reverse on a future date</td>
                              <td className="border px-4 py-2">Accrued expenses at month-end</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2">Template</td>
                              <td className="border px-4 py-2">Saved entry formats for repeated use</td>
                              <td className="border px-4 py-2">Standard allocation entries</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2">Year-End</td>
                              <td className="border px-4 py-2">Closing entries for fiscal year-end</td>
                              <td className="border px-4 py-2">Closing revenue and expense accounts</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Transaction Workflows</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Sales Workflow</h4>
                    <div className="border rounded-lg p-4">
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li className="font-medium">
                          Create Sales Quote
                          <div className="ml-6 mt-1 text-muted-foreground">Prepare and send customer quotation</div>
                        </li>
                        <li className="font-medium">
                          Convert to Sales Order
                          <div className="ml-6 mt-1 text-muted-foreground">When customer approves the quote</div>
                        </li>
                        <li className="font-medium">
                          Create Invoice
                          <div className="ml-6 mt-1 text-muted-foreground">Generate invoice from sales order</div>
                          <div className="ml-6 mt-1 text-xs bg-muted/50 p-2 rounded">
                            DR: Accounts Receivable
                            <br />
                            CR: Sales Revenue
                            <br />
                            CR: Tax Payable
                          </div>
                        </li>
                        <li className="font-medium">
                          Record Payment
                          <div className="ml-6 mt-1 text-muted-foreground">When customer pays the invoice</div>
                          <div className="ml-6 mt-1 text-xs bg-muted/50 p-2 rounded">
                            DR: Bank/Cash
                            <br />
                            CR: Accounts Receivable
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Purchase Workflow</h4>
                    <div className="border rounded-lg p-4">
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li className="font-medium">
                          Create Purchase Requisition
                          <div className="ml-6 mt-1 text-muted-foreground">Internal request for goods/services</div>
                        </li>
                        <li className="font-medium">
                          Create Purchase Order
                          <div className="ml-6 mt-1 text-muted-foreground">Official order sent to supplier</div>
                        </li>
                        <li className="font-medium">
                          Receive Goods/Services
                          <div className="ml-6 mt-1 text-muted-foreground">Record receipt of ordered items</div>
                          <div className="ml-6 mt-1 text-xs bg-muted/50 p-2 rounded">
                            DR: Inventory/Asset/Expense
                            <br />
                            CR: Goods Received Not Invoiced
                          </div>
                        </li>
                        <li className="font-medium">
                          Record Supplier Invoice
                          <div className="ml-6 mt-1 text-muted-foreground">Enter supplier bill in system</div>
                          <div className="ml-6 mt-1 text-xs bg-muted/50 p-2 rounded">
                            DR: Goods Received Not Invoiced
                            <br />
                            DR: Input Tax
                            <br />
                            CR: Accounts Payable
                          </div>
                        </li>
                        <li className="font-medium">
                          Process Payment
                          <div className="ml-6 mt-1 text-muted-foreground">Pay supplier invoice</div>
                          <div className="ml-6 mt-1 text-xs bg-muted/50 p-2 rounded">
                            DR: Accounts Payable
                            <br />
                            CR: Bank/Cash
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Expense Claim Workflow</h4>
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li className="font-medium">
                            Submit Expense Claim
                            <div className="ml-6 mt-1 text-muted-foreground">
                              Employee submits expenses with receipts
                            </div>
                          </li>
                          <li className="font-medium">
                            Review and Approve
                            <div className="ml-6 mt-1 text-muted-foreground">Manager reviews and approves claim</div>
                          </li>
                          <li className="font-medium">
                            Process Claim
                            <div className="ml-6 mt-1 text-muted-foreground">
                              Finance department processes approved claim
                            </div>
                            <div className="ml-6 mt-1 text-xs bg-muted/50 p-2 rounded">
                              DR: Expense Accounts
                              <br />
                              DR: Input Tax (if applicable)
                              <br />
                              CR: Employee Advances/Payable
                            </div>
                          </li>
                        </ol>
                      </div>
                      <div>
                        <ol className="list-decimal list-inside space-y-2 text-sm" start={4}>
                          <li className="font-medium">
                            Reimburse Employee
                            <div className="ml-6 mt-1 text-muted-foreground">Payment made to employee</div>
                            <div className="ml-6 mt-1 text-xs bg-muted/50 p-2 rounded">
                              DR: Employee Advances/Payable
                              <br />
                              CR: Bank/Cash
                            </div>
                          </li>
                          <li className="font-medium">
                            Accounting Review
                            <div className="ml-6 mt-1 text-muted-foreground">
                              Final review for tax and accounting compliance
                            </div>
                          </li>
                          <li className="font-medium">
                            Archive Documentation
                            <div className="ml-6 mt-1 text-muted-foreground">Store receipts and documentation</div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reporting</CardTitle>
              <CardDescription>Generating and analyzing financial reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Standard Financial Reports</h3>
                <p>
                  The Finance Module provides a comprehensive set of standard financial reports to monitor your business
                  performance and meet regulatory requirements.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Income Statement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Shows revenue, expenses, and profit/loss for a specific period.</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Revenue breakdown by category</li>
                        <li>Expense analysis by type</li>
                        <li>Gross profit and margins</li>
                        <li>Operating profit</li>
                        <li>Net profit after tax</li>
                      </ul>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Balance Sheet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Shows assets, liabilities, and equity at a specific point in time.</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Current and non-current assets</li>
                        <li>Current and long-term liabilities</li>
                        <li>Owner's equity and retained earnings</li>
                        <li>Working capital analysis</li>
                        <li>Asset to liability ratios</li>
                      </ul>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Cash Flow Statement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Shows cash inflows and outflows categorized by activities.</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Operating activities</li>
                        <li>Investing activities</li>
                        <li>Financing activities</li>
                        <li>Net change in cash position</li>
                        <li>Cash flow forecasting</li>
                      </ul>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Trial Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Lists all accounts with their debit or credit balances.</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Account code and name</li>
                        <li>Debit and credit columns</li>
                        <li>Opening and closing balances</li>
                        <li>Period movements</li>
                        <li>Balance verification</li>
                      </ul>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Accounts Receivable Aging</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Shows outstanding customer invoices by age.</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Current invoices</li>
                        <li>1-30 days overdue</li>
                        <li>31-60 days overdue</li>
                        <li>61-90 days overdue</li>
                        <li>Over 90 days overdue</li>
                      </ul>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Accounts Payable Aging</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Shows outstanding supplier invoices by age.</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Current bills</li>
                        <li>1-30 days overdue</li>
                        <li>31-60 days overdue</li>
                        <li>61-90 days overdue</li>
                        <li>Over 90 days overdue</li>
                      </ul>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Management Reports</h3>
                <p>
                  In addition to standard financial reports, the system provides management reports to help with
                  decision-making and performance analysis.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Budget vs. Actual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Compares budgeted amounts with actual performance.</p>
                      <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-3">
                        <Image
                          src="/placeholder.svg?height=200&width=400&query=Budget+vs+actual+comparison+chart"
                          alt="Budget vs Actual Report"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Variance analysis by account</li>
                        <li>Percentage variance calculation</li>
                        <li>YTD budget comparison</li>
                        <li>Graphical representation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Financial Ratios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Key financial ratios to assess business health.</p>
                      <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-3">
                        <Image
                          src="/placeholder.svg?height=200&width=400&query=Financial+ratios+dashboard+with+metrics"
                          alt="Financial Ratios Report"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Liquidity ratios (Current, Quick)</li>
                        <li>Profitability ratios (Gross Margin, Net Profit)</li>
                        <li>Efficiency ratios (Inventory Turnover)</li>
                        <li>Solvency ratios (Debt-to-Equity)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Cash Flow Forecast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Projects future cash flows based on current data.</p>
                      <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-3">
                        <Image
                          src="/placeholder.svg?height=200&width=400&query=Cash+flow+forecast+chart+with+projections"
                          alt="Cash Flow Forecast"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>13-week rolling forecast</li>
                        <li>Expected inflows and outflows</li>
                        <li>Cash position projections</li>
                        <li>Scenario analysis</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Profitability Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">Analyzes profitability by different dimensions.</p>
                      <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-3">
                        <Image
                          src="/placeholder.svg?height=200&width=400&query=Profitability+analysis+by+product+and+customer"
                          alt="Profitability Analysis"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Product profitability</li>
                        <li>Customer profitability</li>
                        <li>Project profitability</li>
                        <li>Department profitability</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Report Generation</h3>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">Generating Reports</h4>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Step-by-Step Process</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Navigate to Finance {">"} Reports</li>
                          <li>Select the report type</li>
                          <li>Set the reporting period</li>
                          <li>Choose comparison periods if applicable</li>
                          <li>Select filtering options</li>
                          <li>Choose display options</li>
                          <li>Generate the report</li>
                          <li>Review the results</li>
                          <li>Export or print as needed</li>
                        </ol>
                      </div>
                      <div>
                        <h5 className="font-medium mb-3">Report Options</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>
                            <strong>Format Options:</strong> PDF, Excel, CSV, HTML
                          </li>
                          <li>
                            <strong>Period Options:</strong> Month, Quarter, Year, Custom
                          </li>
                          <li>
                            <strong>Comparison:</strong> Previous Period, Same Period Last Year
                          </li>
                          <li>
                            <strong>Detail Level:</strong> Summary, Detailed, Transactional
                          </li>
                          <li>
                            <strong>Grouping:</strong> By Account, Department, Project
                          </li>
                          <li>
                            <strong>Visualization:</strong> Tables, Charts, Combined
                          </li>
                          <li>
                            <strong>Scheduling:</strong> One-time, Recurring
                          </li>
                          <li>
                            <strong>Distribution:</strong> Email, Download, Print
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium mb-3">Custom Reports</h5>
                      <p className="text-sm mb-3">
                        The system allows you to create custom reports to meet specific business needs:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-3 rounded-md">
                          <h6 className="font-medium text-sm">Report Builder</h6>
                          <p className="text-sm">Visual tool to create custom reports without technical knowledge</p>
                          <ul className="list-disc list-inside text-xs mt-2">
                            <li>Drag-and-drop interface</li>
                            <li>Field selection from multiple sources</li>
                            <li>Filtering and sorting options</li>
                            <li>Calculation capabilities</li>
                          </ul>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md">
                          <h6 className="font-medium text-sm">Advanced Query Tool</h6>
                          <p className="text-sm">SQL-based tool for complex reporting needs</p>
                          <ul className="list-disc list-inside text-xs mt-2">
                            <li>Direct database queries</li>
                            <li>Complex calculations</li>
                            <li>Cross-module reporting</li>
                            <li>Custom aggregations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Best Practices Tab */}
        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Finance Module Best Practices</CardTitle>
              <CardDescription>Recommendations for optimal use of the finance module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Daily Operations</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Data Entry Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          <strong>Timeliness:</strong> Enter transactions daily to maintain up-to-date records
                        </li>
                        <li>
                          <strong>Accuracy:</strong> Double-check all entries before saving
                        </li>
                        <li>
                          <strong>Completeness:</strong> Fill in all relevant fields for comprehensive reporting
                        </li>
                        <li>
                          <strong>Documentation:</strong> Attach supporting documents to transactions
                        </li>
                        <li>
                          <strong>Consistency:</strong> Use consistent naming conventions and categorization
                        </li>
                        <li>
                          <strong>Batch Processing:</strong> Group similar transactions for efficient entry
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Transaction Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          <strong>Review:</strong> Regularly review unposted transactions
                        </li>
                        <li>
                          <strong>Reconciliation:</strong> Reconcile accounts on a regular schedule
                        </li>
                        <li>
                          <strong>Approval Workflows:</strong> Implement appropriate approval levels
                        </li>
                        <li>
                          <strong>Audit Trail:</strong> Maintain detailed logs of all financial activities
                        </li>
                        <li>
                          <strong>Error Correction:</strong> Use proper adjustment procedures
                        </li>
                        <li>
                          <strong>Backup:</strong> Regularly backup financial data
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Month-End Procedures</h3>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">Month-End Closing Checklist</h4>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Pre-Closing Tasks</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Review and post all pending transactions</li>
                          <li>Reconcile bank accounts</li>
                          <li>Review accounts receivable aging</li>
                          <li>Review accounts payable aging</li>
                          <li>Process recurring journal entries</li>
                          <li>Reconcile petty cash</li>
                          <li>Review employee expense claims</li>
                          <li>Reconcile credit card statements</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-3">Closing Tasks</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Record accruals and prepayments</li>
                          <li>Calculate and record depreciation</li>
                          <li>Reconcile inventory with general ledger</li>
                          <li>Review and adjust tax provisions</li>
                          <li>Perform account reconciliations</li>
                          <li>Generate trial balance</li>
                          <li>Review financial statements</li>
                          <li>Lock the accounting period</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium mb-3">Post-Closing Tasks</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Generate and distribute financial reports</li>
                        <li>Analyze variances against budget</li>
                        <li>Prepare management commentary</li>
                        <li>Update cash flow forecasts</li>
                        <li>Backup financial data</li>
                        <li>Prepare for next month</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">System Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Optimal Setup</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          <strong>Chart of Accounts:</strong> Design a logical account structure that meets reporting
                          needs
                        </li>
                        <li>
                          <strong>User Roles:</strong> Configure appropriate access levels based on job responsibilities
                        </li>
                        <li>
                          <strong>Approval Workflows:</strong> Set up approval hierarchies for transactions
                        </li>
                        <li>
                          <strong>Automation:</strong> Configure recurring transactions and auto-posting rules
                        </li>
                        <li>
                          <strong>Tax Settings:</strong> Ensure tax codes and rates are correctly configured
                        </li>
                        <li>
                          <strong>Fiscal Periods:</strong> Set up accounting periods aligned with reporting needs
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Integration Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          <strong>Banking Integration:</strong> Set up bank feeds for automatic transaction import
                        </li>
                        <li>
                          <strong>Sales Integration:</strong> Configure automatic posting from sales to finance
                        </li>
                        <li>
                          <strong>Inventory Integration:</strong> Set up inventory valuation methods
                        </li>
                        <li>
                          <strong>Purchasing Integration:</strong> Configure purchase order to invoice workflow
                        </li>
                        <li>
                          <strong>Payroll Integration:</strong> Set up payroll journal posting rules
                        </li>
                        <li>
                          <strong>External Systems:</strong> Configure API connections to external platforms
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Role-Specific Guidelines</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">For Finance Managers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Regularly review financial dashboards</li>
                        <li>Monitor key performance indicators</li>
                        <li>Analyze budget variances</li>
                        <li>Review and approve journal entries</li>
                        <li>Oversee month-end closing process</li>
                        <li>Ensure compliance with accounting policies</li>
                        <li>Review and sign off on financial reports</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">For Accountants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Maintain accurate transaction records</li>
                        <li>Perform regular account reconciliations</li>
                        <li>Process journal entries</li>
                        <li>Manage accounts payable and receivable</li>
                        <li>Prepare financial statements</li>
                        <li>Assist with tax compliance</li>
                        <li>Support month-end and year-end closing</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">For Department Heads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Review departmental expenses</li>
                        <li>Monitor budget utilization</li>
                        <li>Approve expense claims</li>
                        <li>Validate purchase requisitions</li>
                        <li>Review financial reports for your area</li>
                        <li>Participate in budget planning</li>
                        <li>Ensure compliance with financial policies</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Security and Compliance</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Security Best Practices</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>
                        <strong>Access Control:</strong> Implement role-based access with least privilege principle
                      </li>
                      <li>
                        <strong>Password Policies:</strong> Enforce strong passwords and regular changes
                      </li>
                      <li>
                        <strong>Audit Trails:</strong> Enable comprehensive logging of all financial activities
                      </li>
                      <li>
                        <strong>Data Encryption:</strong> Ensure sensitive financial data is encrypted
                      </li>
                      <li>
                        <strong>Regular Backups:</strong> Implement automated backup procedures
                      </li>
                      <li>
                        <strong>Segregation of Duties:</strong> Ensure no single user can control an entire process
                      </li>
                      <li>
                        <strong>Session Management:</strong> Configure automatic timeouts for inactive sessions
                      </li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Compliance Considerations</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>
                        <strong>Tax Compliance:</strong> Ensure proper tax calculation and reporting
                      </li>
                      <li>
                        <strong>Regulatory Reporting:</strong> Configure reports to meet local requirements
                      </li>
                      <li>
                        <strong>Audit Readiness:</strong> Maintain documentation for all financial transactions
                      </li>
                      <li>
                        <strong>Data Retention:</strong> Configure retention policies per legal requirements
                      </li>
                      <li>
                        <strong>Financial Controls:</strong> Implement internal controls to prevent fraud
                      </li>
                      <li>
                        <strong>Approval Workflows:</strong> Ensure appropriate review and approval processes
                      </li>
                      <li>
                        <strong>Documentation:</strong> Maintain records of all financial policies and procedures
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" asChild>
          <Link href="/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documentation
          </Link>
        </Button>
        <Button asChild>
          <Link href="/documentation/inventory">
            Next: Inventory Module
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
