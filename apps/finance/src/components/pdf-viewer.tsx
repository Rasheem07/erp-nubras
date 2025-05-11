"use client"

import { useEffect, useState } from "react"
import { Button } from "@nubras/ui"
import { ArrowLeft } from "lucide-react"

interface PDFViewerProps {
  invoice: any
  onBack: () => void
}

export default function PDFViewerComponent({ invoice, onBack }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would be a call to your API to generate the PDF
    // For demo purposes, we're just simulating a PDF with an iframe to a sample PDF
    const simulatedPdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    setPdfUrl(simulatedPdfUrl)
  }, [invoice])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Invoice PDF Preview</h2>
      </div>

      {pdfUrl ? (
        <div className="border rounded-lg overflow-hidden h-[800px]">
          <iframe src={pdfUrl} className="w-full h-full" title="Invoice PDF" />
        </div>
      ) : (
        <div className="h-[800px] w-full border rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Generating PDF preview...</p>
          </div>
        </div>
      )}
    </div>
  )
}
