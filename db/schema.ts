import { InferSelectModel } from "drizzle-orm"
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import z from "zod"

// Auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

// App
export const films = sqliteTable("films", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  author: text("author"),
  viewCount: integer("views"),
  likeCount: integer("like_count"),
  categories: text("categories", { mode: "json" })
    .$type<string[]>()
    .default([])
    .notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const reviews = sqliteTable("reviews", {
  id: int().primaryKey({ autoIncrement: true }),
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  watched: integer("watched", { mode: "boolean" }).default(false).notNull(),
  liked: integer("liked", { mode: "boolean" }).default(false).notNull(),
  rating: integer("rating"),
  review: text("review"),
  watchList: integer("watch_list", { mode: "boolean" })
    .default(false)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export type Film = InferSelectModel<typeof films>
export type Review = InferSelectModel<typeof reviews>

export const filmSchema = z.object({
  url: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  title: z.string().min(1, "Title is required").trim(),
  description: z.string(),
  thumbnail: z.string().optional(),
  publishedAt: z.string().date(),
  author: z.string(),
  viewCount: z.number().optional(),
  likeCount: z.number().optional(),
  categories: z.array(z.string()),
})

export type FilmCreate = z.infer<typeof filmSchema>

export const reviewSchema = z.object({
  watched: z.boolean(),
  liked: z.boolean(),
  rating: z.number().min(1).max(5).optional(),
  review: z.string().optional(),
  watchList: z.boolean(),
})
