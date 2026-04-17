#!/usr/bin/env bash
# Dump kemri_projects from local Docker MySQL (docker-compose.yml mysql_db) and import on remote server.
#
# The main projects table is kemri_projects (not "projects").
#
# Prerequisites:
#   • Local: docker compose up -d mysql_db
#   • Remote: same schema; SSH; MySQL in container `db` (docker-compose.prod.yml)
#
# Usage:
#   export REMOTE_USER=kunye REMOTE_HOST=165.22.227.234 REMOTE_DIR=/projects
#   ./scripts/sync-kemri-projects-to-remote.sh
#
# Optional: TABLE_NAME=kemri_projects DB_NAME=imbesdb SSH_KEY=~/.ssh/id_rsa
#   REMOTE_DOCKER_MYSQL=0  — use mysql -h 127.0.0.1 -P 3307 instead of docker exec db

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOCAL_COMPOSE_FILE="${LOCAL_COMPOSE_FILE:-docker-compose.yml}"
LOCAL_MYSQL_SERVICE="${LOCAL_MYSQL_SERVICE:-mysql_db}"
TABLE_NAME="${TABLE_NAME:-kemri_projects}"
DB_NAME="${DB_NAME:-imbesdb}"
DB_USER="${DB_USER:-impesUser}"
DB_PASSWORD="${DB_PASSWORD:-Admin2010impes}"

REMOTE_USER="${REMOTE_USER:-kunye}"
REMOTE_HOST="${REMOTE_HOST:-165.22.227.234}"
REMOTE_DB_NAME="${REMOTE_DB_NAME:-imbesdb}"
REMOTE_DB_USER="${REMOTE_DB_USER:-impesUser}"
REMOTE_DB_PASSWORD="${REMOTE_DB_PASSWORD:-Admin2010impes}"
REMOTE_DOCKER_MYSQL="${REMOTE_DOCKER_MYSQL:-1}"
SSH_KEY="${SSH_KEY:-}"

DUMP_GZ="kemri_projects_dump.sql.gz"
REMOTE_TMP="/tmp/kemri_projects_dump.sql.gz"

SSH_OPTS=(-o BatchMode=yes -o StrictHostKeyChecking=accept-new)
if [[ -n "${SSH_KEY}" ]]; then
  _k="${SSH_KEY/#\~/$HOME}"
  [[ -f "$_k" ]] && SSH_OPTS+=(-i "$_k")
fi

echo "==> Dumping table ${TABLE_NAME} from local ${LOCAL_MYSQL_SERVICE} (${DB_NAME})..."
if ! docker compose -f "$LOCAL_COMPOSE_FILE" exec -T "$LOCAL_MYSQL_SERVICE" \
  mysqldump -u"$DB_USER" -p"$DB_PASSWORD" \
  --single-transaction --quick --no-tablespaces --set-gtid-purged=OFF \
  --no-create-info --skip-triggers \
  "$DB_NAME" "$TABLE_NAME" | gzip > "$ROOT/$DUMP_GZ"; then
  echo "ERROR: mysqldump failed. Is mysql_db up? Does ${TABLE_NAME} exist?" >&2
  exit 1
fi

if [[ ! -s "$ROOT/$DUMP_GZ" ]]; then
  echo "ERROR: dump is empty." >&2
  exit 1
fi

echo "==> Wrote $DUMP_GZ ($(du -h "$ROOT/$DUMP_GZ" | awk '{print $1}'))"
echo "==> Uploading to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_TMP}"
scp "${SSH_OPTS[@]}" "$ROOT/$DUMP_GZ" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_TMP}"

echo "==> Importing on remote (DELETE all rows in ${TABLE_NAME}, then load dump)..."
ssh "${SSH_OPTS[@]}" "${REMOTE_USER}@${REMOTE_HOST}" bash -s -- \
  "$REMOTE_TMP" "$REMOTE_DB_NAME" "$REMOTE_DB_USER" "$REMOTE_DB_PASSWORD" "$REMOTE_DOCKER_MYSQL" "$TABLE_NAME" << 'REMOTE_SCRIPT'
set -euo pipefail
REMOTE_TMP="$1"
REMOTE_DB_NAME="$2"
REMOTE_DB_USER="$3"
REMOTE_DB_PASSWORD="$4"
REMOTE_DOCKER_MYSQL="$5"
TABLE_NAME="$6"

run_mysql() {
  if [[ "$REMOTE_DOCKER_MYSQL" == "1" ]]; then
    docker exec -i db mysql -u"$REMOTE_DB_USER" -p"$REMOTE_DB_PASSWORD" "$REMOTE_DB_NAME"
  else
    mysql -h 127.0.0.1 -P 3307 -u"$REMOTE_DB_USER" -p"$REMOTE_DB_PASSWORD" "$REMOTE_DB_NAME"
  fi
}

gunzip -c "$REMOTE_TMP" > /tmp/kemri_projects_data.sql

echo "[remote] Clearing ${TABLE_NAME}..."
run_mysql <<SQL
SET FOREIGN_KEY_CHECKS=0;
DELETE FROM \`${TABLE_NAME}\`;
SET FOREIGN_KEY_CHECKS=1;
SQL

echo "[remote] Loading data..."
run_mysql < /tmp/kemri_projects_data.sql

rm -f /tmp/kemri_projects_data.sql "$REMOTE_TMP"
echo "[remote] Done."
REMOTE_SCRIPT

echo "==> Complete. Local archive: $ROOT/$DUMP_GZ"
echo "    (remove the .gz if you do not want it in the repo directory)"
