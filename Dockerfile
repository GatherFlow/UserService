ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

FROM base AS build

COPY --link package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY --link . .

RUN \
  mkdir -p ./src/secrets && \
  if [ -f ./src/secrets/private.pem ] || [ -f ./src/secrets/public.pem ]; then \
    echo "One or both key files already exist, skipping write..."; \
  else \
    echo "$PRIVATE_KEY_B64" | base64 -d > ./src/secrets/private.pem && \
    echo "$PUBLIC_KEY_B64" | base64 -d > ./src/secrets/public.pem; \
  fi && \
  chmod 600 ./src/secrets/private.pem ./src/secrets/public.pem

RUN node --run build

FROM base

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/migrations /app/migrations
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/drizzle.config.ts /app/drizzle.config.ts
COPY --from=build /app/src/secrets /app/dist/secrets

EXPOSE 8080

CMD ["node", "--run", "start"]