import { getFilms } from "@/lib/actions/films"
import { Hero, HeroDescription, HeroHeading } from "@/components/ui/hero"
import { Film } from "@/components/film"

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const selectedCategory =
    typeof params.categories === "string" ? params.categories : undefined
  const searchQuery =
    typeof params.search === "string" ? params.search : undefined

  const films = await getFilms()

  let filteredFilms = films

  // Filter by search query first (title, author, url, categories hierarchy)
  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim()
    filteredFilms = filteredFilms
      .filter((film) => {
        // Priority 1: Title
        if (film.title.toLowerCase().includes(query)) {
          return true
        }
        // Priority 2: Author
        if (film.author && film.author.toLowerCase().includes(query)) {
          return true
        }
        // Priority 3: URL
        if (film.url.toLowerCase().includes(query)) {
          return true
        }
        // Priority 4: Categories
        if (
          film.categories.some((category) =>
            category.toLowerCase().includes(query)
          )
        ) {
          return true
        }
        return false
      })
      .sort((a, b) => {
        // Sort by search relevance hierarchy
        const aTitle = a.title.toLowerCase().includes(query)
        const bTitle = b.title.toLowerCase().includes(query)
        const aAuthor = a.author && a.author.toLowerCase().includes(query)
        const bAuthor = b.author && b.author.toLowerCase().includes(query)
        const aUrl = a.url.toLowerCase().includes(query)
        const bUrl = b.url.toLowerCase().includes(query)

        if (aTitle && !bTitle) return -1
        if (bTitle && !aTitle) return 1
        if (aAuthor && !bAuthor) return -1
        if (bAuthor && !aAuthor) return 1
        if (aUrl && !bUrl) return -1
        if (bUrl && !aUrl) return 1

        return 0
      })
  }

  // Then filter by selected category
  if (selectedCategory) {
    filteredFilms = filteredFilms.filter((film) =>
      film.categories.includes(selectedCategory)
    )
  }

  return (
    <>
      <Hero>
        <HeroHeading>Nathan&apos;s Snowboard Films</HeroHeading>
        <HeroDescription>
          My collection of ski and snowboard films, edits, and clips
        </HeroDescription>
      </Hero>
      <section className="px-4 sm:px-6 sm:py-4">
        <div className="grid w-full grid-cols-3 gap-4">
          {filteredFilms.map((bookmark) => (
            <Film key={bookmark.id} {...bookmark} />
          ))}
          {filteredFilms.map((bookmark) => (
            <Film key={bookmark.id} {...bookmark} />
          ))}
          {filteredFilms.map((bookmark) => (
            <Film key={bookmark.id} {...bookmark} />
          ))}
          {filteredFilms.length === 0 && (
            <span className="text-muted-foreground text-sm">
              No result found for &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
      </section>
    </>
  )
}
