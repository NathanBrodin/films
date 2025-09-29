"use server"

import { db } from "@/db"
import { user as users, userSchema, UserUpdate } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getUserById = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1)

  return user[0] || null
}

export const getUserNameById = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1)

  return user[0].name || null
}

export const updateUser = async (id: string, data: UserUpdate) => {
  try {
    // Validate the data
    const validatedData = userSchema.parse(data)

    // Convert empty strings to null for optional URL fields
    const updateData = {
      ...validatedData,
      instagram:
        validatedData.instagram === "" ? null : validatedData.instagram,
      website: validatedData.website === "" ? null : validatedData.website,
      image: validatedData.image === "" ? null : validatedData.image,
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning()

    return updatedUser
  } catch (error) {
    console.error("Failed to update user:", error)
    throw new Error("Failed to update user profile")
  }
}
