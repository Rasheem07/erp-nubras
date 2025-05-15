"use client";

import React, { useState, useEffect } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Check, Info, Loader2, Rotate3D, RotateCw } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VerifyResponse {
  message: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const redirectURL = params.get("redirectURL") || "";
  const [isTotp, setIsTotp] = useState(false);

  // restore timer
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const exp = parseInt(localStorage.getItem("otpExpireAt") || "0", 10);
    const diff = Math.ceil((exp - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  });

  // **start with an empty string** (no padEnd)
  const [otp, setOtp] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) return localStorage.removeItem("otpExpireAt");
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    return () => {
      setIsRedirecting(false);
    };
  });

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const mutation: UseMutationResult<
    VerifyResponse,
    Error,
    { email: string; otp: string }
  > = useMutation({
    mutationFn: async ({ email, otp }) => {
      const res = await fetch("http://localhost:5005/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      return data;
    },
    onSuccess: () => {
      toast.success("Verification successful");
      if (redirectURL && redirectURL != "") {
        setIsRedirecting(true);
        window.location.replace(redirectURL);
      } else {
        router.replace("/");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const Totpmutation: UseMutationResult<
    VerifyResponse,
    Error,
    { email: string; otp: string }
  > = useMutation({
    mutationFn: async ({ email, otp }) => {
      const res = await fetch("http://localhost:5005/api/v1/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      return data;
    },
    onSuccess: () => {
      toast.success("Verification successful!");
      if (redirectURL && redirectURL != "") {
        setIsRedirecting(true);
        window.location.replace(redirectURL);
      } else {
        router.replace("/");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTotp && secondsLeft <= 0) {
      toast.error("OTP expired. Please request a new one.");
      return;
    }
    if (isTotp) {
      // now otp is your 6-digit string
      Totpmutation.mutate({ email, otp });
    } else {
      mutation.mutate({ email, otp });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-lg lg:px-8 lg:py-12 border border-gray-200 shadow-lg">
        <CardHeader className="mb-6">
          <CardTitle className="text-3xl font-bold text-center">
            Verify {isTotp ? "authenticator code" : "email OTP"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="text-center space-y-1">
            {isTotp ? (
              <>
                <p className="sm:text-base text-sm  text-gray-600">
                  6 digits code is being generated in
                </p>
                <p className="sm:text-base text-sm font-medium text-gray-800">
                  alnubras: {email}
                </p>
              </>
            ) : (
              <>
                <p className="sm:text-base text-sm  text-gray-600">
                  We’ve sent a code to
                </p>
                <p className="sm:text-base text-sm font-medium text-gray-800">
                  {email}
                </p>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ← Controlled OTP input */}
            <InputOTP
              maxLength={6}
              value={otp} // <-- bind your state
              onChange={(v) => setOtp(v)} // <-- update state
              className="flex justify-center"
            >
              <InputOTPGroup className="flex gap-2 mx-auto md:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="
                      md:h-[52px] md:w-[52px]
                      h-[36px] w-[36px]
                      text-xl
                      md:text-3xl font-medium
                      text-center
                      border border-gray-300
                      rounded-lg
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-200
                    "
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {isTotp ? (
              <p className="text-center text-sm text-green-600">
                Please check your authenticator app for the code
              </p>
            ) : Number(seconds) == 0 ? (
              <p
                className={`font-sans text-red-500 text-sm mx-auto text-center`}
              >
                OTP already expired!{" "}
                <span className="text-green-600 cursor-pointer hover:text-green-700 underline underline-offset-2">
                  Please click this to resend OTP
                </span>{" "}
              </p>
            ) : (
              <div className="flex flex-col">
                <p
                  className={`${Number(seconds) == 0 && "hidden"} text-center text-sm text-green-600`}
                >
                  Expires in{" "}
                  <span
                    className={`font-mono underline underline-offset-2 animate-pulse ${Number(minutes) < 3 && "text-red-500"}`}
                  >
                    {minutes}:{seconds}
                  </span>
                </p>
                <Button variant={"link"} type="button">resend otp</Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 text-lg cursor-pointer font-semibold"
              disabled={
                (!isTotp && (mutation.isPending || secondsLeft <= 0)) ||
                (isTotp && Totpmutation.isPending)
              }
            >
              {mutation.isPending || Totpmutation.isPending
                ? "Verifying…"
                : "Verify"}
            </Button>

            <Button
              variant={"outline"}
              type="button"
              className={`mx-auto hidden md:flex w-full gap-2 text-xs sm:text-base cursor-pointer ${isTotp ? "border-blue-600 text-blue-600 hover:text-blue-700" : ""}`}
              onClick={() => {
                setOtp("");
                setIsTotp(!isTotp);
              }}
            >
              {isTotp ? (
                <Check />
              ) : (
                <>
                  {" "}
                  <RotateCw /> Switch to{" "}
                </>
              )}{" "}
              {isTotp ? "Enter" : "enter"} code from authenticator app
            </Button>
            <Button
              variant={"outline"}
              type="button"
              className={`mx-auto md:hidden flex w-full gap-2 text-xs font-sans sm:text-base cursor-pointer ${isTotp ? "border-blue-600 text-blue-600 hover:text-blue-700" : ""}`}
              onClick={() => {
                setOtp("");
                setIsTotp(!isTotp);
              }}
            >
              {isTotp ? (
                <Check />
              ) : (
                <>
                  {" "}
                  <RotateCw /> Switch to{" "}
                </>
              )}{" "}
              authenticator code
            </Button>
            {isTotp && (
              <div className="flex gap-1.5 text-sm text-yellow-500 items-center">
                <Info className="h-4 w-4" />
                Please click the above button again to switch to email otp.
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {isRedirecting && (
        <Dialog>
          <DialogContent>
            <div className="flex flex-col gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              <p className="">
                Redirecting you to{" "}
                <span className="underline underline-offset-2 text-blue-600">
                  {redirectURL}
                </span>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
