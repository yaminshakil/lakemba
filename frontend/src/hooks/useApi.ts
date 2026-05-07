'use client'
import { useState, useEffect, useCallback } from 'react'
import type { AxiosPromise } from 'axios'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  apiFn: () => AxiosPromise<{ data: T }>,
  deps: unknown[] = []
): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: true, error: null })

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await apiFn()
      setState({ data: res.data.data, loading: false, error: null })
    } catch {
      setState({ data: null, loading: false, error: 'Failed to load data. Please try again.' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { fetch() }, [fetch])

  return { ...state, refetch: fetch }
}
