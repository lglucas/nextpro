import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthContext } from '@/contexts/AuthContext'

function promiseWithTimeout<T>(promise: PromiseLike<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms)
    }),
  ])
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('@NextPro:role'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role) {
      localStorage.setItem('@NextPro:role', role)
    } else {
      localStorage.removeItem('@NextPro:role')
    }
  }, [role])

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      const fetchBuilder = supabase.from('profiles').select('role').eq('id', userId).single()

      const { data, error } = (await promiseWithTimeout(fetchBuilder, 5000, 'Timeout ao buscar perfil')) as {
        data: { role: string | null } | null
        error: { code?: string; message: string } | null
      }

      if (error) {
        if (error.code === 'PGRST116') {
          const newProfile = {
            id: userId,
            email: userEmail,
            role: 'user',
            full_name: userEmail?.split('@')[0] || 'Usuário',
          }

          const { error: insertError } = await supabase.from('profiles').insert(newProfile)

          if (insertError) {
            const cachedRole = localStorage.getItem('@NextPro:role')
            return cachedRole || 'user'
          }

          return 'user'
        }

        const cachedRole = localStorage.getItem('@NextPro:role')
        return cachedRole || 'user'
      }

      return data?.role || 'user'
    } catch {
      const cachedRole = localStorage.getItem('@NextPro:role')
      return cachedRole || 'user'
    }
  }

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (!mounted) return

        setSession(data.session)
        setUser(data.session?.user ?? null)

        if (data.session?.user) {
          const userRole = await fetchProfile(data.session.user.id, data.session.user.email)
          if (mounted) setRole(userRole)
        }
      } catch (err: unknown) {
        console.error('AuthProvider: erro ao carregar sessão:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!mounted) return

      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (nextSession?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          const userRole = await fetchProfile(nextSession.user.id, nextSession.user.email)
          if (mounted) setRole(userRole)
        }
      } else if (event === 'SIGNED_OUT') {
        setRole(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setRole(null)
    setSession(null)
    setUser(null)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

          <div className="text-center space-y-2">
            <p className="text-slate-900 font-medium">Carregando NextPro...</p>
            <p className="text-xs text-slate-400">Verificando credenciais e permissões</p>
          </div>

          <button
            onClick={() => {
              supabase.auth.signOut()
              window.location.reload()
            }}
            className="text-xs text-red-500 hover:text-red-700 underline mt-4"
          >
            Demorando muito? Sair e recarregar
          </button>
        </div>
      </div>
    )
  }

  const value = { session, user, role, loading, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
