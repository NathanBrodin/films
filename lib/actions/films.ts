"use server"

import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { db } from "@/db"
import { films, filmSchema } from "@/db/schema"
import { eq } from "drizzle-orm"
import z from "zod"

import { auth } from "../auth"

export async function addFilm(formData: z.infer<typeof filmSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.id)
    throw new Error("Only authenticated users can add a film")

  try {
    await db.insert(films).values({
      title: formData.title.trim(),
      url: formData.url,
      description: formData.description,
      thumbnail: formData.thumbnail,
      publishedAt: formData.publishedAt ? new Date(formData.publishedAt) : null,
      author: formData.author,
      viewCount: formData.viewCount,
      likeCount: formData.likeCount,
      categories: formData.categories,
      createdBy: session.user.id,
    })

    revalidateTag("films")
  } catch (e) {
    console.error("Error adding film:", e)
    return { errors: { general: ["Failed to add film"] } }
  }
}

export async function updateFilm(
  formData: z.infer<typeof filmSchema>,
  id: number
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.id != process.env.NATHAN_ID)
    throw new Error("Only Nathan can update bookmarks")

  try {
    await db
      .update(films)
      .set({
        title: formData.title.trim(),
        url: formData.url,
        description: formData.description,
        thumbnail: formData.thumbnail,
        publishedAt: formData.publishedAt
          ? new Date(formData.publishedAt)
          : null,
        author: formData.author,
        viewCount: formData.viewCount,
        likeCount: formData.likeCount,
        categories: formData.categories,
        updatedAt: new Date(),
      })
      .where(eq(films.id, id))

    revalidateTag("bookmarks")
  } catch (e) {
    console.error("Error updating bookmark:", e)
    return { errors: { general: ["Failed to update bookmark"] } }
  }
}

export async function deleteFilm(id: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.id != process.env.NATHAN_ID)
    throw new Error("Only Nathan can delete bookmarks")

  try {
    await db.delete(films).where(eq(films.id, id))
    revalidateTag("bookmarks")
  } catch (e) {
    console.error("Error deleting bookmark:", e)
    return { success: false }
  }
}

export const getFilms = async () => {
  return await db.select().from(films)
}

export const getFilmById = async (id: string) => {
  const film = await db
    .select()
    .from(films)
    .where(eq(films.id, parseInt(id)))
    .limit(1)

  return film[0] || null
}

// export const getFilms = unstable_cache(
//   async () => {
//     return await db.select().from(films)
//   },
//   ["films"],
//   { tags: ["films"], revalidate: false }
// )

// export const getFilmById = unstable_cache(
//   async (id: string) => {
//     const film = await db
//       .select()
//       .from(films)
//       .where(eq(films.id, parseInt(id)))
//       .limit(1)

//     return film[0] || null
//   },
//   ["film-by-id"],
//   { tags: ["films"], revalidate: false }
// )
