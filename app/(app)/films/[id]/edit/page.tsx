import { headers } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getFilmById } from "@/lib/actions/films"
import { auth } from "@/lib/auth"
import { Lines } from "@/components/ui/backgrounds"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import { FilmForm } from "../../new/_components/film-form"

interface FilmPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditFilmPage({ params }: FilmPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const { id } = await params
  const film = await getFilmById(id)

  if (!film) {
    notFound()
  }

  if (!session?.user.id || session.user.id !== film.createdBy) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <Card>
          <CardContent>
            <h3>Only authenticated users can add a film</h3>
            <CardFooter className="mt-4 items-center justify-center gap-2">
              <Button asChild>
                <Link href="/log-in">Log in</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/">Go back home</Link>
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
        <Lines className="text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row">
      <FilmForm editingFilm={film} />
    </div>
  )
}
