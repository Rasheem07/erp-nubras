// Finance Service - Central data management for finance module

import { v4 as uuidv4 } from "uuid"

// Core financial data models
export interface Account {
  id: string
  code: string
  name: string
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense"
  subtype: string
  balance: number
  description: string
  isActive: boolean
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  date: Date
  description: string
  reference: string
  amount: number
  type: "Debit" | "Credit"
  accountId: string
  journalEntryId?: string
  reconciled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface JournalEntry {
  id: string
  date: Date
  reference: string
  description: string
  status: "Draft" | "Posted" | "Rejected"
  postingDate?: Date
  transactions: Transaction[]
  createdBy: string
  approvedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customer: string
  issueDate: Date
  dueDate: Date
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled"
  subtotal: number
  tax: number
  total: number
  items: InvoiceItem[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
  tax?: number
  total: number
}

export interface ExpenseClaim {
  id: string
  employee: string
  department: string
  date: Date
  total: number
  status: "Draft" | "Submitted" | "Approved" | "Rejected"
  paymentStatus: "Not Paid" | "Pending" | "Paid"
  description: string
  items: ExpenseItem[]
  approvedBy?: string
  approvalDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseItem {
  id: string
  category: string
  description: string
  amount: number
  date: Date
  receipt?: string
  taxDeductible: boolean
}

export interface ExpenseCategory {
  id: string
  name: string
  description: string
  defaultTaxRate?: number
  defaultGLAccount?: string
  isActive: boolean
}

export interface BankAccount {
  id: string
  accountName: string
  accountNumber: string
  bank: string
  currency: string
  balance: number
  status: "Active" | "Inactive"
  lastUpdated: Date
  type: "Checking" | "Savings" | "Credit Card" | "Fixed Deposit"
  description: string
  glAccountId: string
}

export interface BankReconciliation {
  id: string
  accountId: string
  startDate: Date
  endDate: Date
  bankBalance: number
  bookBalance: number
  difference: number
  status: "In Progress" | "Completed"
  items: ReconciliationItem[]
  lastReconciled: Date
  createdAt: Date
  updatedAt: Date
}

export interface ReconciliationItem {
  id: string
  transactionId: string
  date: Date
  description: string
  amount: number
  matched: boolean
  notes?: string
}

export interface Budget {
  id: string
  name: string
  type: "Operating" | "Capital" | "Project"
  period: "Monthly" | "Quarterly" | "Annual" | "Custom"
  startDate: Date
  endDate: Date
  status: "Draft" | "Active" | "Closed"
  totalBudget: number
  spent: number
  remaining: number
  percentUsed: number
  departments: string[]
  items: BudgetItem[]
  createdAt: Date
  updatedAt: Date
}

export interface BudgetItem {
  id: string
  accountId: string
  description: string
  amount: number
  actual: number
  variance: number
}

export interface TaxRate {
  id: string
  name: string
  rate: number
  type: "Sales" | "Purchase" | "Income" | "Withholding"
  isActive: boolean
}

export interface Currency {
  code: string
  name: string
  symbol: string
  exchangeRate: number // Relative to base currency
  isBaseCurrency: boolean
}

export interface FinancialReport {
  id: string
  title: string
  type: string
  period: string
  dateGenerated: Date
  status: "Draft" | "Final"
  format: "PDF" | "Excel" | "CSV"
  createdBy: string
  description: string
  tags: string[]
  data?: any
}

export interface FiscalYear {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: "Open" | "Closed"
  periods: FiscalPeriod[]
}

export interface FiscalPeriod {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: "Open" | "Closed"
}

// Mock data store
class FinanceDataStore {
  private accounts: Account[] = []
  private transactions: Transaction[] = []
  private journalEntries: JournalEntry[] = []
  private invoices: Invoice[] = []
  private expenseClaims: ExpenseClaim[] = []
  private expenseCategories: ExpenseCategory[] = []
  private bankAccounts: BankAccount[] = []
  private bankReconciliations: BankReconciliation[] = []
  private budgets: Budget[] = []
  private taxRates: TaxRate[] = []
  private currencies: Currency[] = []
  private financialReports: FinancialReport[] = []
  private fiscalYears: FiscalYear[] = []

  // Initialize with sample data
  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Initialize with sample data
    this.initializeAccounts()
    this.initializeExpenseCategories()
    this.initializeTaxRates()
    this.initializeCurrencies()
    this.initializeFiscalYears()
  }

  private initializeAccounts() {
    this.accounts = [
      {
        id: "1000",
        code: "1000",
        name: "Cash",
        type: "Asset",
        subtype: "Current Asset",
        balance: 15000.0,
        description: "Cash on hand and in bank accounts",
        isActive: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      },
      {
        id: "1100",
        code: "1100",
        name: "Accounts Receivable",
        type: "Asset",
        subtype: "Current Asset",
        balance: 25000.0,
        description: "Amounts owed to the company by customers",
        isActive: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      },
      {
        id: "2000",
        code: "2000",
        name: "Accounts Payable",
        type: "Liability",
        subtype: "Current Liability",
        balance: 18000.0,
        description: "Amounts owed by the company to suppliers",
        isActive: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      },
      {
        id: "3000",
        code: "3000",
        name: "Owner's Equity",
        type: "Equity",
        subtype: "Equity",
        balance: 100000.0,
        description: "Owner's investment in the business",
        isActive: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      },
      {
        id: "4000",
        code: "4000",
        name: "Sales Revenue",
        type: "Revenue",
        subtype: "Operating Revenue",
        balance: 120000.0,
        description: "Income from sales of goods and services",
        isActive: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      },
      {
        id: "5000",
        code: "5000",
        name: "Cost of Goods Sold",
        type: "Expense",
        subtype: "Cost of Sales",
        balance: 65000.0,
        description: "Direct costs attributable to the production of goods sold",
        isActive: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      },
    ]
  }

  private initializeExpenseCategories() {
    this.expenseCategories = [
      {
        id: "cat-001",
        name: "Office Supplies",
        description: "Stationery, printer ink, and other office consumables",
        defaultTaxRate: 5,
        defaultGLAccount: "6100",
        isActive: true,
      },
      {
        id: "cat-002",
        name: "Travel",
        description: "Business travel expenses including airfare, hotels, and transportation",
        defaultTaxRate: 0,
        defaultGLAccount: "6200",
        isActive: true,
      },
      {
        id: "cat-003",
        name: "Meals & Entertainment",
        description: "Business meals and client entertainment expenses",
        defaultTaxRate: 5,
        defaultGLAccount: "6300",
        isActive: true,
      },
      {
        id: "cat-004",
        name: "Rent",
        description: "Office and facility rental expenses",
        defaultTaxRate: 0,
        defaultGLAccount: "6400",
        isActive: true,
      },
      {
        id: "cat-005",
        name: "Utilities",
        description: "Electricity, water, internet, and phone expenses",
        defaultTaxRate: 5,
        defaultGLAccount: "6500",
        isActive: true,
      },
      {
        id: "cat-006",
        name: "Professional Services",
        description: "Legal, accounting, and consulting fees",
        defaultTaxRate: 5,
        defaultGLAccount: "6600",
        isActive: true,
      },
      {
        id: "cat-007",
        name: "Marketing & Advertising",
        description: "Promotional materials, advertising, and marketing campaigns",
        defaultTaxRate: 5,
        defaultGLAccount: "6700",
        isActive: true,
      },
      {
        id: "cat-008",
        name: "Software & Subscriptions",
        description: "Software licenses and subscription services",
        defaultTaxRate: 5,
        defaultGLAccount: "6800",
        isActive: true,
      },
    ]
  }

  private initializeTaxRates() {
    this.taxRates = [
      {
        id: "tax-001",
        name: "Standard VAT",
        rate: 5.0,
        type: "Sales",
        isActive: true,
      },
      {
        id: "tax-002",
        name: "Zero Rate",
        rate: 0.0,
        type: "Sales",
        isActive: true,
      },
      {
        id: "tax-003",
        name: "Corporate Income Tax",
        rate: 9.0,
        type: "Income",
        isActive: true,
      },
      {
        id: "tax-004",
        name: "Customs Duty",
        rate: 5.0,
        type: "Purchase",
        isActive: true,
      },
      {
        id: "tax-005",
        name: "Excise Tax",
        rate: 50.0,
        type: "Sales",
        isActive: true,
      },
    ]
  }

  private initializeCurrencies() {
    this.currencies = [
      {
        code: "AED",
        name: "UAE Dirham",
        symbol: "د.إ",
        exchangeRate: 1,
        isBaseCurrency: true,
      },
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        exchangeRate: 0.27,
        isBaseCurrency: false,
      },
      {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        exchangeRate: 0.25,
        isBaseCurrency: false,
      },
      {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        exchangeRate: 0.21,
        isBaseCurrency: false,
      },
      {
        code: "SAR",
        name: "Saudi Riyal",
        symbol: "﷼",
        exchangeRate: 1.02,
        isBaseCurrency: false,
      },
    ]
  }

  private initializeFiscalYears() {
    const currentYear = new Date().getFullYear()

    // Create fiscal periods (months) for the current year
    const periods: FiscalPeriod[] = []
    for (let i = 0; i < 12; i++) {
      const startDate = new Date(currentYear, i, 1)
      const endDate = new Date(currentYear, i + 1, 0)
      periods.push({
        id: `period-${currentYear}-${i + 1}`,
        name: `${startDate.toLocaleString("default", { month: "long" })} ${currentYear}`,
        startDate,
        endDate,
        status: new Date() > endDate ? "Closed" : "Open",
      })
    }

    this.fiscalYears = [
      {
        id: `fy-${currentYear}`,
        name: `Fiscal Year ${currentYear}`,
        startDate: new Date(currentYear, 0, 1),
        endDate: new Date(currentYear, 11, 31),
        status: "Open",
        periods,
      },
    ]
  }

  // Account methods
  getAccounts(): Account[] {
    return [...this.accounts]
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.find((account) => account.id === id)
  }

  createAccount(account: Omit<Account, "id" | "createdAt" | "updatedAt">): Account {
    const newAccount: Account = {
      ...account,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.accounts.push(newAccount)
    return newAccount
  }

  updateAccount(id: string, updates: Partial<Account>): Account | undefined {
    const index = this.accounts.findIndex((account) => account.id === id)
    if (index === -1) return undefined

    const updatedAccount = {
      ...this.accounts[index],
      ...updates,
      updatedAt: new Date(),
    }

    this.accounts[index] = updatedAccount
    return updatedAccount
  }

  // Expense Category methods
  getExpenseCategories(): ExpenseCategory[] {
    return [...this.expenseCategories]
  }

  getExpenseCategoryById(id: string): ExpenseCategory | undefined {
    return this.expenseCategories.find((category) => category.id === id)
  }

  createExpenseCategory(category: Omit<ExpenseCategory, "id">): ExpenseCategory {
    const newCategory: ExpenseCategory = {
      ...category,
      id: uuidv4(),
    }
    this.expenseCategories.push(newCategory)
    return newCategory
  }

  updateExpenseCategory(id: string, updates: Partial<ExpenseCategory>): ExpenseCategory | undefined {
    const index = this.expenseCategories.findIndex((category) => category.id === id)
    if (index === -1) return undefined

    const updatedCategory = {
      ...this.expenseCategories[index],
      ...updates,
    }

    this.expenseCategories[index] = updatedCategory
    return updatedCategory
  }

  // Tax Rate methods
  getTaxRates(): TaxRate[] {
    return [...this.taxRates]
  }

  // Currency methods
  getCurrencies(): Currency[] {
    return [...this.currencies]
  }

  getBaseCurrency(): Currency {
    return this.currencies.find((currency) => currency.isBaseCurrency) || this.currencies[0]
  }

  updateCurrencyRate(code: string, rate: number): Currency | undefined {
    const index = this.currencies.findIndex((currency) => currency.code === code)
    if (index === -1) return undefined

    const updatedCurrency = {
      ...this.currencies[index],
      exchangeRate: rate,
    }

    this.currencies[index] = updatedCurrency
    return updatedCurrency
  }

  // Fiscal Year methods
  getCurrentFiscalYear(): FiscalYear | undefined {
    const now = new Date()
    return this.fiscalYears.find((fy) => now >= fy.startDate && now <= fy.endDate && fy.status === "Open")
  }

  getCurrentFiscalPeriod(): FiscalPeriod | undefined {
    const now = new Date()
    const currentFY = this.getCurrentFiscalYear()
    if (!currentFY) return undefined

    return currentFY.periods.find(
      (period) => now >= period.startDate && now <= period.endDate && period.status === "Open",
    )
  }
}

// Create a singleton instance
const financeDataStore = new FinanceDataStore()

// Finance Service - Business logic layer
export class FinanceService {
  // Get the data store
  private dataStore = financeDataStore

  // Chart of Accounts
  getChartOfAccounts(): Account[] {
    return this.dataStore.getAccounts()
  }

  getAccountById(id: string): Account | undefined {
    return this.dataStore.getAccountById(id)
  }

  createAccount(account: Omit<Account, "id" | "createdAt" | "updatedAt">): Account {
    // Validate account code is unique
    const accounts = this.dataStore.getAccounts()
    if (accounts.some((a) => a.code === account.code)) {
      throw new Error(`Account code ${account.code} already exists`)
    }

    return this.dataStore.createAccount(account)
  }

  updateAccount(id: string, updates: Partial<Account>): Account | undefined {
    // Validate account code is unique if being updated
    if (updates.code) {
      const accounts = this.dataStore.getAccounts()
      const existingAccount = accounts.find((a) => a.code === updates.code && a.id !== id)
      if (existingAccount) {
        throw new Error(`Account code ${updates.code} already exists`)
      }
    }

    return this.dataStore.updateAccount(id, updates)
  }

  // Expense Categories
  getExpenseCategories(): ExpenseCategory[] {
    return this.dataStore.getExpenseCategories()
  }

  getExpenseCategoryById(id: string): ExpenseCategory | undefined {
    return this.dataStore.getExpenseCategoryById(id)
  }

  createExpenseCategory(category: Omit<ExpenseCategory, "id">): ExpenseCategory {
    return this.dataStore.createExpenseCategory(category)
  }

  updateExpenseCategory(id: string, updates: Partial<ExpenseCategory>): ExpenseCategory | undefined {
    return this.dataStore.updateExpenseCategory(id, updates)
  }

  // Tax Rates
  getTaxRates(): TaxRate[] {
    return this.dataStore.getTaxRates()
  }

  // Multi-currency support
  getCurrencies(): Currency[] {
    return this.dataStore.getCurrencies()
  }

  getBaseCurrency(): Currency {
    return this.dataStore.getBaseCurrency()
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string): number {
    const currencies = this.dataStore.getCurrencies()
    const fromCurrencyObj = currencies.find((c) => c.code === fromCurrency)
    const toCurrencyObj = currencies.find((c) => c.code === toCurrency)

    if (!fromCurrencyObj || !toCurrencyObj) {
      throw new Error("Invalid currency code")
    }

    // Convert to base currency first, then to target currency
    const amountInBaseCurrency = amount / fromCurrencyObj.exchangeRate
    return amountInBaseCurrency * toCurrencyObj.exchangeRate
  }

  // Fiscal Year and Period Management
  getCurrentFiscalYear(): FiscalYear | undefined {
    return this.dataStore.getCurrentFiscalYear()
  }

  getCurrentFiscalPeriod(): FiscalPeriod | undefined {
    return this.dataStore.getCurrentFiscalPeriod()
  }

  // Utility functions
  formatCurrency(amount: number, currencyCode?: string): string {
    const currency = currencyCode
      ? this.dataStore.getCurrencies().find((c) => c.code === currencyCode)
      : this.dataStore.getBaseCurrency()

    if (!currency) {
      throw new Error(`Invalid currency code: ${currencyCode}`)
    }

    return `${currency.symbol} ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  calculateTax(amount: number, taxRateId: string): number {
    const taxRates = this.dataStore.getTaxRates()
    const taxRate = taxRates.find((tax) => tax.id === taxRateId)

    if (!taxRate) {
      throw new Error(`Tax rate with ID ${taxRateId} not found`)
    }

    return amount * (taxRate.rate / 100)
  }
}

// Export a singleton instance
export const financeService = new FinanceService()
