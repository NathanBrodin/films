"use client"

import { useActionState, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Film } from "@/db/schema"
import { format } from "date-fns"
import { TriangleAlert } from "lucide-react"

import { addFilm } from "@/lib/actions/films"
import { categories } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Categories } from "./film/categories"
import { Likes } from "./film/likes"
import { Rating } from "./film/rating"
import { Views } from "./film/views"
import { Lines } from "./ui/backgrounds"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Diamond } from "./ui/diamond"
import MultipleSelector, { Option } from "./ui/multiselect"
import { SectionDivider, Separator } from "./ui/separator"
import { Textarea } from "./ui/textarea"

interface FilmFormProps {
  editingFilm?: Film | null
}

export function FilmForm({ editingFilm: editingFilm }: FilmFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, action, isPending] = useActionState(addFilm, null)

  // Form state for live preview
  const [formData, setFormData] = useState({
    url: editingFilm?.url || "",
    title: editingFilm?.title || "",
    description: editingFilm?.description || "",
    thumbnail: editingFilm?.thumbnail || "",
    publishedAt: editingFilm?.publishedAt
      ? new Date(editingFilm.publishedAt).toISOString().split("T")[0]
      : "",
    author: editingFilm?.author || "",
    views: editingFilm?.views || 0,
    categories: editingFilm?.categories || [],
  })

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function onDelete() {}

  function resetForm() {}

  const metadata = {}

  return (
    <>
      <Card className="relative z-10 m-6 h-fit">
        <CardHeader>
          <CardTitle>Add a new film</CardTitle>
          <CardDescription>
            Add a film that isn’t in the database yet.
          </CardDescription>
          {editingFilm && (
            <CardAction>
              <Button variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <form action={action}>
          {editingFilm && (
            <input type="hidden" name="id" value={editingFilm.id} />
          )}
          <CardContent className="flex flex-row gap-4">
            <div className="flex max-w-lg flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  name="url"
                  id="url"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  defaultValue={editingFilm?.url || ""}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "url" in state.errors
                    ? state.errors.url
                    : ""}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="categories">Categories</Label>
                <MultipleSelector
                  commandProps={{
                    label: "Select categories",
                  }}
                  defaultOptions={categories}
                  placeholder="Select categories"
                  emptyIndicator={
                    <p className="text-center text-sm">No results found</p>
                  }
                  value={formData.categories.map((cat) => ({
                    label: cat,
                    value: cat,
                  }))}
                  onChange={(options) =>
                    handleInputChange(
                      "categories",
                      options.map((opt) => opt.value)
                    )
                  }
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "categories" in state.errors
                    ? state.errors.categories
                    : ""}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card text-muted-foreground px-2">
                    Auto Generated
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">
                  Title
                  {metadata && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <Input
                  name="title"
                  id="title"
                  placeholder="Page title"
                  defaultValue={editingFilm?.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "title" in state.errors
                    ? state.errors.title
                    : ""}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description
                  {metadata && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <div className="flex items-center gap-2">
                  <Textarea
                    name="description"
                    id="description"
                    placeholder="Film description"
                    defaultValue={editingFilm?.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "description" in state.errors
                    ? state.errors.description
                    : ""}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">
                  Thumbnail
                  {metadata && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <Input
                  name="thumbnail"
                  id="thumbnail"
                  placeholder="https://example.com/thumbnail.jpg"
                  defaultValue={editingFilm?.thumbnail || ""}
                  onChange={(e) =>
                    handleInputChange("thumbnail", e.target.value)
                  }
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "thumbnail" in state.errors
                    ? state.errors.thumbnail
                    : ""}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="publishedAt">
                  Published Date
                  {metadata && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <Input
                  name="publishedAt"
                  id="publishedAt"
                  type="date"
                  defaultValue={
                    editingFilm?.publishedAt
                      ? new Date(editingFilm.publishedAt)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("publishedAt", e.target.value)
                  }
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "publishedAt" in state.errors
                    ? state.errors.publishedAt
                    : ""}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">
                  Author
                  {metadata && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <Input
                  name="author"
                  id="author"
                  placeholder="Author name"
                  defaultValue={editingFilm?.author || ""}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "author" in state.errors
                    ? state.errors.author
                    : ""}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="views">Views</Label>
                  <Input
                    name="views"
                    id="views"
                    type="number"
                    placeholder="1000"
                    defaultValue={editingFilm?.views || ""}
                    onChange={(e) =>
                      handleInputChange("views", parseInt(e.target.value) || 0)
                    }
                  />
                  <p className="text-destructive text-xs" role="alert">
                    {state?.errors && "views" in state.errors
                      ? state.errors.views
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="py-4">
            <Separator />
          </div>
          <CardFooter className="flex-col gap-2">
            {!editingFilm ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={resetForm}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(pathname)}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? editingFilm
                  ? "Updating..."
                  : "Adding..."
                : editingFilm
                  ? "Update Film"
                  : "Add Film"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="w-full border-l">
        <div className="text-primary relative flex w-full items-center justify-center border border-amber-300 bg-linear-to-r from-transparent via-amber-300/30 to-transparent p-2">
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-amber-500" />
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
                  <Link href={formData.url || "#"} target="_blank">
                    {formData.title || "Untitled Film"}
                  </Link>
                </h1>
                <div className="flex flex-col gap-0">
                  <p className="text-sm">
                    {formData.author || "Unknown Author"}
                  </p>

                  <p className="text-muted-foreground text-xs">
                    {formData.publishedAt
                      ? format(new Date(formData.publishedAt), "MMMM do, yyyy")
                      : "Date not set"}
                  </p>
                </div>
              </div>
              <div className="relative hidden w-xs sm:block md:w-sm xl:w-xl">
                <Link href={formData.url || "#"} target="_blank">
                  <Image
                    src={formData.thumbnail || "/placeholder.svg"}
                    alt={formData.title || "Film thumbnail"}
                    fill={true}
                    className="aspect-video size-full translate-x-2 translate-y-1/4 rounded-l-xl border-t border-b border-l object-cover object-center shadow-lg"
                  />
                </Link>
              </div>
            </div>
            <Categories
              categories={formData.categories}
              className="absolute bottom-2 left-2 z-10"
            />
            <Lines />
          </div>
        </section>
        <SectionDivider />
        <section className="relative aspect-video w-full sm:hidden">
          <Image
            src={formData.thumbnail || "/placeholder.svg"}
            alt={formData.title || "Film thumbnail"}
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
              <Likes likeCount={0} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground font-mono text-xs">Views</p>
              <Views views={formData.views} />
            </div>
            <Lines className="[mask-image:none] opacity-15 dark:opacity-50" />
            <Diamond bottom left />
            <Diamond bottom right />
          </div>
          <div className="px-4 sm:px-6 sm:py-4">
            <p className="text-muted-foreground leading-relaxed">
              {formData.description || "No description provided."}
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
