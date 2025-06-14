import { z } from "zod"

// Account type enum
export const accountTypeEnum = z.enum(["Asset", "Liability", "Equity", "Revenue", "Expense"])

// Bank account type enum
export const bankAccountTypeEnum = z.enum(["Checking", "Savings", "Credit", "Investment"])

// Bank account currency enum
export const bankCurrencyEnum = z.enum(["AED", "USD", "EUR", "GBP", "INR"])

// Base account schema
export const accountSchema = z.object({
  accNo: z.number().int().positive("Account number must be a positive integer"),
  enabled: z.boolean().default(true),
  name: z.string().min(1, "Name is required").max(32, "Name must be 32 characters or less"),
  type: accountTypeEnum,
  subType: z.string().max(32, "Subtype must be 32 characters or less").optional(),
  balance: z.number().nonnegative("Balance must be non-negative").default(0),
  description: z.string().optional(),
})

// Bank account schema
export const bankAccountSchema = z.object({
  isBankAccount: z.boolean().default(false),
  bankName: z.string().max(32).optional(),
  branch: z.string().max(32).optional(),
  bankAccType: bankAccountTypeEnum.optional(),
  currency: bankCurrencyEnum.default("AED"),
  bankBalance: z.number().nonnegative("Bank balance must be non-negative").default(0),
  bankDescription: z.string().optional(),
})

// Additional bank details schema
export const additionalBankDetailsSchema = z.object({
  hasAdditionalDetails: z.boolean().default(false),
  swift_or_bic: z.string().optional(),
  iban: z.string().optional(),
  contactId: z.number().int().positive().optional(),
})

// Combined schema for the unified form
export const unifiedAccountSchema = accountSchema
  .merge(bankAccountSchema)
  .merge(additionalBankDetailsSchema)
  .refine(
    (data) => {
      // If it's a bank account, require bank name and branch
      if (data.isBankAccount) {
        return !!data.bankName && !!data.branch && !!data.bankAccType
      }
      return true
    },
    {
      message: "Bank name, branch, and account type are required for bank accounts",
      path: ["bankName"],
    },
  )
  .refine(
    (data) => {
      // If additional details are included, require SWIFT/BIC and IBAN
      if (data.hasAdditionalDetails) {
        return !!data.swift_or_bic && !!data.iban && !!data.contactId
      }
      return true
    },
    {
      message: "SWIFT/BIC, IBAN, and contact ID are required for additional bank details",
      path: ["swift_or_bic"],
    },
  )

export type UnifiedAccountFormValues = z.infer<typeof unifiedAccountSchema>

// Define subtypes based on account type
export const accountSubtypes: Record<z.infer<typeof accountTypeEnum>, string[]> = {
  Asset: ["Current Asset", "Fixed Asset", "Other Asset"],
  Liability: ["Current Liability", "Long-term Liability", "Other Liability"],
  Equity: ["Owner's Equity", "Retained Earnings", "Other Equity"],
  Revenue: ["Operating Revenue", "Other Revenue"],
  Expense: ["Cost of Sales", "Operating Expense", "Other Expense"],
}
