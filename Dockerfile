FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=server --prod /app
RUN pnpm deploy --filter=client --prod /app/public

FROM base AS app
COPY --from=build /app /app
WORKDIR /app
EXPOSE 8080
CMD [ "pnpm", "start" ]