FROM node:22-bookworm-slim AS build

RUN npm install -g pnpm@9.15.9

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/cms/package.json apps/cms/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL=http://localhost:3847
ARG VITE_WEB_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WEB_URL=$VITE_WEB_URL

RUN pnpm --filter @portfolio/shared build \
  && pnpm --filter @portfolio/cms build

FROM nginx:1.27-alpine

COPY apps/cms/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/cms/dist /usr/share/nginx/html

EXPOSE 80
