import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import HeroCard from '@/components/HeroCard'
import { sectionMeta } from '@/lib/sections'

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
  const studyPosts = posts.filter((post) => (post as { section?: string }).section === 'study')
  const lifePosts = posts.filter((post) => (post as { section?: string }).section === 'life')
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

  const sections = [
    {
      key: 'study',
      title: sectionMeta.study.title,
      href: sectionMeta.study.href,
      blurb: sectionMeta.study.description,
      posts: studyPosts.slice(0, 3),
    },
    {
      key: 'life',
      title: sectionMeta.life.title,
      href: sectionMeta.life.href,
      blurb: sectionMeta.life.description,
      posts: lifePosts.slice(0, 3),
    },
  ]

  return (
    <div className="space-y-12 sm:space-y-16">
      <HeroCard posts={posts} />

      <section className="space-y-10">
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

        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.key} className="space-y-6">
              <div className="border-primary-100/90 border-b pb-4 dark:border-gray-800">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-gray-950 dark:text-gray-100">
                      {section.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {section.blurb}
                    </p>
                  </div>
                  <Link
                    href={section.href}
                    className="text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100 text-sm font-semibold tracking-[0.08em] uppercase"
                  >
                    More
                  </Link>
                </div>
              </div>

              <div className="divide-primary-100/80 divide-y dark:divide-gray-800">
                {!section.posts.length && (
                  <p className="py-6 text-sm text-gray-500 dark:text-gray-400">暂无内容</p>
                )}
                {section.posts.map((post) => {
                  const { slug, date, title, summary = '', tags } = post
                  return (
                    <article
                      key={`${section.key}-${slug}`}
                      className="group grid gap-4 py-6 md:grid-cols-[96px_minmax(0,1fr)] md:gap-8"
                    >
                      <div className="pt-1">
                        <time
                          className="block text-sm font-medium tracking-[0.02em] text-gray-500 dark:text-gray-400"
                          dateTime={date}
                        >
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </div>
                      <div className="space-y-3">
                        <h4 className="group-hover:text-primary-700 dark:text-primary-50 dark:group-hover:text-primary-200 text-[1.35rem] leading-[1.5] font-semibold tracking-[-0.03em] text-gray-950 transition">
                          <Link href={`/blog/${slug}`} className="block">
                            {title}
                          </Link>
                        </h4>
                        <p className="max-w-2xl text-[0.98rem] leading-8 text-gray-600 dark:text-gray-300">
                          {summary}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                          <Link
                            href={`/blog/${slug}`}
                            className="text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100 text-sm font-semibold tracking-[0.08em] uppercase"
                          >
                            Read →
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
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
