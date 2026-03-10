#!/bin/bash

# ============================================
# Production Deployment Script
# ============================================
# This script deploys the application to production
# Usage: ./deploy-to-production.sh

set -e  # Exit on any error

# Configuration
REMOTE_USER="kunye"
REMOTE_HOST="165.22.227.234"
REMOTE_DIR="/projects"
LOCAL_DIR="."

echo "🚀 Starting production deployment..."
echo ""

# Step 1: Check if we're in the correct directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found!"
    echo "Please run this script from the /imes directory"
    exit 1
fi

# Step 2: Confirm deployment
echo "📋 Deployment Details:"
echo "   Source: $(pwd)"
echo "   Target: $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Step 3: Remove any local .env.local files that shouldn't be deployed
echo "🧹 Cleaning up local environment files (.env.local)..."
echo "   Note: .env.development and .env.production are kept (they're part of the config)"
find . -name ".env.local" -type f -exec rm -f {} \; 2>/dev/null || true
echo "✓ Cleanup complete"
echo ""

# Step 4: Sync files to remote server
echo "📦 Syncing files to production server..."
rsync -avz --no-group --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude 'uploads/*' \
    --exclude 'api/uploads' \
    --exclude '.env.local' \
    --exclude '.DS_Store' \
    $LOCAL_DIR/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/
echo "✓ Files synced"
echo ""

# Step 5: Clean up remote .env.local files
echo "🧹 Cleaning up remote environment files..."
ssh $REMOTE_USER@$REMOTE_HOST "find $REMOTE_DIR -name '.env.local' -type f -delete 2>/dev/null || true"
echo "✓ Remote cleanup complete"
echo ""

# Step 6: Build and deploy
echo "🔨 Building and deploying containers..."
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
    cd /projects
    
    # Stop all services
    echo "⏸️  Stopping services..."
    docker-compose -f docker-compose.prod.yml down
    
    # Remove old containers
    echo "🗑️  Removing old containers..."
    docker-compose -f docker-compose.prod.yml rm -f
    
    # Build with no cache for fresh build
    echo "🔨 Building services..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Start services
    echo "▶️  Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait a moment for services to start
    sleep 5
    
    # Show running containers
    echo ""
    echo "📊 Running containers:"
    docker-compose -f docker-compose.prod.yml ps
ENDSSH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Main App:         http://165.22.227.234:8080/impes"
echo "   API:              http://165.22.227.234:3000"
echo "   Public Dashboard: http://165.22.227.234:5174"
echo ""
echo "📝 Next steps:"
echo "   1. Test the application in your browser"
echo "   2. Check logs: ssh $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_DIR && docker-compose -f docker-compose.prod.yml logs -f'"
echo ""

