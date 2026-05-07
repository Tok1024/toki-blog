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
      <article className="mx-auto max-w-[980px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,680px)_160px] lg:gap-12">
          <div className="space-y-9">
            <header className="border-primary-100/90 border-b pb-10 dark:border-gray-800">
              <div className="dark:text-primary-200 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
                <span className="border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900/60 dark:bg-primary-900/20 dark:text-primary-200 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium">
                  Published
                </span>
                <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:inline-block dark:bg-gray-600" />
                <Link
                  href={`/${basePath}`}
                  className="text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100 inline-flex items-center gap-1 font-medium transition"
                  aria-label="Back to the blog"
                >
                  返回列表 ↗
                </Link>
                <Link
                  href={editUrl(filePath)}
                  className="text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100 inline-flex items-center gap-2 transition sm:ml-1"
                >
                  编辑此页
                </Link>
              </div>
              <div className="mt-5 space-y-4">
                <PageTitle>{title}</PageTitle>
                {primaryAuthor && (
                  <div className="dark:text-primary-100 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    {primaryAuthor.avatar && (
                      <Image
                        src={primaryAuthor.avatar}
                        alt={primaryAuthor.name}
                        width={40}
                        height={40}
                        className="ring-primary-100 dark:ring-primary-900 h-10 w-10 rounded-full object-cover ring-1"
                      />
                    )}
                    <div className="leading-tight">
                      <p className="font-medium text-gray-900 dark:text-gray-50">
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
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                )}
              </div>
            </header>

            <div className="px-0 py-1">
              <div className="prose dark:prose-invert dark:text-primary-50 max-w-none text-gray-800">
                {children}
              </div>
            </div>

            {(next || prev) && (
              <div className="border-primary-100/90 grid gap-3 border-t pt-7 md:grid-cols-2 dark:border-gray-800">
                {prev && prev.path && (
                  <div className="border-primary-100/50 rounded-xl border p-4 transition dark:border-gray-800">
                    <p className="text-primary-700 dark:text-primary-200 text-[11px] font-medium">
                      Previous
                    </p>
                    <Link
                      href={`/${prev.path}`}
                      className="hover:text-primary-700 dark:text-primary-200 dark:hover:text-primary-100 mt-2 block text-[1.02rem] font-medium text-gray-900 transition"
                    >
                      {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.path && (
                  <div className="border-primary-100/50 rounded-xl border p-4 transition dark:border-gray-800">
                    <p className="text-primary-700 dark:text-primary-200 text-[11px] font-medium">
                      Next
                    </p>
                    <Link
                      href={`/${next.path}`}
                      className="hover:text-primary-700 dark:text-primary-200 dark:hover:text-primary-100 mt-2 block text-[1.02rem] font-medium text-gray-900 transition"
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
                className="border-primary-100/90 dark:text-primary-100 border-t px-0 py-8 text-center text-gray-800 dark:border-gray-800"
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
