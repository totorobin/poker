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

# Run a clean build for all packages in correct order and verify server outputs
RUN pnpm --filter @poker/shared build \
    && pnpm --filter client build \
    && rm -rf apps/server/dist && rm -f apps/server/tsconfig.tsbuildinfo \
    && pnpm --filter server build \
    && ls -la apps/server/dist

# Deploy the server package to a standalone directory
# This command extracts the server and ses dépendances de production (including shared)
RUN pnpm --filter server deploy --prod --legacy /usr/src/app/deployed

# Production stage
FROM node:22-slim AS production
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Pre-create directory for permissions
RUN chown node:node /usr/src/app
USER node

# Copy production dependencies (including shared)
# We use pnpm deploy here to get only the necessary production modules
COPY --chown=node:node --from=base /usr/src/app/deployed/node_modules ./node_modules
COPY --chown=node:node --from=base /usr/src/app/deployed/package.json ./package.json

# Explicitly copy all compiled JS files from server dist
COPY --chown=node:node --from=base /usr/src/app/apps/server/dist ./dist

# Ensure public directory exists and copy client assets
RUN mkdir -p public
COPY --chown=node:node --from=base /usr/src/app/apps/client/dist ./public

# Debug step to verify file existence during build (visible in docker build logs)
RUN ls -la dist/ && ls -la dist/user.js && ls -la public/ && ls -la public/index.html

ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE $PORT

# Start using the explicitly copied dist/index.js
CMD [ "node", "dist/index.js" ]
