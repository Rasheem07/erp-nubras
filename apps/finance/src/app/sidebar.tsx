"use client";
import { FinanceSidebar } from "@/components/sidebar";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function SidebarUI() {
  const { open } = useSidebar();

  const sidebar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) {
      if (sidebar.current) {
        sidebar.current.style.display = "none";
      }
    } else {
      if (sidebar.current) {
        sidebar.current.style.display = "block";
      }
    }
  }, [open]);
  return (
    <Sidebar ref={sidebar} className={`border-r relative `}>
      <SidebarContent className="relative">
        <FinanceSidebar />
      </SidebarContent>
    </Sidebar>
  );
}
