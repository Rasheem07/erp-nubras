"use client";

import React, { useState } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignInPayload {
  email: string;
  password: string;
}
interface SignInResponse {
  message: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignInPayload>({ email: "", password: "" });
  const params = useSearchParams();
  const redirectURL = params.get("redirectURL") || "";
  const mutation: UseMutationResult<SignInResponse, Error, SignInPayload> =
    useMutation({
      mutationFn: async (payload) => {
        const res = await fetch(`http://localhost:5005/api/v1/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to send OTP");
        return data;
      },
      onSuccess: () => {
        // set a 10-minute expiry timestamp
        const expireAt = Date.now() + 10 * 60 * 1000;
        localStorage.setItem("otpExpireAt", expireAt.toString());
        // navigate with email query
        toast.success("OTP sent! Check your email.");
        router.push(
          `/auth/verify?email=${encodeURIComponent(form.email)}&redirectURL=${encodeURIComponent(redirectURL)}`
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-lg lg:px-8 lg:py-12 border border-gray-200 shadow-lg">
        <CardHeader className="mb-6">
          <CardTitle className="text-3xl font-bold text-center">
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              className="h-12 text-lg"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="h-12 text-lg"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button
              type="submit"
              className="w-full py-4 text-lg font-semibold"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sending…" : "Send OTP"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              This code will expire in <strong>10 minutes</strong>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
