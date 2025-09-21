"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function Search() {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  // Get current search query from URL params
  const currentSearch = searchParams.get("search") || ""
  const [searchValue, setSearchValue] = useState(currentSearch)

  // Sync search input with URL params
  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  // Auto-focus input when user starts typing
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't focus if user is typing in another input or if modifier keys are pressed
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.key === "Escape" ||
        e.key === "Tab" ||
        e.key === "Enter"
      ) {
        return
      }

      // Focus the search input and let the character be typed
      if (inputRef.current && e.key.length === 1) {
        inputRef.current.focus()
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown)
    return () => document.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  const updateSearchParams = useCallback(
    (searchQuery: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim())
      } else {
        params.delete("search")
      }

      const queryString = params.toString()
      router.push(pathname + (queryString ? "?" + queryString : ""))
    },
    [searchParams, pathname, router]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)
      // Apply search on each keystroke
      updateSearchParams(value)
    },
    [updateSearchParams]
  )

  const handleClear = useCallback(() => {
    setSearchValue("")
    updateSearchParams("")
  }, [updateSearchParams])

  return (
    <section className="flex gap-2 px-2 py-2 lg:gap-4 lg:px-8 lg:py-4">
      <div className="bg-card relative w-full">
        <Input
          ref={inputRef}
          id={id}
          className="peer ps-9"
          placeholder="Search bookmarks"
          autoComplete="off"
          value={searchValue}
          onChange={handleInputChange}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} aria-hidden="true" />
        </div>
        {searchValue && (
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Clear input"
            onClick={handleClear}
          >
            <XIcon size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <Button variant="secondary">
        <span className="hidden lg:flex">Search</span>
        <SearchIcon className="flex size-4 lg:hidden" aria-hidden="true" />
      </Button>
    </section>
  )
}
