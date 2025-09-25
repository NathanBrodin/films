import { Eye } from "lucide-react"

export function Views({ viewCount }: { viewCount: number | null }) {
  return (
    <div className="inline-flex items-center gap-1">
      <span
        className="text-muted-foreground inline-flex items-center"
        aria-hidden="true"
      >
        <Eye className="size-4" />
      </span>
      <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
        {viewCount}
      </span>
    </div>
  )
}
