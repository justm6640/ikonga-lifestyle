#!/bin/bash

# Deployment Script for IKONGA Lifestyle

# 1. Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main

# 2. Rebuild and restart containers
echo "🐳 Rebuilding and restarting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Prune unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete! application should be running."
echo "   Backend: http://localhost:3001"
echo "   Frontend: http://localhost:3000"
