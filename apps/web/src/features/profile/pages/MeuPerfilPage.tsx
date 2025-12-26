import { useAuth } from '@/contexts/AuthContext'

export function MeuPerfilPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Meu perfil</h1>
        <p className="mt-2 text-slate-600">Página inicial. Vamos evoluir com dados e preferências.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-900 break-all">{user?.email || '—'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">User ID</p>
            <p className="mt-1 font-semibold text-slate-900 break-all">{user?.id || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

