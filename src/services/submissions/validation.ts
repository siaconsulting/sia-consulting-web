export type SubmissionKind = 'contact' | 'service' | 'training'

export type ValidationResult<T> = { success: true; data: T } | { success: false }

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const cleanText = (value: string) => value.trim().replace(/\r\n?/g, '\n')

const readText = (
  input: Record<string, unknown>,
  key: string,
  options: { required?: boolean; maxLength: number } = { maxLength: 1000 },
): ValidationResult<string | undefined> => {
  const raw = input[key]
  if (raw === undefined || raw === null || raw === '') {
    return options.required ? { success: false } : { success: true, data: undefined }
  }
  if (typeof raw !== 'string') return { success: false }
  const value = cleanText(raw)
  if ((options.required && value.length === 0) || value.length > options.maxLength || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) {
    return { success: false }
  }
  return { success: true, data: value || undefined }
}

const textFields = (
  input: Record<string, unknown>,
  definitions: Record<string, { required?: boolean; maxLength: number }>,
): ValidationResult<Record<string, string | undefined>> => {
  const data: Record<string, string | undefined> = {}
  for (const [key, options] of Object.entries(definitions)) {
    const field = readText(input, key, options)
    if (!field.success) return field
    data[key] = field.data
  }
  return { success: true, data }
}

export const readPositiveID = (value: unknown): number | undefined => {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

const commonDefinitions = {
  name: { required: true, maxLength: 120 },
  email: { required: true, maxLength: 254 },
  phone: { maxLength: 32 },
  organization: { maxLength: 180 },
  jobTitle: { maxLength: 120 },
  country: { maxLength: 100 },
} as const

export type CommonSubmission = {
  name: string
  email: string
  phone?: string
  organization?: string
  jobTitle?: string
  country?: string
  privacyConsent?: boolean
  privacyConsentAt?: string
  privacyNoticeVersion?: string
}

export const parseCommonSubmission = (
  value: unknown,
  _now: Date,
  options: { organizationRequired?: boolean } = {},
): ValidationResult<CommonSubmission> => {
  if (!isRecord(value)) return { success: false }
  const parsed = textFields(value, {
    ...commonDefinitions,
    organization: { ...commonDefinitions.organization, required: options.organizationRequired },
  })
  if (!parsed.success) return parsed
  const email = parsed.data.email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false }

  const phone = parsed.data.phone
  if (phone && (!/^[+\d\s().-]+$/.test(phone) || (phone.match(/\d/g)?.length ?? 0) < 6 || (phone.match(/\d/g)?.length ?? 0) > 20)) {
    return { success: false }
  }

  const consent = value.privacyConsent
  if (consent !== undefined && typeof consent !== 'boolean') return { success: false }
  return {
    success: true,
    data: {
      name: parsed.data.name!,
      email: email.toLowerCase(),
      ...(phone ? { phone } : {}),
      ...(parsed.data.organization ? { organization: parsed.data.organization } : {}),
      ...(parsed.data.jobTitle ? { jobTitle: parsed.data.jobTitle } : {}),
      ...(parsed.data.country ? { country: parsed.data.country } : {}),
      ...(consent !== undefined ? { privacyConsent: consent } : {}),
    },
  }
}

export type ContactSubmission = CommonSubmission & { subject: string; message: string }
export type ServiceSubmission = CommonSubmission & {
  service: number
  sector?: number
  need: string
  wantedPeriod?: string
  budget?: string
}
export type TrainingSubmission = CommonSubmission & {
  training?: number
  customTrainingNeed?: string
  participantCount?: number
  preferredFormat?: 'in_person' | 'remote' | 'hybrid' | 'undecided'
  wantedPeriod?: string
  location?: string
  message?: string
}

export const parseContactSubmission = (input: unknown, now: Date): ValidationResult<ContactSubmission> => {
  if (!isRecord(input)) return { success: false }
  const common = parseCommonSubmission(input, now)
  if (!common.success) return common
  const subject = readText(input, 'subject', { required: true, maxLength: 200 })
  const message = readText(input, 'message', { required: true, maxLength: 10000 })
  if (!subject.success || !message.success) return { success: false }
  return { success: true, data: { ...common.data, subject: subject.data!, message: message.data! } }
}

export const parseServiceSubmission = (input: unknown, now: Date): ValidationResult<ServiceSubmission> => {
  if (!isRecord(input)) return { success: false }
  const common = parseCommonSubmission(input, now, { organizationRequired: true })
  if (!common.success) return common
  const need = readText(input, 'need', { required: true, maxLength: 10000 })
  const wantedPeriod = readText(input, 'wantedPeriod', { maxLength: 160 })
  const budget = readText(input, 'budget', { maxLength: 160 })
  const service = readPositiveID(input.service)
  const sector = input.sector === undefined || input.sector === null || input.sector === '' ? undefined : readPositiveID(input.sector)
  if (!need.success || !wantedPeriod.success || !budget.success || !service || (input.sector != null && input.sector !== '' && !sector)) {
    return { success: false }
  }
  return {
    success: true,
    data: {
      ...common.data,
      service,
      ...(sector ? { sector } : {}),
      need: need.data!,
      ...(wantedPeriod.data ? { wantedPeriod: wantedPeriod.data } : {}),
      ...(budget.data ? { budget: budget.data } : {}),
    },
  }
}

const TRAINING_FORMATS = ['in_person', 'remote', 'hybrid', 'undecided'] as const

export const parseTrainingSubmission = (input: unknown, now: Date): ValidationResult<TrainingSubmission> => {
  if (!isRecord(input)) return { success: false }
  const common = parseCommonSubmission(input, now, { organizationRequired: true })
  if (!common.success) return common
  const training = input.training === undefined || input.training === null || input.training === '' ? undefined : readPositiveID(input.training)
  const customTrainingNeed = readText(input, 'customTrainingNeed', { maxLength: 5000 })
  const wantedPeriod = readText(input, 'wantedPeriod', { maxLength: 160 })
  const location = readText(input, 'location', { maxLength: 200 })
  const message = readText(input, 'message', { maxLength: 10000 })
  if ((input.training != null && input.training !== '' && !training) || !customTrainingNeed.success || !wantedPeriod.success || !location.success || !message.success) {
    return { success: false }
  }
  const countValue = input.participantCount
  let participantCount: number | undefined
  if (countValue !== undefined && countValue !== null && countValue !== '') {
    participantCount = typeof countValue === 'number' ? countValue : typeof countValue === 'string' && /^\d+$/.test(countValue) ? Number(countValue) : NaN
    if (!Number.isSafeInteger(participantCount) || participantCount < 1 || participantCount > 10000) return { success: false }
  }
  const format = input.preferredFormat
  if (format !== undefined && format !== null && !TRAINING_FORMATS.includes(format as (typeof TRAINING_FORMATS)[number])) return { success: false }
  if (!training && !customTrainingNeed.data) return { success: false }

  return {
    success: true,
    data: {
      ...common.data,
      ...(training ? { training } : {}),
      ...(customTrainingNeed.data ? { customTrainingNeed: customTrainingNeed.data } : {}),
      ...(participantCount ? { participantCount } : {}),
      ...(format ? { preferredFormat: format as TrainingSubmission['preferredFormat'] } : {}),
      ...(wantedPeriod.data ? { wantedPeriod: wantedPeriod.data } : {}),
      ...(location.data ? { location: location.data } : {}),
      ...(message.data ? { message: message.data } : {}),
    },
  }
}
