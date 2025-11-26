// next.config.js
const path = require('path')
const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app giscus.githubapp.com static.cloudflareinsights.com umami.toki.codes cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https:;
  media-src 'self' https: data: blob:;
  connect-src 'self' https://static.cloudflareinsights.com https://api.github.com https://umami.toki.codes https://giscus.app https://giscus.githubapp.com https:;
  font-src 'self' https://fonts.gstatic.com;
  frame-src giscus.app giscus.githubapp.com;
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
  // experimental: {
  //   outputFileTracingIncludes: {
  //     '/': ['.contentlayer/**'],
  //   },
  // },

  webpack: (config) => {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not || []), /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

module.exports = () =>
  [withContentlayer, withBundleAnalyzer].reduce((acc, next) => next(acc), nextConfig)
