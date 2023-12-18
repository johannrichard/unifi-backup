FROM node:18-alpine as builder

# Set base directory and install yarn
WORKDIR /usr/src/app
RUN yarn set version stable

# Copy compiled code
COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --immutable
COPY . .
RUN yarn build

FROM node:18-alpine as unifi-backup

# Create app directory
WORKDIR /usr/src/app
RUN yarn set version stable

# Install dependencies
RUN npm i -g typescript
COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --immutable

COPY --from=builder /usr/src/app/dist ./dist

# Expose backups volume
ENV BACKUP_LOCATION "/backups"
VOLUME [ "/backups" ]
ENTRYPOINT [ "yarn", "node", "dist/index.js" ]
