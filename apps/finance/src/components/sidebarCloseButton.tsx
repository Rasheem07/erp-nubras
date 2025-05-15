"use client";

import React from "react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { PanelLeft, PanelRight } from "lucide-react";

export default function SidebarCloseButton() {
  const { open, setOpen } = useSidebar();

  const handleSidebar = () => {
    setOpen(!open);
  };
  return (
    <Button size={"icon"} variant={"ghost"} onClick={handleSidebar}>
      {open ? (
        <PanelLeft className="h-5 w-5" />
      ) : (
        <PanelRight className="h-5 w-5" />
      )}
    </Button>
  );
}
