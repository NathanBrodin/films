import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidYouTubeUrl(url: string): boolean {
  // Early exit for obviously incomplete URLs
  if (url.length < 11 || !url.includes("youtu")) return false

  // YouTube video ID regex - matches 11 character alphanumeric + dash/underscore
  const videoIdPattern = /[a-zA-Z0-9_-]{11}/

  // Check common YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ]

  return patterns.some((pattern) => {
    const match = url.match(pattern)
    return match && videoIdPattern.test(match[1])
  })
}
