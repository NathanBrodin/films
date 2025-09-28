import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"

import { getFilmById } from "@/lib/actions/films"
import { Lines } from "@/components/ui/backgrounds"
import { Diamond } from "@/components/ui/diamond"
import { SectionDivider } from "@/components/ui/separator"
import { Categories } from "@/components/film/categories"
import { Likes } from "@/components/film/likes"
import { Rating } from "@/components/film/rating"
import { Views } from "@/components/film/views"

interface FilmPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { id } = await params
  const film = await getFilmById(id)

  if (!film) {
    notFound()
  }

  return (
    <>
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
                <Link href={film.url} target="_blank">
                  {film.title}
                </Link>
              </h1>
              <div className="flex flex-col gap-0">
                <p className="text-sm">{film.author}</p>
                {film.publishedAt && (
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(film.publishedAt), "MMMM do, yyyy")}
                  </p>
                )}
              </div>
            </div>
            <div className="relative hidden w-xs sm:block md:w-sm lg:w-xl">
              <Link href={film.url} target="_blank">
                <Image
                  src={film.thumbnail ?? "/placeholder.svg"}
                  alt={film.title}
                  fill={true}
                  className="aspect-video size-full translate-x-2 translate-y-1/4 rounded-l-xl border-t border-b border-l object-cover object-center shadow-lg"
                />
              </Link>
            </div>
          </div>
          <Categories
            categories={film.categories}
            className="absolute bottom-2 left-2 z-10"
          />
          <Lines />
        </div>
      </section>
      <SectionDivider />
      <section className="relative aspect-video w-full sm:hidden">
        <Image
          src={film.thumbnail ?? "/placeholder.svg"}
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
            <Likes likeCount={film.likeCount} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground font-mono text-xs">Views</p>
            <Views viewCount={film.viewCount} />
          </div>
          <Lines className="[mask-image:none] opacity-15 dark:opacity-50" />
          <Diamond bottom left />
          <Diamond bottom right />
        </div>
        <div className="px-4 sm:px-6 sm:py-4">
          <p className="text-muted-foreground leading-relaxed">
            {film.description}
          </p>
        </div>
      </section>
    </>
  )
}

export async function generateMetadata({
  params,
}: FilmPageProps): Promise<Metadata> {
  const { id } = await params
  const film = await getFilmById(id)

  if (!film) {
    return {
      title: "Film Not Found",
    }
  }

  return {
    title: film.title,
    description: film.description || `Watch ${film.title} by ${film.author}`,
    openGraph: {
      title: film.title,
      description: film.description || `Watch ${film.title} by ${film.author}`,
      images: film.thumbnail ? [film.thumbnail] : [],
    },
  }
}
