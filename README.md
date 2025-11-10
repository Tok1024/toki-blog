## Toki Blog

一个基于 Next.js + Tailwind CSS（Pliny/Contentlayer）的个人博客。

### 特性
- MDX 写作，自动生成标签/列表/作者页
- 浅蓝 + 白色主题（可暗色），首页 Hero 卡片
- 支持搜索、评论、RSS 与站点地图

### 技术栈
- Next.js (App Router) · Tailwind CSS v4 · Contentlayer · Pliny UI

### 开发
要求 Node 18/20 LTS。

```bash
pnpm install
pnpm dev
# 浏览器访问 http://localhost:3000
```

### 写文章
在 `data/blog/` 新建 `.mdx` 文件，推荐模板：

```mdx
---
title: My Post Title
date: 2025-11-09
lastmod: 2025-11-09
tags: [note]
summary: 简短摘要
images: []
draft: false
authors: ['default']
layout: PostLayout
---

正文内容…
```

图片放到 `public/static/images/`，以 `/static/images/xxx.png` 引用。

提示：开发环境保存即热更新；生产环境更新内容需重新构建并重启服务。

### 外观定制（简要）
- 主色：`css/tailwind.css` 中 `--color-primary-***`
- 首页卡片：`components/HeroCard.tsx`
- Logo 与 Favicon：`public/logo.svg`，`app/icon.svg` 或 `public/static/favicons/*`

### 生产部署（Docker）
已支持独立运行构建。简要流程：

```bash
docker build -t toki-blog:latest .
docker run -d -p 3000:3000 --name toki-blog toki-blog:latest
```

建议使用 CI/CD 构建镜像并在服务器用 Watchtower/compose 自动拉取与重启。

### 许可证
MIT
