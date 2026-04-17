#!/usr/bin/env bash
# Pull /etc/nginx/sites-available/pmis from the VPS into this repo, edit locally, push back.
# (Same idea as intellinex/deploy/sync-nginx-default-with-vps.sh — host nginx for TLS + proxy to Docker.)
#
# Usage:
#   export VPS_USER=kunye
#   export VPS_HOST=165.22.227.234
#   ./deploy/sync-nginx-pmis-with-vps.sh pull
#   # edit deploy/host-nginx-pmis.vps.conf
#   ./deploy/sync-nginx-pmis-with-vps.sh push
#
# Requires: ssh / scp access to the VPS.
#
# push: ssh -tt allows sudo password on remote. If that fails:
#   VPS_PUSH_SCP_ONLY=1 ./deploy/sync-nginx-pmis-with-vps.sh push

set -euo pipefail
VPS_USER="${VPS_USER:-}"
VPS_HOST="${VPS_HOST:-}"
REMOTE_PATH="${REMOTE_PATH:-/etc/nginx/sites-available/pmis}"
LOCAL_REL="${LOCAL_REL:-deploy/host-nginx-pmis.vps.conf}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCAL_ABS="$ROOT/$LOCAL_REL"

if [[ -z "$VPS_USER" || -z "$VPS_HOST" ]]; then
  echo "Set VPS_USER and VPS_HOST, e.g.:"
  echo "  export VPS_USER=kunye VPS_HOST=165.22.227.234"
  exit 1
fi

case "${1:-}" in
  pull)
    scp "${VPS_USER}@${VPS_HOST}:${REMOTE_PATH}" "$LOCAL_ABS"
    echo "Wrote $LOCAL_REL — edit it, then: $0 push"
    ;;
  push)
    if [[ ! -f "$LOCAL_ABS" ]]; then
      echo "Missing $LOCAL_REL — run pull first."
      exit 1
    fi
    scp "$LOCAL_ABS" "${VPS_USER}@${VPS_HOST}:/tmp/nginx-pmis.updated"
    if [[ "${VPS_PUSH_SCP_ONLY:-}" == "1" ]]; then
      echo ""
      echo "File uploaded to /tmp/nginx-pmis.updated on ${VPS_HOST}."
      echo "Run on the VPS (SSH with a TTY):"
      echo "  sudo cp /tmp/nginx-pmis.updated ${REMOTE_PATH} && sudo nginx -t && sudo systemctl reload nginx && rm -f /tmp/nginx-pmis.updated"
      echo ""
      exit 0
    fi
    ssh -tt "${VPS_USER}@${VPS_HOST}" "sudo cp /tmp/nginx-pmis.updated ${REMOTE_PATH} && sudo nginx -t && sudo systemctl reload nginx && rm -f /tmp/nginx-pmis.updated"
    echo "Deployed to ${REMOTE_PATH} and reloaded nginx."
    ;;
  *)
    echo "Usage: VPS_USER=... VPS_HOST=... $0 pull|push"
    echo "Optional: REMOTE_PATH=/path/on/server (default: /etc/nginx/sites-available/pmis)"
    exit 1
    ;;
esac
