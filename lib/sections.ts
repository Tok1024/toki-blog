import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'

export const POSTS_PER_PAGE = 5

export const sectionMeta = {
  study: {
    title: '学习记录',
    description: '更偏技术、实验、系统设计和工程实践的内容。',
    href: '/study',
  },
  life: {
    title: '生活记录',
    description: '碎碎念、音乐、图片、动漫，以及更轻松的日常片段。',
    href: '/life',
  },
} as const

export type BlogSection = keyof typeof sectionMeta

export function getAllPosts() {
  return allCoreContent(sortPosts(allBlogs))
}

export function getSectionPosts(section: BlogSection) {
  return getAllPosts().filter((post) => (post as { section?: string }).section === section)
}
