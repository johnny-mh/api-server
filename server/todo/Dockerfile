# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.1.38
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Bun"

WORKDIR /app

ENV NODE_ENV="production"

COPY bun.lockb package.json ./
COPY server/auth/package.json ./server/auth/
COPY server/todo/package.json ./server/todo/
RUN bun install --ci
COPY . .

EXPOSE 3001
CMD ["bun", "run", "--cwd=server/todo", "src/index.ts"]
