"use server"

import { revalidateTag, unstable_cache } from "next/cache"
import { headers } from "next/headers"
import { db } from "@/db"
import { films, filmSchema } from "@/db/schema"
import { eq } from "drizzle-orm"

import { auth } from "../auth"

export default async function addFilm(
  prevState: any /* eslint-disable-line */,
  formData: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.id != process.env.NATHAN_ID)
    throw new Error("Only Nathan can add bookmarks")

  try {
    const validatedData = filmSchema.safeParse({
      url: formData.get("url"),
      title: formData.get("title"),
      categories: formData.getAll("categories") as string[],
      favicon: formData.get("favicon"),
      author: formData.get("author"),
    })

    if (!validatedData.success) {
      return {
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    await db.insert(films).values({
      title: validatedData.data.title.trim(),
      url: validatedData.data.url,
      categories: validatedData.data.categories,
      favicon: validatedData.data.favicon?.trim(),
      author: validatedData.data.author?.trim(),
    })

    revalidateTag("bookmarks")
  } catch (e) {
    console.error("Error adding bookmark:", e)
    return { errors: { general: ["Failed to add bookmark"] } }
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
      categories: formData.getAll("categories") as string[],
      favicon: formData.get("favicon"),
      author: formData.get("author"),
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
        categories: validatedData.data.categories,
        favicon: validatedData.data.favicon?.trim(),
        author: validatedData.data.author?.trim(),
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

export const getFilms = unstable_cache(
  async () => {
    return await db.select().from(films)
  },
  ["films"],
  { tags: ["films"], revalidate: false }
)
