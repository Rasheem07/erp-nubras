"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  Controller,
  useFieldArray,
  type Resolver,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash,
  Eye,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { GetRequest } from "../../../lib/requestHelper";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
//
// 1) Zod schema matching your DB models
//
const invoiceItemSchema = z.object({
  itemId: z.string().nonempty(),
  quantity: z.number().min(1),
  total: z.number().min(0),
});

const taxSchema = z.object({
  taxName: z.string().nonempty(),
  rate: z.number().min(0),
  applyOn: z.enum(["Net Total", "Previous Row Amount", "Previous Row Total"]),
  enabled: z.boolean(),
});

const invoiceSchema = z.object({
  type: z.enum(["sales", "purchase"]),
  customerId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  deliveryDate: z
    .string()
    .optional()
    .nullable()
    .refine((d) => !d || !isNaN(Date.parse(d)), "Invalid date"),
  shippingMethod: z.string().max(25).optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1),
  taxes: z.array(taxSchema).min(1),
});

type InvoiceForm = z.infer<typeof invoiceSchema>;

export default function CreateInvoicePage() {
  const router = useRouter();

  const { data: customersList = [], isLoading: customerLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        return await GetRequest("customers", "Failed to fetch customers");
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  const { data: suppliersList = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      try {
        return await GetRequest("suppliers", "Failed to fetch suppliers");
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [custPopoverOpen, setCustPopoverOpen] = useState(false);
  const [supPopoverOpen, setSupPopoverOpen] = useState(false);

  const resolver = zodResolver(invoiceSchema) as Resolver<InvoiceForm>
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceForm>({
    resolver,
    defaultValues: {
      type: "sales",
      customerId: "",
      supplierId: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      deliveryDate: "",
      shippingMethod: "",
      notes: "",
      items: [{ itemId: "", quantity: 1, total: 0 }],
      taxes: [{ taxName: "VAT", rate: 5, applyOn: "Net Total", enabled: true }],
    },
  });

  // Items field array
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({ control, name: "items" });

  // Taxes field array
  const {
    fields: taxFields,
    append: appendTax,
    remove: removeTax,
  } = useFieldArray({ control, name: "taxes" });

  // Helpers
  const subtotal = () => watch("items").reduce((sum, i) => sum + i.total, 0);

  const taxAmount = () =>
    watch("taxes")
      .filter((t) => t.enabled)
      .reduce((sum, t) => sum + subtotal() * (t.rate / 100), 0);

  const total = () => subtotal() + taxAmount();

  // React-Query mutation
  const createInvoice = async (payload: any) => {
    const res = await fetch("http://localhost:5005/api/v1/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create invoice");
    return res.json();
  };

  const mutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => router.push("/invoices"),
  });

  // Submit
  const onSubmit = (data: InvoiceForm) => {
    const payload = {
      ...data,
      customerId: data.type === "sales" ? Number(data.customerId) : null,
      supplierId: data.type === "purchase" ? Number(data.supplierId) : null,
      netAmount: subtotal(),
      taxAmount: taxAmount(),
      totalAmount: total(),
      items: data.items.map((i) => ({
        itemId: Number(i.itemId),
        quantity: i.quantity,
        total: i.total,
      })),
      taxes: data.taxes.map((t) => ({
        taxName: t.taxName,
        rate: t.rate,
        applyOn: t.applyOn,
        enabled: t.enabled,
      })),
    };
    mutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Create New Invoice
            </h2>
            <p className="text-muted-foreground">
              Create a new sales or purchase invoice
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} className="gap-2">
          <Save className="h-4 w-4" />
          Save Invoice
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="items" className="w-full" onValueChange={() => {}}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="taxes">Taxes & Charges</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* Items & Meta */}
          <Card className="mt-4 rounded-tl-none rounded-tr-none">
            <CardContent className="pt-6">
              <TabsContent value="items" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sales or Purchase" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="purchase">Purchase</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {watch("type") === "sales" && (
                    <div className="space-y-2">
                      <Label htmlFor="customerId">Customer</Label>
                      <Controller
                        control={control}
                        name="customerId"
                        render={({ field }) => {
                          // filter by name or contactPerson
                          const filtered = customersList.filter(
                            (c: any) =>
                              c.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              (c.contact || "")
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              (c.email || "")
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          );

                          return (
                            <Popover
                              open={custPopoverOpen}
                              onOpenChange={setCustPopoverOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between"
                                  onClick={() => {
                                    setSearchTerm(""); // reset search each open
                                    setCustPopoverOpen(true);
                                  }}
                                >
                                  {field.value
                                    ? customersList.find(
                                        (x: any) => x.id === Number(field.value)
                                      )?.name
                                    : "Select customer…"}
                                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="w-[500px] border-gray-300">
                                <Input
                                  placeholder="Search by name or contact"
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  className="mb-2"
                                />

                                <div className="h-[200px] overflow-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Email</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {filtered.slice(0, 10).map((c: any) => (
                                        <TableRow
                                          key={c.id}
                                          className="cursor-pointer hover:bg-muted/50"
                                          onClick={() => {
                                            field.onChange(String(c.id));
                                            setCustPopoverOpen(false);
                                          }}
                                        >
                                          <TableCell className="text-nowrap">
                                            {c.id}
                                          </TableCell>
                                          <TableCell className="text-nowrap">
                                            {c.name}
                                          </TableCell>
                                          <TableCell className="text-nowrap">
                                            {c.contact}
                                          </TableCell>
                                          <TableCell className="text-nowrap">
                                            {c.email}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </PopoverContent>
                            </Popover>
                          );
                        }}
                      />
                    </div>
                  )}
                  {watch("type") === "purchase" && (
                    <div className="space-y-2">
                      <Label htmlFor="supplierId">Customer</Label>
                      <Controller
                        control={control}
                        name="supplierId"
                        render={({ field }) => {
                          // filter by name or contactPerson
                          const filtered = suppliersList.filter(
                            (c: any) =>
                              c.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              (c.contact || "")
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              (c.email || "")
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          );

                          return (
                            <Popover
                              open={supPopoverOpen}
                              onOpenChange={setSupPopoverOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between"
                                  onClick={() => {
                                    setSearchTerm(""); // reset search each open
                                    setSupPopoverOpen(true);
                                  }}
                                >
                                  {field.value
                                    ? suppliersList.find(
                                        (x: any) => x.id === Number(field.value)
                                      )?.name
                                    : "Select supplier..."}
                                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent className="w-[500px] border-gray-300">
                                <Input
                                  placeholder="Search by name or contact"
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  className="mb-2"
                                />

                                <div className="h-[200px] overflow-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Email</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {filtered.slice(0, 10).map((c: any) => (
                                        <TableRow
                                          key={c.id}
                                          className="cursor-pointer hover:bg-muted/50"
                                          onClick={() => {
                                            field.onChange(String(c.id));
                                            setCustPopoverOpen(false);
                                          }}
                                        >
                                          <TableCell className="text-nowrap">
                                            {c.id}
                                          </TableCell>
                                          <TableCell className="text-nowrap">
                                            {c.name}
                                          </TableCell>
                                          <TableCell className="text-nowrap">
                                            {c.contact}
                                          </TableCell>
                                          <TableCell className="text-nowrap">
                                            {c.email}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </PopoverContent>
                            </Popover>
                          );
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="date">Issue Date</Label>
                    <Input type="date" {...register("date")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input type="date" {...register("dueDate")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input type="date" {...register("deliveryDate")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingMethod">Shipping Method</Label>
                    <Input
                      {...register("shippingMethod")}
                      placeholder="e.g., Air, Ground"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea {...register("notes")} rows={2} />
                  </div>
                </div>

                <Separator />

                {/* Line Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Invoice Items</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendItem({
                          itemId: "",
                          quantity: 1,
                          total: 0,
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item ID</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itemFields.map((field, idx) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Input
                                type="number"
                                {...register(`items.${idx}.itemId` as const)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                {...register(`items.${idx}.quantity` as const, {
                                  valueAsNumber: true,
                                })}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                {...register(`items.${idx}.total` as const, {
                                  valueAsNumber: true,
                                })}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(idx)}
                                disabled={itemFields.length === 1}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Taxes & Charges */}
              <TabsContent value="taxes" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Tax Configuration</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendTax({
                          taxName: "",
                          rate: 0,
                          applyOn: "Net Total",
                          enabled: true,
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Tax
                    </Button>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Rate %</TableHead>
                          <TableHead>Apply On</TableHead>
                          <TableHead>Enabled</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {taxFields.map((field, idx) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Input
                                {...register(`taxes.${idx}.taxName` as const)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                {...register(`taxes.${idx}.rate` as const, {
                                  valueAsNumber: true,
                                })}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                control={control}
                                name={`taxes.${idx}.applyOn` as const}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Apply On" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Net Total">
                                        Net Total
                                      </SelectItem>
                                      <SelectItem value="Previous Row Amount">
                                        Previous Row Amount
                                      </SelectItem>
                                      <SelectItem value="Previous Row Total">
                                        Previous Row Total
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                control={control}
                                name={`taxes.${idx}.enabled` as const}
                                render={({ field }) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTax(idx)}
                                disabled={taxFields.length === 1}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Summary */}
              <TabsContent value="summary" className="space-y-6 mt-0">
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>AED {subtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>AED {taxAmount().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>AED {total().toFixed(2)}</span>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="disabled:opacity-75"
            disabled={mutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </form>
    </div>
  );
}
