export type SubmissionActionStatus = 'idle' | 'success' | 'invalid' | 'rate-limited' | 'unavailable'

export type SubmissionActionState = {
  status: SubmissionActionStatus
  message?: string
  formToken?: string
}

export const initialSubmissionActionState: SubmissionActionState = { status: 'idle' }

export const submissionMessages = {
  success: 'Votre demande a bien été reçue.',
  invalid: 'Vérifiez les informations indiquées, puis réessayez.',
  rateLimited: 'Trop de tentatives ont été effectuées. Réessayez plus tard.',
  unavailable: 'Le formulaire est momentanément indisponible. Réessayez plus tard.',
  configurationUnavailable: 'Ce formulaire n’est pas encore configuré pour recevoir des demandes.',
} as const
