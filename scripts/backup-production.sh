#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

ROOT=/srv/apps/sia-consulting-web
BACKUP_DIR=/srv/backups/sia-consulting-web
ENV_FILE="$ROOT/shared/.env"
LOG_PREFIX='SIA backup'

fail() { printf '%s: %s\n' "$LOG_PREFIX" "$1" >&2; exit 1; }
[[ "$EUID" -ne 0 ]] || fail 'run as the backup service user, not root.'
[[ -r "$ENV_FILE" ]] || fail 'application environment file is not readable.'
[[ -n "${BACKUP_AGE_RECIPIENT:-}" && "$BACKUP_AGE_RECIPIENT" != *'<'* ]] || fail 'BACKUP_AGE_RECIPIENT is not configured.'
[[ -n "${BACKUP_OFFSITE_TARGET:-}" && "$BACKUP_OFFSITE_TARGET" != *'<'* ]] || fail 'BACKUP_OFFSITE_TARGET is not configured.'
for binary in age rsync pg_dump tar node; do command -v "$binary" >/dev/null || fail "$binary is required."; done
mkdir -p "$BACKUP_DIR"
chmod 0750 "$BACKUP_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DB_TMP="$BACKUP_DIR/$STAMP.postgres.dump.age.tmp"
MEDIA_TMP="$BACKUP_DIR/$STAMP.media.tar.gz.age.tmp"
trap 'rm -f "$DB_TMP" "$MEDIA_TMP"' EXIT

node "$ROOT/current/scripts/run-with-env.mjs" --database-only pg_dump --format=custom --no-owner --no-acl \
  | age --encrypt --recipient "$BACKUP_AGE_RECIPIENT" --output "$DB_TMP"
tar -C "$ROOT/shared" -czf - media \
  | age --encrypt --recipient "$BACKUP_AGE_RECIPIENT" --output "$MEDIA_TMP"
mv "$DB_TMP" "$BACKUP_DIR/$STAMP.postgres.dump.age"
mv "$MEDIA_TMP" "$BACKUP_DIR/$STAMP.media.tar.gz.age"
rsync --archive --protect-args "$BACKUP_DIR/$STAMP.postgres.dump.age" "$BACKUP_DIR/$STAMP.media.tar.gz.age" "$BACKUP_OFFSITE_TARGET/"
find "$BACKUP_DIR" -type f -mtime +14 -delete
printf '%s completed for %s. Encrypted archives copied offsite.\n' "$LOG_PREFIX" "$STAMP"
