import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Fetch the webpage
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        },
        { status: 400 }
      )
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("text/html")) {
      return NextResponse.json(
        {
          error: "URL does not point to an HTML page",
        },
        { status: 400 }
      )
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract metadata
    const title =
      document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content") ||
      document
        .querySelector('meta[name="twitter:title"]')
        ?.getAttribute("content") ||
      document.querySelector("title")?.textContent ||
      ""

    const author =
      document.querySelector('meta[name="author"]')?.getAttribute("content") ||
      document
        .querySelector('meta[property="article:author"]')
        ?.getAttribute("content") ||
      document
        .querySelector('meta[name="twitter:creator"]')
        ?.getAttribute("content") ||
      ""

    // Extract favicon
    let favicon = ""
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
    ]

    for (const selector of faviconSelectors) {
      const faviconElement = document.querySelector(selector)
      if (faviconElement) {
        const href = faviconElement.getAttribute("href")
        if (href) {
          // Convert relative URLs to absolute URLs
          favicon = href.startsWith("http")
            ? href
            : new URL(href, validUrl.origin).toString()
          break
        }
      }
    }

    // Fallback to default favicon location
    if (!favicon) {
      favicon = `${validUrl.origin}/favicon.ico`
    }

    return NextResponse.json({
      title: title.trim(),
      author: author.trim(),
      favicon: favicon.trim(),
    })
  } catch (error) {
    console.error("Error fetching metadata:", error)

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 })
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
