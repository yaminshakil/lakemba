'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  apiFn: () => Promise<{ data: T }>,
  deps: unknown[] = []
): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: true, error: null })
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await apiFn()
      if (mountedRef.current) setState({ data: res.data, loading: false, error: null })
    } catch {
      if (mountedRef.current) setState({ data: null, loading: false, error: 'Failed to load data. Please try again.' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { fetch() }, [fetch])

  return { ...state, refetch: fetch }
}
