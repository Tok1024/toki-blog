import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TOC from '@/components/TOC'
import { formatDate } from 'pliny/utils/formatDate'

const editUrl = (path) => `${siteMetadata.siteRepo}/tree/master/data/${path}`
// const discussUrl = (path) =>
//   `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]
  const primaryAuthor = authorDetails?.[0]
  const tocItems = content.toc as unknown as { value: string; url: string; depth: number }[]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="mx-auto max-w-screen-xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-14">
          <div className="space-y-10">
            <header className="glass-card via-primary-50/70 ring-primary-100/70 rounded-3xl bg-gradient-to-br from-white/95 to-white/95 p-8 shadow-sm dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
              <div className="text-primary-700 dark:text-primary-200 flex flex-wrap items-center gap-3 text-sm">
                <span className="bg-primary-50 text-primary-700 ring-primary-100/80 dark:bg-primary-900/40 dark:text-primary-200 dark:ring-primary-900/60 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ring-1">
                  Published
                </span>
                <time dateTime={date} className="font-medium">
                  {formatDate(date, siteMetadata.locale)}
                </time>
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:inline-block dark:bg-gray-600" />
                <Link
                  href={`/${basePath}`}
                  className="text-primary-700 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 inline-flex items-center gap-1 font-semibold transition"
                  aria-label="Back to the blog"
                >
                  返回列表 ↗
                </Link>
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:inline-block dark:bg-gray-600" />
                <Link
                  href={editUrl(filePath)}
                  className="text-primary-700 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 inline-flex items-center gap-2 transition"
                >
                  编辑此页
                  <span aria-hidden="true">✏️</span>
                </Link>
              </div>
              <div className="mt-5 space-y-4">
                <PageTitle>{title}</PageTitle>
                {primaryAuthor && (
                  <div className="glass-card via-primary-50/70 text-primary-800 dark:text-primary-100 flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-white/95 to-white/95 px-3 py-2 text-sm shadow-sm dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
                    {primaryAuthor.avatar && (
                      <Image
                        src={primaryAuthor.avatar}
                        alt={primaryAuthor.name}
                        width={40}
                        height={40}
                        className="ring-primary-100 dark:ring-primary-900 h-10 w-10 rounded-full object-cover ring-2"
                      />
                    )}
                    <div className="leading-tight">
                      <p className="font-semibold text-gray-900 dark:text-gray-50">
                        {primaryAuthor.name}
                      </p>
                      {primaryAuthor.occupation && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {primaryAuthor.occupation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                )}
              </div>
            </header>

            <div className="glass-card via-primary-50/60 rounded-3xl bg-gradient-to-br from-white/95 to-white/95 px-6 py-10 shadow-sm dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
              <div className="prose text-primary-900 dark:prose-invert dark:text-primary-50 max-w-none">
                {children}
              </div>
            </div>

            {(next || prev) && (
              <div className="glass-card via-primary-50/70 grid gap-4 rounded-3xl bg-gradient-to-br from-white/95 to-white/95 px-6 py-5 shadow-sm md:grid-cols-2 dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
                {prev && prev.path && (
                  <div className="border-primary-100/70 from-primary-50/70 to-primary-50/70 dark:border-primary-900/50 dark:from-primary-900/30 dark:to-primary-900/30 rounded-2xl border bg-gradient-to-br via-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:via-gray-900/60">
                    <p className="text-primary-700 dark:text-primary-200 text-xs font-semibold tracking-wide uppercase">
                      Previous
                    </p>
                    <Link
                      href={`/${prev.path}`}
                      className="text-primary-800 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 mt-2 block text-lg font-semibold transition"
                    >
                      {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.path && (
                  <div className="border-primary-100/60 via-primary-50/60 dark:border-primary-900/40 rounded-2xl border bg-gradient-to-br from-white/90 to-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
                    <p className="text-primary-700 dark:text-primary-200 text-xs font-semibold tracking-wide uppercase">
                      Next
                    </p>
                    <Link
                      href={`/${next.path}`}
                      className="text-primary-800 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 mt-2 block text-lg font-semibold transition"
                    >
                      {next.title}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {siteMetadata.comments && (
              <div
                id="comment"
                className="glass-card via-primary-50/70 text-primary-800 dark:text-primary-100 rounded-3xl bg-gradient-to-br from-white/95 to-white/95 px-6 py-8 text-center shadow-sm dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900"
              >
                <Comments slug={slug} />
              </div>
            )}
          </div>

          <TOC toc={tocItems} />
        </div>
      </article>
    </SectionContainer>
  )
}
