"use client"

import { useTransition } from "react"
import { Film, filmSchema } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { addFilm } from "@/lib/actions/films"
import { getVideoInfo } from "@/lib/actions/youtube"
import { categories, Category } from "@/lib/categories"
import { cn, isValidYouTubeUrl } from "@/lib/utils"
import { AnimatedState } from "@/components/ui/animate-state"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import MultipleSelector from "@/components/ui/multiselect"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { FilmPreview } from "./film-preview"

interface FilmFormProps {
  editingFilm?: Film | null
}

export function FilmForm({ editingFilm: editingFilm }: FilmFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isFetchingPending, startFetchingTransition] = useTransition()

  const form = useForm<z.infer<typeof filmSchema>>({
    resolver: zodResolver(filmSchema),
    defaultValues: editingFilm
      ? {
          url: editingFilm.url,
          title: editingFilm.title,
          description: editingFilm.description ?? "",
          thumbnail: editingFilm.thumbnail ?? undefined,
          publishedAt: editingFilm.publishedAt ?? new Date(),
          author: editingFilm.author ?? "",
          viewCount: editingFilm.viewCount ?? undefined,
          likeCount: editingFilm.likeCount ?? undefined,
          categories: editingFilm.categories,
        }
      : {
          url: "",
          title: "",
          description: "",
          thumbnail: "",
          publishedAt: new Date(),
          author: "",
          viewCount: undefined,
          likeCount: undefined,
          categories: [],
        },
  })

  const watchedValues = form.watch()

  function handleUrlChange(url: string) {
    if (isValidYouTubeUrl(url)) {
      startFetchingTransition(async () => {
        const info = await getVideoInfo(url)

        if (!info) return

        form.setValue("title", info.title)
        form.setValue("description", info.description)
        form.setValue("thumbnail", info.thumbnail)
        form.setValue("publishedAt", new Date(info.publishedAt))
        form.setValue("author", info.author)
        form.setValue("viewCount", info.viewCount)
        form.setValue("likeCount", info.likeCount)
      })
    }
  }

  function onSubmit(values: z.infer<typeof filmSchema>) {
    startTransition(async () => {
      try {
        await addFilm(values)
        toast.success("Film added successfully!")
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add film"
        toast.error(errorMessage)
      }
    })
  }

  return (
    <>
      <Card className="relative z-10 m-0 mx-3 my-6 h-fit w-full md:m-6">
        <CardHeader>
          <CardTitle>Add a new film</CardTitle>
          <CardDescription>
            Add a film that isn’t in the database yet.
          </CardDescription>
          {editingFilm && (
            <CardAction>
              <Button variant="destructive" onClick={() => {}}>
                Delete
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-row gap-4">
              <div className="grid w-full gap-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Link to film</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          autoComplete="off"
                          placeholder="https://www.youtube.com/..."
                          {...field}
                          onChange={(e) => {
                            form.setValue("url", e.target.value)
                            handleUrlChange(e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Categories</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          value={
                            field.value
                              ?.map((val) =>
                                categories.find((cat) => cat.value === val)
                              )
                              .filter(
                                (cat): cat is Category => cat !== undefined
                              ) || []
                          }
                          onChange={(options) =>
                            field.onChange(
                              options.map((option) => option.value)
                            )
                          }
                          defaultOptions={categories}
                          commandProps={{
                            label: "Select categories",
                          }}
                          placeholder="Select categories"
                          hidePlaceholderWhenSelected
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter film title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter film description"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel required>Published Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/thumbnail.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="viewCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>View Count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="likeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Like Count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <div className="py-4">
              <Separator />
            </div>
            <CardFooter className="flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full" disabled={isPending}>
                <AnimatedState>
                  {isPending
                    ? editingFilm
                      ? "Updating..."
                      : "Adding..."
                    : editingFilm
                      ? "Update Film"
                      : "Add Film"}
                </AnimatedState>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <FilmPreview film={watchedValues} />
    </>
  )
}
