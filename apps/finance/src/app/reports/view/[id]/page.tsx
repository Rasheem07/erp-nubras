"use client"
import { useParams, useRouter } from "next/navigation"
import {Button} from "@/components/ui/button"
import { ReportViewer } from "@/components/report-viewer"
import { ArrowLeft } from "lucide-react"

export default function ViewReportPage() {
  const router = useRouter()
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">View Report</h1>
          <p className="text-muted-foreground">Viewing report details</p>
        </div>
      </div>

      <ReportViewer reportId={id as string} onClose={() => router.back()} />
    </div>
  )
}
