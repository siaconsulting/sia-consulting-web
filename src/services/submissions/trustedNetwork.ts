import 'server-only'

import { headers } from 'next/headers'
import { createSubmissionRequestContext } from './requestContext'
import { resolveTrustedClientAddress } from '@/utilities/trustedNetworkIdentity'

export class SubmissionNetworkConfigurationError extends Error {
  constructor() {
    super('A trusted client network identity is not configured.')
    this.name = 'SubmissionNetworkConfigurationError'
  }
}

export async function createTrustedSubmissionContext() {
  const requestHeaders = await headers()
  const address = resolveTrustedClientAddress(requestHeaders, {
    nodeEnv: process.env.NODE_ENV,
    trustedProxyHeader: process.env.SUBMISSION_TRUSTED_PROXY_IP_HEADER,
  })

  if (!address) throw new SubmissionNetworkConfigurationError()
  return createSubmissionRequestContext(address)
}
