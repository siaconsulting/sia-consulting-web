#!/usr/bin/env bash
set -Eeuo pipefail

ROOT=/srv/apps/sia-consulting-web
REPOSITORY="$ROOT/repository"
RELEASES="$ROOT/releases"
SHARED="$ROOT/shared"
CURRENT="$ROOT/current"
ENV_FILE="$SHARED/.env"
WEB_UNIT=sia-web.service
WORKER_UNIT=sia-worker.service
PORT=3210
export NODE_ENV=production

fail() { printf 'Deploy stopped: %s\n' "$1" >&2; exit 1; }
[[ "$EUID" -ne 0 ]] || fail 'run as the deployment user, not root.'
[[ -d "$REPOSITORY/.git" ]] || fail "repository checkout missing at $REPOSITORY/repository."
[[ -r "$ENV_FILE" ]] || fail "environment file missing or unreadable: $ENV_FILE."
command -v git >/dev/null || fail 'git is required.'
command -v pnpm >/dev/null || fail 'pnpm is required on PATH.'
command -v node >/dev/null || fail 'Node.js is required on PATH.'
command -v curl >/dev/null || fail 'curl is required for the local health check.'
[[ -z "$(git -C "$REPOSITORY" status --porcelain)" ]] || fail 'repository checkout has local changes; inspect it manually.'

git -C "$REPOSITORY" fetch --prune origin main
COMMIT="$(git -C "$REPOSITORY" rev-parse origin/main)"
[[ "$COMMIT" =~ ^[0-9a-f]{40}$ ]] || fail 'could not resolve origin/main commit.'
RELEASE="$RELEASES/$COMMIT"
mkdir -p "$RELEASES" "$SHARED/media"
[[ ! -e "$RELEASE" ]] || fail "release already exists: $RELEASE (inspect manually)."
mkdir "$RELEASE"
git -C "$REPOSITORY" archive "$COMMIT" | tar -x -C "$RELEASE"
ln -s "$ENV_FILE" "$RELEASE/.env"
ln -s "$SHARED/media" "$RELEASE/public/media"

PREVIOUS=""
if [[ -L "$CURRENT" ]]; then PREVIOUS="$(readlink -f "$CURRENT")"; fi
activate_previous() {
  local status=$?
  if [[ "$status" -ne 0 && -n "$PREVIOUS" ]]; then
    printf 'Release failed; restoring previous code pointer (database is NOT rolled back).\n' >&2
    ln -sfn "$PREVIOUS" "$ROOT/current.rollback"
    mv -Tf "$ROOT/current.rollback" "$CURRENT"
    sudo systemctl restart "$WEB_UNIT" "$WORKER_UNIT" || true
  fi
  exit "$status"
}
trap activate_previous EXIT

cd "$RELEASE"
SIA_ENV_FILE="$ENV_FILE" node scripts/check-production-env.mjs
pnpm install --frozen-lockfile
SIA_ENV_FILE="$ENV_FILE" node scripts/run-with-env.mjs pnpm db:migrate:production
SIA_ENV_FILE="$ENV_FILE" node scripts/run-with-env.mjs pnpm build

mkdir -p "$RELEASE/.next/cache"
chgrp -R sia-runtime "$RELEASE"
chmod -R g+rX "$RELEASE"
chmod -R g+rwX "$RELEASE/.next/cache"
find "$RELEASE/.next/cache" -type d -exec chmod g+s {} +
ln -s "$RELEASE" "$ROOT/current.next"
mv -Tf "$ROOT/current.next" "$CURRENT"
sudo systemctl restart "$WEB_UNIT" "$WORKER_UNIT"
sudo systemctl is-active --quiet "$WEB_UNIT" || fail "$WEB_UNIT did not become active."
sudo systemctl is-active --quiet "$WORKER_UNIT" || fail "$WORKER_UNIT did not become active."
curl --fail --silent --show-error --max-time 15 "http://127.0.0.1:$PORT/" >/dev/null || fail 'local HTTP smoke check failed.'
trap - EXIT
printf 'Release %s is active. Database migrations were not rolled back.\n' "$COMMIT"
