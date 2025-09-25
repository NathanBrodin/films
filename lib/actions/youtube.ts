interface VideoSnippet {
  title: string
  description: string
  channelTitle: string
  publishedAt: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
  }
}

interface VideoContentDetails {
  duration: string
  dimension: string
  definition: string
}

interface VideoStatistics {
  viewCount: string
  likeCount: string
  commentCount: string
}

interface VideoInfo {
  id: string
  snippet: VideoSnippet
  contentDetails: VideoContentDetails
  statistics: VideoStatistics
}

interface YouTubeApiResponse {
  items: VideoInfo[]
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

export async function getVideoInfo(url: string): Promise<VideoInfo | null> {
  const videoId = extractVideoId(url)

  if (!videoId) {
    throw new Error("Youtube url invalid")
  }

  try {
    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      id: videoId,
      key: process.env.YOUTUBE_API_KEY!,
    })

    const url = `https://youtube.googleapis.com/youtube/v3/videos?${params.toString()}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(
        `YouTube API request failed: ${response.status} ${response.statusText}`
      )
    }

    const data: YouTubeApiResponse = await response.json()
    console.log(data)

    if (!data.items || data.items.length === 0) {
      return null
    }

    return data.items[0]
  } catch (error) {
    console.error("Error fetching video info:", error)
    throw error
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  // If it's already just a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }

  return null
}

export function youtubeToFilm(videoInfo: VideoInfo) {
  return {
    url: "",
    title: videoInfo.snippet.title,
    description: videoInfo.snippet.description,
    thumbnail: videoInfo.snippet.thumbnails.default.url,
    publishedAt: videoInfo.snippet.publishedAt,
    author: videoInfo.snippet.channelTitle,
    viewCount: parseInt(videoInfo.statistics.viewCount),
    likeCount: parseInt(videoInfo.statistics.likeCount),
    categories: [],
  }
}
