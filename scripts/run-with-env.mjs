#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'

const inheritedEnv = { ...process.env }
const envFile = resolve(process.env.SIA_ENV_FILE || '.env')
if (!existsSync(envFile)) {
  process.stderr.write('Required environment file was not found.\n')
  process.exit(78)
}

const loadedEnv = config({ path: envFile, quiet: true })
if (loadedEnv.error) {
  process.stderr.write('Required environment file could not be read.\n')
  process.exit(78)
}

const cliArgs = process.argv.slice(2)
const databaseOnly = cliArgs[0] === '--database-only'
if (databaseOnly) cliArgs.shift()
const [command, ...args] = cliArgs
if (!command) {
  process.stderr.write('Usage: node scripts/run-with-env.mjs <command> [args...]\n')
  process.exit(64)
}

const databaseEnvironmentKeys = new Set([
  'HOME', 'PATH', 'LANG', 'LC_ALL', 'TMP', 'TMPDIR', 'TEMP', 'USER', 'LOGNAME',
  'SystemRoot', 'WINDIR', 'COMSPEC', 'PATHEXT', 'SSH_AUTH_SOCK',
])
const env = databaseOnly
  ? Object.fromEntries(Object.entries(inheritedEnv).filter(([key]) => databaseEnvironmentKeys.has(key) || key.startsWith('PG')))
  : { ...process.env }
const connectionString = process.env.DATABASE_URL || env.DATABASE_URL
if (!connectionString) {
  process.stderr.write('DATABASE_URL is required for this command.\n')
  process.exit(78)
}

let databaseURL
try {
  databaseURL = new URL(connectionString)
} catch {
  process.stderr.write('DATABASE_URL is invalid.\n')
  process.exit(78)
}
if (!['postgres:', 'postgresql:'].includes(databaseURL.protocol)) {
  process.stderr.write('DATABASE_URL must use PostgreSQL.\n')
  process.exit(78)
}

try {
  env.PGHOST = databaseURL.hostname
  if (databaseURL.port) env.PGPORT = databaseURL.port
  if (databaseURL.username) env.PGUSER = decodeURIComponent(databaseURL.username)
  if (databaseURL.password) env.PGPASSWORD = decodeURIComponent(databaseURL.password)
  if (databaseURL.pathname.length > 1) env.PGDATABASE = decodeURIComponent(databaseURL.pathname.slice(1))
  const sslmode = databaseURL.searchParams.get('sslmode')
  if (sslmode) env.PGSSLMODE = sslmode
} catch {
  process.stderr.write('DATABASE_URL contains invalid encoded credentials.\n')
  process.exit(78)
}

const child = spawn(command, args, { env, stdio: 'inherit', shell: false })
let finished = false
const signalExitCodes = { SIGHUP: 129, SIGINT: 130, SIGTERM: 143 }
const forwardSignal = (signal) => {
  if (child.exitCode === null && child.signalCode === null) child.kill(signal)
}
for (const signal of Object.keys(signalExitCodes)) process.on(signal, forwardSignal)

function finish(code) {
  if (finished) return
  finished = true
  for (const signal of Object.keys(signalExitCodes)) process.off(signal, forwardSignal)
  process.exitCode = code
}

child.on('error', () => {
  process.stderr.write(`Could not start executable: ${command}.\n`)
  finish(127)
})
child.on('exit', (code, signal) => {
  finish(signal ? signalExitCodes[signal] ?? 1 : code ?? 1)
})
