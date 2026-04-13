import ListLayout from '@/layouts/ListLayoutWithTags'
import { notFound } from 'next/navigation'
import { getSectionPosts, POSTS_PER_PAGE, sectionMeta } from '@/lib/sections'

export const generateStaticParams = async () => {
  const posts = getSectionPosts('study')
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))
}

export default async function StudyPage(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts = getSectionPosts('study')
  const pageNumber = parseInt(params.page, 10)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
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
    />
  )
}
