"use client"

import type React from "react"
import { Button } from "@nubras/ui"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@nubras/ui"

interface BudgetDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budgetId: string | undefined
}

const BudgetDrawer: React.FC<BudgetDrawerProps> = ({ open, onOpenChange, budgetId }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px]">
        <SheetHeader>
          <SheetTitle>Budget Details</SheetTitle>
          <SheetDescription>View and manage budget details</SheetDescription>
        </SheetHeader>
        <div>
          <p>Budget ID: {budgetId}</p>
        </div>
        <SheetFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { BudgetDrawer }
