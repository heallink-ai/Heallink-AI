FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

# Copy the app package.json
COPY apps/heallink-admin/package.json ./apps/heallink-admin/

# Copy packages if they exist
COPY packages ./packages/

# Install dependencies
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/heallink-admin/node_modules ./apps/heallink-admin/node_modules
COPY --from=deps /app/packages ./packages

# Copy project files
COPY package.json yarn.lock tsconfig.json ./
COPY apps/heallink-admin ./apps/heallink-admin/

# Set working directory to the app
WORKDIR /app/apps/heallink-admin

# Build the project
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy the necessary files from the builder
COPY --from=builder /app/apps/heallink-admin/public ./public
COPY --from=builder /app/apps/heallink-admin/.next ./.next
COPY --from=builder /app/apps/heallink-admin/package.json ./package.json
COPY --from=builder /app/apps/heallink-admin/next.config.ts ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose port
EXPOSE 3001

# Start the production server
CMD ["yarn", "start", "--port", "3001"]