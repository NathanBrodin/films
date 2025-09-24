import { Heart } from "lucide-react"

export function Likes({ likeCount }: { likeCount: number | null }) {
  return (
    <div className="inline-flex items-center gap-1">
      <span
        className="inline-flex items-center text-red-500"
        aria-hidden="true"
      >
        <Heart className="size-4 fill-red-500" />
      </span>
      <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
        {likeCount}
      </span>
    </div>
  )
}
