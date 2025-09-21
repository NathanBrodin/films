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
  {
    label: "Inspirations",
    value: "Inspirations",
    variant: "purple",
  },
  {
    label: "Registries",
    value: "registries",
    variant: "blue",
  },
  {
    label: "Portfolios",
    value: "portfolios",
    variant: "cyan",
  },
  {
    label: "Tools",
    value: "Tools",
    variant: "orange",
  },
  {
    label: "Articles",
    value: "Articles",
    variant: "green",
  },
  {
    label: "Services",
    value: "Services",
    variant: "teal",
  },
  {
    label: "Templates",
    value: "templates",
    variant: "fuchsia",
  },
  {
    label: "My Stuff",
    value: "my-stuff",
    variant: "yellow",
  },
  {
    label: "Others",
    value: "Others",
    variant: "gray",
  },
]
