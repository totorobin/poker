# Base stage with pnpm
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/

# Install dependencies (including devDependencies for building)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Run a clean build for all packages
RUN pnpm -r build

# Deploy the server package to a standalone directory
# This command extracts the server and ses dépendances de production (including shared)
RUN pnpm --filter server deploy --prod --legacy /usr/src/app/deployed

# Production stage
FROM node:22-slim AS production
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Ensure we have correct permissions for the node user
RUN chown node:node /usr/src/app
USER node

# Copy the deployed server files (contains dist/, node_modules/, package.json)
COPY --chown=node:node --from=base /usr/src/app/deployed ./

# Copy built client files to server's public folder
# Note: In the server, path.resolve('public') will point to /usr/src/app/public
COPY --chown=node:node --from=base /usr/src/app/apps/client/dist ./public

ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE $PORT

# Point directly to the entry point in the root of the deployed package
CMD [ "node", "dist/index.js" ]
