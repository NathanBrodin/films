export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeUrl(url: string): string {
  if (!url) return url

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }

  return url
}

export function getDomainFromUrl(url: string): string | null {
  try {
    const urlObject = new URL(url)
    return urlObject.hostname
  } catch {
    return null
  }
}

export function getFaviconUrl(url: string): string {
  try {
    const urlObject = new URL(url)
    return `${urlObject.protocol}//${urlObject.hostname}/favicon.ico`
  } catch {
    return ''
  }
}
