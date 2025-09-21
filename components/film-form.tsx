"use client"

import { useActionState, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Film } from "@/db/schema"

import addFilm, { deleteFilm, updateFilm } from "@/lib/actions/films"
import { categories } from "@/lib/categories"
import { isValidUrl, normalizeUrl } from "@/lib/utils/url"
import { useUrlMetadata } from "@/hooks/use-url-metadata"
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

  const [addState, addFormAction, addPending] = useActionState(addFilm, null)
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateFilm,
    null
  )

  const state = editingFilm ? updateState : addState
  const formAction = editingFilm ? updateFormAction : addFormAction
  const pending = editingFilm ? updatePending : addPending
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [favicon, setFavicon] = useState("")
  const [prevPending, setPrevPending] = useState(false)

  const { metadata, loading, error, fetchMetadata, clearMetadata } =
    useUrlMetadata()

  const resetForm = useCallback(() => {
    setUrl("")
    setTitle("")
    setAuthor("")
    setFavicon("")
    setSelectedOptions([])
    clearMetadata()
  }, [clearMetadata])

  // Auto-populate fields when metadata is fetched
  useEffect(() => {
    if (metadata) {
      setTitle(metadata.title)
      setAuthor(metadata.author)
      setFavicon(metadata.favicon)
    }
  }, [metadata])

  // Track pending state changes
  useEffect(() => {
    setPrevPending(pending)
  }, [pending])

  // Reset form after successful submission
  useEffect(() => {
    // Detect when we just finished submitting (prevPending was true, now false)
    // and there are no errors in the state
    if (prevPending && !pending && !state?.errors) {
      if (editingFilm) {
        // Clear edit search param after successful update
        router.push(pathname)
      } else {
        // Reset form for new bookmark
        resetForm()
      }
    }
  }, [prevPending, pending, state, resetForm, editingFilm, router, pathname])

  // Populate form fields when editingFilm changes
  useEffect(() => {
    if (editingFilm) {
      setUrl(editingFilm.url)
      setTitle(editingFilm.title)
      setAuthor(editingFilm.author || "")
      setFavicon(editingFilm.favicon || "")

      // Set selected categories
      const filmCategories =
        editingFilm.categories?.map((cat) => ({
          label: cat,
          value: cat,
        })) || []
      setSelectedOptions(filmCategories)
    } else {
      resetForm()
    }
  }, [editingFilm, resetForm])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawUrl = e.target.value
    setUrl(rawUrl)

    if (!rawUrl.trim()) {
      clearMetadata()
      setTitle("")
      setAuthor("")
      setFavicon("")
    }
  }

  // Debounce URL metadata fetching (only for new bookmarks)
  useEffect(() => {
    if (!url.trim() || editingFilm) return

    const timer = setTimeout(() => {
      const normalizedUrl = normalizeUrl(url)
      if (isValidUrl(normalizedUrl)) {
        fetchMetadata(normalizedUrl)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [url, fetchMetadata, editingFilm])

  async function onDelete() {
    if (editingFilm) {
      deleteFilm(editingFilm.id)
    }
  }

  return (
    <Card className="h-fit w-full max-w-sm">
      <CardHeader>
        <CardTitle>{editingFilm ? "Edit Bookmark" : "Add Bookmark"}</CardTitle>
        <CardDescription>
          {editingFilm
            ? "Update the bookmark details."
            : "Add a new bookmark to your collection."}
        </CardDescription>
        {editingFilm && (
          <CardAction>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <form action={formAction}>
        {editingFilm && (
          <input type="hidden" name="id" value={editingFilm.id} />
        )}
        <CardContent className="">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                name="url"
                id="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com"
              />
              {url && !isValidUrl(normalizeUrl(url)) && (
                <p className="text-xs text-amber-600">
                  Please enter a valid URL (e.g., https://example.com)
                </p>
              )}
              {loading && !editingFilm && (
                <p className="text-muted-foreground text-xs">
                  Fetching metadata...
                </p>
              )}
              {error && <p className="text-destructive text-xs">{error}</p>}
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
                value={selectedOptions}
                onChange={setSelectedOptions}
                defaultOptions={categories}
                placeholder="Select categories"
                emptyIndicator={
                  <p className="text-center text-sm">No results found</p>
                }
              />
              {selectedOptions.map((option) => (
                <input
                  key={option.value}
                  type="hidden"
                  name="categories"
                  value={option.value}
                />
              ))}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title"
                className={metadata ? "border-green-200" : ""}
              />
              <p className="text-destructive text-xs" role="alert">
                {state?.errors && "title" in state.errors
                  ? state.errors.title
                  : ""}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="favicon">
                Favicon
                {metadata && (
                  <span className="text-muted-foreground ml-2 text-xs">
                    (auto-filled)
                  </span>
                )}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  name="favicon"
                  id="favicon"
                  value={favicon}
                  onChange={(e) => setFavicon(e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                  className={metadata ? "flex-1 border-green-200" : "flex-1"}
                />
                {favicon && (
                  <Image
                    src={favicon}
                    alt="Favicon preview"
                    width={16}
                    height={16}
                    className="h-4 w-4 rounded-sm border"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                )}
              </div>
              <p className="text-destructive text-xs" role="alert">
                {state?.errors && "favicon" in state.errors
                  ? state.errors.favicon
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
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className={metadata ? "border-green-200" : ""}
              />
              <p className="text-destructive text-xs" role="alert">
                {state?.errors && "author" in state.errors
                  ? state.errors.author
                  : ""}
              </p>
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
          <Button type="submit" className="w-full" disabled={pending}>
            {pending
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
