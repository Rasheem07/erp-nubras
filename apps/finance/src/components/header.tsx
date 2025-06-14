"use client";
import { Bell, PanelLeft, PanelRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import { useSidebar } from "./ui/sidebar";

export function FinanceHeader() {
  const pathname = usePathname();

  const { open, setOpen } = useSidebar();
  return (
    <header
      className={`sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6`}
    >
      <div className="flex-1">
        <Button variant={"ghost"} size={"icon"} onClick={() => setOpen(!open)}>
          {open ? <PanelLeft /> : <PanelRight />}
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-md pl-8"
            />
          </div>
        </div>
        <ModeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 font-normal">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            NU
          </span>
        </Button>
      </div>
    </header>
  );
}
