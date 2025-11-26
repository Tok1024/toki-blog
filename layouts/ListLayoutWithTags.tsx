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
      <div className="space-y-8">
        <div className="pt-6 pb-6">
          <h1 className="text-primary-900 dark:text-primary-100 text-3xl leading-9 font-extrabold tracking-tight sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="glass-card via-primary-50/60 hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-3xl bg-gradient-to-b from-white/95 to-white/95 pt-5 shadow-sm sm:flex dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-primary-600 font-bold uppercase">All Posts</h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="text-primary-800 hover:text-primary-600 dark:text-primary-100 dark:hover:text-primary-200 font-bold uppercase"
                >
                  All Posts
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                        <h3 className="text-primary-600 inline px-3 py-2 text-sm font-bold uppercase">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="text-primary-700 hover:text-primary-600 dark:text-primary-100 dark:hover:text-primary-200 px-3 py-2 text-sm font-medium uppercase"
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
            <div className="grid gap-6 sm:grid-cols-2">
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <article
                    key={path}
                    className="glass-card group via-primary-50/70 relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 to-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <time
                          className="text-primary-700/80 dark:text-primary-200/80 text-sm font-medium"
                          dateTime={date}
                          suppressHydrationWarning
                        >
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </div>

                      <h3 className="text-primary-900 group-hover:text-primary-600 dark:text-primary-50 dark:group-hover:text-primary-200 text-xl leading-snug font-bold transition">
                        <Link href={`/${path}`} className="block">
                          {title}
                        </Link>
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                      </div>

                      <p className="prose text-primary-800/80 dark:text-primary-100/80 line-clamp-3 max-w-none text-sm">
                        {summary}
                      </p>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/${path}`}
                        className="text-primary-700 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 text-sm font-semibold"
                        aria-label={`Read more: "${title}"`}
                      >
                        Read more &rarr;
                      </Link>
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
