import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

export default function HeroCard() {
  return (
  <section className="to-primary-50/40 dark:to-primary-900/10 rounded-2xl border border-gray-200 bg-gradient-to-b from-white p-6 text-left sm:p-8 md:p-12 dark:border-gray-800 dark:from-gray-900">

      <div className="bg-primary-50 text-primary-700 ring-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:ring-primary-900/30 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ring-1">
        <span aria-hidden="true">✨</span>
        欢迎来到 {siteMetadata.headerTitle}
      </div>

        <h1 className="mt-5 bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl dark:from-primary-400 dark:to-primary-300">
        Hello! This is Toki!
        </h1>
        <p className="mt-4 max-w-3xl bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-base text-transparent sm:text-lg">
          这里记录了我的一些想法
        </p>

      {/* <div className="mt-8 flex items-center gap-4">
        <Link
          href="/blog"
          className="bg-primary-600 hover:bg-primary-500 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-white transition"
          aria-label="开始阅读"
        >
          开始阅读
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-gray-900 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800/50"
          aria-label="查看项目"
        >
          查看项目
        </Link>
      </div> */}
    </section>
  )
}
