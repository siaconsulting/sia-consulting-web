import type { CollectionConfig, Field } from 'payload'
import { requestCollectionAccess, requestSubmittedUpdate } from '@/access/submissionAccess'
import { validateAssignedTo, requestAdmin, requestLabels, commonSubmissionFields, workflowFields } from './requests/shared'
import { queueSubmissionNotification } from '@/hooks/queueSubmissionNotification'

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  labels: requestLabels('Demande de contact', 'Demandes de contact'),
  access: requestCollectionAccess,
  admin: requestAdmin(),
  defaultSort: '-submittedAt',
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Informations reçues', fields: [
        ...commonSubmissionFields(),
        { name: 'subject', type: 'text', label: 'Objet', required: true, maxLength: 200, access: { update: requestSubmittedUpdate } },
        { name: 'message', type: 'textarea', label: 'Message', required: true, maxLength: 10000, access: { update: requestSubmittedUpdate } },
      ] as Field[] },
      { label: 'Suivi interne', fields: workflowFields() },
    ] },
  ],
  hooks: { beforeValidate: [validateAssignedTo], afterChange: [queueSubmissionNotification('contact-requests')] },
  timestamps: true,
}
