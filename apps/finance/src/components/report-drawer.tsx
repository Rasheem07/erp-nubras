"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadIcon, FileTextIcon, PrinterIcon, ShareIcon, UserIcon } from "lucide-react"
import { format } from "date-fns"

interface ReportDrawerProps {
  open: boolean
  onClose: () => void
  report: any | null
}

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "final":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "draft":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "in progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Format badge colors
const getFormatColor = (format: string) => {
  switch (format.toLowerCase()) {
    case "pdf":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "excel":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "csv":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Sample report content based on report type
const getReportContent = (report: any) => {
  if (!report) return null

  switch (report.title) {
    case "Income Statement":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Income Statement</h3>
          <p className="text-sm text-center text-muted-foreground">For the period ending {report.period}</p>

          <div className="space-y-2">
            <h4 className="font-medium">Revenue</h4>
            <div className="flex justify-between text-sm">
              <span>Sales Revenue</span>
              <span>$245,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Revenue</span>
              <span>$78,500.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Revenue</span>
              <span>$323,500.00</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Cost of Goods Sold</h4>
            <div className="flex justify-between text-sm">
              <span>Cost of Goods Sold</span>
              <span>$142,300.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Gross Profit</span>
              <span>$181,200.00</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Operating Expenses</h4>
            <div className="flex justify-between text-sm">
              <span>Salaries and Wages</span>
              <span>$85,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rent</span>
              <span>$12,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Utilities</span>
              <span>$5,500.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Office Supplies</span>
              <span>$3,200.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Marketing</span>
              <span>$8,500.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Insurance</span>
              <span>$4,800.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Depreciation</span>
              <span>$7,200.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Operating Expenses</span>
              <span>$126,200.00</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Net Income</span>
            <span>$55,000.00</span>
          </div>
        </div>
      )

    case "Balance Sheet":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Balance Sheet</h3>
          <p className="text-sm text-center text-muted-foreground">As of {report.period}</p>

          <div className="space-y-2">
            <h4 className="font-medium">Assets</h4>
            <div className="space-y-1">
              <h5 className="text-sm font-medium">Current Assets</h5>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Cash</span>
                <span>$78,500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Accounts Receivable</span>
                <span>$45,200.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Inventory</span>
                <span>$62,300.00</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="pl-4">Total Current Assets</span>
                <span>$186,000.00</span>
              </div>
            </div>

            <div className="space-y-1 mt-2">
              <h5 className="text-sm font-medium">Non-Current Assets</h5>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Property, Plant & Equipment</span>
                <span>$320,000.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Less: Accumulated Depreciation</span>
                <span>($85,000.00)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Intangible Assets</span>
                <span>$45,000.00</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="pl-4">Total Non-Current Assets</span>
                <span>$280,000.00</span>
              </div>
            </div>

            <div className="flex justify-between font-medium">
              <span>Total Assets</span>
              <span>$466,000.00</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Liabilities</h4>
            <div className="space-y-1">
              <h5 className="text-sm font-medium">Current Liabilities</h5>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Accounts Payable</span>
                <span>$32,500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Short-term Loans</span>
                <span>$15,000.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Accrued Expenses</span>
                <span>$8,500.00</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="pl-4">Total Current Liabilities</span>
                <span>$56,000.00</span>
              </div>
            </div>

            <div className="space-y-1 mt-2">
              <h5 className="text-sm font-medium">Non-Current Liabilities</h5>
              <div className="flex justify-between text-sm">
                <span className="pl-4">Long-term Loans</span>
                <span>$120,000.00</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="pl-4">Total Non-Current Liabilities</span>
                <span>$120,000.00</span>
              </div>
            </div>

            <div className="flex justify-between font-medium">
              <span>Total Liabilities</span>
              <span>$176,000.00</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Equity</h4>
            <div className="flex justify-between text-sm">
              <span className="pl-4">Share Capital</span>
              <span>$200,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="pl-4">Retained Earnings</span>
              <span>$90,000.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Equity</span>
              <span>$290,000.00</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total Liabilities and Equity</span>
            <span>$466,000.00</span>
          </div>
        </div>
      )

    case "Cash Flow Statement":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Cash Flow Statement</h3>
          <p className="text-sm text-center text-muted-foreground">For the period ending {report.period}</p>

          <div className="space-y-2">
            <h4 className="font-medium">Operating Activities</h4>
            <div className="flex justify-between text-sm">
              <span>Net Income</span>
              <span>$55,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Depreciation</span>
              <span>$7,200.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Increase in Accounts Receivable</span>
              <span>($12,500.00)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Decrease in Inventory</span>
              <span>$8,300.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Increase in Accounts Payable</span>
              <span>$5,200.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Net Cash from Operating Activities</span>
              <span>$63,200.00</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Investing Activities</h4>
            <div className="flex justify-between text-sm">
              <span>Purchase of Equipment</span>
              <span>($25,000.00)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sale of Investments</span>
              <span>$12,000.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Net Cash used in Investing Activities</span>
              <span>($13,000.00)</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Financing Activities</h4>
            <div className="flex justify-between text-sm">
              <span>Repayment of Loans</span>
              <span>($10,000.00)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Dividends Paid</span>
              <span>($15,000.00)</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Net Cash used in Financing Activities</span>
              <span>($25,000.00)</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Net Increase in Cash</span>
            <span>$25,200.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cash at Beginning of Period</span>
            <span>$53,300.00</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Cash at End of Period</span>
            <span>$78,500.00</span>
          </div>
        </div>
      )

    case "Accounts Receivable Aging":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Accounts Receivable Aging</h3>
          <p className="text-sm text-center text-muted-foreground">As of {report.period}</p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Customer</th>
                <th className="text-right py-2">Current</th>
                <th className="text-right py-2">1-30 Days</th>
                <th className="text-right py-2">31-60 Days</th>
                <th className="text-right py-2">61-90 Days</th>
                <th className="text-right py-2">&gt;90 Days</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">ABC Company</td>
                <td className="text-right py-2">$5,200.00</td>
                <td className="text-right py-2">$3,500.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2 font-medium">$8,700.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">XYZ Corporation</td>
                <td className="text-right py-2">$7,800.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$2,500.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2 font-medium">$10,300.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">123 Industries</td>
                <td className="text-right py-2">$3,200.00</td>
                <td className="text-right py-2">$4,500.00</td>
                <td className="text-right py-2">$1,800.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2 font-medium">$9,500.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Smith & Co</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$2,300.00</td>
                <td className="text-right py-2">$3,500.00</td>
                <td className="text-right py-2">$1,200.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2 font-medium">$7,000.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Johnson LLC</td>
                <td className="text-right py-2">$4,500.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">$5,200.00</td>
                <td className="text-right py-2 font-medium">$9,700.00</td>
              </tr>
              <tr className="font-medium">
                <td className="py-2">Total</td>
                <td className="text-right py-2">$20,700.00</td>
                <td className="text-right py-2">$10,300.00</td>
                <td className="text-right py-2">$7,800.00</td>
                <td className="text-right py-2">$1,200.00</td>
                <td className="text-right py-2">$5,200.00</td>
                <td className="text-right py-2 font-semibold">$45,200.00</td>
              </tr>
            </tbody>
          </table>

          <div className="pt-4">
            <h4 className="font-medium">Summary</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm font-medium">Current</p>
                <p className="text-lg font-semibold">$20,700.00</p>
                <p className="text-xs text-muted-foreground">45.8% of total</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md">
                <p className="text-sm font-medium">Overdue</p>
                <p className="text-lg font-semibold">$24,500.00</p>
                <p className="text-xs text-muted-foreground">54.2% of total</p>
              </div>
            </div>
          </div>
        </div>
      )

    case "Budget vs Actual":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Budget vs Actual</h3>
          <p className="text-sm text-center text-muted-foreground">For the period {report.period}</p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Category</th>
                <th className="text-right py-2">Budget</th>
                <th className="text-right py-2">Actual</th>
                <th className="text-right py-2">Variance</th>
                <th className="text-right py-2">Variance %</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium" colSpan={5}>
                  Revenue
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Sales Revenue</td>
                <td className="text-right py-2">$250,000.00</td>
                <td className="text-right py-2">$245,000.00</td>
                <td className="text-right py-2 text-red-600">($5,000.00)</td>
                <td className="text-right py-2 text-red-600">-2.0%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Service Revenue</td>
                <td className="text-right py-2">$75,000.00</td>
                <td className="text-right py-2">$78,500.00</td>
                <td className="text-right py-2 text-green-600">$3,500.00</td>
                <td className="text-right py-2 text-green-600">4.7%</td>
              </tr>
              <tr className="border-b font-medium">
                <td className="py-2 pl-2">Total Revenue</td>
                <td className="text-right py-2">$325,000.00</td>
                <td className="text-right py-2">$323,500.00</td>
                <td className="text-right py-2 text-red-600">($1,500.00)</td>
                <td className="text-right py-2 text-red-600">-0.5%</td>
              </tr>

              <tr className="border-b">
                <td className="py-2 font-medium" colSpan={5}>
                  Expenses
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Cost of Goods Sold</td>
                <td className="text-right py-2">$140,000.00</td>
                <td className="text-right py-2">$142,300.00</td>
                <td className="text-right py-2 text-red-600">($2,300.00)</td>
                <td className="text-right py-2 text-red-600">-1.6%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Salaries and Wages</td>
                <td className="text-right py-2">$82,000.00</td>
                <td className="text-right py-2">$85,000.00</td>
                <td className="text-right py-2 text-red-600">($3,000.00)</td>
                <td className="text-right py-2 text-red-600">-3.7%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Rent</td>
                <td className="text-right py-2">$12,000.00</td>
                <td className="text-right py-2">$12,000.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">0.0%</td>
              </tr>

              <tr className="border-b">
                <td className="py-2 pl-4">Utilities</td>
                <td className="text-right py-2">$5,000.00</td>
                <td className="text-right py-2">$5,500.00</td>
                <td className="text-right py-2 text-red-600">($500.00)</td>
                <td className="text-right py-2 text-red-600">-10.0%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Marketing</td>
                <td className="text-right py-2">$10,000.00</td>
                <td className="text-right py-2">$8,500.00</td>
                <td className="text-right py-2 text-green-600">$1,500.00</td>
                <td className="text-right py-2 text-green-600">15.0%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pl-4">Other Expenses</td>
                <td className="text-right py-2">$20,000.00</td>
                <td className="text-right py-2">$15,700.00</td>
                <td className="text-right py-2 text-green-600">$4,300.00</td>
                <td className="text-right py-2 text-green-600">21.5%</td>
              </tr>
              <tr className="border-b font-medium">
                <td className="py-2 pl-2">Total Expenses</td>
                <td className="text-right py-2">$269,000.00</td>
                <td className="text-right py-2">$269,000.00</td>
                <td className="text-right py-2">$0.00</td>
                <td className="text-right py-2">0.0%</td>
              </tr>

              <tr className="font-semibold">
                <td className="py-2">Net Income</td>
                <td className="text-right py-2">$56,000.00</td>
                <td className="text-right py-2">$54,500.00</td>
                <td className="text-right py-2 text-red-600">($1,500.00)</td>
                <td className="text-right py-2 text-red-600">-2.7%</td>
              </tr>
            </tbody>
          </table>

          <div className="pt-4">
            <h4 className="font-medium">Summary</h4>
            <p className="text-sm mt-2">
              Overall budget performance is on target with a slight variance of -2.7% in net income. Revenue is slightly
              below budget by 0.5%, while expenses are exactly on budget. Notable savings in marketing (15.0%) and other
              expenses (21.5%) offset overages in salaries and utilities.
            </p>
          </div>
        </div>
      )

    default:
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <FileTextIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            Preview not available for this report type. Please download the report to view its contents.
          </p>
          <Button className="mt-4">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      )
  }
}

export function ReportDrawer({ open, onClose, report }: ReportDrawerProps) {
  const [activeTab, setActiveTab] = useState("preview")

  if (!report) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold">{report.title}</SheetTitle>
          <SheetDescription>{report.description}</SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
              <Badge className={getFormatColor(report.format)}>{report.format}</Badge>
            </div>

            <div className="border rounded-md p-4 overflow-auto max-h-[500px]">{getReportContent(report)}</div>

            <div className="flex justify-between pt-4">
              <Button variant="outline">
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </Button>
              <div className="space-x-2">
                <Button variant="outline">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Report Type</p>
                <p className="font-medium">{report.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Period</p>
                <p>{report.period}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date Generated</p>
                <p>{format(report.dateGenerated, "MMMM d, yyyy")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Format</p>
                <p>{report.format}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{report.createdBy}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{report.description}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-1">
                {report.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {report.status === "Draft" && (
              <div className="flex justify-end pt-4">
                <Button>Finalize Report</Button>
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
                  <p className="text-sm font-medium">Report created</p>
                  <p className="text-xs text-muted-foreground">
                    {format(report.dateGenerated, "MMMM d, yyyy")} at 10:30 AM
                  </p>
                  <p className="text-sm">{report.createdBy} created this report</p>
                </div>
              </div>

              {report.status === "Final" && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FileTextIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Report finalized</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(report.dateGenerated.getTime() + 86400000), "MMMM d, yyyy")} at 2:15 PM
                    </p>
                    <p className="text-sm">{report.createdBy} finalized this report</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <DownloadIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Report downloaded</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(report.dateGenerated.getTime() + 172800000), "MMMM d, yyyy")} at 11:45 AM
                  </p>
                  <p className="text-sm">Finance Manager downloaded this report</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
