import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useAuditLog() {
  const { user } = useAuth()

  const logAction = async (action: string, target: string, details: object = {}) => {
    if (!user) return

    try {
      const { error } = await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action,
        target,
        details
      })

      if (error) throw error
      console.log(`[Audit] ${action}: ${target}`, details)
    } catch (err) {
      console.error('Falha ao registrar log de auditoria:', err)
      // Não bloqueia a UI se o log falhar, mas avisa no console
    }
  }

  return { logAction }
}
