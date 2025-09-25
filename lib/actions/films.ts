"use server"

import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { db } from "@/db"
import { films, filmSchema } from "@/db/schema"
import { eq } from "drizzle-orm"

import { auth } from "../auth"

export async function addFilm(
  prevState: any /* eslint-disable-line */,
  formData: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.id)
    throw new Error("Only authenticated users can add a film")

  try {
    const validatedData = filmSchema.safeParse({
      url: formData.get("url"),
      title: formData.get("title"),
      description: formData.get("description") || "",
      thumbnail: formData.get("thumbnail"),
      publishedAt: formData.get("publishedAt"),
      author: formData.get("author") || "",
      views: formData.get("views") ? Number(formData.get("views")) : undefined,
      likeCount: formData.get("likeCount")
        ? Number(formData.get("likeCount"))
        : undefined,
      dislikeCount: formData.get("dislikeCount")
        ? Number(formData.get("dislikeCount"))
        : undefined,
      categories: formData.getAll("categories") as string[],
    })

    if (!validatedData.success) {
      return {
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    await db.insert(films).values({
      title: validatedData.data.title.trim(),
      url: validatedData.data.url,
      description: validatedData.data.description,
      thumbnail: validatedData.data.thumbnail,
      publishedAt: validatedData.data.publishedAt
        ? new Date(validatedData.data.publishedAt)
        : null,
      author: validatedData.data.author,
      viewCount: validatedData.data.viewCount,
      likeCount: validatedData.data.likeCount,
      categories: validatedData.data.categories,
      createdBy: session.user.id,
    })

    revalidateTag("films")
  } catch (e) {
    console.error("Error adding film:", e)
    return { errors: { general: ["Failed to add film"] } }
  }
}

export async function updateFilm(
  prevState: any /* eslint-disable-line */,
  formData: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.id != process.env.NATHAN_ID)
    throw new Error("Only Nathan can update bookmarks")

  try {
    const id = formData.get("id")
    if (!id) {
      return { errors: { id: ["Bookmark ID is required"] } }
    }

    const validatedData = filmSchema.safeParse({
      url: formData.get("url"),
      title: formData.get("title"),
      description: formData.get("description") || "",
      thumbnail: formData.get("thumbnail"),
      publishedAt: formData.get("publishedAt"),
      author: formData.get("author") || "",
      views: formData.get("views") ? Number(formData.get("views")) : undefined,
      likeCount: formData.get("likeCount")
        ? Number(formData.get("likeCount"))
        : undefined,
      dislikeCount: formData.get("dislikeCount")
        ? Number(formData.get("dislikeCount"))
        : undefined,
      categories: formData.getAll("categories") as string[],
    })

    if (!validatedData.success) {
      return {
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    await db
      .update(films)
      .set({
        title: validatedData.data.title.trim(),
        url: validatedData.data.url,
        description: validatedData.data.description,
        thumbnail: validatedData.data.thumbnail,
        publishedAt: validatedData.data.publishedAt
          ? new Date(validatedData.data.publishedAt)
          : null,
        author: validatedData.data.author,
        viewCount: validatedData.data.viewCount,
        likeCount: validatedData.data.likeCount,
        categories: validatedData.data.categories,
        updatedAt: new Date(),
      })
      .where(eq(films.id, parseInt(id as string)))

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
