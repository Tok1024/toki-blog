'use client'

import { useRef, useState, useEffect } from 'react'

export default function CopyButton({
  codeRef,
}: {
  codeRef: React.RefObject<HTMLPreElement | null>
}) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleCopy = async () => {
    const text = codeRef.current?.textContent ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      aria-label="Copy code"
      onClick={handleCopy}
      className="border-primary-200/60 absolute top-3 right-3 rounded-md border bg-white/80 px-2 py-1 text-xs text-gray-600 opacity-0 transition group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
