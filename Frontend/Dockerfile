# ==========================================
# 👉 Build stage
# ==========================================
FROM node:22 AS build
WORKDIR /src

RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL=/root/.bun
ENV PATH=$BUN_INSTALL/bin:$PATH

ARG APP_ENV=prod

COPY Frontend/package*.json ./Frontend/

WORKDIR /src/Frontend

RUN bun install --frozen-lockfile

COPY Frontend/ /src/Frontend/

RUN bun run build-${APP_ENV}

# ==========================================
# 👉 Runtime stage
# ==========================================
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

ARG APP_ENV=prod

COPY --from=build /src/Frontend/dist/ /usr/share/nginx/html/

COPY Frontend/nginx.*.conf /tmp/

RUN cp "/tmp/nginx.${APP_ENV}.conf" /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]