FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY app/web/package.json app/web/package.json
COPY packages/sdk/package.json packages/sdk/package.json
COPY packages/types/package.json packages/types/package.json

RUN npm ci

COPY app/web app/web
COPY packages/sdk packages/sdk
COPY packages/types packages/types

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:1.29-alpine AS runtime

COPY .docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/app/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
