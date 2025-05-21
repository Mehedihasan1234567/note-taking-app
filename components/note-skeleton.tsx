import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function NoteSkeleton() {
  return (
    <Card className="p-3">
      <div className="mb-1 flex items-center justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-2/3" />
      <div className="flex gap-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </Card>
  )
}
