"use client"

import { useActionState, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Film, FilmCreate } from "@/db/schema"

import { addFilm } from "@/lib/actions/films"
import { categories } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import MultipleSelector from "@/components/ui/multiselect"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { FilmPreview } from "./film-preview"

interface FilmFormProps {
  editingFilm?: Film | null
}

export function FilmForm({ editingFilm: editingFilm }: FilmFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, action, isPending] = useActionState(addFilm, null)

  // Form state for live preview
  const [formData, setFormData] = useState<FilmCreate>({
    url: editingFilm?.url || "",
    title: editingFilm?.title || "",
    description: editingFilm?.description || "",
    thumbnail: editingFilm?.thumbnail || "",
    publishedAt: editingFilm?.publishedAt
      ? new Date(editingFilm.publishedAt).toISOString().split("T")[0]
      : "",
    author: editingFilm?.author || "",
    viewCount: editingFilm?.viewCount || 0,
    likeCount: editingFilm?.likeCount || 0,
    categories: editingFilm?.categories || [],
  })

  const [isLoadingVideoInfo, setIsLoadingVideoInfo] = useState(false)
  const [videoInfoError, setVideoInfoError] = useState<string | null>(null)
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(
    new Set()
  )

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Remove auto-filled status when user manually edits a field
    if (autoFilledFields.has(field)) {
      setAutoFilledFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete(field)
        return newSet
      })
    }
  }

  const handleUrlChange = async (url: string) => {
    handleInputChange("url", url)

    // Check if the URL looks like a YouTube URL
    if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
      setIsLoadingVideoInfo(true)
      setVideoInfoError(null)
      try {
        const response = await fetch("/api/youtube", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        })

        if (response.ok) {
          const { filmData } = await response.json()

          // Auto-fill the form with the video data
          setFormData((prev) => ({
            ...prev,
            url: url,
            title: filmData.title,
            description: filmData.description || "",
            thumbnail: filmData.thumbnail || "",
            publishedAt: new Date(filmData.publishedAt)
              .toISOString()
              .split("T")[0],
            author: filmData.author || "",
            viewCount: filmData.viewCount || 0,
            likeCount: filmData.likeCount || 0,
          }))

          // Mark fields as auto-filled
          setAutoFilledFields(
            new Set([
              "title",
              "description",
              "thumbnail",
              "publishedAt",
              "author",
              "viewCount",
              "likeCount",
            ])
          )
        } else {
          const errorText = await response.text()
          console.error("Failed to fetch YouTube video info:", errorText)
          setVideoInfoError(
            "Failed to fetch video information. Please check the URL or try again."
          )
        }
      } catch (error) {
        console.error("Failed to fetch YouTube video info:", error)
        setVideoInfoError(
          "Network error. Please check your connection and try again."
        )
      } finally {
        setIsLoadingVideoInfo(false)
      }
    } else if (
      url &&
      !url.includes("youtube.com") &&
      !url.includes("youtu.be")
    ) {
      // Clear any previous auto-fill data if it's not a YouTube URL
      setVideoInfoError(null)
      setAutoFilledFields(new Set())
    }
  }

  function onDelete() {}

  function resetForm() {
    setFormData({
      url: "",
      title: "",
      description: "",
      thumbnail: "",
      publishedAt: "",
      author: "",
      viewCount: 0,
      likeCount: 0,
      categories: [],
    })
    setAutoFilledFields(new Set())
    setVideoInfoError(null)
  }

  const hasAutoFilledData = autoFilledFields.size > 0

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
          {/* Hidden inputs to pass current form state to server */}
          <input type="hidden" name="url" value={formData.url} />
          <input type="hidden" name="title" value={formData.title} />
          <input
            type="hidden"
            name="description"
            value={formData.description}
          />
          <input type="hidden" name="thumbnail" value={formData.thumbnail} />
          <input
            type="hidden"
            name="publishedAt"
            value={formData.publishedAt}
          />
          <input type="hidden" name="author" value={formData.author} />
          <input type="hidden" name="views" value={formData.viewCount} />
          <input type="hidden" name="likeCount" value={formData.likeCount} />
          {formData.categories.map((category, index) => (
            <input
              key={index}
              type="hidden"
              name="categories"
              value={category}
            />
          ))}
          <CardContent className="flex flex-row gap-4">
            <div className="flex max-w-lg flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={formData.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  disabled={isLoadingVideoInfo}
                />
                {isLoadingVideoInfo && (
                  <p className="text-muted-foreground animate-pulse text-sm">
                    🔄 Fetching video information...
                  </p>
                )}
                {hasAutoFilledData &&
                  !isLoadingVideoInfo &&
                  !videoInfoError && (
                    <p className="text-sm text-green-600">
                      ✅ Video information loaded successfully
                    </p>
                  )}
                {videoInfoError && (
                  <p className="text-destructive text-sm">
                    ⚠️ {videoInfoError}
                  </p>
                )}
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
                  {autoFilledFields.has("title") && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <Input
                  id="title"
                  placeholder="Page title"
                  value={formData.title}
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
                  {autoFilledFields.has("description") && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <div className="flex items-center gap-2">
                  <Textarea
                    id="description"
                    placeholder="Film description"
                    value={formData.description}
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
                  {autoFilledFields.has("thumbnail") && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={formData.thumbnail}
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
                  {autoFilledFields.has("publishedAt") && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <Input
                  id="publishedAt"
                  type="date"
                  value={formData.publishedAt}
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
                  {autoFilledFields.has("author") && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      (auto-filled)
                    </span>
                  )}
                </Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  value={formData.author}
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
                  <Label htmlFor="views">
                    Views
                    {autoFilledFields.has("viewCount") && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        (auto-filled)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="views"
                    type="number"
                    placeholder="1000"
                    value={formData.viewCount || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "viewCount",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <p className="text-destructive text-xs" role="alert">
                    {state?.errors && "viewCount" in state.errors
                      ? state.errors.viewCount
                      : ""}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="likeCount">
                    Likes
                    {autoFilledFields.has("likeCount") && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        (auto-filled)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="likeCount"
                    type="number"
                    placeholder="1000"
                    value={formData.likeCount || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "likeCount",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <p className="text-destructive text-xs" role="alert">
                    {state?.errors && "likeCount" in state.errors
                      ? state.errors.likeCount
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
                Reset Form
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
      <FilmPreview film={formData} />
    </>
  )
}
