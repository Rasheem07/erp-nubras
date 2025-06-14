"use client"
import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "./reactQuery.provider";
import { SidebarProvider } from "../ui/sidebar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="relative">
      <ThemeProvider attribute="class" defaultTheme="light">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </ThemeProvider>
    </SidebarProvider>
  );
}
