# ---- Build stage ----
FROM node:20.13.1-bookworm-slim AS builder
WORKDIR /app

# Install necessary build tools for native dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies (production only)
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the app source code
COPY . .

# ---- Production stage ----
FROM node:20.13.1-bookworm-slim AS runner
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy node_modules and app files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the app port
EXPOSE 5000

# Use a healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Run the app as non-root user
USER appuser

# Start the app
CMD ["node", "server.js"]
