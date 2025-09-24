export type Category = {
  label: string
  value: string
  variant:
    | "purple"
    | "blue"
    | "cyan"
    | "orange"
    | "green"
    | "teal"
    | "fuchsia"
    | "yellow"
    | "gray"
}

export const categories: Category[] = [
  { label: "Park", value: "park", variant: "purple" },
  { label: "Street", value: "street", variant: "blue" },
  { label: "Freeride", value: "freeride", variant: "cyan" },

  { label: "Ski", value: "ski", variant: "orange" },
  { label: "Snowboard", value: "snowboard", variant: "green" },

  { label: "Film", value: "film", variant: "teal" },
  { label: "Edit", value: "edit", variant: "fuchsia" },
  { label: "Series", value: "series", variant: "yellow" },

  { label: "Other", value: "other", variant: "gray" },
]
