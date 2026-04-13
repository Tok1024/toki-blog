'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="space-y-10">
        <div className="space-y-4 pt-8 pb-10">
          <h1 className="dark:text-primary-100 text-4xl leading-[1.2] font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="glass-card border-primary-200 text-primary-900 focus:border-primary-400 focus:ring-primary-300 dark:border-primary-900/40 dark:text-primary-50 block w-full rounded-2xl border px-4 py-3"
              />
            </label>
            <svg
              className="text-primary-400 dark:text-primary-300 absolute top-3 right-3 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="divide-primary-100/80 divide-y dark:divide-gray-800">
          {!filteredBlogPosts.length && (
            <div className="glass-card text-primary-700 dark:text-primary-200 col-span-full rounded-3xl bg-white/90 p-6 text-center shadow-sm dark:bg-gray-900/70">
              No posts found.
            </div>
          )}
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags } = post
            return (
              <article
                key={path}
                className="group grid gap-5 py-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-8"
              >
                <div className="pt-1">
                  <time
                    className="text-sm font-medium tracking-[0.02em] text-gray-500 dark:text-gray-400"
                    dateTime={date}
                  >
                    {formatDate(date, siteMetadata.locale)}
                  </time>
                </div>

                <div className="space-y-4">
                  <h3 className="group-hover:text-primary-700 dark:text-primary-50 dark:group-hover:text-primary-200 text-[1.6rem] leading-[1.45] font-semibold tracking-[-0.03em] text-gray-950 transition">
                    <Link href={`/${path}`} className="block">
                      {title}
                    </Link>
                  </h3>

                  <p className="max-w-2xl text-[1.02rem] leading-8 text-gray-600 dark:text-gray-300">
                    {summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-2">
                      {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                    </div>

                    <Link
                      href={`/${path}`}
                      className="text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100 text-sm font-semibold tracking-[0.08em] uppercase"
                      aria-label={`Read more: "${title}"`}
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
