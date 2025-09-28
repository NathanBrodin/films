import Image from "next/image"
import Link from "next/link"
import { FilmCreate } from "@/db/schema"
import { format } from "date-fns"
import { TriangleAlertIcon } from "lucide-react"

import { Lines } from "@/components/ui/backgrounds"
import { Diamond } from "@/components/ui/diamond"
import { SectionDivider } from "@/components/ui/separator"
import { Categories } from "@/components/film/categories"
import { Likes } from "@/components/film/likes"
import { Rating } from "@/components/film/rating"
import { Views } from "@/components/film/views"

export function FilmPreview({ film }: { film: FilmCreate }) {
  return (
    <div className="w-full max-w-xl border-l">
      <div className="text-primary relative flex w-full items-center justify-center border border-amber-300 bg-linear-to-r from-transparent via-amber-300/30 to-transparent p-2">
        <div className="flex items-center gap-2">
          <TriangleAlertIcon className="size-4 text-amber-500" />
          <span className="font-display text-foreground text-sm font-medium tracking-wide text-balance">
            This is a preview of the created film
          </span>
        </div>
        <Lines className="[mask-image:none] text-amber-300 opacity-20" />
      </div>
      <section className="border-grid">
        <div className="container-wrapper from-primary/2 relative bg-linear-to-t">
          <div className="flex">
            <div className="flex flex-1 flex-col gap-6 px-4 py-8 md:px-8 md:py-16">
              <Link
                href="/"
                className="text-primary decoration-primary/20 text-sm underline"
              >
                ← Back to films
              </Link>
              <h1 className="max-w-2xl">
                <Link href={film.url || "#"} target="_blank">
                  {film.title || "Untitled Film"}
                </Link>
              </h1>
              <div className="flex flex-col gap-0">
                <p className="text-sm">{film.author || "Unknown Author"}</p>

                <p className="text-muted-foreground text-xs">
                  {film.publishedAt
                    ? format(new Date(film.publishedAt), "MMMM do, yyyy")
                    : "Date not set"}
                </p>
              </div>
            </div>
            {/*<div className="relative hidden w-xs sm:block md:w-sm xl:w-xl">
              <Link href={film.url || "#"} target="_blank">
                <Image
                  src={film.thumbnail || "/placeholder.svg"}
                  alt={film.title || "Film thumbnail"}
                  fill={true}
                  className="aspect-video size-full translate-x-2 translate-y-1/4 rounded-l-xl border-t border-b border-l object-cover object-center shadow-lg"
                />
              </Link>
            </div>*/}
          </div>
          <Categories
            categories={film.categories}
            className="absolute bottom-2 left-2 z-10"
          />
          <Lines />
        </div>
      </section>
      <SectionDivider />
      <section className="relative aspect-video w-full">
        <Image
          src={film.thumbnail ?? "placeholder.svg"}
          alt={film.title}
          fill={true}
          className="object-cover object-center"
        />
      </section>
      <section>
        <div className="border-grid relative inline-flex w-full items-center gap-10 border-b border-dashed px-4 py-2 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-1 opacity-30">
            <p className="text-muted-foreground font-mono text-xs">Ratings</p>
            <Rating />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground font-mono text-xs">Likes</p>
            <Likes likeCount={film.likeCount ?? 0} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground font-mono text-xs">Views</p>
            <Views viewCount={film.viewCount ?? 0} />
          </div>
          <Lines className="[mask-image:none] opacity-15 dark:opacity-50" />
          <Diamond bottom left />
          <Diamond bottom right />
        </div>
        <div className="px-4 sm:px-6 sm:py-4">
          <p className="text-muted-foreground leading-relaxed">
            {film.description || "No description provided."}
          </p>
        </div>
      </section>
    </div>
  )
}
