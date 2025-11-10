// next.config.js
const path = require('path')
const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app umami.toki.codes;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app
`

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, '') },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

// standalone
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 关键：独立可运行产物
  output: 'standalone',
  basePath,
  reactStrictMode: true,
  trailingSlash: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  eslint: { dirs: ['app', 'components', 'layouts', 'scripts'] },
  
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
    // 只有在静态导出时才需要 unoptimized，standalone 下可留 undefined
    unoptimized,
  },

  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },

  // 确保 Contentlayer 生成文件被打包进 standalone（防止运行时报缺）
  experimental: {
    outputFileTracingIncludes: {
      '/': ['.contentlayer/**'],
    },
  },

  webpack: (config) => {
    // 使用 SVGR 把 .svg 当 React 组件
    // 避免与默认 asset 规则冲突
    const assetRule = config.module.rules.find((rule) => rule?.test?.test?.('.svg'))
    if (assetRule) assetRule.exclude = /\.svg$/

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

module.exports = () => [withContentlayer, withBundleAnalyzer].reduce((acc, next) => next(acc), nextConfig)
