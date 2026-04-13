# Toki Blog Architecture Overview

这份文档用于快速恢复对博客项目的整体认知，重点回答四个问题：

1. 这是个什么项目
2. 内容从哪里来
3. 页面是怎么渲染出来的
4. 线上大概率是怎么部署和更新的

## 1. 技术栈

- 框架：Next.js 15.2.4
- 渲染模型：App Router
- UI：React 19 + Tailwind CSS v4
- 内容系统：Contentlayer + MDX
- 博客能力：Pliny
- 包管理器：Yarn 3.6.1（`nodeLinker: node-modules`）
- 生产输出：`output: 'standalone'`

核心判断：这不是依赖数据库的博客后台，而是“代码仓库 + MDX 内容文件 + 构建产物”的静态/半静态博客。

## 2. 目录分层

### 页面层

- `app/`
  Next.js App Router 页面入口。
- `app/page.tsx`
  首页入口，读取全部文章后交给 `app/Main.tsx` 渲染。
- `app/blog/[...slug]/page.tsx`
  文章详情页。
- `app/blog/page/[page]/page.tsx`
  文章分页列表。
- `app/tags/*`
  标签页和标签分页。
- `app/about/page.tsx`
  关于页。
- `app/projects/page.tsx`
  项目页。
- `app/api/ideas/route.ts`
  一个轻量 API，用来读写灵感列表。

### 内容层

- `data/blog/*.mdx`
  博客正文，主要更新入口。
- `data/authors/*.mdx`
  作者资料。
- `data/siteMetadata.js`
  站点标题、域名、评论、搜索、统计等全局配置。
- `data/headerNavLinks.ts`
  顶部导航。
- `private/ideas.json`
  ideas API 写入的数据文件。

### 渲染层

- `components/`
  通用组件，如 Header、Footer、评论、搜索、音频播放器。
- `layouts/`
  文章布局模板，如 `PostLayout`、`PostSimple`、`PostBanner`。
- `components/MDXComponents.tsx`
  MDX 内可用的组件映射。

### 构建层

- `contentlayer.config.ts`
  定义文档类型、MDX 处理链、标签统计、搜索索引生成。
- `scripts/postbuild.mjs`
  构建后处理。
- `scripts/rss.mjs`
  生成 RSS。
- `next.config.js`
  Next.js 构建、CSP、安全头、standalone 输出配置。
- `Dockerfile`
  生产镜像构建方式。

## 3. 内容是怎么变成页面的

文章新增流程：

1. 在 `data/blog/` 新建一个 `.mdx` 文件
2. 写 frontmatter，例如标题、日期、标签、摘要、layout
3. 图片放在 `public/static/images/`
4. 本地运行 `yarn dev` 预览
5. 生产环境重新构建并重启服务

构建时发生的事情：

1. Contentlayer 扫描 `data/` 目录
2. 把 `blog/**/*.mdx` 和 `authors/**/*.mdx` 转成可导入的数据对象
3. 计算 `readingTime`、`slug`、`toc`、结构化数据
4. 生成 `app/tag-data.json`
5. 生成 `public/search.json`
6. Next.js 根据 `app/` 下的页面生成静态页面和 standalone 运行产物

所以这套博客的“数据源”本质上是 Git 仓库里的文件，不是 CMS，也不是数据库。

## 4. 文章详情页渲染链路

以 `app/blog/[...slug]/page.tsx` 为核心：

1. 从 `contentlayer/generated` 读取 `allBlogs`
2. 根据 URL slug 找到对应文章
3. 读取作者信息 `allAuthors`
4. 根据 frontmatter 的 `layout` 选择具体模板
5. 用 `MDXLayoutRenderer` 把 MDX 编译结果渲染成 React 页面
6. 输出 SEO metadata 和 JSON-LD

因此你后续更新博客时，最常碰的文件通常是：

- `data/blog/*.mdx`
- `layouts/PostLayout.tsx`
- `components/*`
- `data/siteMetadata.js`

## 5. 当前启用的博客能力

- 搜索：本地 `kbar` 搜索，索引文件是 `/search.json`
- 评论：Giscus
- 统计：Umami
- RSS：构建后生成
- Sitemap / robots：通过 App Router 路由输出
- 标签页：自动生成
- 数学公式：KaTeX
- 代码高亮：Prism / rehype-prism-plus

## 6. 线上部署方式

从 `next.config.js` 和 `Dockerfile` 看，线上大概率是这条链路：

1. `yarn install`
2. `yarn build`
3. 生成 `.next/standalone/server.js`
4. Docker 镜像只拷贝 standalone 运行所需文件
5. 容器内用 `node server.js` 启动
6. 容器监听 `3666` 端口

这说明服务端并不依赖开发服务器，也不需要在生产机上跑 `yarn dev`。

## 7. 本地恢复开发的最短路径

```bash
corepack enable
yarn install
yarn dev
```

如果要验证生产构建：

```bash
yarn build
```

如果要本地以生产模式启动：

```bash
yarn build
yarn serve
```

## 8. 这次检查的结论

- 仓库当前能成功执行 `yarn build`
- 当前机器的 Node 版本是 `v25.2.1`
- 项目 README 原先写的是 `pnpm`，但实际项目使用的是 Yarn 3
- 仓库里已有 `.next`、`.contentlayer`、`node_modules`，说明之前已经成功跑过

## 9. 你接下来最值得优先看的文件

如果你要继续更新博客，建议按这个顺序重新熟悉：

1. `data/siteMetadata.js`
2. `app/layout.tsx`
3. `app/Main.tsx`
4. `app/blog/[...slug]/page.tsx`
5. `contentlayer.config.ts`
6. `data/blog/` 下最近几篇文章

这样能最快恢复对“站点配置 -> 首页 -> 文章页 -> 内容构建”的整体理解。
