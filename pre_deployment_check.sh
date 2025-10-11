#!/bin/bash

# Pre-Deployment Checklist Script
# Run this before deploying to verify everything is ready

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REMOTE_USER="kunye"
REMOTE_HOST="165.22.227.234"
ISSUES_FOUND=0

print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_header "Pre-Deployment Checklist"

# Check 1: Required files exist
print_header "Checking Required Files"

[ -f "docker-compose.yml" ] && print_check 0 "docker-compose.yml exists" || print_check 1 "docker-compose.yml missing"
[ -f "api/Dockerfile" ] && print_check 0 "api/Dockerfile exists" || print_check 1 "api/Dockerfile missing"
[ -f "frontend/Dockerfile" ] && print_check 0 "frontend/Dockerfile exists" || print_check 1 "frontend/Dockerfile missing"
[ -f "api/package.json" ] && print_check 0 "api/package.json exists" || print_check 1 "api/package.json missing"
[ -f "frontend/package.json" ] && print_check 0 "frontend/package.json exists" || print_check 1 "frontend/package.json missing"

# Check 2: Database schema files
print_header "Checking Database Files"

if [ -f "api/schema.sql" ] || [ -f "schema.sql" ] || [ -f "init.sql" ]; then
    print_check 0 "Database schema file found"
else
    print_check 1 "No database schema file found (schema.sql or init.sql)"
fi

# Check 3: Configuration files
print_header "Checking Configuration"

if [ -f "api/config/db.js" ]; then
    if grep -q "process.env.DB_HOST" api/config/db.js; then
        print_check 0 "Database config uses environment variables"
    else
        print_warning "Database config might not use environment variables"
    fi
else
    print_check 1 "api/config/db.js not found"
fi

# Check 4: Environment files
print_header "Checking Environment Files"

if [ -f "api/.env" ]; then
    print_check 0 "api/.env exists"
else
    print_warning "api/.env not found (will use docker-compose environment)"
fi

# Check 5: SSH connectivity
print_header "Checking Remote Server Connection"

if ssh -o ConnectTimeout=5 -o BatchMode=yes $REMOTE_USER@$REMOTE_HOST "echo 'ok'" > /dev/null 2>&1; then
    print_check 0 "SSH connection successful (using key)"
elif ssh -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST "echo 'ok'" > /dev/null 2>&1; then
    print_check 0 "SSH connection successful (may require password)"
else
    print_check 1 "Cannot connect to $REMOTE_USER@$REMOTE_HOST"
    echo "   Try: ssh $REMOTE_USER@$REMOTE_HOST"
fi

# Check 6: Remote server requirements
print_header "Checking Remote Server Requirements"

if ssh -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST "command -v docker" > /dev/null 2>&1; then
    print_check 0 "Docker installed on remote server"
    DOCKER_VERSION=$(ssh $REMOTE_USER@$REMOTE_HOST "docker --version" 2>/dev/null)
    echo "   $DOCKER_VERSION"
else
    print_check 1 "Docker not installed on remote server"
    echo "   Install with: sudo apt update && sudo apt install -y docker.io docker-compose"
fi

if ssh -o ConnectTimeout=5 $REMOTE_USER@$REMOTE_HOST "command -v docker-compose" > /dev/null 2>&1; then
    print_check 0 "Docker Compose installed on remote server"
    COMPOSE_VERSION=$(ssh $REMOTE_USER@$REMOTE_HOST "docker-compose --version" 2>/dev/null)
    echo "   $COMPOSE_VERSION"
else
    print_check 1 "Docker Compose not installed on remote server"
fi

# Check 7: Port availability (if we can check)
print_header "Checking Remote Server Ports"

echo "Checking if required ports might be available..."
for PORT in 3000 5173 5174 3306; do
    if ssh $REMOTE_USER@$REMOTE_HOST "sudo lsof -i :$PORT" > /dev/null 2>&1; then
        print_warning "Port $PORT might be in use on remote server"
    else
        print_check 0 "Port $PORT appears available"
    fi
done

# Check 8: Disk space on remote
print_header "Checking Remote Server Resources"

DISK_SPACE=$(ssh $REMOTE_USER@$REMOTE_HOST "df -h /projects | tail -1 | awk '{print \$4}'" 2>/dev/null)
if [ -n "$DISK_SPACE" ]; then
    echo "Available disk space: $DISK_SPACE"
    print_check 0 "Disk space checked"
else
    print_warning "Could not check disk space"
fi

# Check 9: Local project size
print_header "Checking Local Project"

PROJECT_SIZE=$(du -sh /home/dev/dev/imes 2>/dev/null | awk '{print $1}')
echo "Local project size: $PROJECT_SIZE"

NODE_MODULES_SIZE=$(du -sh /home/dev/dev/imes/*/node_modules 2>/dev/null | awk '{sum+=$1} END {print sum "M"}')
if [ -d "api/node_modules" ] || [ -d "frontend/node_modules" ]; then
    print_warning "node_modules directories exist (will be excluded from transfer)"
    echo "   Run 'rm -rf */node_modules' to clean up"
fi

# Summary
print_header "Summary"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "To deploy, run:"
    echo "  chmod +x deploy_to_remote.sh"
    echo "  ./deploy_to_remote.sh"
else
    echo -e "${RED}Found $ISSUES_FOUND issue(s) that should be addressed.${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
fi

echo ""
echo "For detailed deployment instructions, see:"
echo "  cat REMOTE_DEPLOYMENT_GUIDE.md"

