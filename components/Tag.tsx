import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="bg-primary-50 text-primary-700 ring-primary-100 hover:text-primary-600 dark:bg-primary-900/40 dark:text-primary-200 dark:ring-primary-900/60 dark:hover:text-primary-100 mr-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ring-1 transition hover:-translate-y-0.5"
      aria-label={`Tag: ${text}`}
    >
      <span aria-hidden="true">#</span>
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
