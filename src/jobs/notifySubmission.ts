import type { Payload, SendEmailOptions, TaskConfig } from 'payload'
import type { SubmissionCollection } from '@/hooks/queueSubmissionNotification'

type SubmissionEmail = {
  name: string
  email: string
  phone?: string | null
  organization?: string | null
  country?: string | null
  subject?: string | null
  message?: string | null
  need?: string | null
  budget?: string | null
  wantedPeriod?: string | null
  trainingTitle?: string
  customTrainingNeed?: string | null
  participantCount?: number | null
  preferredFormat?: string | null
  location?: string | null
}

export const buildSubmissionEmail = (collection: SubmissionCollection, request: SubmissionEmail): SendEmailOptions => {
  const requestType = collection === 'contact-requests' ? 'Demande de contact' :
    collection === 'service-requests' ? 'Demande de prestation' : 'Demande de formation'
  const details = [
    `Type : ${requestType}`,
    `Nom : ${request.name}`,
    `E-mail : ${request.email}`,
    request.phone ? `Téléphone : ${request.phone}` : undefined,
    request.organization ? `Organisation : ${request.organization}` : undefined,
    request.country ? `Pays : ${request.country}` : undefined,
    request.subject ? `Objet : ${request.subject}` : undefined,
    request.trainingTitle ? `Formation : ${request.trainingTitle}` : undefined,
    request.customTrainingNeed ? `Besoin de formation : ${request.customTrainingNeed}` : undefined,
    request.participantCount ? `Participants : ${request.participantCount}` : undefined,
    request.preferredFormat ? `Format : ${request.preferredFormat}` : undefined,
    request.location ? `Lieu : ${request.location}` : undefined,
    request.need ? `Besoin :\n${request.need}` : undefined,
    request.wantedPeriod ? `Période souhaitée : ${request.wantedPeriod}` : undefined,
    request.budget ? `Budget indicatif : ${request.budget}` : undefined,
    request.message ? `Message :\n${request.message}` : undefined,
  ].filter((line): line is string => Boolean(line))

  return { to: '', subject: `Nouvelle demande reçue — ${requestType}`, text: details.join('\n\n') }
}

const loadSubmission = async (payload: Payload, collection: SubmissionCollection, requestID: number) => {
  switch (collection) {
    case 'contact-requests':
      return payload.findByID({ collection, id: requestID, depth: 0, overrideAccess: true })
    case 'service-requests':
      return payload.findByID({ collection, id: requestID, depth: 0, overrideAccess: true })
    case 'training-requests':
      return payload.findByID({ collection, id: requestID, depth: 0, overrideAccess: true })
  }
}

export const sendSubmissionNotification = async (
  payload: Payload,
  collection: SubmissionCollection,
  requestID: number,
  delivery: { recipient?: string; sendEmail?: (message: SendEmailOptions) => Promise<unknown> } = {},
): Promise<boolean> => {
  const request = await loadSubmission(payload, collection, requestID)
  if (request.notificationStatus === 'sent') return false

  try {
    const recipient = delivery.recipient ?? process.env.SUBMISSION_NOTIFICATION_TO?.trim()
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      throw new Error('Invalid notification destination.')
    }
    if (!delivery.sendEmail && payload.email.name === 'console') {
      throw new Error('A production Payload email adapter is not configured.')
    }

    let trainingTitle: string | undefined
    if (collection === 'training-requests' && 'training' in request && request.training) {
      const trainingID = typeof request.training === 'object' ? request.training.id : request.training
      const training = await payload.findByID({ collection: 'trainings', id: trainingID, depth: 0, overrideAccess: true })
      trainingTitle = training.title
    }

    const message = buildSubmissionEmail(collection, { ...request, trainingTitle })
    if (delivery.sendEmail) await delivery.sendEmail({ ...message, to: recipient })
    else await payload.sendEmail({ ...message, to: recipient })

    await payload.update({
      collection,
      id: requestID,
      data: { notificationStatus: 'sent' } as never,
      overrideAccess: true,
    })
    return true
  } catch {
    await payload.update({
      collection,
      id: requestID,
      data: { notificationStatus: 'failed' } as never,
      overrideAccess: true,
    }).catch(() => undefined)
    // Do not propagate transport/provider details, which may contain private configuration.
    throw new Error('Submission notification delivery failed.')
  }
}

type NotificationTaskShape = {
  input: { requestCollection: SubmissionCollection; requestID: number }
  output: { sent: boolean }
}

export const notifySubmissionTask: TaskConfig<NotificationTaskShape> = {
  slug: 'notifySubmission',
  label: 'Notifier SIA d’une nouvelle demande',
  concurrency: ({ input }) => `${input.requestCollection}:${input.requestID}`,
  retries: { attempts: 3, backoff: { delay: 60_000, type: 'exponential' } },
  inputSchema: [
    {
      name: 'requestCollection', type: 'select', required: true,
      options: [
        { label: 'Demande de contact', value: 'contact-requests' },
        { label: 'Demande de prestation', value: 'service-requests' },
        { label: 'Demande de formation', value: 'training-requests' },
      ],
    },
    { name: 'requestID', type: 'number', required: true },
  ],
  outputSchema: [{ name: 'sent', type: 'checkbox', required: true }],
  handler: async ({ input, req }) => {
    const sent = await sendSubmissionNotification(req.payload, input.requestCollection, input.requestID)
    return { output: { sent } }
  },
}
