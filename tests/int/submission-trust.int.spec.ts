import { afterEach, describe, expect, it } from 'vitest'
import { getSubmissionConsentConfiguration } from '@/services/submissions/formRuntime'
import { resolveTrustedClientAddress } from '@/utilities/trustedNetworkIdentity'

const original = {
  required: process.env.SUBMISSION_PRIVACY_CONSENT_REQUIRED,
  version: process.env.SUBMISSION_PRIVACY_NOTICE_VERSION,
  text: process.env.SUBMISSION_PRIVACY_NOTICE_TEXT,
}

afterEach(() => {
  for (const [key, value] of Object.entries({
    SUBMISSION_PRIVACY_CONSENT_REQUIRED: original.required,
    SUBMISSION_PRIVACY_NOTICE_VERSION: original.version,
    SUBMISSION_PRIVACY_NOTICE_TEXT: original.text,
  })) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})

describe('public submission trust configuration', () => {
  it('uses loopback only in local/test runtimes and ignores forwarded headers there', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.50' })
    expect(resolveTrustedClientAddress(headers, { nodeEnv: 'development' })).toBe('127.0.0.1')
    expect(resolveTrustedClientAddress(headers, { nodeEnv: 'test' })).toBe('127.0.0.1')
  })

  it('fails closed in production unless an approved single-address proxy header is configured', () => {
    const spoofed = new Headers({ 'x-forwarded-for': '203.0.113.50', 'x-real-ip': '198.51.100.4' })
    expect(resolveTrustedClientAddress(spoofed, { nodeEnv: 'production' })).toBeNull()
    expect(resolveTrustedClientAddress(spoofed, { nodeEnv: 'production', trustedProxyHeader: 'x-forwarded-for' })).toBeNull()
    expect(resolveTrustedClientAddress(spoofed, { nodeEnv: 'production', trustedProxyHeader: 'x-real-ip' })).toBe('198.51.100.4')
    expect(resolveTrustedClientAddress(new Headers({ 'x-real-ip': '198.51.100.4, 203.0.113.2' }), { nodeEnv: 'production', trustedProxyHeader: 'x-real-ip' })).toBeNull()
    expect(resolveTrustedClientAddress(new Headers({ 'x-real-ip': 'not-an-ip' }), { nodeEnv: 'production', trustedProxyHeader: 'x-real-ip' })).toBeNull()
  })

  it('requires a configured notice version and copy only when consent is mandatory', () => {
    process.env.SUBMISSION_PRIVACY_CONSENT_REQUIRED = 'true'
    delete process.env.SUBMISSION_PRIVACY_NOTICE_VERSION
    delete process.env.SUBMISSION_PRIVACY_NOTICE_TEXT
    expect(getSubmissionConsentConfiguration()).toMatchObject({ required: true, configured: false, available: false, text: null })

    process.env.SUBMISSION_PRIVACY_NOTICE_VERSION = 'notice-test-v1'
    process.env.SUBMISSION_PRIVACY_NOTICE_TEXT = 'Texte approuvé de test.'
    expect(getSubmissionConsentConfiguration()).toMatchObject({ required: true, configured: true, available: true, version: 'notice-test-v1', text: 'Texte approuvé de test.' })
  })
})
