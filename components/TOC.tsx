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
        <nav aria-label="目录" className="border-primary-100/90 border-l pl-6 dark:border-gray-800">
          <div className="mb-4">
            <h3 className="text-primary-700 dark:text-primary-200 text-[11px] font-semibold tracking-[0.2em] uppercase">
              On This Page
            </h3>
          </div>
          <ul className="space-y-1.5 text-[13px] leading-6">
            {toc.map((item) => (
              <li key={item.url} style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 12}px` }}>
                <Link
                  href={item.url}
                  className="hover:text-primary-700 dark:hover:text-primary-200 block text-gray-400 transition dark:text-gray-500"
                >
                  <span>{item.value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
