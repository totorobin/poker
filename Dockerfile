# --------------> The build image
FROM node:18-slim as build


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
#RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build


# --------------> The production image__
FROM node:18-slim
ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/dist dist
COPY --from=build /usr/src/app/server.mjs server.mjs

ENV PORT 8080
EXPOSE 8080

USER node
CMD [ "node", "server.mjs" ]