# ---------- Build Stage ----------
	FROM node:20-alpine AS builder
	
	# Set working directory
	WORKDIR /app
	
	# Copy package manager files
	COPY package.json yarn.lock ./
	
	# Copy monorepo source
	COPY apps/automate ./apps/automate
	COPY packages/shared ./packages/shared
	
	# Install only necessary deps for building
	RUN corepack enable 
	RUN yarn workspaces focus @tdata/shared
	RUN yarn build:shared;
	RUN yarn workspaces focus @tdata/automate
	RUN yarn build:automate
	
	# Build only the target app
	RUN yarn build:automate
	
# ---------- Runtime Stage ----------
	FROM node:20.5.1-alpine AS runner
	
	WORKDIR /app
	
	# Copy only the built app
	COPY --from=builder /app/apps/automate/dist ./dist
	
	# If runtime deps are needed, install here:
	# COPY package.json yarn.lock ./
	# RUN corepack enable && yarn install --production
	
	# Set environment variables (use --env-file in prod)
	ENV NODE_ENV=production
	
	# Set the default command
	CMD ["node", "dist/index.cjs"]
	