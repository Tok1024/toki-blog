import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

type HeroCardProps = {
  postCount?: number
}

export default function HeroCard({ postCount = 0 }: HeroCardProps) {
  return (
    <section className="border-primary-100/90 rounded-[1.75rem] border-b pb-12 sm:pb-14 dark:border-gray-800">
      <div className="max-w-3xl space-y-7">
        <div className="space-y-5">
          <p className="text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-[0.24em] uppercase">
            Personal notes and writing
          </p>
          <h1 className="max-w-3xl text-4xl leading-[1.25] font-semibold tracking-[-0.05em] text-gray-950 sm:text-5xl md:text-6xl dark:text-white">
            Hello, This is Toki
          </h1>
          <p className="max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-300">
            记录思考、灵感与实践
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/blog"
            className="bg-primary-700 hover:bg-primary-800 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition"
            aria-label="开始阅读"
          >
            开始阅读
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/about"
            className="border-primary-200 text-primary-800 hover:border-primary-300 hover:bg-primary-50 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-800"
            aria-label="关于我"
          >
            关于我
          </Link>
          {postCount > 0 && (
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {postCount} 篇文章
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
