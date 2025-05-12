"use client";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");
  return <p style={{ color: "red" }}>Error: {error || "Unknown"}</p>;
}
