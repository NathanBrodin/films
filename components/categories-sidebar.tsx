"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { categories } from "@/lib/categories"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function CategoriesSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current selected category from search params
  const selectedCategory = searchParams.get("categories") || null

  // Helper function to clear all categories
  const clearAllCategories = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("categories")

    const queryString = params.toString()
    router.push(pathname + (queryString ? "?" + queryString : ""))
  }, [searchParams, pathname, router])

  // Helper function to update search params
  const selectCategory = useCallback(
    (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (selectedCategory === categoryId) {
        // If clicking the same category, clear selection (go to "All Categories")
        params.delete("categories")
      } else {
        // Select new category
        params.set("categories", categoryId)
      }

      const queryString = params.toString()
      router.push(pathname + (queryString ? "?" + queryString : ""))
    },
    [searchParams, pathname, router, selectedCategory]
  )

  return (
    <>
      <SidebarProvider className="min-h-fit flex-1">
        <Sidebar
          className="hidden bg-transparent lg:flex"
          collapsible="none"
          {...props}
        >
          <SidebarContent className="">
            <div className="shrink-0" />
            <SidebarGroup>
              <SidebarGroupLabel>Categories</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={clearAllCategories}
                      isActive={selectedCategory === null}
                    >
                      All Categories
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {categories.map((category) => (
                    <SidebarMenuItem key={category.value}>
                      <SidebarMenuButton
                        onClick={() => selectCategory(category.value)}
                        isActive={selectedCategory === category.value}
                      >
                        {category.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <div className="flex flex-col lg:hidden">
        <div className="text-muted-foreground border-b px-0 pb-2.5 text-center font-mono text-xs uppercase">
          Categories
        </div>
        <ul className="flex overflow-x-auto text-sm">
          <li className="flex w-full flex-1">
            <button
              className={cn(
                "text-muted-foreground shrink-0 p-2 text-sm text-nowrap",
                selectedCategory === null && "bg-accent text-accent-foreground"
              )}
              onClick={clearAllCategories}
            >
              All categories
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.value} className="flex w-full flex-1">
              <button
                className={cn(
                  "text-muted-foreground shrink-0 p-2 text-sm text-nowrap",
                  selectedCategory === category.value &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => selectCategory(category.value)}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
