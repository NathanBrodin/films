import { useState, useCallback } from 'react'

interface UrlMetadata {
  title: string
  author: string
  favicon: string
}

interface UseUrlMetadataReturn {
  metadata: UrlMetadata | null
  loading: boolean
  error: string | null
  fetchMetadata: (url: string) => Promise<void>
  clearMetadata: () => void
}

export function useUrlMetadata(): UseUrlMetadataReturn {
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetadata = useCallback(async (url: string) => {
    if (!url.trim()) {
      setMetadata(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch metadata')
      }

      const data = await response.json()
      setMetadata(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setMetadata(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearMetadata = useCallback(() => {
    setMetadata(null)
    setError(null)
  }, [])

  return {
    metadata,
    loading,
    error,
    fetchMetadata,
    clearMetadata,
  }
}
