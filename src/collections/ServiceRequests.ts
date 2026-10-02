import type { CollectionConfig, Field } from 'payload'
import { requestCollectionAccess, requestSubmittedUpdate } from '@/access/submissionAccess'
import { validateAssignedTo, requestAdmin, requestLabels, commonSubmissionFields, workflowFields } from './requests/shared'
import { queueSubmissionNotification } from '@/hooks/queueSubmissionNotification'

export const ServiceRequests: CollectionConfig = {
  slug: 'service-requests',
  labels: requestLabels('Demande de prestation', 'Demandes de prestation'),
  access: requestCollectionAccess,
  admin: requestAdmin(),
  defaultSort: '-submittedAt',
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Informations reçues', fields: [
        ...commonSubmissionFields({ organizationRequired: true }),
        { name: 'service', type: 'relationship', relationTo: 'services', label: 'Expertise concernée', required: true, filterOptions: { _status: { equals: 'published' } }, access: { update: requestSubmittedUpdate } },
        { name: 'sector', type: 'relationship', relationTo: 'sectors', label: 'Secteur concerné', filterOptions: { _status: { equals: 'published' } }, access: { update: requestSubmittedUpdate } },
        { name: 'need', type: 'textarea', label: 'Description du besoin', required: true, maxLength: 10000, access: { update: requestSubmittedUpdate } },
        { name: 'wantedPeriod', type: 'text', label: 'Échéance ou période souhaitée', maxLength: 160, access: { update: requestSubmittedUpdate } },
        { name: 'budget', type: 'text', label: 'Budget indicatif (facultatif)', maxLength: 160, access: { update: requestSubmittedUpdate } },
      ] as Field[] },
      { label: 'Suivi interne', fields: workflowFields() },
    ] },
  ],
  hooks: { beforeValidate: [validateAssignedTo], afterChange: [queueSubmissionNotification('service-requests')] },
  timestamps: true,
}
