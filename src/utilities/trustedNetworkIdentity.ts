import { isIP } from 'node:net'

const TRUSTED_PROXY_IP_HEADERS = ['x-real-ip', 'cf-connecting-ip'] as const

export type TrustedProxyIPHeader = (typeof TRUSTED_PROXY_IP_HEADERS)[number]

export function resolveTrustedClientAddress(
  requestHeaders: Pick<Headers, 'get'>,
  options: { nodeEnv?: string; trustedProxyHeader?: string } = {},
): string | null {
  if (options.nodeEnv !== 'production') return '127.0.0.1'

  const configuredHeader = options.trustedProxyHeader?.trim().toLowerCase()
  if (!configuredHeader || !TRUSTED_PROXY_IP_HEADERS.includes(configuredHeader as TrustedProxyIPHeader)) return null

  const address = requestHeaders.get(configuredHeader)?.trim()
  if (!address || address.includes(',') || /\s/.test(address) || isIP(address) === 0) return null

  return address
}
