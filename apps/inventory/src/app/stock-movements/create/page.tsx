import { StockMovementForm } from "@/components/stock-movement-form";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function CreateStockMovementPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Create Stock Movement
      </h2>
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center">
            <Loader2 className="aniamte-spin text-primary" />
          </div>
        }
      >
        <StockMovementForm />
      </Suspense>
    </div>
  );
}
