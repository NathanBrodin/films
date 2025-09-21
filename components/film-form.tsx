"use client"

import { useActionState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Film } from "@/db/schema"

import { addFilm } from "@/lib/actions/films"
import { categories } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import MultipleSelector, { Option } from "./ui/multiselect"
import { Separator } from "./ui/separator"

interface FilmFormProps {
  editingFilm?: Film | null
}

export function FilmForm({ editingFilm: editingFilm }: FilmFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, action, isPending] = useActionState(addFilm, null)

  function onDelete() {}

  function resetForm() {}

  const metadata = {}

  return (
    <Card className="h-fit w-full max-w-sm">
      <CardHeader>
        <CardTitle>Add a new film</CardTitle>
        <CardDescription>
          If you had a film in my that was not registered in the film database,
          here&apos; your opportunity to add it and share it with everyone.
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
        <CardContent className="">
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                name="url"
                id="url"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                defaultValue={editingFilm?.url || ""}
              />
              <p className="text-destructive text-xs" role="alert">
                {state?.errors && "url" in state.errors ? state.errors.url : ""}
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
                value={
                  editingFilm?.categories?.map((cat) => ({
                    label: cat,
                    value: cat,
                  })) || []
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
                <Input
                  name="description"
                  id="description"
                  placeholder="Film description"
                  defaultValue={editingFilm?.description || ""}
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
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "views" in state.errors
                    ? state.errors.views
                    : ""}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="likeCount">Likes</Label>
                <Input
                  name="likeCount"
                  id="likeCount"
                  type="number"
                  placeholder="50"
                  defaultValue={editingFilm?.likeCount || ""}
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "likeCount" in state.errors
                    ? state.errors.likeCount
                    : ""}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dislikeCount">Dislikes</Label>
                <Input
                  name="dislikeCount"
                  id="dislikeCount"
                  type="number"
                  placeholder="5"
                  defaultValue={editingFilm?.dislikeCount || ""}
                />
                <p className="text-destructive text-xs" role="alert">
                  {state?.errors && "dislikeCount" in state.errors
                    ? state.errors.dislikeCount
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
  )
}
