FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

# Copy the app package.json
COPY apps/api/package.json ./apps/api/

# Copy packages if they exist
COPY packages ./packages/

# Install dependencies
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages ./packages

# Copy project files
COPY package.json yarn.lock tsconfig.json ./
COPY apps/api ./apps/api/

# Set working directory to the api app
WORKDIR /app/apps/api

# Build the project
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy the necessary files from the builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

# Copy email templates
COPY --from=builder /app/apps/api/src/modules/emails/templates ./dist/modules/emails/templates

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose port
EXPOSE 3003

# Start the production server
CMD ["yarn", "start:prod"]