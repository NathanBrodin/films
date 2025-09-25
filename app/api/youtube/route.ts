import { NextRequest, NextResponse } from "next/server"

import { getVideoInfo, youtubeToFilm } from "@/lib/actions/youtube"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Valid URL is required" },
        { status: 400 }
      )
    }

    // Validate that it's a YouTube URL
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return NextResponse.json(
        { error: "Only YouTube URLs are supported" },
        { status: 400 }
      )
    }

    const videoInfo = await getVideoInfo(url)

    if (!videoInfo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const filmData = youtubeToFilm(videoInfo)

    return NextResponse.json({ filmData })
  } catch (error) {
    console.error("YouTube API error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Youtube url invalid")) {
        return NextResponse.json(
          { error: "Invalid YouTube URL format" },
          { status: 400 }
        )
      }

      if (error.message.includes("YouTube API request failed")) {
        return NextResponse.json(
          { error: "YouTube service temporarily unavailable" },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch video information" },
      { status: 500 }
    )
  }
}
