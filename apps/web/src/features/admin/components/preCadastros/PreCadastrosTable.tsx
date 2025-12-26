import { Fragment } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { PreCadastroOnboardingStatus, PreRegistrationRow } from '@/features/admin/components/preCadastros/types'
import { extractPreCadastroSummary } from '@/features/admin/components/preCadastros/utils'

const ONBOARDING_LABELS: Record<PreCadastroOnboardingStatus, string> = {
  draft: 'Rascunho',
  pendente_escola: 'Pendente escola',
  aguardando_contrato: 'Aguardando contrato',
  ativo: 'Ativo',
  rejeitado: 'Rejeitado',
}

const ONBOARDING_BADGE_CLASS: Record<PreCadastroOnboardingStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  pendente_escola: 'bg-amber-50 text-amber-700',
  aguardando_contrato: 'bg-blue-50 text-blue-700',
  ativo: 'bg-green-50 text-green-700',
  rejeitado: 'bg-red-50 text-red-700',
}

export function PreCadastrosTable({
  rows,
  loading,
  updatingId,
  expandedId,
  onToggleExpanded,
  onUpdateOnboardingStatus,
}: {
  rows: PreRegistrationRow[]
  loading: boolean
  updatingId: string | null
  expandedId: string | null
  onToggleExpanded: (id: string) => void
  onUpdateOnboardingStatus: (id: string, onboardingStatus: PreCadastroOnboardingStatus) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-3">Atualizado</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Responsável</th>
            <th className="px-6 py-3">Escolinha</th>
            <th className="px-6 py-3">Filhos</th>
            <th className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500">
                Carregando pré‑cadastros...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500">
                Nenhum pré‑cadastro encontrado.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const summary = extractPreCadastroSummary(row)
              const isExpanded = expandedId === row.id
              const onboardingStatus: PreCadastroOnboardingStatus =
                row.onboarding_status && row.onboarding_status in ONBOARDING_LABELS ? row.onboarding_status : row.status === 'submitted' ? 'pendente_escola' : 'draft'
              return (
                <Fragment key={row.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-slate-500">
                      {format(new Date(row.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={[
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit',
                            row.status === 'submitted' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700',
                          ].join(' ')}
                        >
                          {row.status === 'submitted' ? 'Enviado' : 'Rascunho'}
                        </span>

                        {row.status === 'submitted' ? (
                          <span
                            className={[
                              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit',
                              ONBOARDING_BADGE_CLASS[onboardingStatus],
                            ].join(' ')}
                          >
                            {ONBOARDING_LABELS[onboardingStatus]}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-medium text-slate-900">{summary.guardianName || '—'}</div>
                      <div className="text-xs text-slate-500">{summary.guardianEmail || row.user_id}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      <div className="font-medium text-slate-900">{summary.schoolName || '—'}</div>
                      <div className="text-xs text-slate-500">{(summary.city || '—') + (summary.uf ? `/${summary.uf}` : '')}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{summary.childrenCount}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {row.status === 'submitted' ? (
                          <select
                            value={onboardingStatus}
                            onChange={(e) => onUpdateOnboardingStatus(row.id, e.target.value as PreCadastroOnboardingStatus)}
                            disabled={updatingId === row.id}
                            className="text-xs px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-50"
                          >
                            <option value="pendente_escola">Pendente escola</option>
                            <option value="aguardando_contrato">Aguardando contrato</option>
                            <option value="ativo">Ativo</option>
                            <option value="rejeitado">Rejeitado</option>
                          </select>
                        ) : null}

                        <button
                          className="text-xs text-primary hover:bg-primary/5 px-2 py-1 rounded"
                          onClick={() => onToggleExpanded(row.id)}
                        >
                          {isExpanded ? 'Ocultar' : 'Ver'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-slate-50">
                        <div className="grid lg:grid-cols-3 gap-4">
                          <div className="bg-white border border-slate-200 rounded-xl p-4">
                            <p className="text-xs text-slate-500">User ID</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900 break-all">{row.user_id}</p>
                            <p className="mt-3 text-xs text-slate-500">Criado</p>
                            <p className="mt-1 text-sm text-slate-700">
                              {format(new Date(row.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                            <p className="mt-3 text-xs text-slate-500">Enviado</p>
                            <p className="mt-1 text-sm text-slate-700">
                              {row.submitted_at ? format(new Date(row.submitted_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '—'}
                            </p>
                            <p className="mt-3 text-xs text-slate-500">Consentimento</p>
                            <p className="mt-1 text-sm text-slate-700">
                              {row.consented_at ? format(new Date(row.consented_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '—'}
                            </p>
                            <p className="mt-3 text-xs text-slate-500">Versão</p>
                            <p className="mt-1 text-sm text-slate-700">{row.consent_version || '—'}</p>
                          </div>
                          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
                            <p className="text-xs text-slate-500">Payload (json)</p>
                            <pre className="mt-2 text-xs text-slate-700 whitespace-pre-wrap break-words">
                              {JSON.stringify(row.data, null, 2)}
                            </pre>
                            {row.submitted_meta ? (
                              <>
                                <p className="mt-4 text-xs text-slate-500">Meta (json)</p>
                                <pre className="mt-2 text-xs text-slate-700 whitespace-pre-wrap break-words">
                                  {JSON.stringify(row.submitted_meta, null, 2)}
                                </pre>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
