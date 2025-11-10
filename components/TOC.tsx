import Link from './Link'

type TocItem = {
  value: string
  url: string
  depth: number
}

export default function TOC({ toc }: { toc?: TocItem[] }) {
  if (!toc || toc.length === 0) return null

  return (
    <aside className="hidden lg:block xl:col-span-1 pl-6">
      <nav aria-label="目录" className="sticky top-24 max-h-[72vh] overflow-auto text-lg">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold uppercase text-gray-800 dark:text-gray-200">
            目录
          </h3>
          <ul className="space-y-2">
            {toc.map((item) => (
              <li
                key={item.url}
                style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 16}px` }}
              >
                <Link
                  href={item.url}
                  className="block text-gray-800 dark:text-gray-100 hover:text-primary-600 transition-colors text-lg leading-7"
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