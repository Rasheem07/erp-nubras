"use client";
import React from "react";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function SidebarToggler() {
  const { toggleSidebar } = useSidebar();
  return (
    <div>
      <Button className="md:block hidden" variant="ghost" size="lg" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}
