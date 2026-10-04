#!/usr/bin/env node
import process from 'node:process'
import { config } from 'dotenv'

config({ path: process.env.SIA_ENV_FILE || '.env', quiet: true })

const required = [
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SERVER_URL',
  'REVALIDATION_SECRET',
  'PREVIEW_SECRET',
]
const missing = required.filter((key) => !process.env[key]?.trim() || process.env[key]?.includes('<'))
const errors = []
const formsReady = process.argv.includes('--forms-ready')

if (missing.length) errors.push(`Missing or placeholder values: ${missing.join(', ')}`)
if (process.env.NEXT_PUBLIC_SERVER_URL !== 'https://siaconsulting.fr') {
  errors.push('NEXT_PUBLIC_SERVER_URL must be the final canonical HTTPS origin before production build.')
}
if (formsReady && process.env.SUBMISSION_TRUSTED_PROXY_IP_HEADER?.toLowerCase() !== 'x-real-ip') {
  errors.push('This deployment pack configures Nginx to overwrite X-Real-IP; set the matching trusted header.')
}
if (formsReady && !['true', 'false'].includes(process.env.SUBMISSION_PRIVACY_CONSENT_REQUIRED || '')) {
  errors.push('SUBMISSION_PRIVACY_CONSENT_REQUIRED must be explicitly true or false before forms are opened.')
}
if (formsReady && process.env.SUBMISSION_PRIVACY_CONSENT_REQUIRED === 'true') {
  for (const name of ['SUBMISSION_PRIVACY_NOTICE_VERSION', 'SUBMISSION_PRIVACY_NOTICE_TEXT']) {
    if (!process.env[name]?.trim() || process.env[name]?.includes('<')) errors.push(`${name} is required when consent is enabled.`)
  }
}
const smtpVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_ADDRESS', 'SMTP_FROM_NAME']
const smtpConfigured = smtpVars.some((name) => Boolean(process.env[name]?.trim()))
if (formsReady && !smtpConfigured) errors.push('SMTP must be configured before public forms are opened.')
if (smtpConfigured || formsReady) {
  for (const name of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_FROM_ADDRESS', 'SMTP_FROM_NAME']) {
    if (!process.env[name]?.trim() || process.env[name]?.includes('<')) errors.push(`${name} is required for configured SMTP.`)
  }
  if (!/^[1-9]\d*$/.test(process.env.SMTP_PORT || '')) errors.push('SMTP_PORT must be a positive integer.')
  if (Number(process.env.SMTP_PORT) > 65535) errors.push('SMTP_PORT must not exceed 65535.')
  if (Boolean(process.env.SMTP_USER?.trim()) !== Boolean(process.env.SMTP_PASS?.trim())) errors.push('Set both SMTP_USER and SMTP_PASS, or neither.')
  for (const name of ['SMTP_USER', 'SMTP_PASS']) {
    if (process.env[name]?.includes('<')) errors.push(`${name} still contains a placeholder.`)
  }
  if (process.env.SMTP_SECURE && !['true', 'false'].includes(process.env.SMTP_SECURE)) errors.push('SMTP_SECURE must be true or false.')
  if (formsReady && !['true', 'false'].includes(process.env.SMTP_SECURE || '')) errors.push('Set SMTP_SECURE explicitly before opening forms.')
  for (const name of ['SMTP_FROM_ADDRESS']) {
    if (process.env[name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env[name])) errors.push(`${name} must be a valid email address.`)
  }
}
if (formsReady && (!process.env.SUBMISSION_NOTIFICATION_TO?.trim() || process.env.SUBMISSION_NOTIFICATION_TO.includes('<'))) {
  errors.push('SUBMISSION_NOTIFICATION_TO must be configured before forms are opened.')
}
if (process.env.SUBMISSION_NOTIFICATION_TO && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.SUBMISSION_NOTIFICATION_TO)) {
  errors.push('SUBMISSION_NOTIFICATION_TO must be a valid email address.')
}
if (formsReady && (!process.env.SUBMISSION_RATE_LIMIT_SECRET?.trim() || process.env.SUBMISSION_RATE_LIMIT_SECRET.includes('<'))) {
  errors.push('A dedicated SUBMISSION_RATE_LIMIT_SECRET is required before forms are opened.')
}
for (const name of ['PAYLOAD_SECRET', 'REVALIDATION_SECRET', 'PREVIEW_SECRET', 'SUBMISSION_RATE_LIMIT_SECRET']) {
if (process.env[name] && !process.env[name].includes('<') && Buffer.byteLength(process.env[name]) < 32) {
    errors.push(`${name} must contain at least 32 bytes.`)
  }
}
try {
  const databaseURL = new URL(process.env.DATABASE_URL || '')
  if (!['postgres:', 'postgresql:'].includes(databaseURL.protocol)) errors.push('DATABASE_URL must use PostgreSQL.')
  if (!databaseURL.username || !databaseURL.password || databaseURL.pathname.length < 2) {
    errors.push('DATABASE_URL must include the dedicated database user, password and database name.')
  }
  if (databaseURL.hostname !== '127.0.0.1' && databaseURL.hostname !== 'localhost') {
    errors.push('This single-host pack expects PostgreSQL on localhost; review networking before changing it.')
  }
} catch {
  errors.push('DATABASE_URL is not a valid URL.')
}

if (errors.length) {
  process.stderr.write(`Production environment check failed:\n- ${errors.join('\n- ')}\n`)
  process.exit(1)
}
process.stdout.write('Production environment check passed (values were not printed).\n')
