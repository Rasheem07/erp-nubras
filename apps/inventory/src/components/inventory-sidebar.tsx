"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Package,
  Truck,
  ShoppingCart,
  Layers,
  Scissors,
  MapPin,
  BarChart2,
  Settings,
  Home,
  ArrowRightLeft,
  ClipboardCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function InventorySidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <Package className="h-6 w-6" />
        <span className="text-lg font-semibold">Inventory Module</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link
            href="apps.alnubrasstudio.com"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "apps.alnubrasstudio.com" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/items"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/items") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Package className="h-4 w-4" />
            <span>Inventory Items</span>
          </Link>

          <Link
            href="/stock-movements"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/stock-movements") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Stock Movements</span>
          </Link>

          <Link
            href="/purchase-orders"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/purchase-orders") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Purchase Orders</span>
          </Link>

          <Link
            href="/material-allocations"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/material-allocations")
                ? "bg-accent text-accent-foreground"
                : "transparent",
            )}
          >
            <Layers className="h-4 w-4" />
            <span>Material Allocations</span>
          </Link>

          <Link
            href="/waste-tracking"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/waste-tracking") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Scissors className="h-4 w-4" />
            <span>Waste Tracking</span>
          </Link>

          <Link
            href="/suppliers"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/suppliers") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Truck className="h-4 w-4" />
            <span>Suppliers</span>
          </Link>

          <Link
            href="/locations"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/locations") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <MapPin className="h-4 w-4" />
            <span>Locations</span>
          </Link>

          <Link
            href="/reports"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/reports") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Reports</span>
          </Link>

          <Link
            href="/audit"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/audit") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Inventory Audit</span>
          </Link>

          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith("/settings") ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
