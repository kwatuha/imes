#!/bin/bash

# ============================================
# County Server Deployment Script
# ============================================
# Deploys the IMES app to the county server with no prompts.
# Usage: ./county-server-deploy.sh [--help|-h|--dry-run] [--sync-db]
#
# --sync-db  After deploy: dump local MySQL (docker-compose.yml mysql_db),
#            upload to server, import into production mysql_db (replaces DB content).

set -e

# Configuration
REMOTE_USER="me"
REMOTE_HOST="197.156.144.221"
REMOTE_DIR="/projects"
REMOTE_FALLBACK_DIR="/home/$REMOTE_USER/projects"
LOCAL_DIR="."
DEPLOY_DIR="$REMOTE_DIR"
HTTPS_DOMAIN="${HTTPS_DOMAIN:-ecimes.kisumu.go.ke}"
LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-admin@kisumu.go.ke}"
# Same compose as legacy: docker-compose.prod.yml (host 8080→HTTP, 8443→HTTPS, 5174→public-dashboard).
# DB secrets: $DEPLOY_DIR/.env (not rsync'd — create on server from .env.example).
PROD_COMPOSE="-f docker-compose.prod.yml"

# Local dev DB (same credentials as docker-compose.yml / docker-compose.prod.yml mysql_db)
LOCAL_COMPOSE_FILE="${LOCAL_COMPOSE_FILE:-docker-compose.yml}"
LOCAL_MYSQL_SERVICE="${LOCAL_MYSQL_SERVICE:-mysql_db}"
REMOTE_DB_DUMP_NAME="county_deploy_db_import.sql.gz"
SYNC_DB=false

# Rsync exclusions aligned with deploy-gprs-server.sh pattern (lean deploy tree).
#
# Unlike government_projects/deploy-gprs-server.sh, this project MUST ship
# ./public-dashboard/ (docker-compose.prod.yml builds the public_dashboard service).
# Never add --exclude 'public-dashboard' here.
RSYNC_EXCLUDES=(
    --exclude 'node_modules'
    --exclude '.git'
    # Explicitly pull in the whole public-dashboard tree (GPRS deploy omits this directory).
    --include 'public-dashboard/'
    --include 'public-dashboard/**'
    --exclude '.env'
    --exclude '.env.local'
    --exclude '.env.production'
    --exclude '*.log'
    --exclude 'dist'
    --exclude 'build'
    --exclude '.DS_Store'
    --exclude '__pycache__'
    --exclude '*.pyc'
    --exclude '.vscode'
    --exclude '.idea'
    --exclude 'db_data'
    --exclude 'uploads/*'
    --exclude 'api/uploads'
    --exclude '*.txt'
    --include 'frontend/index.html'
    --include 'frontend/public/xindex.html'
    --exclude '*.html'
    --exclude '*.md'
    --exclude 'api/migrations'
    --exclude 'api/dump'
    --exclude 'scripts/migration'
    --exclude 'screenshots'
    --exclude 'docs'
    --exclude 'original_docker_compose.yml'
    --exclude 'test-guide'
    --exclude 'test*.sh'
    --exclude 'test*.js'
    --exclude 'diagnose*.sh'
    --exclude 'check*.sh'
    --exclude 'import*.sh'
    --exclude 'copy*.sh'
    --exclude 'sync*.sh'
    --exclude 'verify*.sh'
    --exclude 'setup*.sh'
    --exclude 'install*.sh'
    --exclude 'fix*.sh'
    --exclude 'run*.sh'
    --exclude 'deploy*.sh'
    --include 'county-server-deploy.sh'
    --include 'nginx/'
    --include 'nginx/**'
    --include 'nginx/nginx-production.conf'
    --include 'frontend/nginx-frontend.conf'
    --include 'api/init.sql'
    --exclude '*.sql'
)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_local_requirements() {
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "docker-compose.prod.yml not found."
        print_status "Run this script from the /imes repository root."
        exit 1
    fi
    if ! command -v rsync >/dev/null 2>&1; then
        print_error "rsync is required but not installed locally."
        exit 1
    fi
}

test_ssh_connection() {
    print_status "Testing SSH connection to $REMOTE_USER@$REMOTE_HOST..."
    if ssh -o BatchMode=yes -o ConnectTimeout=10 "$REMOTE_USER@$REMOTE_HOST" "echo ok" >/dev/null 2>&1; then
        print_success "SSH connection successful"
    else
        print_error "Unable to connect to $REMOTE_USER@$REMOTE_HOST via SSH."
        print_status "Ensure your SSH key is loaded and server is reachable."
        exit 1
    fi
}

# Printed when Docker/Compose is missing or unusable on the remote host.
remote_docker_install_hint() {
    cat << HINT
----------------------------------------------------------------------
On the SERVER (SSH in as a sudo-capable user), install Docker Engine:

  curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
  sudo sh /tmp/get-docker.sh
  sudo usermod -aG docker $REMOTE_USER
  sudo apt-get install -y docker-compose-plugin || sudo apt-get install -y docker-compose

Then log out and back in (or: newgrp docker) so user "$REMOTE_USER" can run docker.
Start the daemon if needed: sudo systemctl enable --now docker
----------------------------------------------------------------------
HINT
}

check_remote_docker() {
    print_status "Checking Docker and Compose on remote server..."
    # Non-login SSH has a minimal PATH; Docker may live under /snap/bin or /usr/bin.
    if ! ssh "$REMOTE_USER@$REMOTE_HOST" bash -s >/tmp/county_deploy_check.$$ 2>&1 <<'REMOTE_CHECK'
set -e
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:${PATH:-}"
if [ -f "$HOME/.profile" ]; then . "$HOME/.profile" >/dev/null 2>&1 || true; fi
if [ -f "$HOME/.bashrc" ]; then . "$HOME/.bashrc" >/dev/null 2>&1 || true; fi

DOCKER_BIN=""
if command -v docker >/dev/null 2>&1; then
    DOCKER_BIN="$(command -v docker)"
else
    for p in /usr/bin/docker /usr/local/bin/docker /snap/bin/docker; do
        if [ -x "$p" ]; then DOCKER_BIN="$p"; break; fi
    done
fi

if [ -z "$DOCKER_BIN" ]; then
    echo "ERROR: docker CLI not found (checked PATH and /usr/bin/docker, /usr/local/bin/docker, /snap/bin/docker)."
    echo "DIAG: PATH=$PATH"
    ls -la /usr/bin/docker /usr/local/bin/docker /snap/bin/docker 2>&1 || true
    exit 1
fi

if ! "$DOCKER_BIN" info >/dev/null 2>&1; then
    echo "ERROR: docker is present at $DOCKER_BIN but cannot reach the daemon."
    echo "       Common fixes: sudo systemctl start docker"
    echo "       Add user to docker group: sudo usermod -aG docker $USER then log out and SSH again."
    exit 1
fi

if "$DOCKER_BIN" compose version >/dev/null 2>&1; then
    echo "COMPOSE_CMD=docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    echo "COMPOSE_CMD=docker-compose"
elif [ -x /usr/bin/docker-compose ]; then
    echo "COMPOSE_CMD=/usr/bin/docker-compose"
elif [ -x /usr/local/bin/docker-compose ]; then
    echo "COMPOSE_CMD=/usr/local/bin/docker-compose"
else
    echo "ERROR: Neither docker compose (plugin) nor docker-compose is available."
    exit 1
fi
REMOTE_CHECK
    then
        cat /tmp/county_deploy_check.$$ >&2
        rm -f /tmp/county_deploy_check.$$
        print_error "Remote Docker check failed."
        remote_docker_install_hint >&2
        exit 1
    fi

    REMOTE_COMPOSE_CMD="$(awk -F= '/^COMPOSE_CMD=/{print $2}' /tmp/county_deploy_check.$$)"
    rm -f /tmp/county_deploy_check.$$

    if [ -z "$REMOTE_COMPOSE_CMD" ]; then
        print_error "Could not determine remote compose command."
        remote_docker_install_hint >&2
        exit 1
    fi
    print_success "Remote compose command: $REMOTE_COMPOSE_CMD"
}

ensure_remote_directory_writable() {
    print_status "Checking remote deploy directory: $REMOTE_DIR"
    if ssh "$REMOTE_USER@$REMOTE_HOST" "set -e
        if [ ! -d '$REMOTE_DIR' ]; then
            mkdir -p '$REMOTE_DIR' 2>/dev/null || true
        fi
        [ -d '$REMOTE_DIR' ] && [ -w '$REMOTE_DIR' ]
    "; then
        DEPLOY_DIR="$REMOTE_DIR"
        print_success "Remote deploy directory is writable: $DEPLOY_DIR"
        return
    fi

    print_warning "Primary deploy directory is not writable: $REMOTE_DIR"
    print_status "Trying fallback deploy directory: $REMOTE_FALLBACK_DIR"
    if ssh "$REMOTE_USER@$REMOTE_HOST" "set -e
        mkdir -p '$REMOTE_FALLBACK_DIR'
        [ -d '$REMOTE_FALLBACK_DIR' ] && [ -w '$REMOTE_FALLBACK_DIR' ]
    "; then
        DEPLOY_DIR="$REMOTE_FALLBACK_DIR"
        print_success "Using fallback deploy directory: $DEPLOY_DIR"
        return
    fi

    print_error "Neither primary nor fallback deploy directory is writable."
    print_status "Run on server once (as sudo-capable user):"
    print_status "  sudo mkdir -p '$REMOTE_DIR' && sudo chown -R $REMOTE_USER:$REMOTE_USER '$REMOTE_DIR'"
    print_status "  # or ensure $REMOTE_FALLBACK_DIR is writable by $REMOTE_USER"
    exit 1
}

cleanup_local_env_files() {
    print_status "Cleaning local .env.local files..."
    find . -name ".env.local" -type f -exec rm -f {} \; 2>/dev/null || true
    print_success "Local cleanup complete"
}

sync_files() {
    print_status "Syncing files to $REMOTE_USER@$REMOTE_HOST:$DEPLOY_DIR..."
    print_warning "This may take a few minutes..."
    rsync -avz --no-group --progress \
        "${RSYNC_EXCLUDES[@]}" \
        "$LOCAL_DIR/" "$REMOTE_USER@$REMOTE_HOST:$DEPLOY_DIR/"
    print_success "Files synced"

    # Same workaround as deploy-gprs-server.sh: single-file rsync without *.html filter ambiguity.
    print_status "Ensuring frontend/index.html is synced..."
    if [ -f frontend/index.html ]; then
        if rsync -avz --no-group --progress \
            ./frontend/index.html "$REMOTE_USER@$REMOTE_HOST:$DEPLOY_DIR/frontend/index.html"; then
            print_success "frontend/index.html synced"
        else
            print_warning "Could not re-sync frontend/index.html (continuing)"
        fi
    fi
}

cleanup_remote_env_files() {
    print_status "Cleaning remote .env.local files..."
    ssh "$REMOTE_USER@$REMOTE_HOST" "find $DEPLOY_DIR -name '.env.local' -type f -delete 2>/dev/null || true"
    print_success "Remote cleanup complete"
}

dump_local_mysql() {
    print_status "Dumping local MySQL from $LOCAL_MYSQL_SERVICE ($LOCAL_COMPOSE_FILE)..."
    if ! command -v docker >/dev/null 2>&1; then
        print_error "docker is required for --sync-db."
        exit 1
    fi
    if [ ! -f "$LOCAL_COMPOSE_FILE" ]; then
        print_error "Local compose file not found: $LOCAL_COMPOSE_FILE"
        exit 1
    fi
    if ! docker compose -f "$LOCAL_COMPOSE_FILE" exec -T "$LOCAL_MYSQL_SERVICE" \
        mysqladmin ping -h localhost -uroot -proot_password --silent >/dev/null 2>&1; then
        print_error "Local MySQL service '$LOCAL_MYSQL_SERVICE' is not reachable."
        print_status "Start it first, for example:"
        print_status "  docker compose -f $LOCAL_COMPOSE_FILE up -d $LOCAL_MYSQL_SERVICE"
        exit 1
    fi
    local out="${TMPDIR:-/tmp}/imes_county_db_$$.sql.gz"
    if ! docker compose -f "$LOCAL_COMPOSE_FILE" exec -T "$LOCAL_MYSQL_SERVICE" \
        mysqldump -uroot -proot_password --single-transaction --routines --triggers imbesdb \
        | gzip >"$out"; then
        rm -f "$out"
        print_error "mysqldump failed."
        exit 1
    fi
    print_success "Local dump created ($(du -h "$out" | awk '{print $1}'))"
    printf '%s' "$out"
}

upload_db_dump() {
    local dump_path="$1"
    print_status "Uploading database dump to $REMOTE_USER@$REMOTE_HOST:$DEPLOY_DIR/$REMOTE_DB_DUMP_NAME ..."
    rsync -avz --no-group --progress \
        "$dump_path" "$REMOTE_USER@$REMOTE_HOST:$DEPLOY_DIR/$REMOTE_DB_DUMP_NAME"
    print_success "Dump uploaded"
}

remote_import_mysql() {
    print_status "Importing dump on remote server (may take several minutes)..."
    ssh "$REMOTE_USER@$REMOTE_HOST" "set -e
        export PATH=\"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:\$PATH\"
        [ -f \"\$HOME/.profile\" ] && . \"\$HOME/.profile\" >/dev/null 2>&1 || true
        [ -f \"\$HOME/.bashrc\" ] && . \"\$HOME/.bashrc\" >/dev/null 2>&1 || true
        cd '$DEPLOY_DIR'
        COMPOSE_CMD='$REMOTE_COMPOSE_CMD'
        if [ ! -f \"docker-compose.prod.yml\" ]; then
            echo '[ERROR] docker-compose.prod.yml not found on remote server.'
            exit 1
        fi
        if [ ! -f \"$REMOTE_DB_DUMP_NAME\" ]; then
            echo \"[ERROR] Dump file not found after rsync: $REMOTE_DB_DUMP_NAME (cwd: \$(pwd))\"
            exit 1
        fi
        echo '[INFO] Waiting for mysql_db to accept connections...'
        i=0
        while [ \$i -lt 90 ]; do
            if \$COMPOSE_CMD -f docker-compose.prod.yml exec -T mysql_db mysqladmin ping -h localhost -uroot -proot_password --silent 2>/dev/null; then
                break
            fi
            i=\$((i + 1))
            sleep 2
        done
        if ! \$COMPOSE_CMD -f docker-compose.prod.yml exec -T mysql_db mysqladmin ping -h localhost -uroot -proot_password --silent 2>/dev/null; then
            echo '[ERROR] mysql_db did not become ready in time.'
            exit 1
        fi
        echo '[INFO] Importing into imbesdb...'
        gunzip -c \"$REMOTE_DB_DUMP_NAME\" | \$COMPOSE_CMD -f docker-compose.prod.yml exec -T mysql_db mysql -uroot -proot_password imbesdb
        echo '[INFO] Restarting api...'
        \$COMPOSE_CMD -f docker-compose.prod.yml restart api >/dev/null 2>&1 || true
    "
    print_success "Remote database import complete"
}

deploy_remote() {
    print_status "Building and deploying containers on remote server..."
    ssh "$REMOTE_USER@$REMOTE_HOST" "set -e
        export PATH=\"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:\$PATH\"
        [ -f \"\$HOME/.profile\" ] && . \"\$HOME/.profile\" >/dev/null 2>&1 || true
        [ -f \"\$HOME/.bashrc\" ] && . \"\$HOME/.bashrc\" >/dev/null 2>&1 || true
        cd '$DEPLOY_DIR'
        COMPOSE_CMD='$REMOTE_COMPOSE_CMD'

        if [ ! -f \"docker-compose.prod.yml\" ]; then
            echo '[ERROR] docker-compose.prod.yml not found on remote server.'
            exit 1
        fi

        echo '[INFO] Selecting HTTPS vhost for county (ecimes)...'
        cp -f ./nginx/https-ecimes.conf ./nginx/https-site.conf

        echo '[INFO] Stopping existing services...'
        \$COMPOSE_CMD -f docker-compose.prod.yml down --remove-orphans || true

        echo '[INFO] Removing old containers...'
        \$COMPOSE_CMD -f docker-compose.prod.yml rm -f || true

        echo '[INFO] Building services (no cache)...'
        \$COMPOSE_CMD -f docker-compose.prod.yml build --no-cache

        echo '[INFO] Starting services...'
        \$COMPOSE_CMD -f docker-compose.prod.yml up -d

        sleep 5
        echo '[INFO] Running containers:'
        \$COMPOSE_CMD -f docker-compose.prod.yml ps
    "
    print_success "Remote deployment completed"
}

setup_https_remote() {
    print_status "Configuring HTTPS for $HTTPS_DOMAIN ..."
    ssh "$REMOTE_USER@$REMOTE_HOST" "set -e
        export PATH=\"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:\$PATH\"
        [ -f \"\$HOME/.profile\" ] && . \"\$HOME/.profile\" >/dev/null 2>&1 || true
        [ -f \"\$HOME/.bashrc\" ] && . \"\$HOME/.bashrc\" >/dev/null 2>&1 || true
        cd '$DEPLOY_DIR'
        COMPOSE_CMD='$REMOTE_COMPOSE_CMD'
        DOMAIN='$HTTPS_DOMAIN'
        EMAIL='$LETSENCRYPT_EMAIL'

        if [ ! -f \"docker-compose.prod.yml\" ]; then
            echo '[ERROR] docker-compose.prod.yml not found on remote server.'
            exit 1
        fi

        mkdir -p ./certbot/www ./certbot/conf/live/\$DOMAIN

        if [ ! -s ./certbot/conf/live/\$DOMAIN/fullchain.pem ] || [ ! -s ./certbot/conf/live/\$DOMAIN/privkey.pem ]; then
            if command -v openssl >/dev/null 2>&1; then
                echo '[INFO] Creating temporary self-signed certificate for first HTTPS boot...'
                openssl req -x509 -nodes -newkey rsa:2048 \
                    -days 2 \
                    -keyout ./certbot/conf/live/\$DOMAIN/privkey.pem \
                    -out ./certbot/conf/live/\$DOMAIN/fullchain.pem \
                    -subj \"/CN=\$DOMAIN\" >/dev/null 2>&1
            else
                echo '[ERROR] openssl not found on remote host (required for bootstrap cert).'
                exit 1
            fi
        fi

        \$COMPOSE_CMD -f docker-compose.prod.yml up -d nginx_proxy

        echo '[INFO] Requesting/renewing Let''s Encrypt certificate...'
        docker run --rm \
            -v \"\$(pwd)/certbot/conf:/etc/letsencrypt\" \
            -v \"\$(pwd)/certbot/www:/var/www/certbot\" \
            certbot/certbot certonly --webroot \
            -w /var/www/certbot \
            -d \$DOMAIN \
            --email \$EMAIL \
            --agree-tos \
            --no-eff-email \
            --non-interactive

        echo '[INFO] Reloading nginx with issued certificate...'
        \$COMPOSE_CMD -f docker-compose.prod.yml restart nginx_proxy
    "
    print_success "HTTPS is configured for https://$HTTPS_DOMAIN/"
}

show_summary() {
    echo
    print_success "Deployment complete"
    echo
    print_status "Application URLs (same docker-compose.prod.yml ports as legacy: 8080, 8443, 5174, 3000):"
    print_status "  - Via DNS/TLS: https://$HTTPS_DOMAIN/admin/ … (or http://$REMOTE_HOST:8080/ … behind nginx)"
    print_status "  - Direct: https://$REMOTE_HOST:8443/  http://$REMOTE_HOST:8080/  citizen SPA: http://$REMOTE_HOST:5174/  API: http://$REMOTE_HOST:3000/"
    echo
    print_status "Useful commands:"
    print_status "  - Deploy dir: $DEPLOY_DIR"
    print_status "  - Logs: ssh $REMOTE_USER@$REMOTE_HOST 'cd $DEPLOY_DIR && ($REMOTE_COMPOSE_CMD $PROD_COMPOSE logs -f)'"
    print_status "  - Restart: ssh $REMOTE_USER@$REMOTE_HOST 'cd $DEPLOY_DIR && ($REMOTE_COMPOSE_CMD $PROD_COMPOSE restart)'"
}

show_help() {
    echo "County Server Deployment Script"
    echo "Usage: $0 [--help|-h|--dry-run] [--sync-db]"
    echo
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --dry-run     Show what would be synced without deploying"
    echo "  --sync-db     After deploy: dump local MySQL (see LOCAL_COMPOSE_FILE), upload,"
    echo "                and import into remote imbesdb (destructive: replaces DB tables)."
    echo
    echo "Configuration:"
    echo "  REMOTE_USER: $REMOTE_USER"
    echo "  REMOTE_HOST: $REMOTE_HOST"
    echo "  REMOTE_DIR:  $REMOTE_DIR"
    echo "  REMOTE_FALLBACK_DIR: $REMOTE_FALLBACK_DIR"
    echo "  HTTPS_DOMAIN: $HTTPS_DOMAIN"
    echo "  LETSENCRYPT_EMAIL: $LETSENCRYPT_EMAIL"
    echo "  LOCAL_COMPOSE_FILE: $LOCAL_COMPOSE_FILE (for --sync-db)"
    echo "  LOCAL_MYSQL_SERVICE: $LOCAL_MYSQL_SERVICE"
}

dry_run() {
    print_status "DRY RUN - showing files that would be synced..."
    print_status "Dry-run target path: $REMOTE_DIR (fallback used only during real deploy)"
    rsync -avz --dry-run --no-group \
        "${RSYNC_EXCLUDES[@]}" \
        "$LOCAL_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
}

main() {
    print_status "Starting county server deployment..."
    print_status "Source: $(pwd)"
    print_status "Primary target:  $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
    print_status "Fallback target: $REMOTE_USER@$REMOTE_HOST:$REMOTE_FALLBACK_DIR"
    if [ "$SYNC_DB" = true ]; then
        print_warning "--sync-db enabled: local MySQL will be dumped and imported on the server after deploy."
    fi
    echo

    check_local_requirements
    test_ssh_connection
    check_remote_docker
    ensure_remote_directory_writable
    cleanup_local_env_files
    sync_files
    cleanup_remote_env_files
    deploy_remote
    setup_https_remote

    if [ "$SYNC_DB" = true ]; then
        DB_DUMP_LOCAL="$(dump_local_mysql)"
        upload_db_dump "$DB_DUMP_LOCAL"
        rm -f "$DB_DUMP_LOCAL"
        remote_import_mysql
    fi

    show_summary
}

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

if [ "$1" = "--dry-run" ]; then
    check_local_requirements
    test_ssh_connection
    dry_run
    exit 0
fi

for arg in "$@"; do
    if [ "$arg" = "--sync-db" ]; then
        SYNC_DB=true
    fi
done

main

