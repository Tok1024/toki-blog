import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="border-primary-200 bg-primary-50/80 text-primary-700 hover:border-primary-300 hover:text-primary-800 dark:border-primary-900/60 dark:bg-primary-900/30 dark:text-primary-200 dark:hover:text-primary-100 mr-2 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase transition"
      aria-label={`Tag: ${text}`}
    >
      <span aria-hidden="true">#</span>
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
