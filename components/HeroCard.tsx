import Link from '@/components/Link'
import BlogHeatmap from '@/components/BlogHeatmap'

type HeroCardProps = {
  posts: Array<{
    date: string
  }>
}

export default function HeroCard({ posts }: HeroCardProps) {
  return (
    <section className="border-b border-black/6 pb-8 sm:pb-10 dark:border-white/8">
      <div className="grid gap-7 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:items-start xl:gap-10">
        <div className="flex h-full flex-col justify-between gap-7">
          <div className="space-y-5">
            <h1 className="max-w-3xl text-[2.25rem] leading-[1.06] font-medium tracking-[-0.045em] text-gray-950 sm:text-[3.25rem] dark:text-white">
              <span className="block">Hello,</span>
              <span className="text-primary-800 dark:text-primary-100 block">This is Toki</span>
            </h1>

            <p className="max-w-md text-[0.98rem] leading-7 text-gray-600 dark:text-gray-300">
              记录思考、灵感与实践
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/study"
              className="border-primary-200/90 text-primary-800 hover:border-primary-300 hover:bg-primary-50 inline-flex min-h-11 items-center justify-center rounded-full border bg-white px-3 py-2 text-[0.92rem] font-medium whitespace-nowrap transition dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-900"
              aria-label="进入学习记录"
            >
              学习记录
            </Link>
            <Link
              href="/life"
              className="border-primary-200/90 text-primary-800 hover:border-primary-300 hover:bg-primary-50 inline-flex min-h-11 items-center justify-center rounded-full border bg-white px-3 py-2 text-[0.92rem] font-medium whitespace-nowrap transition dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-900"
              aria-label="进入生活记录"
            >
              生活记录
            </Link>
            <Link
              href="/about"
              className="bg-primary-700 hover:bg-primary-800 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 py-2 text-[0.92rem] font-medium whitespace-nowrap text-white transition"
              aria-label="关于我"
            >
              关于我
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="border-primary-100/80 min-w-0 rounded-2xl border bg-white/60 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900/28">
          <BlogHeatmap posts={posts} embedded />
        </div>
      </div>
    </section>
  )
}
