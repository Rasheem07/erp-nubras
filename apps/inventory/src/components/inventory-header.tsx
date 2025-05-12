"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Package, Menu, ScanBarcode } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { InventorySidebar } from "@/components/inventory-sidebar"

export function InventoryHeader() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/inventory") return "Dashboard"
    if (pathname === "/items") return "Inventory Items"
    if (pathname === "/stock-movements") return "Stock Movements"
    if (pathname === "/purchase-orders") return "Purchase Orders"
    if (pathname === "/material-allocations") return "Material Allocations"
    if (pathname === "/waste-tracking") return "Waste Tracking"
    if (pathname === "/suppliers") return "Suppliers"
    if (pathname === "/locations") return "Locations"
    if (pathname === "/reports") return "Reports"
    if (pathname === "/settings") return "Settings"
    return "Inventory Management"
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <InventorySidebar />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" />
        <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="w-[300px] pl-8"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <Button variant="outline" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}

        <Button variant="outline" size="icon">
          <ScanBarcode className="h-5 w-5" />
          <span className="sr-only">Scan Barcode</span>
        </Button>

        <ModeToggle />
      </div>
    </header>
  )
}
