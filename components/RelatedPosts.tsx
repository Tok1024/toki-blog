import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  allPosts: CoreContent<Blog>[]
  max?: number
}

export default function RelatedPosts({
  currentSlug,
  currentTags,
  allPosts,
  max = 3,
}: RelatedPostsProps) {
  if (!currentTags || currentTags.length === 0) return null

  const scored = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => {
      const overlap = (post.tags || []).filter((t) => currentTags.includes(t)).length
      return { post, score: overlap }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)

  if (scored.length === 0) return null

  return (
    <div className="border-primary-100/90 border-t pt-7 dark:border-gray-800">
      <h3 className="text-primary-700 dark:text-primary-200 mb-4 text-xs font-medium">相关文章</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {scored.map(({ post }) => (
          <Link
            key={post.slug}
            href={`/${post.path}`}
            className="border-primary-100/50 hover:border-primary-200 group rounded-xl border p-4 transition dark:border-gray-800 dark:hover:border-gray-700"
          >
            <p className="group-hover:text-primary-700 dark:group-hover:text-primary-200 text-sm font-medium text-gray-900 transition dark:text-gray-100">
              {post.title}
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-primary-600 dark:text-primary-300 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
