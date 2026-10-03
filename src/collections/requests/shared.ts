import type { CollectionBeforeValidateHook, CollectionConfig, Field } from 'payload'
import { ROLE } from '@/access/roles'
import { requestSubmittedUpdate, requestWorkflowUpdate, requestAdminRead, neverRead, neverUpdate } from '@/access/submissionAccess'
import { canManageRequests } from '@/access/roles'

export const REQUEST_STATUSES = [
  { label: 'Nouvelle', value: 'new' },
  { label: 'Qualifiée', value: 'qualified' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'Convertie', value: 'converted' },
  { label: 'Refusée', value: 'rejected' },
  { label: 'Archivée', value: 'archived' },
] as const

export const REQUEST_SOURCES = [
  { label: 'Site web', value: 'website' },
  { label: 'Administration', value: 'admin' },
  { label: 'Import', value: 'import' },
  { label: 'Intégration', value: 'integration' },
] as const

export const requestLabels = (singular: string, plural: string) => ({ singular, plural })

const protectedSubmission = (field: Field): Field => {
  if (!('name' in field)) return field
  return { ...field, access: { update: requestSubmittedUpdate } } as Field
}

export const commonSubmissionFields = (options: { organizationRequired?: boolean } = {}): Field[] => [
  protectedSubmission({ name: 'name', type: 'text', label: 'Nom', required: true, maxLength: 120 }),
  protectedSubmission({ name: 'email', type: 'email', label: 'Adresse e-mail', required: true }),
  protectedSubmission({ name: 'phone', type: 'text', label: 'Téléphone', maxLength: 32 }),
  protectedSubmission({ name: 'organization', type: 'text', label: 'Organisation', required: options.organizationRequired, maxLength: 180 }),
  protectedSubmission({ name: 'jobTitle', type: 'text', label: 'Fonction', maxLength: 120 }),
  protectedSubmission({ name: 'country', type: 'text', label: 'Pays', maxLength: 100 }),
  protectedSubmission({ name: 'privacyConsent', type: 'checkbox', label: 'Consentement enregistré' }),
  protectedSubmission({ name: 'privacyConsentAt', type: 'date', label: 'Date du consentement' }),
  protectedSubmission({ name: 'privacyNoticeVersion', type: 'text', label: 'Version de la notice', maxLength: 100 }),
]

export const workflowFields = (): Field[] => [
  {
    name: 'status', type: 'select', label: 'Statut', required: true, defaultValue: 'new',
    options: [...REQUEST_STATUSES], access: { update: requestWorkflowUpdate },
  },
  {
    name: 'assignedTo', type: 'relationship', relationTo: 'users', label: 'Responsable commercial',
    admin: { description: 'Attribuable uniquement à un compte ADMIN ou COMMERCIAL.' },
    access: { update: requestWorkflowUpdate },
  },
  {
    name: 'internalNotes', type: 'textarea', label: 'Notes internes', maxLength: 10000,
    access: { update: requestWorkflowUpdate },
  },
  {
    name: 'source', type: 'select', label: 'Origine', required: true, defaultValue: 'admin',
    options: [...REQUEST_SOURCES], admin: { readOnly: true }, access: { update: neverUpdate },
  },
  {
    name: 'submittedAt', type: 'date', label: 'Reçue le', required: true, defaultValue: () => new Date().toISOString(),
    admin: { readOnly: true }, access: { update: neverUpdate },
  },
  {
    name: 'idempotencyKey', type: 'text', unique: true, index: true,
    admin: { hidden: true }, access: { read: neverRead, update: neverUpdate },
  },
  {
    name: 'notificationStatus', type: 'select', label: 'Notification interne', defaultValue: 'pending',
    options: [
      { label: 'En attente', value: 'pending' },
      { label: 'Échec — nouvel essai prévu', value: 'failed' },
      { label: 'Envoyée', value: 'sent' },
    ],
    admin: { readOnly: true }, access: { read: requestAdminRead, update: neverUpdate },
  },
]

export const validateAssignedTo: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  const hasAssignmentInUpdate = Boolean(data && Object.prototype.hasOwnProperty.call(data, 'assignedTo'))
  const candidate = hasAssignmentInUpdate ? data?.assignedTo : originalDoc?.assignedTo
  if (candidate === undefined || candidate === null || candidate === '') return data

  const relationID = typeof candidate === 'object' && candidate !== null && 'id' in candidate
    ? candidate.id
    : candidate
  if (typeof relationID !== 'string' && typeof relationID !== 'number') {
    throw new Error('Le responsable sélectionné est invalide.')
  }

  try {
    const assignedUser = await req.payload.findByID({
      collection: 'users', id: relationID, depth: 0, overrideAccess: true, req,
    })
    if (assignedUser.role !== ROLE.admin && assignedUser.role !== ROLE.commercial) {
      throw new Error('Le responsable doit avoir un rôle ADMIN ou COMMERCIAL.')
    }
  } catch {
    throw new Error('Le responsable doit être un utilisateur ADMIN ou COMMERCIAL existant.')
  }

  return data
}

export const requestAdmin = (): CollectionConfig['admin'] => ({
  group: 'Demandes',
  useAsTitle: 'name',
  defaultColumns: ['submittedAt', 'name', 'organization', 'status', 'assignedTo'],
  hidden: ({ user }) => !canManageRequests(user),
})
