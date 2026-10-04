import { spawn, type ChildProcess } from 'node:child_process'
import { resolve } from 'node:path'
import type { FullConfig } from '@playwright/test'

const defaultBaseURL = 'http://localhost:3299'
const startupTimeoutMs = 30_000
const requestTimeoutMs = 1_000

function waitForExit(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve()

  return new Promise((resolveExit, rejectExit) => {
    child.once('exit', () => resolveExit())
    child.once('error', rejectExit)
  })
}

export default async function globalSetup(config: FullConfig): Promise<() => Promise<void>> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || config.projects[0]?.use.baseURL || defaultBaseURL
  const serverURL = new URL(typeof baseURL === 'string' ? baseURL : defaultBaseURL)
  const port = serverURL.port || (serverURL.protocol === 'https:' ? '443' : '80')
  const nextCLI = resolve(process.cwd(), 'node_modules/next/dist/bin/next')
  const child = spawn(process.execPath, [nextCLI, 'start', '--port', port], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NODE_OPTIONS: '--no-deprecation',
      SUBMISSION_TRUSTED_PROXY_IP_HEADER: 'x-real-ip',
      SUBMISSION_PRIVACY_CONSENT_REQUIRED: 'false',
      SUBMISSION_PRIVACY_NOTICE_VERSION: '',
      SUBMISSION_PRIVACY_NOTICE_TEXT: '',
      SMTP_HOST: '', SMTP_PORT: '', SMTP_USER: '', SMTP_PASS: '', SMTP_FROM_ADDRESS: '', SMTP_FROM_NAME: '',
      SUBMISSION_NOTIFICATION_TO: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  let output = ''
  const appendOutput = (chunk: Buffer) => {
    output = `${output}${chunk.toString()}`.slice(-6_000)
  }
  child.stdout?.on('data', appendOutput)
  child.stderr?.on('data', appendOutput)

  const startedAt = Date.now()
  let ready = false

  while (!ready && Date.now() - startedAt < startupTimeoutMs) {
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(`Playwright Next.js server exited before becoming ready.\n${output}`)
    }

    try {
      const response = await fetch(serverURL, { signal: AbortSignal.timeout(requestTimeoutMs) })
      ready = response.status < 500
      await response.body?.cancel()
    } catch {
      await new Promise((wait) => setTimeout(wait, 250))
    }
  }

  if (!ready) {
    child.kill()
    await waitForExit(child)
    throw new Error(`Playwright Next.js server did not become ready within ${startupTimeoutMs}ms.\n${output}`)
  }

  return async () => {
    if (child.exitCode !== null || child.signalCode !== null) return

    const exited = waitForExit(child)
    child.kill()
    await exited
  }
}
