import { WasteTrackingForm } from "@/components/waste-tracking-form";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function CreateWasteRecordPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Record Waste</h2>
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center">
            <Loader2 className="aniamte-spin text-primary" />
          </div>
        }
      >
        <WasteTrackingForm />
      </Suspense>
    </div>
  );
}
