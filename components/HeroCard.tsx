import Link from '@/components/Link'
import BlogHeatmap from '@/components/BlogHeatmap'

type HeroCardProps = {
  posts: Array<{
    date: string
  }>
}

export default function HeroCard({ posts }: HeroCardProps) {
  return (
    <section className="pb-10 sm:pb-12">
      <div className="border-primary-100/90 rounded-[30px] border bg-white/92 p-5 shadow-[0_18px_50px_-34px_rgba(80,111,144,0.32)] backdrop-blur sm:p-6 lg:p-7 dark:border-gray-800 dark:bg-gray-950/80">
        <div className="grid gap-5 md:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] md:items-stretch xl:gap-6">
          <div className="via-primary-50/35 to-primary-100/35 h-full rounded-[24px] bg-linear-to-br from-white p-5 sm:p-6 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900/80">
            <div className="flex h-full flex-col justify-between gap-8">
              <h1 className="max-w-3xl text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] text-gray-950 sm:text-[3.9rem] dark:text-white">
                <span className="block">Hello,</span>
                <span className="text-primary-800 dark:text-primary-100 block">This is Toki</span>
              </h1>

              <div className="space-y-5">
                <p className="max-w-sm text-[0.98rem] leading-7 text-gray-600 dark:text-gray-300">
                  记录思考、灵感与实践
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  <Link
                    href="/study"
                    className="border-primary-200 text-primary-800 hover:border-primary-300 hover:bg-primary-50 inline-flex min-h-14 items-center justify-center rounded-full border bg-white/85 px-3 py-2.5 text-[0.95rem] font-semibold tracking-[0.01em] whitespace-nowrap transition dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-900"
                    aria-label="进入学习记录"
                  >
                    学习记录
                  </Link>
                  <Link
                    href="/life"
                    className="border-primary-200 text-primary-800 hover:border-primary-300 hover:bg-primary-50 inline-flex min-h-14 items-center justify-center rounded-full border bg-white/85 px-3 py-2.5 text-[0.95rem] font-semibold tracking-[0.01em] whitespace-nowrap transition dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-900"
                    aria-label="进入生活记录"
                  >
                    生活记录
                  </Link>
                  <Link
                    href="/about"
                    className="bg-primary-700 hover:bg-primary-800 inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-[0.95rem] font-semibold tracking-[0.01em] whitespace-nowrap text-white shadow-[0_14px_28px_-18px_rgba(80,111,144,0.9)] transition"
                    aria-label="关于我"
                  >
                    关于我
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-primary-100/90 bg-primary-50/30 min-w-0 rounded-[24px] border p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900/35">
            <BlogHeatmap posts={posts} embedded />
          </div>
        </div>
      </div>
    </section>
  )
}
