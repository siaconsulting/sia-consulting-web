#!/usr/bin/env bash
set -Eeuo pipefail

BASE_URL="${BASE_URL:-}"
if [[ -z "$BASE_URL" ]]; then
  printf 'Set BASE_URL to the deployed site origin.\n' >&2
  exit 64
fi

node --input-type=module - "$BASE_URL" <<'NODE'
const value = process.argv[2]
let url
try {
  url = new URL(value)
} catch {
  process.stderr.write('BASE_URL must be a valid origin URL.\n')
  process.exit(64)
}

const localHosts = new Set(['localhost', '127.0.0.1', '[::1]'])
if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
  process.stderr.write('BASE_URL must contain only an origin, without credentials, path, query, or fragment.\n')
  process.exit(64)
}
if (url.protocol !== 'https:' && !(url.protocol === 'http:' && localHosts.has(url.hostname))) {
  process.stderr.write('BASE_URL must use HTTPS; HTTP is allowed only for a loopback smoke test.\n')
  process.exit(64)
}
NODE

check_status() {
  local path="$1"
  local expected="$2"
  local status
  status="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --connect-timeout 5 --max-time 15 "$BASE_URL$path")"
  if [[ "$status" != "$expected" ]]; then
    printf 'Smoke check failed: %s returned HTTP %s (expected %s).\n' "$path" "$status" "$expected" >&2
    return 1
  fi
  printf 'HTTP %s %s\n' "$status" "$path"
}

for path in \
  / \
  /expertises \
  /secteurs \
  /formations \
  /publications \
  /etudes-de-cas \
  /ressources \
  /equipe \
  /references \
  /contact \
  /recherche \
  /demande-de-service \
  /demande-de-formation \
  /admin \
  /sitemap.xml \
  /robots.txt
do
  check_status "$path" 200
done

check_status "/__sia_smoke_not_found_$$" 404
printf 'Smoke checks passed. No form was submitted.\n'
