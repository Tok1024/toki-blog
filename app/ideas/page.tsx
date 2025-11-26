import fs from 'fs/promises'
import path from 'path'
import { Metadata } from 'next'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = {
  title: 'Ideas',
  description: '随手记录的想法',
}

type Idea = {
  id: string
  title: string
  text: string
  date: string
  mood?: string
}

export default async function Page() {
  const file = path.join(process.cwd(), 'private', 'ideas.json')
  let list: Idea[] = []
  try {
    const raw = await fs.readFile(file, 'utf-8')
    list = JSON.parse(raw) as Idea[]
  } catch (e) {
    list = []
  }

  list.sort((a, b) => +new Date(b.date) - +new Date(a.date))

  return (
    <SectionContainer>
      <div className="py-12">
        <PageTitle>Ideas</PageTitle>
        {/* Inline add form removed; use the floating button (bottom-right) to go to the add page */}
        <div className="mt-8 space-y-6">
          {list.map((it) => (
            <article
              key={it.id}
              className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800/60 dark:bg-gray-900/70"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg leading-tight font-semibold">{it.title}</h3>
                <time className="text-sm whitespace-nowrap text-gray-500">
                  {new Date(it.date).toLocaleString()}
                </time>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm text-yellow-700">心情：</span>
                <span className="inline-flex items-center rounded px-2 py-1 text-xs text-yellow-800">
                  {it.mood ?? '—'}
                </span>
              </div>
              <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">{it.text}</p>
            </article>
          ))}
          {list.length === 0 && <div className="text-gray-500">暂无想法</div>}
        </div>
        {/* floating add button bottom-right */}
        <a
          href="/ideas/new"
          className="bg-primary-600 hover:bg-primary-500 fixed right-6 bottom-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg"
          aria-label="Add idea"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </a>
      </div>
    </SectionContainer>
  )
}
