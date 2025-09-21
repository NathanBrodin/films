import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getFilms } from "@/lib/actions/films"
import { auth } from "@/lib/auth"
import { AdminFilm } from "@/components/admin-film"
import { FilmForm } from "@/components/film-form"

interface AdminPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams
  const editId = typeof params.edit === "string" ? params.edit : undefined

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const films = (await getFilms()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  // Find the film to edit if edit param is present
  const editingFilm = editId
    ? films.find((film) => film.id === parseInt(editId))
    : null

  return (
    <div className="flex gap-6 p-6">
      <FilmForm editingFilm={editingFilm} />
      <div>
        {films.map((bookmark) => (
          <AdminFilm key={bookmark.id} {...bookmark} />
        ))}
      </div>
    </div>
  )
}
