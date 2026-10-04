'use server'

import { executePublicSubmission } from './submissionExecutor'
import { initialSubmissionActionState, type SubmissionActionState } from './submissionState'

export async function submitServiceRequestAction(_previous: SubmissionActionState = initialSubmissionActionState, formData: FormData) {
  return executePublicSubmission('service', formData)
}
