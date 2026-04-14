import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'

export const POSTS_PER_PAGE = 5

export const sectionMeta = {
  study: {
    title: '学习记录',
    description: '技术笔记，和一些认真思考。',
    href: '/study',
  },
  life: {
    title: '生活记录',
    description: '碎碎念、音乐、动漫、自我表达。',
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
