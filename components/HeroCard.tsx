import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

type HeroCardProps = {
  postCount?: number
}

export default function HeroCard({ postCount = 0 }: HeroCardProps) {
  return (
    <section className="group relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-lg transition hover:shadow-xl sm:p-12 dark:border-gray-700/40 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
      {/* 动态背景装饰 */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-blue-300/30 to-indigo-300/30 blur-3xl transition-transform duration-700 group-hover:scale-110 dark:from-blue-600/20 dark:to-indigo-600/20" />
      <div className="pointer-events-none absolute -right-20 -bottom-10 h-64 w-64 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/30 blur-3xl transition-transform duration-700 group-hover:scale-110 dark:from-purple-600/20 dark:to-pink-600/20" />

      <div className="relative mx-auto max-w-4xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="animate-gradient bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent transition-all duration-300 group-hover:scale-105 sm:text-5xl md:text-6xl dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            Hello, This is Toki
          </h1>
          <p className="text-primary-800/90 dark:text-primary-200/80 mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
            记录思考、灵感与实践
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/blog"
            className="from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:text-gray-900"
            aria-label="开始阅读"
          >
            开始阅读
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/about"
            className="border-primary-200/80 text-primary-700 hover:border-primary-300 hover:bg-primary-50/60 dark:border-primary-900/50 dark:text-primary-200 dark:hover:border-primary-800 inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 dark:hover:bg-gray-800/60"
            aria-label="关于我"
          >
            关于我
          </Link>
          {postCount > 0 && (
            <span className="border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-300 inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {postCount} 篇文章
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
