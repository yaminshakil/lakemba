'use client'
import { useEffect } from 'react'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
      <p className="text-gray-500 max-w-md">{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset} className="px-6 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-500">
        Try again
      </button>
    </div>
  )
}
