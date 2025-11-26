import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import HeroCard from '@/components/HeroCard'

const MAX_DISPLAY = 5

type HomeProps = {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary?: string
    tags: string[]
  }>
}

export default function Home({ posts }: HomeProps) {
  const tagFrequency: Record<string, number> = posts.reduce((acc: Record<string, number>, post) => {
    post.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})

  const topTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag)

  return (
    <div className="space-y-12 sm:space-y-16">
      <HeroCard postCount={posts.length} />

      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-primary-700 dark:text-primary-300 text-sm font-semibold tracking-[0.18em] uppercase">
              Latest writing
            </p>
            <h2 className="text-primary-900 dark:text-primary-100 text-3xl leading-tight font-bold sm:text-4xl">
              最新动态
            </h2>
            <p className="text-primary-700/80 dark:text-primary-200/80 text-base">
              {siteMetadata.description}
            </p>
          </div>
          {topTags.length > 0 && (
            <div className="glass-card via-primary-50/70 text-primary-800 dark:text-primary-100 flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-white/95 to-white/95 px-4 py-3 text-sm shadow-sm dark:from-gray-900 dark:via-gray-900/70 dark:to-gray-900">
              <span className="text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-wide uppercase">
                常用标签
              </span>
              <div className="flex flex-wrap gap-2">
                {topTags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {!posts.length && (
            <p className="glass-card border-primary-200 text-primary-700 dark:border-primary-900/50 dark:text-primary-200 rounded-2xl border-dashed bg-white/90 p-6 text-center dark:bg-gray-900/70">
              No posts found.
            </p>
          )}
          {posts.slice(0, MAX_DISPLAY).map((post, index) => {
            const { slug, date, title, summary = '', tags } = post
            return (
              <article
                key={slug}
                className="glass-card group via-primary-50/70 relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 to-white/95 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900"
              >
                <div className="relative flex h-full flex-col gap-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <time
                        className="text-primary-700/80 dark:text-primary-200/80 text-sm font-medium"
                        dateTime={date}
                      >
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                      <h3 className="text-primary-900 group-hover:text-primary-600 dark:text-primary-50 dark:group-hover:text-primary-200 text-xl leading-snug font-semibold transition sm:text-2xl">
                        <Link href={`/blog/${slug}`} className="flex items-start gap-2">
                          <span className="bg-primary-50 text-primary-700 ring-primary-100/80 dark:bg-primary-900/40 dark:text-primary-200 dark:ring-primary-900/60 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ring-1">
                            {index === 0 ? 'New' : '更新'}
                          </span>
                          {title}
                        </Link>
                      </h3>
                    </div>
                  </div>

                  <p className="prose dark:prose-invert max-w-none text-base text-gray-600 dark:text-gray-300">
                    {summary}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    <Link
                      href={`/blog/${slug}`}
                      className="text-primary-700 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 inline-flex items-center gap-2 text-sm font-semibold transition hover:translate-x-1"
                      aria-label={`Read more: "${title}"`}
                    >
                      Read more
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end">
          <Link
            href="/blog"
            className="glass-card from-primary-500 via-primary-400 to-primary-500 dark:from-primary-500 dark:via-primary-400 dark:to-primary-500 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            aria-label="All posts"
          >
            All Posts
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
    </div>
  )
}
