import { useAuth } from '@/contexts/AuthContext'

export function FinancialBlockedPage() {
  const { signOut } = useAuth()

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Acesso bloqueado</h1>
        <p className="mt-2 text-sm text-slate-600">Sua mensalidade está pendente. Procure a secretaria.</p>
        <div className="mt-6">
          <button type="button" onClick={() => void signOut()} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

