import type { CollectionAfterChangeHook } from 'payload'

export type SubmissionCollection = 'contact-requests' | 'service-requests' | 'training-requests'

export const queueSubmissionNotification =
  (requestCollection: SubmissionCollection): CollectionAfterChangeHook =>
  async ({ doc, operation, req }) => {
    if (operation !== 'create') return doc

    try {
      await req.payload.jobs.queue({
        task: 'notifySubmission',
        input: { requestCollection, requestID: doc.id },
        overrideAccess: true,
        req,
      })
    } catch {
      // Keep the request committed; the job payload must never contain prospect data.
      req.payload.logger.error({
        msg: 'Could not enqueue incoming request notification.',
        requestCollection,
        requestID: doc.id,
      })
    }

    return doc
  }
