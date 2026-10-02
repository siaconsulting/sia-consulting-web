import type { CollectionConfig, Field } from 'payload'
import { requestCollectionAccess, requestSubmittedUpdate } from '@/access/submissionAccess'
import { validateAssignedTo, requestAdmin, requestLabels, commonSubmissionFields, workflowFields } from './requests/shared'
import { queueSubmissionNotification } from '@/hooks/queueSubmissionNotification'

export const TrainingRequests: CollectionConfig = {
  slug: 'training-requests',
  labels: requestLabels('Demande de formation', 'Demandes de formation'),
  access: requestCollectionAccess,
  admin: requestAdmin(),
  defaultSort: '-submittedAt',
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Informations reçues', fields: [
        ...commonSubmissionFields({ organizationRequired: true }),
        { name: 'training', type: 'relationship', relationTo: 'trainings', label: 'Formation du catalogue', filterOptions: { _status: { equals: 'published' } }, admin: { description: 'Facultatif si le besoin est décrit librement.' }, access: { update: requestSubmittedUpdate } },
        { name: 'customTrainingNeed', type: 'textarea', label: 'Besoin de formation spécifique', maxLength: 5000, access: { update: requestSubmittedUpdate } },
        { name: 'participantCount', type: 'number', label: 'Nombre approximatif de participants', min: 1, max: 10000, access: { update: requestSubmittedUpdate } },
        { name: 'preferredFormat', type: 'select', label: 'Format souhaité', options: [
          { label: 'Présentiel', value: 'in_person' }, { label: 'À distance', value: 'remote' },
          { label: 'Hybride', value: 'hybrid' }, { label: 'À définir', value: 'undecided' },
        ], access: { update: requestSubmittedUpdate } },
        { name: 'wantedPeriod', type: 'text', label: 'Période souhaitée', maxLength: 160, access: { update: requestSubmittedUpdate } },
        { name: 'location', type: 'text', label: 'Lieu souhaité', maxLength: 200, access: { update: requestSubmittedUpdate } },
        { name: 'message', type: 'textarea', label: 'Précisions complémentaires', maxLength: 10000, access: { update: requestSubmittedUpdate } },
      ] as Field[] },
      { label: 'Suivi interne', fields: workflowFields() },
    ] },
  ],
  hooks: { beforeValidate: [validateAssignedTo], afterChange: [queueSubmissionNotification('training-requests')] },
  timestamps: true,
}
