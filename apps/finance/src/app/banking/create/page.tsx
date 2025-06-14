"use client";

import React, { useEffect } from "react";
import { useForm, Controller, UseFormProps } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Zod schemas matching CreateBankingDto and nested DTOs
const bankDetailsSchema = z.object({
  bankName: z.string().nonempty("Bank name is required").max(32),
  branch: z.string().nonempty("Branch is required").max(32),
  bankAccType: z.enum([
    "checking",
    "savings",
    "fixed deposit",
    "current",
    "other",
  ]),
  currency: z.enum(["AED", "USD", "INR", "EUR", "GPB", "SAR"]),
  description: z.string().optional(),
});

const additionalDetailsSchema = z.object({
  swift_or_bic: z.string().max(11).optional(),
  iban: z.string().max(34).optional(),
});

const contactSchema = z.object({
  code: z.number().int().min(100).max(999),
  number: z.string().min(8).max(12),
  email: z.string().email(),
  reference: z.string().nonempty(),
});

const accountDetailsSchema = z.object({
  accNo: z.number().int().optional(),
  enabled: z.boolean(),
  name: z.string().min(3).max(32),
  type: z.enum(["asset", "liability", "equity", "expense", "revenue"]),
  subType: z.string().max(32),
  description: z.string().optional(),
});

const createBankingSchema = z.object({
  balance: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid decimal"),
  bankDetails: bankDetailsSchema,
  additionalDetails: additionalDetailsSchema,
  contact: contactSchema,
  accountDetails: accountDetailsSchema,
});

type FormValues = z.infer<typeof createBankingSchema>;

export default function CreateBankAccountPage() {
  const router = useRouter();

  const {
    register,
    setValue,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBankingSchema),
    defaultValues: {
      balance: "",
      bankDetails: {
        bankName: "",
        branch: "",
        bankAccType: "checking",
        currency: "AED",
        description: "",
      },
      additionalDetails: { swift_or_bic: "", iban: "" },
      contact: { code: 971, number: "", email: "", reference: "bank" },
      accountDetails: {
        accNo: undefined,
        enabled: true,
        name: "",
        type: "asset",
        subType: "",
        description: "",
      },
    },
  }); 

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch("http://localhost:5005/api/v1/banking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Bank account created successfully");
      router.push("/banking");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error creating account");
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    const payload = {
      ...data,
      accountDetails: {
        ...data.accountDetails,
        // copy the validated top–level balance into the nested DTO
        balance: data.balance,
      },
    };
    mutation.mutate(payload);
  };

 

  return (
    <form className="container mx-auto p-6 space-y-8">
      {/* Bank Core Details */}
      <section>
        <h2 className="text-xl font-bold">Bank Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" {...register("bankDetails.bankName")} />
            {errors.bankDetails?.bankName && (
              <p className="text-red-600">
                {errors.bankDetails.bankName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input id="branch" {...register("bankDetails.branch")} />
            {errors.bankDetails?.branch && (
              <p className="text-red-600">
                {errors.bankDetails.branch.message}
              </p>
            )}
          </div>
          <div>
            <Label>Account Type</Label>
            <Controller
              control={control}
              name="bankDetails.bankAccType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="fixed deposit">Fixed Deposit</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.bankDetails?.bankAccType && (
              <p className="text-red-600">
                {errors.bankDetails.bankAccType.message}
              </p>
            )}
          </div>
          <div>
            <Label>Currency</Label>
            <Controller
              control={control}
              name="bankDetails.currency"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GPB">GPB</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.bankDetails?.currency && (
              <p className="text-red-600">
                {errors.bankDetails.currency.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Opening Balance */}
      <section>
        <h2 className="text-xl font-bold">Opening Balance</h2>
        <div>
          <Label htmlFor="balance">Balance</Label>
          <Input
            id="balance"
            type="number"
            step="0.01"
            {...register("balance")}
          />
          {errors.balance && (
            <p className="text-red-600">{errors.balance.message}</p>
          )}
        </div>
      </section>

      {/* Additional Details */}
      <section>
        <h2 className="text-xl font-bold">Additional Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="swift_or_bic">SWIFT/BIC Code</Label>
            <Input
              id="swift_or_bic"
              {...register("additionalDetails.swift_or_bic")}
            />
            {errors.additionalDetails?.swift_or_bic && (
              <p className="text-red-600">
                {errors.additionalDetails.swift_or_bic.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="iban">IBAN</Label>
            <Input id="iban" {...register("additionalDetails.iban")} />
            {errors.additionalDetails?.iban && (
              <p className="text-red-600">
                {errors.additionalDetails.iban.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="text-xl font-bold">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="code">Country Code</Label>
            <Input
              id="code"
              type="number"
              {...register("contact.code", { valueAsNumber: true })}
            />
            {errors.contact?.code && (
              <p className="text-red-600">{errors.contact.code.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="number">Phone Number</Label>
            <Input id="number" {...register("contact.number")} />
            {errors.contact?.number && (
              <p className="text-red-600">{errors.contact.number.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("contact.email")} />
            {errors.contact?.email && (
              <p className="text-red-600">{errors.contact.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="reference">Reference</Label>
            <Input id="reference" {...register("contact.reference")} />
            {errors.contact?.reference && (
              <p className="text-red-600">{errors.contact.reference.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Account (COA) Details */}
      <section>
        <h2 className="text-xl font-bold">Chart of Accounts Entry</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Label htmlFor="accNo">
              Account Number{" "}
              <span className="text-slate-400">
                (optional: auto-incremeted if left blank)
              </span>
            </Label>
            <Input
              id="accNo"
              type="number"
              {...register("accountDetails.accNo", { valueAsNumber: true })}
            />
            {errors.accountDetails?.accNo && (
              <p className="text-red-600">
                {errors.accountDetails.accNo.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input id="name" {...register("accountDetails.name")} />
            {errors.accountDetails?.name && (
              <p className="text-red-600">
                {errors.accountDetails.name.message}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Controller
              control={control}
              name="accountDetails.enabled"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <span>
              {watch("accountDetails.enabled") ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div>
            <Label>Type</Label>
            <Controller
              control={control}
              name="accountDetails.type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset">Asset</SelectItem>
                    <SelectItem value="liability">Liability</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {typeof errors.accountDetails?.type === "object" &&
              errors.accountDetails?.type?.message && (
                <p className="text-red-600">
                  {errors.accountDetails.type.message}
                </p>
              )}
          </div>
          <div>
            <Label htmlFor="subType">Account Subtype</Label>
            <Select
              value={watch("accountDetails.subType")}
              onValueChange={(value) =>
                setValue("accountDetails.subType", value)
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
            {errors.accountDetails?.subType && (
              <p className="text-red-600">
                {errors.accountDetails.subType.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="acctDesc">Description</Label>
            <Textarea
              id="acctDesc"
              rows={3}
              {...register("accountDetails.description")}
            />
            {errors.accountDetails?.description && (
              <p className="text-red-600">
                {errors.accountDetails.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          className="px-6 disabled:opacity-50"
        >
          {mutation.isPending ? "Saving..." : "Save Account"}
        </Button>
      </div>
    </form>
  );
}
