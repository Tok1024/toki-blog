import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { allBlogs } from 'contentlayer/generated'

export const runtime = 'nodejs'

const size = { width: 1200, height: 630 }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const post = slug ? allBlogs.find((p) => p.slug === slug) : null

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f7fafe',
            fontSize: 48,
            color: '#243240',
          }}
        >
          {"Toki's Blog"}
        </div>
      ),
      { ...size }
    )
  }

  const tags = (post.tags || []).slice(0, 3)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#f7fafe',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: '#1a1a1a',
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {post.title}
          </div>
          {post.summary && (
            <div
              style={{
                fontSize: 24,
                color: '#506f90',
                lineHeight: 1.5,
                maxWidth: '800px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {post.summary.slice(0, 120)}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: 22, color: '#506f90' }}>
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {tags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      fontSize: 16,
                      color: '#506f90',
                      border: '1px solid #dce7f5',
                      borderRadius: '9999px',
                      padding: '4px 12px',
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#415a75' }}>{"Toki's Blog"}</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
