# build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

ARG NODE_ENV=production
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_MEDIA_URL
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_MEDIA_URL=$NEXT_PUBLIC_MEDIA_URL

RUN npm run build
# output: "export" なので out/ が生成される想定

# serve
FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80