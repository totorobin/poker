# --------------> The frontend build image
FROM node:21-slim as build-f

WORKDIR /usr/src/shared
COPY shared .

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY client/package*.json ./

RUN npm install
# If you are building your code for production
#RUN npm ci --only=production

# Bundle app source
COPY client .

RUN npm run build

# --------------> The backend build image
FROM node:21-slim as build-b


# Create app directory
WORKDIR /usr/src/app

COPY shared ../shared
COPY server .

RUN npm install

RUN npm run build

# --------------> The production image
FROM node:21-slim
ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

COPY --from=build-b /usr/src/app/package*.json ./
RUN npm ci --only=production
COPY --from=build-f /usr/src/app/dist public
COPY --from=build-b /usr/src/app/dist ./

ENV PORT 8080
EXPOSE 8080

USER node
CMD [ "node", "server/src/index.js" ]
