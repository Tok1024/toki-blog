import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

interface ArticleCardProps {
  post: CoreContent<Blog>
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const { path, date, title, summary, tags } = post
  return (
    <article className="group grid gap-5 py-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-8">
      <div className="pt-1">
        <time
          className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400"
          dateTime={date}
          suppressHydrationWarning
        >
          {formatDate(date, siteMetadata.locale)}
        </time>
      </div>

      <div className="space-y-4">
        <h3 className="group-hover:text-primary-700 dark:text-primary-50 dark:group-hover:text-primary-200 text-2xl leading-snug font-semibold tracking-tight text-gray-950 transition">
          <Link href={`/${path}`} className="block">
            {title}
          </Link>
        </h3>

        <p className="max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300">{summary}</p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => <Tag key={tag} text={tag} />)}
          </div>

          <Link
            href={`/${path}`}
            className="text-primary-700 hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100 text-sm font-semibold tracking-wide uppercase"
            aria-label={`Read more: "${title}"`}
          >
            Read &rarr;
          </Link>
        </div>
      </div>
    </article>
  )
}
