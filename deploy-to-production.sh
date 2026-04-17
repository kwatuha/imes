#!/bin/bash

# ============================================
# Legacy production deployment (DigitalOcean / PMIS)
# ============================================
# Deploys docker-compose.prod.yml (same ports as county): host 8080→nginx HTTP, 8443→HTTPS,
# 5174→public-dashboard, 3000→api, 3307→MySQL.
#
# Usage:
#   ./deploy-to-production.sh
#   DEPLOY_SKIP_CONFIRM=1 ./deploy-to-production.sh
#
# Optional env:
#   REMOTE_USER REMOTE_HOST REMOTE_DIR
#   HTTPS_DOMAIN (default: pmis.kisumu.go.ke)
#   LETSENCRYPT_EMAIL (default: admin@kisumu.go.ke)
#   DEPLOY_SKIP_CONFIRM=1  skip y/n prompt
#   LEGACY_BIND_PUBLIC_80=1  also map host :80→nginx (only if free; needed for Certbot HTTP-01
#                            unless you proxy /.well-known/ to http://127.0.0.1:8080/)

set -e

REMOTE_USER="${REMOTE_USER:-kunye}"
REMOTE_HOST="${REMOTE_HOST:-165.22.227.234}"
REMOTE_DIR="${REMOTE_DIR:-/projects}"
LOCAL_DIR="."
HTTPS_DOMAIN="${HTTPS_DOMAIN:-pmis.kisumu.go.ke}"
LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-admin@kisumu.go.ke}"
LEGACY_BIND_PUBLIC_80="${LEGACY_BIND_PUBLIC_80:-0}"

echo "🚀 Starting legacy (PMIS) production deployment..."
echo ""

if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found!"
    echo "Please run this script from the /imes repository root."
    exit 1
fi
if [ "$LEGACY_BIND_PUBLIC_80" = "1" ] && [ ! -f "docker-compose.legacy-public.yml" ]; then
    echo "❌ Error: docker-compose.legacy-public.yml not found (required when LEGACY_BIND_PUBLIC_80=1)."
    exit 1
fi

echo "📋 Deployment details:"
echo "   Source: $(pwd)"
echo "   Target: $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
echo "   HTTPS:  https://$HTTPS_DOMAIN/"
echo "   Compose: docker-compose.prod.yml$([ "$LEGACY_BIND_PUBLIC_80" = "1" ] && echo ' + docker-compose.legacy-public.yml (host :80)')"
echo ""

if [ "${DEPLOY_SKIP_CONFIRM:-}" != "1" ]; then
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

echo "🧹 Cleaning up local .env.local files..."
find . -name ".env.local" -type f -exec rm -f {} \; 2>/dev/null || true
echo "✓ Cleanup complete"
echo ""

echo "📦 Syncing files to production server..."
rsync -avz --no-group --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'certbot' \
    --exclude '*.log' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude 'uploads/*' \
    --exclude 'api/uploads' \
    --exclude '.env.local' \
    --exclude '.DS_Store' \
    --include 'public-dashboard/' \
    --include 'public-dashboard/**' \
    --include 'nginx/' \
    --include 'nginx/**' \
    --include 'docker-compose.legacy-public.yml' \
    "$LOCAL_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
echo "✓ Files synced"
echo ""

echo "🧹 Cleaning remote .env.local files..."
ssh "$REMOTE_USER@$REMOTE_HOST" "find $REMOTE_DIR -name '.env.local' -type f -delete 2>/dev/null || true"
echo "✓ Remote cleanup complete"
echo ""

echo "🔨 Building, deploying, and configuring HTTPS on remote..."
ssh "$REMOTE_USER@$REMOTE_HOST" bash -s << ENDSSH
set -e
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:\${PATH:-}"
if [ -f "\$HOME/.profile" ]; then . "\$HOME/.profile" >/dev/null 2>&1 || true; fi
if [ -f "\$HOME/.bashrc" ]; then . "\$HOME/.bashrc" >/dev/null 2>&1 || true; fi

cd "$REMOTE_DIR"

if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

DOMAIN="$HTTPS_DOMAIN"
EMAIL="$LETSENCRYPT_EMAIL"
LEGACY_BIND_PUBLIC_80="$LEGACY_BIND_PUBLIC_80"

if [ "\$LEGACY_BIND_PUBLIC_80" = "1" ]; then
    COMPOSE_FILES="-f docker-compose.prod.yml -f docker-compose.legacy-public.yml"
    if [ ! -f docker-compose.legacy-public.yml ]; then
        echo "[ERROR] docker-compose.legacy-public.yml missing on server."
        exit 1
    fi
    echo "[INFO] Host :80 is mapped to nginx (LEGACY_BIND_PUBLIC_80=1) for Let's Encrypt HTTP-01."
else
    COMPOSE_FILES="-f docker-compose.prod.yml"
fi

echo "[INFO] Using: \$COMPOSE_CMD \$COMPOSE_FILES"
echo "[INFO] Selecting HTTPS vhost for legacy (pmis)..."
cp -f ./nginx/https-pmis.conf ./nginx/https-site.conf

mkdir -p ./certbot/www ./certbot/conf/live/\$DOMAIN

if [ ! -s ./certbot/conf/live/\$DOMAIN/fullchain.pem ] || [ ! -s ./certbot/conf/live/\$DOMAIN/privkey.pem ]; then
    if command -v openssl >/dev/null 2>&1; then
        echo "[INFO] Creating temporary self-signed certificate for first HTTPS boot..."
        openssl req -x509 -nodes -newkey rsa:2048 \\
            -days 2 \\
            -keyout ./certbot/conf/live/\$DOMAIN/privkey.pem \\
            -out ./certbot/conf/live/\$DOMAIN/fullchain.pem \\
            -subj "/CN=\$DOMAIN" >/dev/null 2>&1
    else
        echo "[ERROR] openssl not found (required for bootstrap cert)."
        exit 1
    fi
fi

echo "⏸️  Stopping services..."
\$COMPOSE_CMD \$COMPOSE_FILES down --remove-orphans || true

echo "🗑️  Removing old containers..."
\$COMPOSE_CMD \$COMPOSE_FILES rm -f || true

echo "🔨 Building services..."
\$COMPOSE_CMD \$COMPOSE_FILES build --no-cache

echo "▶️  Starting services..."
\$COMPOSE_CMD \$COMPOSE_FILES up -d

echo "[INFO] Requesting/renewing Let's Encrypt certificate (HTTP-01 on port 80)..."
if [ "\$LEGACY_BIND_PUBLIC_80" != "1" ]; then
    echo "[INFO] Without host :80, proxy http://\$DOMAIN/.well-known/ to http://127.0.0.1:8080/ on the edge, or set LEGACY_BIND_PUBLIC_80=1 if :80 is free."
fi
docker run --rm \\
    -v "\$(pwd)/certbot/conf:/etc/letsencrypt" \\
    -v "\$(pwd)/certbot/www:/var/www/certbot" \\
    certbot/certbot certonly --webroot \\
    -w /var/www/certbot \\
    -d \$DOMAIN \\
    --email \$EMAIL \\
    --agree-tos \\
    --no-eff-email \\
    --non-interactive \\
    || echo "[WARN] Certbot failed — TLS may use the temporary self-signed cert until DNS-01, edge proxy for /.well-known/, or LEGACY_BIND_PUBLIC_80=1."

echo "[INFO] Reloading nginx..."
\$COMPOSE_CMD \$COMPOSE_FILES restart nginx_proxy

sleep 5
echo ""
echo "📊 Running containers:"
\$COMPOSE_CMD \$COMPOSE_FILES ps
ENDSSH

if [ "$LEGACY_BIND_PUBLIC_80" = "1" ]; then
    LOGS_HINT="docker compose -f docker-compose.prod.yml -f docker-compose.legacy-public.yml logs -f"
    LOGS_HINT_ALT="docker-compose -f docker-compose.prod.yml -f docker-compose.legacy-public.yml logs -f"
else
    LOGS_HINT="docker compose -f docker-compose.prod.yml logs -f"
    LOGS_HINT_ALT="docker-compose -f docker-compose.prod.yml logs -f"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Direct to Docker (same layout as county server):"
echo "   Nginx HTTP:  http://$REMOTE_HOST:8080/"
echo "   Nginx HTTPS: https://$REMOTE_HOST:8443/"
echo "   Public dashboard (dev-style port): http://$REMOTE_HOST:5174/"
echo "   API:         http://$REMOTE_HOST:3000/"
echo ""
echo "🌐 With DNS + reverse proxy on :443 (typical): https://$HTTPS_DOMAIN/admin/ etc."
echo ""
echo "📝 Let's Encrypt: HTTP-01 needs http://$HTTPS_DOMAIN/.well-known/ on port 80, or use DNS-01."
echo "📝 Logs: ssh $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_DIR && ($LOGS_HINT || $LOGS_HINT_ALT)'"
echo ""
