#!/bin/bash

# IKONGA Lifestyle - Deployment Script for Hostinger VPS
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting IKONGA Lifestyle deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/ikonga/ikonga-lifestyle"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo -e "${YELLOW}📦 Pulling latest code from GitHub...${NC}"
cd $PROJECT_DIR
git pull origin main

echo -e "${YELLOW}🔧 Installing Backend dependencies...${NC}"
cd $BACKEND_DIR
npm install --production=false

echo -e "${YELLOW}🗄️  Running Prisma migrations...${NC}"
npx prisma generate
npx prisma migrate deploy

echo -e "${YELLOW}🏗️  Building Backend...${NC}"
npm run build

echo -e "${YELLOW}🔧 Installing Frontend dependencies...${NC}"
cd $FRONTEND_DIR
npm install --production=false

echo -e "${YELLOW}🏗️  Building Frontend...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting applications with PM2...${NC}"
cd $PROJECT_DIR
pm2 restart ecosystem.config.js

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}📊 Check status with: pm2 status${NC}"
echo -e "${GREEN}📝 View logs with: pm2 logs${NC}"
