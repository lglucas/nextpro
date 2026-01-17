import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { createEmptyPreCadastroDraft } from '@/features/preCadastro/defaults'
import { getMyPreCadastroDraft, insertSchoolSuggestion, upsertMyPreCadastroDraft } from '@/features/preCadastro/api'
import type { PreCadastroDraftData, PreCadastroStatus } from '@/features/preCadastro/types'
import { clearPreCadastroLocalStorage, loadPreCadastroFromLocalStorage, savePreCadastroToLocalStorage } from '@/features/preCadastro/storage'
import { PreCadastroStepper } from '@/features/preCadastro/components/PreCadastroStepper'
import { GuardianStep } from '@/features/preCadastro/components/steps/GuardianStep'
import { SchoolStep } from '@/features/preCadastro/components/steps/SchoolStep'
import { ChildrenStep } from '@/features/preCadastro/components/steps/ChildrenStep'
import { SocioEconomicStep } from '@/features/preCadastro/components/steps/SocioEconomicStep'
import { ConsentStep } from '@/features/preCadastro/components/steps/ConsentStep'

const STEPS = ['Responsável', 'Escolinha', 'Filhos', 'Censo', 'Confirmação']
const CONSENT_VERSION = '2025-12-26-v1'

export function PreCadastroWizard({
  inviteSchool,
}: {
  inviteSchool?: { id: string; uf: string; city: string; name: string } | null
}) {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<PreCadastroStatus>('draft')
  const [draft, setDraft] = useState<PreCadastroDraftData>(() => createEmptyPreCadastroDraft(user?.email))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [botTrap, setBotTrap] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [schoolId, setSchoolId] = useState<string | null>(() => (inviteSchool?.id ? inviteSchool.id : null))
  const startedAtRef = useRef<number>(Date.now())
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

  const canGoBack = step > 0 && status !== 'submitted'
  const canGoNext = step < STEPS.length - 1 && status !== 'submitted'
  const isLast = step === STEPS.length - 1
  const lockSchoolFields = Boolean(inviteSchool?.id && inviteSchool.uf && inviteSchool.city && inviteSchool.name)

  const applyInviteSchool = useCallback(
    (base: PreCadastroDraftData) => {
      if (!inviteSchool) return base
      return {
        ...base,
        school: {
          uf: inviteSchool.uf || base.school.uf,
          city: inviteSchool.city || base.school.city,
          name: inviteSchool.name || base.school.name,
        },
      }
    },
    [inviteSchool],
  )

  const validateStep = useCallback(() => {
    if (step === 0) return draft.guardian.fullName.trim() !== '' && draft.guardian.email.trim() !== ''
    if (step === 1) return draft.school.uf.trim() !== '' && draft.school.city.trim() !== '' && draft.school.name.trim() !== ''
    if (step === 2) return draft.children.length > 0 && draft.children.every((c) => c.fullName.trim() !== '' && c.birthDate !== '')
    if (step === 3) return draft.socio.householdIncomeRange !== '' && draft.socio.housingStatus !== ''
    if (step === 4) return draft.consent.accepted
    return true
  }, [draft, step])

  const statusBadge = useMemo(() => {
    if (status === 'submitted') return { text: 'Enviado', className: 'bg-green-50 text-green-700 border-green-200' }
    return { text: 'Rascunho', className: 'bg-slate-50 text-slate-700 border-slate-200' }
  }, [status])

  const saveDraft = useCallback(
    async (nextStatus: PreCadastroStatus) => {
      if (!user) return
      if (nextStatus === 'submitted' && botTrap.trim() !== '') {
        setError('Não foi possível enviar. Tente novamente.')
        return
      }
      if (nextStatus === 'submitted' && turnstileSiteKey && !turnstileToken) {
        setError('Conclua a verificação antes de enviar.')
        return
      }
      setSaving(true)
      setError(null)
      savePreCadastroToLocalStorage(user.id, draft)

      try {
        if (nextStatus === 'submitted' && turnstileSiteKey && turnstileToken) {
          const { data, error: captchaError } = await supabase.functions.invoke('turnstile-verify', {
            body: { token: turnstileToken },
          })
          if (captchaError || !data?.success) {
            throw new Error('Falha na verificação. Tente novamente.')
          }
        }

        const nowIso = new Date().toISOString()
        const row = await upsertMyPreCadastroDraft(user.id, nextStatus, draft, {
          onboardingStatus: nextStatus === 'submitted' ? 'pendente_escola' : 'draft',
          consentedAt: nextStatus === 'submitted' ? nowIso : null,
          consentVersion: nextStatus === 'submitted' ? CONSENT_VERSION : null,
          schoolId,
          submittedMeta:
            nextStatus === 'submitted'
              ? {
                  userAgent: typeof navigator === 'undefined' ? null : navigator.userAgent,
                  language: typeof navigator === 'undefined' ? null : navigator.language,
                  timezoneOffsetMinutes: new Date().getTimezoneOffset(),
                  submittedAtClient: nowIso,
                  startedAtClient: new Date(startedAtRef.current).toISOString(),
                  durationMs: Date.now() - startedAtRef.current,
                }
              : {},
        })
        setStatus(row.status)
        setSavedAt(new Date().toLocaleString())
        if (nextStatus === 'submitted') {
          await insertSchoolSuggestion(user.id, draft.school)
          clearPreCadastroLocalStorage(user.id)
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao salvar pré‑cadastro'
        setError(message)
      } finally {
        setSaving(false)
      }
    },
    [botTrap, draft, schoolId, turnstileSiteKey, turnstileToken, user],
  )

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)

      const local = loadPreCadastroFromLocalStorage(user.id)
      if (local) {
        setDraft(applyInviteSchool(local))
      } else {
        setDraft(applyInviteSchool(createEmptyPreCadastroDraft(user.email)))
      }
      setSchoolId(inviteSchool?.id || null)

      try {
        const row = await getMyPreCadastroDraft(user.id)
        if (row?.data) {
          setDraft(applyInviteSchool(row.data as unknown as PreCadastroDraftData))
          setStatus(row.status)
          setSchoolId(row.school_id ?? inviteSchool?.id ?? null)
          if (row.status === 'submitted') setStep(STEPS.length - 1)
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao carregar pré‑cadastro'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [applyInviteSchool, inviteSchool?.id, user])

  if (!user) return null

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-600">Carregando seu pré‑cadastro...</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">Censo (pré‑cadastro)</p>
          <p className="text-sm text-slate-600">Preencha com calma. Você pode voltar e continuar depois.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusBadge.className}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <PreCadastroStepper currentStep={step} steps={STEPS} />
      </div>

      {error ? <div className="mt-6 text-sm text-red-600">{error}</div> : null}
      {savedAt ? <div className="mt-2 text-xs text-slate-500">Último salvamento: {savedAt}</div> : null}

      <div className="mt-8">
        {step === 0 ? <GuardianStep value={draft.guardian} onChange={(guardian) => setDraft((d) => ({ ...d, guardian }))} /> : null}
        {step === 1 ? <SchoolStep value={draft.school} onChange={(school) => setDraft((d) => ({ ...d, school }))} disabled={lockSchoolFields} /> : null}
        {step === 2 ? <ChildrenStep value={draft.children} onChange={(children) => setDraft((d) => ({ ...d, children }))} /> : null}
        {step === 3 ? <SocioEconomicStep value={draft.socio} onChange={(socio) => setDraft((d) => ({ ...d, socio }))} /> : null}
        {step === 4 ? (
          <ConsentStep
            accepted={draft.consent.accepted}
            onChange={(accepted) => setDraft((d) => ({ ...d, consent: { accepted } }))}
            botTrap={botTrap}
            onBotTrapChange={setBotTrap}
            turnstileToken={turnstileToken}
            onTurnstileTokenChange={setTurnstileToken}
          />
        ) : null}
      </div>

      <div className="mt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={!canGoBack}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={() => saveDraft('draft')}
            disabled={saving || status === 'submitted'}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar rascunho
          </button>
        </div>

        {isLast ? (
          <button
            type="button"
            onClick={() => saveDraft('submitted')}
            disabled={saving || status === 'submitted' || !validateStep()}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitted' ? 'Enviado' : saving ? 'Enviando...' : 'Enviar'}
          </button>
        ) : (
          <button
            type="button"
            onClick={async () => {
              await saveDraft('draft')
              if (!validateStep()) return
              setStep((s) => Math.min(STEPS.length - 1, s + 1))
            }}
            disabled={saving || !canGoNext || !validateStep()}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Continuar'}
          </button>
        )}
      </div>
    </div>
  )
}
