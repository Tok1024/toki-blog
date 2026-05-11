'use client'

import { useEffect, useState, useRef } from 'react'
import Link from './Link'

type TocItem = {
  value: string
  url: string
  depth: number
}

export default function TOC({ toc }: { toc?: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!toc || toc.length === 0) return

    const headingIds = toc.map((item) => item.url.replace('#', ''))

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    headingIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [toc])

  if (!toc || toc.length === 0) return null

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <nav aria-label="目录" className="border-primary-100/90 border-l pl-6 dark:border-gray-800">
          <div className="mb-4">
            <h3 className="text-primary-700 dark:text-primary-200 text-xs font-medium">
              On This Page
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs leading-6">
            {toc.map((item) => {
              const id = item.url.replace('#', '')
              const isActive = activeId === id
              return (
                <li key={item.url} style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 12}px` }}>
                  <Link
                    href={item.url}
                    className={`block transition ${
                      isActive
                        ? 'text-primary-700 dark:text-primary-200 font-medium'
                        : 'hover:text-primary-700 dark:hover:text-primary-200 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    <span>{item.value}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
