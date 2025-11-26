'use client'
import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Comments from '@/components/Comments'
import siteMetadata from '@/data/siteMetadata'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content
  // giscus / 评论组件需要一个字符串 slug，用于映射 Discussion
  // 优先使用 content 提供的 slug 字段（如果 contentlayer 有），否则基于 name 生成
  const authorSlug =
    // @ts-ignore
    content.slug ??
    name
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-primary-900 dark:text-primary-100 text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="glass-card via-primary-50/60 flex flex-col items-center space-y-4 rounded-3xl bg-gradient-to-b from-white/95 to-white/95 p-8 shadow-sm md:w-72 md:items-start dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="ring-primary-100 dark:ring-primary-900 h-48 w-48 rounded-full object-cover ring-4"
              />
            )}
            <div className="text-center md:text-left">
              <h3 className="text-primary-900 dark:text-primary-100 text-2xl leading-8 font-bold tracking-tight">
                {name}
              </h3>
              <div className="text-primary-700 dark:text-primary-200">{occupation}</div>
              <div className="text-primary-700 dark:text-primary-200">{company}</div>
            </div>
            <div className="flex space-x-3 pt-2">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div>
          </div>
          <div className="glass-card prose via-primary-50/60 dark:prose-invert max-w-none flex-1 rounded-3xl bg-gradient-to-br from-white/95 to-white/95 p-8 shadow-sm dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
            {children}
          </div>
        </div>
        {siteMetadata.comments && (
          <div
            className="text-primary-800 dark:text-primary-100 pt-6 pb-6 text-center"
            id="comment"
          >
            <Comments slug={authorSlug} />
          </div>
        )}
      </div>
    </>
  )
}
