'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useEffect, useRef, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  if (!siteMetadata.comments?.provider) {
    return null
  }

  return (
    <div id="comments" ref={ref} className="pt-6">
      {show && <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />}
    </div>
  )
}
