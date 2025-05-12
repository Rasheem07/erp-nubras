"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Scan } from "lucide-react"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { toast } from "@nubras/ui"

interface BarcodeScannerButtonProps {
  onScan: (barcode: string, quantity?: number) => void
  mode?: "search" | "count" | "receive" | "issue"
  showQuantity?: boolean
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  buttonText?: string
}

export function BarcodeScannerButton({
  onScan,
  mode = "search",
  showQuantity = false,
  variant = "outline",
  size = "sm",
  className = "",
  buttonText,
}: BarcodeScannerButtonProps) {
  const [showScanner, setShowScanner] = useState(false)

  const handleScan = (barcode: string, quantity?: number) => {
    onScan(barcode, quantity)
    setShowScanner(false)
    toast({
      title: "Barcode Scanned",
      description: `Barcode ${barcode}${quantity ? ` with quantity ${quantity}` : ""} processed successfully`,
    })
  }

  return (
    <>
      <Button variant={variant} size={size} className={`gap-1.5 ${className}`} onClick={() => setShowScanner(true)}>
        <Scan className={size === "icon" ? "h-4 w-4" : "h-3.5 w-3.5 mr-1"} />
        {buttonText || (size !== "icon" ? "Scan Barcode" : "")}
      </Button>

      {showScanner && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <BarcodeScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
            mode={mode}
            showQuantity={showQuantity}
            title={`Scan ${mode === "count" ? "to Count" : mode === "receive" ? "to Receive" : mode === "issue" ? "to Issue" : "to Search"}`}
            description={`Scan a barcode ${showQuantity ? "and enter quantity" : ""} to ${mode === "count" ? "count inventory" : mode === "receive" ? "receive items" : mode === "issue" ? "issue items" : "search"}`}
          />
        </div>
      )}
    </>
  )
}
