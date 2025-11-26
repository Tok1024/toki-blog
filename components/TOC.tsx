import Link from './Link'

type TocItem = {
  value: string
  url: string
  depth: number
}

export default function TOC({ toc }: { toc?: TocItem[] }) {
  if (!toc || toc.length === 0) return null

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <nav
          aria-label="目录"
          className="border-primary-100/70 via-primary-50/60 ring-primary-100/60 dark:ring-primary-900/50 max-h-[72vh] overflow-auto rounded-3xl border bg-gradient-to-br from-white to-white p-5 text-base ring-1 shadow-sm backdrop-blur-xl dark:border-gray-800 dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-primary-700 dark:text-primary-200 text-sm font-semibold tracking-[0.14em] uppercase">
              目录
            </h3>
            <span className="text-primary-600 ring-primary-100 dark:bg-primary-900/40 dark:text-primary-200 dark:ring-primary-900/60 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold ring-1">
              {toc.length} 节
            </span>
          </div>
          <ul className="space-y-2 text-sm leading-6">
            {toc.map((item) => (
              <li
                key={item.url}
                className="group"
                style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 14}px` }}
              >
                <Link
                  href={item.url}
                  className="hover:text-primary-700 dark:hover:text-primary-200 flex items-start gap-2 rounded-xl px-2 py-1 text-gray-800 transition hover:bg-white dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="bg-primary-300 dark:bg-primary-500 mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full opacity-60 transition group-hover:opacity-100" />
                  <span className="flex-1">{item.value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
