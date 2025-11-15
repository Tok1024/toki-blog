FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 仅拷贝安装所需文件以提高缓存命中率（包括 .yarn，以使用项目内的 yarnPath=3.6.1）
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/

# 使用 corepack 激活并锁定 Yarn 版本；打印 Node/Yarn 版本用于排查
RUN corepack enable \
	&& corepack prepare yarn@3.6.1 --activate \
	&& node -v && yarn -v \
	&& yarn install --immutable

# 拷贝源码并构建；构建后强校验 standalone 是否生成
COPY . .
RUN node -v && yarn -v \
	&& yarn build \
	&& ( [ -f .next/standalone/server.js ] \
			 && echo "Standalone OK" \
			 || (echo "Standalone MISSING" && ls -al .next || true && ls -al .next/standalone || true && exit 1) )

FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 仅复制 standalone 运行所需文件（减小镜像并避免 Yarn 运行）
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3666
ENV PORT=3666

# 直接运行 standalone server，避免 Yarn 版本校验问题
CMD ["node", "server.js"]