import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export function Rating() {
  return (
    <div className="inline-flex items-center gap-1">
      <span
        className="inline-flex items-center text-amber-500"
        aria-hidden="true"
      >
        <Star className={cn("size-4 fill-amber-500")} />
        <Star className={cn("size-4 fill-amber-500")} />
        <Star className={cn("size-4 fill-amber-500")} />
        <Star className={cn("size-4 fill-amber-500 opacity-30")} />
        <Star className={cn("size-4 fill-amber-500 opacity-30")} />
      </span>
      <span className="sr-only">3 stars</span>
      <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
        (3,234)
      </span>
    </div>
  )
}
