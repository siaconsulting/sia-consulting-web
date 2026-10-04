'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitContact } from '@/actions/submitContact'
import { submitServiceRequestAction } from '@/actions/submitServiceRequest'
import { submitTrainingRequestAction } from '@/actions/submitTrainingRequest'
import { initialSubmissionActionState, submissionMessages, type SubmissionActionState } from '@/actions/submissionState'
import type { SubmissionFormRuntime } from '@/services/submissions/formRuntime'
import type { SubmissionOption } from '@/data/submissionOptions'

type FormSecurityProps = Pick<SubmissionFormRuntime, 'token' | 'idempotencyKey' | 'privacyNoticeText' | 'consentRequired' | 'configurationAvailable'>
type FieldProps = { id: string; label: string; required?: boolean; hint?: string; children: React.ReactNode }

function Field({ id, label, required, hint, children }: FieldProps) {
  return <div className="sia-form-field">
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    {children}
    {hint && <p id={`${id}-hint`} className="sia-form-hint">{hint}</p>}
  </div>
}

function CommonFields({ prefix, organizationRequired = false }: { prefix: string; organizationRequired?: boolean }) {
  return <>
    <Field id={`${prefix}-name`} label="Nom" required><input id={`${prefix}-name`} name="name" autoComplete="name" maxLength={120} required /></Field>
    <Field id={`${prefix}-email`} label="Adresse e-mail" required><input id={`${prefix}-email`} name="email" type="email" autoComplete="email" maxLength={254} required /></Field>
    <Field id={`${prefix}-phone`} label="Téléphone"><input id={`${prefix}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={32} /></Field>
    <Field id={`${prefix}-organization`} label="Organisation" required={organizationRequired}><input id={`${prefix}-organization`} name="organization" autoComplete="organization" maxLength={180} required={organizationRequired} /></Field>
    <Field id={`${prefix}-job-title`} label="Fonction"><input id={`${prefix}-job-title`} name="jobTitle" autoComplete="organization-title" maxLength={120} /></Field>
    <Field id={`${prefix}-country`} label="Pays"><input id={`${prefix}-country`} name="country" autoComplete="country-name" maxLength={100} /></Field>
  </>
}

function ConsentAndProtection({ security }: { security: FormSecurityProps }) {
  return <>
    <div className="sia-form-honeypot" aria-hidden="true">
      <label htmlFor="submission-website">Ne pas remplir ce champ</label>
      <input id="submission-website" name="website" tabIndex={-1} autoComplete="off" />
    </div>
    <input type="hidden" name="submissionToken" value={security.token ?? ''} />
    <input type="hidden" name="idempotencyKey" value={security.idempotencyKey} />
    {security.privacyNoticeText && <fieldset className="sia-consent-fieldset">
      <legend>Confidentialité</legend>
      <label className="sia-consent-label">
        <input type="checkbox" name="privacyConsent" required={security.consentRequired} />
        <span>{security.privacyNoticeText}{security.consentRequired && <span aria-hidden="true"> *</span>}</span>
      </label>
    </fieldset>}
  </>
}

function SubmissionFeedback({ state, pending, formRef }: { state: SubmissionActionState; pending: boolean; formRef: React.RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    if (state.status === 'invalid' || state.status === 'rate-limited' || state.status === 'unavailable') formRef.current?.focus()
  }, [formRef, state.status, state.message])

  if (state.status === 'success') return <div className="sia-form-success" role="status"><h2>Demande reçue</h2><p>{state.message || submissionMessages.success}</p></div>
  return <>
    {pending && <p className="sia-form-pending" role="status">Envoi de votre demande…</p>}
    {state.message && <div ref={formRef} className={`sia-form-feedback sia-form-feedback--${state.status}`} role="alert" tabIndex={-1}>
      <p>{state.message}</p>
    </div>}
  </>
}

function FormUnavailable({ message = submissionMessages.configurationUnavailable }: { message?: string }) {
  return <div className="sia-form-feedback sia-form-feedback--unavailable" role="status"><p>{message}</p></div>
}

export function ContactSubmissionForm({ security }: { security: FormSecurityProps }) {
  const [state, formAction, pending] = useActionState(submitContact, initialSubmissionActionState)
  const feedbackRef = useRef<HTMLDivElement>(null)
  if (!security.configurationAvailable || !security.token) return <FormUnavailable />
  if (state.status === 'success') return <SubmissionFeedback state={state} pending={pending} formRef={feedbackRef} />

  return <form className="sia-public-form" action={formAction}>
    <div className="sia-form-grid"><CommonFields prefix="contact" />
      <Field id="contact-subject" label="Objet" required><input id="contact-subject" name="subject" maxLength={200} required /></Field>
    </div>
    <Field id="contact-message" label="Votre message" required hint="10 000 caractères maximum.">
      <textarea id="contact-message" name="message" rows={7} maxLength={10000} required />
    </Field>
    <ConsentAndProtection security={{ ...security, token: state.formToken ?? security.token }} />
    <SubmissionFeedback state={state} pending={pending} formRef={feedbackRef} />
    <button className="sia-action sia-action--solid sia-form-submit" type="submit" disabled={pending}>
      {pending ? 'Envoi en cours…' : 'Envoyer la demande'} <span aria-hidden="true">→</span>
    </button>
  </form>
}

export function ServiceRequestForm({
  security,
  services,
  sectors,
  selectedService,
}: {
  security: FormSecurityProps
  services: SubmissionOption[]
  sectors: SubmissionOption[]
  selectedService?: string
}) {
  const [state, formAction, pending] = useActionState(submitServiceRequestAction, initialSubmissionActionState)
  const feedbackRef = useRef<HTMLDivElement>(null)
  if (!security.configurationAvailable || !security.token) return <FormUnavailable />
  if (state.status === 'success') return <SubmissionFeedback state={state} pending={pending} formRef={feedbackRef} />

  return <form className="sia-public-form" action={formAction}>
    <div className="sia-form-grid"><CommonFields prefix="service" organizationRequired />
      <Field id="service-choice" label="Expertise concernée" required>
        <select id="service-choice" name="serviceSlug" defaultValue={selectedService ?? ''} required>
          <option value="">Choisir une expertise</option>
          {services.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}
        </select>
      </Field>
      {sectors.length > 0 && <Field id="service-sector" label="Secteur concerné">
        <select id="service-sector" name="sectorSlug" defaultValue=""><option value="">Facultatif</option>{sectors.map((sector) => <option key={sector.slug} value={sector.slug}>{sector.title}</option>)}</select>
      </Field>}
      <Field id="service-period" label="Échéance ou période souhaitée"><input id="service-period" name="wantedPeriod" maxLength={160} /></Field>
      <Field id="service-budget" label="Budget indicatif"><input id="service-budget" name="budget" maxLength={160} /></Field>
    </div>
    <Field id="service-need" label="Description du besoin" required hint="10 000 caractères maximum.">
      <textarea id="service-need" name="need" rows={7} maxLength={10000} required />
    </Field>
    <ConsentAndProtection security={{ ...security, token: state.formToken ?? security.token }} />
    <SubmissionFeedback state={state} pending={pending} formRef={feedbackRef} />
    <button className="sia-action sia-action--solid sia-form-submit" type="submit" disabled={pending}>
      {pending ? 'Envoi en cours…' : 'Envoyer la demande'} <span aria-hidden="true">→</span>
    </button>
  </form>
}

export function TrainingRequestForm({
  security,
  trainings,
  selectedTraining,
}: {
  security: FormSecurityProps
  trainings: SubmissionOption[]
  selectedTraining?: string
}) {
  const [state, formAction, pending] = useActionState(submitTrainingRequestAction, initialSubmissionActionState)
  const feedbackRef = useRef<HTMLDivElement>(null)
  if (!security.configurationAvailable || !security.token) return <FormUnavailable />
  if (state.status === 'success') return <SubmissionFeedback state={state} pending={pending} formRef={feedbackRef} />

  return <form className="sia-public-form" action={formAction}>
    <div className="sia-form-grid"><CommonFields prefix="training" organizationRequired />
      <Field id="training-choice" label="Formation du catalogue">
        <select id="training-choice" name="trainingSlug" defaultValue={selectedTraining ?? ''}>
          <option value="">Aucune formation sélectionnée</option>
          {trainings.map((training) => <option key={training.slug} value={training.slug}>{training.title}</option>)}
        </select>
      </Field>
      <Field id="training-need" label="Besoin de formation spécifique" hint="À renseigner si aucune formation du catalogue ne correspond.">
        <textarea id="training-need" name="customTrainingNeed" rows={4} maxLength={5000} />
      </Field>
      <Field id="training-participants" label="Nombre approximatif de participants"><input id="training-participants" name="participantCount" type="number" min={1} max={10000} step={1} inputMode="numeric" /></Field>
      <Field id="training-format" label="Format souhaité"><select id="training-format" name="preferredFormat" defaultValue=""><option value="">À définir</option><option value="in_person">Présentiel</option><option value="remote">À distance</option><option value="hybrid">Hybride</option><option value="undecided">Sans préférence</option></select></Field>
      <Field id="training-period" label="Période souhaitée"><input id="training-period" name="wantedPeriod" maxLength={160} /></Field>
      <Field id="training-location" label="Lieu souhaité"><input id="training-location" name="location" maxLength={200} /></Field>
    </div>
    <p className="sia-form-hint sia-form-choice-hint">Sélectionnez une formation du catalogue ou décrivez un besoin spécifique.</p>
    <Field id="training-message" label="Précisions complémentaires"><textarea id="training-message" name="message" rows={5} maxLength={10000} /></Field>
    <ConsentAndProtection security={{ ...security, token: state.formToken ?? security.token }} />
    <SubmissionFeedback state={state} pending={pending} formRef={feedbackRef} />
    <button className="sia-action sia-action--solid sia-form-submit" type="submit" disabled={pending}>
      {pending ? 'Envoi en cours…' : 'Envoyer la demande'} <span aria-hidden="true">→</span>
    </button>
  </form>
}
