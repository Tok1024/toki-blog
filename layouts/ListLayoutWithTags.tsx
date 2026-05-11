'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import ArticleCard from '@/components/ArticleCard'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  description?: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
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

export default function ListLayoutWithTags({
  posts,
  title,
  description,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="space-y-10">
        <div className="pt-8 pb-2">
          <h1 className="dark:text-primary-100 text-4xl leading-tight font-semibold tracking-tight text-gray-950">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-10 sm:flex-row">
          <div className="hidden h-full max-h-screen max-w-[240px] min-w-[240px] flex-wrap overflow-auto sm:flex">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-primary-700 border-primary-200 dark:text-primary-300 border-b pb-3 text-xs font-semibold tracking-widest uppercase dark:border-gray-800">
                  All Posts
                </h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="hover:text-primary-700 dark:hover:text-primary-200 text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-300"
                >
                  All Posts
                </Link>
              )}
              <ul className="mt-4 space-y-1">
                {sortedTags.map((t) => {
                  return (
                    <li key={t}>
                      {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                        <h3 className="bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200 inline-block rounded-full px-3 py-2 text-sm font-medium">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="hover:text-primary-700 dark:hover:text-primary-200 inline-block px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-300"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="flex-1">
            <div className="divide-primary-100/80 divide-y dark:divide-gray-800">
              {displayPosts.map((post) => (
                <ArticleCard key={post.path} post={post} />
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
