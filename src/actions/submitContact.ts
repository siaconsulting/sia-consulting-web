'use server'

import { executePublicSubmission } from './submissionExecutor'
import { initialSubmissionActionState, type SubmissionActionState } from './submissionState'

export async function submitContact(_previous: SubmissionActionState = initialSubmissionActionState, formData: FormData) {
  return executePublicSubmission('contact', formData)
}
