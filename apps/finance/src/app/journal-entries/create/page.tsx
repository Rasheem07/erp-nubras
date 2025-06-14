"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Save, Trash, Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { type Resolver } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Account } from "@/app/accounts/accounts.type";
import { FetchAllAccounts } from "@/services/accounts";

// Schemas
const journalEntryLineSchema = z.object({
  accountId: z.string().nonempty(),
  debit: z.string().refine((v) => !isNaN(parseFloat(v)), {
    message: "debit must be a valid decimal string",
  }),
  credit: z.string().refine((v) => !isNaN(parseFloat(v)), {
    message: "credit must be a valid decimal string",
  }),
});

const createJournalEntrySchema = z.object({
  date: z.string().optional(),
  refType: z.string().optional(),
  refNo: z.preprocess((val) => Number(val), z.number().int().optional()),
  description: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().default("draft"),
  journalEntryLines: z.array(journalEntryLineSchema).min(2),
});

type FormValues = z.infer<typeof createJournalEntrySchema>;

export default function CreateJournalEntryPage() {
  const router = useRouter();

  const resolver = zodResolver(
    createJournalEntrySchema
  ) as Resolver<FormValues>;
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      refType: "",
      refNo: undefined,
      description: "",
      notes: "",
      status: "draft",
      journalEntryLines: [
        { accountId: "", debit: "0.00", credit: "0.00" },
        { accountId: "", debit: "0.00", credit: "0.00" },
      ],
    },
  });

  const [accountListStatus, setAccountListStatus] = useState<boolean>(true);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        return await FetchAllAccounts();
      } catch (error) {
        setAccountListStatus(false);
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "journalEntryLines",
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      refType: data.refType,
      refNo: data.refNo,
      description: data.description,
      notes: data.notes,
      status: data.status,
      journalEntryLines: data.journalEntryLines.map((line) => ({
        accountId: Number(line.accountId),
        debit: line.debit,
        credit: line.credit,
      })),
    };
    const res = await fetch("http://localhost:5005/api/v1/journal-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) router.push("/journal-entries");
    else console.error(await res.json());
  };

  const entries = watch("journalEntryLines");
  const debitTotal = entries.reduce(
    (sum, e) => sum + parseFloat(e.debit || "0"),
    0
  );
  const creditTotal = entries.reduce(
    (sum, e) => sum + parseFloat(e.credit || "0"),
    0
  );
  const isBalanced = debitTotal === creditTotal && debitTotal > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create Journal Entry
          </h2>
          <p className="text-muted-foreground">
            Create a new general ledger journal entry
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Journal Entry Information</CardTitle>
            <CardDescription>
              Enter the details for the new journal entry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input {...register("date")} type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refNo">Reference no</Label>
                <Input
                  {...register("refNo", { valueAsNumber: true })}
                  placeholder="e.g., INV-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refType">Reference type</Label>
                <Input {...register("refType")} placeholder="e.g., Invoice" />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  {...register("description")}
                  placeholder="Enter description"
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Journal Entry Lines</h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`text-sm ${isBalanced ? "text-green-600" : "text-red-600"}`}
                  >
                    {isBalanced ? "Balanced" : "Unbalanced"}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ accountId: "", debit: "0.00", credit: "0.00" })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Line
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Account</TableHead>
                      <TableHead className="text-right">Debit (AED)</TableHead>
                      <TableHead className="text-right">Credit (AED)</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            control={control}
                            name={`journalEntryLines.${index}.accountId`}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                  {accountListStatus !== false ? (
                                    accounts &&
                                    accounts!.length > 0 &&
                                    accounts!.map((acc) => (
                                      <SelectItem
                                        key={acc.accNo}
                                        value={String(acc.accNo)}
                                      >
                                        {acc.accNo + " - " + acc.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <p>error loading account options</p>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            {...register(`journalEntryLines.${index}.debit`)}
                            type="number"
                            step="0.01"
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            {...register(`journalEntryLines.${index}.credit`)}
                            type="number"
                            step="0.01"
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 2}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(debitTotal)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(creditTotal)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                {...register("notes")}
                rows={3}
                placeholder="Additional notes"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => alert("Auto-balance feature placeholder")}
              >
                <Calculator className="mr-2 h-4 w-4" /> Auto-Balance
              </Button>
              <Button type="submit" disabled={!isBalanced}>
                <Save className="mr-2 h-4 w-4" /> Save Journal Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
