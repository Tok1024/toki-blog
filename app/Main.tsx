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

      <section className="space-y-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-primary-700 dark:text-primary-300 text-sm font-semibold tracking-[0.18em] uppercase">
              Latest writing
            </p>
            <h2 className="dark:text-primary-100 text-3xl leading-tight font-semibold tracking-[-0.03em] text-gray-950 sm:text-4xl">
              最新动态
            </h2>
            <p className="max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300">
              {siteMetadata.description}
            </p>
          </div>
          {topTags.length > 0 && (
            <div className="dark:text-primary-100 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-[0.16em] uppercase">
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

        <div className="divide-primary-100/80 space-y-0 divide-y dark:divide-gray-800">
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
                className="group grid gap-5 py-9 md:grid-cols-[108px_minmax(0,1fr)] md:gap-9"
              >
                <div className="pt-1">
                  <time
                    className="block text-sm font-medium tracking-[0.02em] text-gray-500 dark:text-gray-400"
                    dateTime={date}
                  >
                    {formatDate(date, siteMetadata.locale)}
                  </time>
                </div>

                <div className="relative flex h-full flex-col gap-5">
                  <div className="space-y-3">
                    <h3 className="group-hover:text-primary-700 dark:text-primary-50 dark:group-hover:text-primary-200 text-[1.58rem] leading-[1.48] font-semibold tracking-[-0.03em] text-gray-950 transition">
                      <Link href={`/blog/${slug}`} className="block">
                        {title}
                      </Link>
                    </h3>

                    <p className="max-w-2xl text-[1.02rem] leading-8 text-gray-600 dark:text-gray-300">
                      {summary}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    <Link
                      href={`/blog/${slug}`}
                      className="text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.08em] uppercase transition"
                      aria-label={`Read more: "${title}"`}
                    >
                      {index === 0 ? 'Newest' : 'Read'}
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
            className="border-primary-200 text-primary-800 hover:border-primary-300 hover:bg-primary-50 dark:text-primary-100 inline-flex items-center gap-2 rounded-full border bg-white px-6 py-3 text-sm font-semibold transition dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
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
