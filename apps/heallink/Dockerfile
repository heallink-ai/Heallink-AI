FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

# Copy the app package.json
COPY apps/heallink/package.json ./apps/heallink/

# Copy packages if they exist
COPY packages ./packages/

# Install dependencies
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/heallink/node_modules ./apps/heallink/node_modules
COPY --from=deps /app/packages ./packages

# Copy project files
COPY package.json yarn.lock tsconfig.json ./
COPY apps/heallink ./apps/heallink/

# Set working directory to the app
WORKDIR /app/apps/heallink

# Build the project
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy the necessary files from the builder
COPY --from=builder /app/apps/heallink/public ./public
COPY --from=builder /app/apps/heallink/.next ./.next
COPY --from=builder /app/apps/heallink/package.json ./package.json
COPY --from=builder /app/apps/heallink/next.config.ts ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose port
EXPOSE 3000

# Start the production server
CMD ["yarn", "start"]