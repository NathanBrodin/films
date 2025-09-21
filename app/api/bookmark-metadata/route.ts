import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  try {
    // Validate URL
    const parsedUrl = new URL(url)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid URL protocol')
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract title
    let title = document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
                document.querySelector('title')?.textContent ||
                parsedUrl.hostname

    // Clean up title
    title = title.trim()

    // Extract favicon
    let favicon: string | undefined

    // Try to find favicon in various ways
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]'
    ]

    for (const selector of faviconSelectors) {
      const faviconEl = document.querySelector(selector)
      const faviconHref = faviconEl?.getAttribute('href')

      if (faviconHref) {
        // Convert relative URLs to absolute
        if (faviconHref.startsWith('//')) {
          favicon = `${parsedUrl.protocol}${faviconHref}`
        } else if (faviconHref.startsWith('/')) {
          favicon = `${parsedUrl.protocol}//${parsedUrl.host}${faviconHref}`
        } else if (faviconHref.startsWith('http')) {
          favicon = faviconHref
        } else {
          favicon = `${parsedUrl.protocol}//${parsedUrl.host}/${faviconHref}`
        }
        break
      }
    }

    // Fallback to default favicon location
    if (!favicon) {
      favicon = `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`
    }

    return NextResponse.json({
      title,
      favicon,
    })

  } catch (error) {
    console.error('Error fetching bookmark metadata:', error)

    // Return fallback data
    const parsedUrl = new URL(url)
    return NextResponse.json({
      title: parsedUrl.hostname,
      favicon: `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
