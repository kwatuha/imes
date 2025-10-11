#!/bin/bash

# IMES Remote Deployment Script
# This script automates the deployment process to a remote server

set -e  # Exit on any error

# Configuration
REMOTE_USER="kunye"
REMOTE_HOST="165.22.227.234"
REMOTE_PATH="/projects/imes"
LOCAL_PATH="/home/dev/dev/imes"
BACKUP_BEFORE_DEPLOY=true

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running from correct directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "Error: docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

print_header "IMES Remote Deployment Script"
echo "Source: $LOCAL_PATH"
echo "Destination: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo ""

# Ask for confirmation
read -p "Do you want to continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled."
    exit 0
fi

# Step 1: Pre-deployment checks
print_header "Step 1: Pre-deployment Checks"

# Check SSH connectivity
echo "Checking SSH connectivity..."
if ssh -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST "echo 'Connected'" > /dev/null 2>&1; then
    print_success "SSH connection successful"
else
    print_error "Cannot connect to remote server. Please check SSH connection."
    exit 1
fi

# Check if Docker is installed on remote
echo "Checking Docker on remote server..."
if ssh $REMOTE_USER@$REMOTE_HOST "command -v docker" > /dev/null 2>&1; then
    print_success "Docker is installed on remote server"
else
    print_warning "Docker not found on remote server."
    read -p "Do you want to install Docker on remote server? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Docker..."
        ssh $REMOTE_USER@$REMOTE_HOST "sudo apt update && sudo apt install -y docker.io docker-compose"
        ssh $REMOTE_USER@$REMOTE_HOST "sudo systemctl start docker && sudo systemctl enable docker"
        ssh $REMOTE_USER@$REMOTE_HOST "sudo usermod -aG docker $REMOTE_USER"
        print_success "Docker installed. Note: You may need to reconnect SSH for group changes."
    else
        print_error "Docker is required for deployment. Exiting."
        exit 1
    fi
fi

# Step 2: Clean up local project
print_header "Step 2: Cleaning Local Project"

echo "Removing node_modules directories..."
rm -rf api/node_modules
rm -rf frontend/node_modules
rm -rf public-dashboard/node_modules
print_success "Removed node_modules"

echo "Removing build artifacts..."
rm -rf frontend/dist
rm -rf public-dashboard/dist
print_success "Removed build artifacts"

echo "Removing log files..."
find . -name "*.log" -type f -delete 2>/dev/null || true
print_success "Removed log files"

# Step 3: Create deployment package
print_header "Step 3: Creating Deployment Package"

echo "Creating tar archive..."
cd /home/dev/dev
tar czf imes-deploy.tar.gz \
  --exclude='imes/node_modules' \
  --exclude='imes/frontend/node_modules' \
  --exclude='imes/public-dashboard/node_modules' \
  --exclude='imes/frontend/dist' \
  --exclude='imes/public-dashboard/dist' \
  --exclude='imes/.git' \
  --exclude='imes/*.log' \
  --exclude='imes/api/uploads' \
  imes/
print_success "Deployment package created: imes-deploy.tar.gz"

# Step 4: Backup existing deployment (if exists)
print_header "Step 4: Backup Existing Deployment"

if [ "$BACKUP_BEFORE_DEPLOY" = true ]; then
    echo "Checking for existing deployment..."
    if ssh $REMOTE_USER@$REMOTE_HOST "[ -d $REMOTE_PATH ]"; then
        BACKUP_NAME="imes-backup-$(date +%Y%m%d_%H%M%S).tar.gz"
        echo "Creating backup of existing deployment..."
        ssh $REMOTE_USER@$REMOTE_HOST "cd /projects && tar czf $BACKUP_NAME imes/ 2>/dev/null || true"
        print_success "Backup created: $BACKUP_NAME"
    else
        print_warning "No existing deployment found, skipping backup."
    fi
fi

# Step 5: Transfer files to remote server
print_header "Step 5: Transferring Files to Remote Server"

echo "Copying deployment package..."
scp imes-deploy.tar.gz $REMOTE_USER@$REMOTE_HOST:/tmp/
print_success "Files transferred"

# Clean up local tar file
rm imes-deploy.tar.gz

# Step 6: Extract and setup on remote server
print_header "Step 6: Setting Up on Remote Server"

ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
set -e

echo "Stopping existing containers (if any)..."
cd /projects/imes 2>/dev/null && docker-compose down 2>/dev/null || true

echo "Creating projects directory..."
mkdir -p /projects
cd /projects

echo "Extracting deployment package..."
tar xzf /tmp/imes-deploy.tar.gz
rm /tmp/imes-deploy.tar.gz

echo "Setting up directory structure..."
cd imes
mkdir -p api/uploads/contractor-photos
mkdir -p api/uploads/project-photos
mkdir -p api/uploads/payment-requests
mkdir -p api/uploads/chat-files
mkdir -p backups

echo "Setting permissions..."
chmod -R 755 api/uploads
chmod +x deploy.sh 2>/dev/null || true

echo "Remote setup complete!"
ENDSSH

print_success "Remote setup completed"

# Step 7: Build and start Docker containers
print_header "Step 7: Building and Starting Docker Containers"

echo "Building Docker images on remote server..."
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
cd /projects/imes
echo "Building containers..."
docker-compose build --no-cache
echo "Starting containers..."
docker-compose up -d
echo "Waiting for containers to start..."
sleep 10
ENDSSH

print_success "Docker containers started"

# Step 8: Verify deployment
print_header "Step 8: Verifying Deployment"

echo "Checking container status..."
ssh $REMOTE_USER@$REMOTE_HOST "cd /projects/imes && docker-compose ps"

echo ""
echo "Checking API health..."
sleep 5
if ssh $REMOTE_USER@$REMOTE_HOST "curl -s http://localhost:3000/ > /dev/null"; then
    print_success "API is responding"
else
    print_warning "API is not responding yet. Check logs with: ssh $REMOTE_USER@$REMOTE_HOST 'cd /projects/imes && docker logs node_api'"
fi

# Step 9: Display access information
print_header "Deployment Complete!"

echo ""
echo -e "${GREEN}Application URLs:${NC}"
echo "  Frontend:        http://$REMOTE_HOST:5173"
echo "  Public Dashboard: http://$REMOTE_HOST:5174"
echo "  API:             http://$REMOTE_HOST:3000"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Import database schema (if first deployment):"
echo "   ssh $REMOTE_USER@$REMOTE_HOST"
echo "   cd /projects/imes"
echo "   docker exec -i db mysql -u impesUser -pAdmin2010impes imbesdb < api/schema.sql"
echo ""
echo "2. Check logs:"
echo "   ssh $REMOTE_USER@$REMOTE_HOST 'cd /projects/imes && docker-compose logs -f'"
echo ""
echo "3. Create admin user (if needed):"
echo "   ssh $REMOTE_USER@$REMOTE_HOST"
echo "   cd /projects/imes"
echo "   docker exec -it db mysql -u impesUser -pAdmin2010impes imbesdb"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View logs:    ssh $REMOTE_USER@$REMOTE_HOST 'cd /projects/imes && docker-compose logs -f'"
echo "  Restart:      ssh $REMOTE_USER@$REMOTE_HOST 'cd /projects/imes && docker-compose restart'"
echo "  Stop:         ssh $REMOTE_USER@$REMOTE_HOST 'cd /projects/imes && docker-compose down'"
echo "  Shell access: ssh $REMOTE_USER@$REMOTE_HOST"
echo ""

print_success "Deployment completed successfully!"


