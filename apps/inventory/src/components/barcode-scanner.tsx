"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Check, Loader2, Scan, X, RotateCcw } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (barcode: string, quantity?: number) => void
  onClose: () => void
  mode?: "search" | "count" | "receive" | "issue"
  showQuantity?: boolean
  title?: string
  description?: string
}

export function BarcodeScanner({
  onScan,
  onClose,
  mode = "search",
  showQuantity = false,
  title = "Scan Barcode",
  description = "Scan a barcode or enter it manually",
}: BarcodeScannerProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "manual">("camera")
  const [barcode, setBarcode] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isScanning, setIsScanning] = useState(false)
  const [recentScans, setRecentScans] = useState<{ barcode: string; timestamp: Date; quantity?: number }[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Simulate camera initialization
  useEffect(() => {
    if (activeTab === "camera") {
      setIsScanning(true)

      // In a real implementation, we would initialize the camera here
      // For demo purposes, we'll simulate camera access
      const simulateCameraInit = setTimeout(() => {
        // Randomly decide if camera access fails (for demo purposes)
        const cameraAccessFails = Math.random() > 0.8

        if (cameraAccessFails) {
          setCameraError("Could not access camera. Please check permissions or try manual entry.")
          setIsScanning(false)
        } else {
          setCameraError(null)
          // Simulate successful camera initialization
          setIsScanning(false)
        }
      }, 1500)

      return () => clearTimeout(simulateCameraInit)
    }
  }, [activeTab])

  const handleScan = useCallback((scannedBarcode: string) => {
    // Add to recent scans
    setRecentScans((prev) => [
      { barcode: scannedBarcode, timestamp: new Date(), quantity: showQuantity ? quantity : undefined },
      ...prev.slice(0, 4), // Keep only the 5 most recent scans
    ])

    // Call the onScan callback
    onScan(scannedBarcode, showQuantity ? quantity : undefined)

    // Reset the form for the next scan
    setBarcode("")
  }, [onScan, quantity, showQuantity])
  // Simulate barcode detection
  useEffect(() => {
    if (activeTab === "camera" && !cameraError) {
      const simulateScan = setTimeout(() => {
        // Generate a random barcode for demo purposes
        const randomBarcode = `ITEM${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(5, "0")}`

        // Only trigger this occasionally to simulate scanning
        if (Math.random() > 0.7) {
          setBarcode(randomBarcode)
          handleScan(randomBarcode)
        }
      }, 3000)

      return () => clearTimeout(simulateScan)
    }
  }, [activeTab, cameraError, recentScans, handleScan])


  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (barcode.trim()) {
      handleScan(barcode)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="relative pb-2">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <Tabs
        defaultValue="camera"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "camera" | "manual")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" disabled={isScanning}>
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="manual" disabled={isScanning}>
            <Scan className="h-4 w-4 mr-2" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="space-y-4">
          {isScanning ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Initializing camera...</p>
            </div>
          ) : cameraError ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <p className="text-sm text-red-500 text-center mb-4">{cameraError}</p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("manual")}>
                Switch to Manual Entry
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2/3 h-1/3 border-2 border-primary rounded-md"></div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Position the barcode within the frame to scan
              </p>
            </div>
          )}

          {showQuantity && (
            <div className="grid gap-2">
              <Label htmlFor="camera-quantity">Quantity</Label>
              <Input id="camera-quantity" type="number" min="1" value={quantity} onChange={handleQuantityChange} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="manual">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                placeholder="Enter barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                autoComplete="off"
              />
            </div>

            {showQuantity && (
              <div className="grid gap-2">
                <Label htmlFor="manual-quantity">Quantity</Label>
                <Input id="manual-quantity" type="number" min="1" value={quantity} onChange={handleQuantityChange} />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!barcode.trim()}>
              <Check className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {recentScans.length > 0 && (
        <CardFooter className="flex-col items-start pt-0">
          <div className="w-full">
            <h4 className="text-sm font-medium mb-2">Recent Scans</h4>
            <div className="space-y-2">
              {recentScans.map((scan, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                  <span className="font-mono">{scan.barcode}</span>
                  <div className="flex items-center gap-2">
                    {scan.quantity && <span className="text-xs text-muted-foreground">Qty: {scan.quantity}</span>}
                    <span className="text-xs text-muted-foreground">
                      {scan.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setBarcode(scan.barcode)
                        if (scan.quantity) setQuantity(scan.quantity)
                      }}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
