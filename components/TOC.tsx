import Link from './Link'

type TocItem = {
  value: string
  url: string
  depth: number
}

export default function TOC({ toc }: { toc?: TocItem[] }) {
  if (!toc || toc.length === 0) return null

  return (
    <aside className="hidden pl-6 lg:block xl:col-span-1">
      <nav aria-label="目录" className="sticky top-24 max-h-[72vh] overflow-auto text-lg">
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 uppercase dark:text-gray-200">
            目录
          </h3>
          <ul className="space-y-2">
            {toc.map((item) => (
              <li key={item.url} style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 16}px` }}>
                <Link
                  href={item.url}
                  className="hover:text-primary-600 block text-lg leading-7 text-gray-800 transition-colors dark:text-gray-100"
                >
                  {item.value}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
