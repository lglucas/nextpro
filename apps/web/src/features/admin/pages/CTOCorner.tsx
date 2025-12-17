import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ShieldAlert, Database, Save, Activity, Users, Search, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function CTOCornerPage() {
  const { role, user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'settings' | 'logs' | 'users'>('settings')
  const [logs, setLogs] = useState<any[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [settings, setSettings] = useState<any>({ xp_base: 10, financial_block_days: 5 })

  // Carregar Configurações
  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from('system_settings').select('*')
      if (data) {
        const newSettings = data.reduce((acc: any, curr: any) => ({
          ...acc,
          [curr.key]: curr.value
        }), {})
        setSettings((prev: any) => ({ ...prev, ...newSettings }))
      }
    }
    loadSettings()
  }, [])

  // Carregar Logs
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs()
    }
  }, [activeTab])

  // Carregar Usuários
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

  const fetchLogs = async () => {
    setLoadingLogs(true)
    const { data } = await supabase
      .from('audit_logs')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (data) setLogs(data)
    setLoadingLogs(false)
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    // Nota: Em produção, idealmente usaria uma Edge Function para listar usuários do Auth
    // Aqui listamos da tabela profiles
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setUsers(data)
    setLoadingUsers(false)
  }

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Salva cada configuração
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('system_settings')
          .upsert({ 
            key, 
            value, 
            updated_at: new Date().toISOString(),
            updated_by: currentUser?.id 
          })
      }

      // Log da ação
      await supabase.from('audit_logs').insert({
        actor_id: currentUser?.id,
        action: 'update_settings',
        target: 'System Settings',
        details: settings
      })

      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configurações')
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!confirm(`Tem certeza que deseja alterar o papel deste usuário para ${newRole}?`)) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      await supabase.from('audit_logs').insert({
        actor_id: currentUser?.id,
        action: 'update_user_role',
        target: userId,
        details: { new_role: newRole }
      })

      fetchUsers() // Recarrega lista
    } catch (error) {
      console.error('Erro ao atualizar role:', error)
      alert('Erro ao atualizar permissão')
    }
  }

  // Proteção de Rota
  if (role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Acesso Negado</h1>
        <p className="text-slate-500">Esta área é restrita para o CTO.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cantinho do CTO</h1>
            <p className="text-slate-400 mt-1">
              Painel de Controle Absoluto & Auditoria
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'settings' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Configurações
            </div>
            {activeTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'logs' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Audit Logs
            </div>
            {activeTab === 'logs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'users' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gestão de Usuários
            </div>
            {activeTab === 'users' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
        
        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="p-6 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Variáveis Globais do Sistema</h2>
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">XP Base por Presença</label>
                <p className="text-xs text-slate-500 mb-2">Quanto de XP um atleta ganha ao comparecer a um jogo.</p>
                <input 
                  type="number" 
                  value={settings.xp_base}
                  onChange={e => setSettings({...settings, xp_base: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dias para Bloqueio Financeiro</label>
                <p className="text-xs text-slate-500 mb-2">Dias de tolerância após vencimento antes de bloquear acesso.</p>
                <input 
                  type="number" 
                  value={settings.financial_block_days}
                  onChange={e => setSettings({...settings, financial_block_days: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  type="submit" 
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar Configurações
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="p-0">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-semibold text-slate-700">Últimas 50 Ações</h2>
              <button onClick={fetchLogs} className="text-sm text-primary hover:underline">Atualizar</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Data/Hora</th>
                    <th className="px-6 py-3">Ator</th>
                    <th className="px-6 py-3">Ação</th>
                    <th className="px-6 py-3">Alvo</th>
                    <th className="px-6 py-3">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingLogs ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Carregando logs...</td></tr>
                  ) : logs.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum log encontrado.</td></tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 text-slate-500">
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-900">
                          {log.profiles?.full_name || 'Desconhecido'}
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-600">{log.target}</td>
                        <td className="px-6 py-3 text-slate-500 max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="p-0">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold text-slate-700">Gerenciamento de Usuários</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar usuário..." 
                    className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <button onClick={fetchUsers} className="text-sm text-primary hover:underline">Atualizar</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role Atual</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingUsers ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500">Carregando usuários...</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-slate-900">{u.full_name}</td>
                        <td className="px-6 py-3 text-slate-500">{u.email}</td>
                        <td className="px-6 py-3">
                          <span className={`
                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 
                              u.role === 'partner' ? 'bg-blue-100 text-blue-700' : 
                              'bg-slate-100 text-slate-700'}
                          `}>
                            {u.role === 'super_admin' ? 'Super Admin' : u.role === 'partner' ? 'Sócio' : 'Atleta'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {u.role !== 'super_admin' && (
                              <button 
                                onClick={() => handleUpdateRole(u.id, 'super_admin')}
                                className="text-xs text-purple-600 hover:bg-purple-50 px-2 py-1 rounded"
                              >
                                Promover CTO
                              </button>
                            )}
                            {u.role !== 'partner' && (
                              <button 
                                onClick={() => handleUpdateRole(u.id, 'partner')}
                                className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                              >
                                Promover Sócio
                              </button>
                            )}
                            {u.role !== 'user' && (
                              <button 
                                onClick={() => handleUpdateRole(u.id, 'user')}
                                className="text-xs text-slate-600 hover:bg-slate-50 px-2 py-1 rounded"
                              >
                                Rebaixar Atleta
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
