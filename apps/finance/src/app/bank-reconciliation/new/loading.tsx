"use client"

import { Skeleton } from "@nubras/ui"
import { Card, CardContent, CardHeader } from "@nubras/ui"

export default function NewBankReconciliationLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px] mt-2" />
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <div className="border rounded-lg p-4">
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
