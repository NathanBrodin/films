"use client"

import Image from "next/image"
import Link from "next/link"
import { Film as FilmData } from "@/db/schema"
import { format } from "date-fns"

export function Film(film: FilmData) {
  const patternId = `pattern-${film.id}`

  return (
    <div className="group hover:shadow-alt hover:border-primary/20 border-border relative flex w-full flex-col overflow-clip rounded-sm border [box-shadow:hsl(218,_13%,_50%,_0.1)_0_-2px_0_0_inset] transition-colors active:translate-y-px active:scale-[.99]">
      <div className="bg-card/60 relative flex h-fit w-full shrink-0 grow items-center justify-center overflow-clip rounded-sm p-2 md:h-[220px] md:max-h-[310px]">
        <svg className="text-primary/30 pointer-events-none absolute inset-0 [z-index:-1] size-full select-none">
          <defs>
            <pattern
              id={patternId}
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                stroke="currentColor"
                strokeWidth="1.5"
              ></line>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`}></rect>
        </svg>
        <div className="relative flex size-full items-center justify-center">
          <Image
            src={film.thumbnail ?? "placeholder.svg"}
            alt={film.title}
            fill={true}
            className="size-full rounded-[2px] border object-cover object-center shadow-lg"
          />
          <div className="bg-cream-50 dark:bg-offgray-950 text-accent-blue absolute right-0 bottom-0 left-0 z-2 flex transform items-center divide-x divide-blue-300 border-t border-blue-300 text-xs [box-shadow:hsl(218,_13%,_50%,_0.1)_0_-2px_0_0_inset] transition-transform duration-200 group-focus-within:translate-y-0 group-hover:translate-y-0 md:translate-y-full dark:divide-blue-400/50 dark:border-blue-400/50 dark:text-blue-100 dark:[box-shadow:hsl(218,_13%,_70%,_0.05)_0_-2px_0_0_inset]">
            <button className="dark:bg-offgray-950 fv-style w-full px-3 py-2 text-center hover:bg-blue-50 focus-visible:![outline-offset:-4px] dark:hover:bg-blue-950">
              See more
            </button>
            <Link
              href={film.url}
              target="_blank"
              className="dark:bg-offgray-950 fv-style flex w-full cursor-pointer items-center justify-center gap-1.5 px-3 py-2 hover:bg-blue-50 focus-visible:![outline-offset:-4px] dark:hover:bg-blue-950"
            >
              See video
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-card flex h-fit flex-1 shrink-0 flex-col gap-1 border-t border-gray-100 p-3.5 dark:border-gray-400/15">
        <h2 className="text-foreground group-hover:text-primary truncate text-[0.9375rem] font-medium">
          {film.title}
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed">
          {film.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="font-mono text-sm text-[0.625rem] leading-5">
            {film.author}
          </p>
          <div className="flex h-5 items-baseline gap-2">
            {film.publishedAt && (
              <p className="text-muted-foreground font-mono text-sm text-[0.625rem] leading-5">
                {format(new Date(film.publishedAt), "MMMM do, yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
