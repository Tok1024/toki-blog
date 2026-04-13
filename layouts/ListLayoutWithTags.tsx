'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

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
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
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

export default function ListLayoutWithTags({
  posts,
  title,
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
          <h1 className="dark:text-primary-100 text-4xl leading-[1.2] font-semibold tracking-[-0.05em] text-gray-950 sm:hidden">
            {title}
          </h1>
        </div>
        <div className="flex flex-col gap-10 sm:flex-row">
          <div className="hidden h-full max-h-screen max-w-[240px] min-w-[240px] flex-wrap overflow-auto sm:flex">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-primary-700 border-primary-200 dark:text-primary-300 border-b pb-3 text-xs font-semibold tracking-[0.2em] uppercase dark:border-gray-800">
                  All Posts
                </h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="text-primary-700 border-primary-200 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 block border-b pb-3 text-xs font-semibold tracking-[0.2em] uppercase dark:border-gray-800"
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
                        suppressHydrationWarning
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
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
