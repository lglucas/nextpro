import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAuditLog } from '@/hooks/useAuditLog'
import { ShieldAlert, Database, Save, Activity } from 'lucide-react'

export function CTOCornerPage() {
  const { role } = useAuth()
  const { logAction } = useAuditLog()
  const [logs, setLogs] = useState<any[]>([]) // Futuro: useQuery para buscar logs reais

  const handleSaveConfig = async () => {
    // Simula salvamento
    await logAction(
      'update_system_config', 
      'Global Settings', 
      { xp_base: 10, financial_block_days: 5 }
    )
    alert('Configurações salvas e log registrado!')
  }

  // Proteção extra (além da rota)
  if (role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Acesso Negado</h1>
        <p className="text-slate-500">Esta área é restrita para o CTO (Você não é o Lucas!).</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
        <div className="p-3 bg-amber-100 rounded-lg">
          <ShieldAlert className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Cantinho do CTO 🛠️</h1>
          <p className="text-amber-700 mt-1">
            Área de perigo. Aqui você tem poderes absolutos sobre a plataforma. 
            Tudo o que você fizer será registrado no Audit Log público.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações Globais */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Variáveis de Sistema
          </h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">XP Base por Presença</label>
              <input type="number" defaultValue={10} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dias para Bloqueio Financeiro</label>
              <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>

            <div className="pt-4">
              <button 
                type="button" 
                onClick={handleSaveConfig}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações (Loggar)
              </button>
            </div>
          </form>
        </div>

        {/* Audit Log Completo */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Histórico Completo de Auditoria
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-500 italic text-center py-8">
              Conectando ao Supabase para buscar logs reais...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
