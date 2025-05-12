import { MaterialAllocationForm } from "@/components/material-allocation-form";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function CreateMaterialAllocationPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Allocate Material</h2>
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center">
            <Loader2 className="aniamte-spin text-primary" />
          </div>
        }
      >
        <MaterialAllocationForm />
      </Suspense>
    </div>
  );
}
