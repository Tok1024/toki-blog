import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getSectionPosts, POSTS_PER_PAGE, sectionMeta } from '@/lib/sections'

export const metadata = genPageMetadata({
  title: sectionMeta.study.title,
  description: sectionMeta.study.description,
})

export default async function StudyPage() {
  const posts = getSectionPosts('study')
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={sectionMeta.study.title}
      description={sectionMeta.study.description}
    />
  )
}
