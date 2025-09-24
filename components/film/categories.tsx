import { categories as categoriesType } from "@/lib/categories"
import { cn } from "@/lib/utils"

import { Badge } from "../ui/badge"

export function Categories({
  categories,
  className,
}: {
  categories: string[]
  className?: string
}) {
  const getCategoryVariant = (categoryId: string) => {
    const category = categoriesType.find((cat) => cat.value === categoryId)
    return category?.variant || "gray"
  }

  return (
    <div className={cn("flex flex-wrap gap-2 px-4 md:px-8", className)}>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={getCategoryVariant(category)}
          className="bg-card h-[18px] text-[0.625rem] leading-6"
        >
          {category}
        </Badge>
      ))}
    </div>
  )
}
