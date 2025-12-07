# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including dev dependencies for build
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client for production
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
