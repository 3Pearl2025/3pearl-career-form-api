# ---- Build stage ----
FROM node:20.19.4-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

# ---- Production stage ----
FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app

# Copy from builder
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /app ./

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Distroless runs as nonroot by default
CMD ["server.js"]