import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  role: string | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(() => {
    // Tenta recuperar do localStorage na inicialização
    return localStorage.getItem('@NextPro:role')
  })
  const [loading, setLoading] = useState(true)

  // Atualiza localStorage sempre que role mudar
  useEffect(() => {
    if (role) {
      localStorage.setItem('@NextPro:role', role)
    } else {
      localStorage.removeItem('@NextPro:role')
    }
  }, [role])

  // Função auxiliar para buscar o perfil com timeout e self-healing
  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log('AuthContext: Buscando perfil para', userId)
      
      // Promise race para timeout de 5 segundos
      const fetchPromise = supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao buscar perfil')), 5000)
      )

      const result: any = await Promise.race([fetchPromise, timeoutPromise])
      const { data, error } = result

      if (error) {
        // Se o erro for "Row not found" (PGRST116), tenta criar o perfil (Self-healing)
        if (error.code === 'PGRST116') {
          console.warn('AuthContext: Perfil não encontrado. Tentando criar perfil padrão...')
          
          const newProfile = {
            id: userId,
            email: userEmail,
            role: 'user', // Default role
            full_name: userEmail?.split('@')[0] || 'Usuário'
          }

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile)

          if (insertError) {
            console.error('AuthContext: Falha ao criar perfil automático:', insertError)
            return 'user' // Fallback seguro
          }

          console.log('AuthContext: Perfil criado automaticamente!')
          return 'user'
        }
        
        console.warn('AuthContext: Erro genérico ao buscar perfil:', error.message)
        // Se já temos um role em memória/storage, prefira manter ele em caso de erro temporário
        const cachedRole = localStorage.getItem('@NextPro:role')
        return cachedRole || 'user' 
      }
      
      return data?.role || 'user'
    } catch (err) {
      console.error('AuthContext: Erro crítico ao buscar perfil:', err)
      const cachedRole = localStorage.getItem('@NextPro:role')
      return cachedRole || 'user'
    }
  }

  useEffect(() => {
    let mounted = true
    console.log('AuthContext: Inicializando...')
    
    // Função unificada de carga
    const loadSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const userRole = await fetchProfile(session.user.id, session.user.email)
            if (mounted) setRole(userRole)
          }
        }
      } catch (err) {
        console.error('AuthContext: Erro ao carregar sessão:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSession()

    // Escuta mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthContext: Mudança de estado:', _event)
      
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Só busca perfil se for login ou token refresh
          if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || _event === 'INITIAL_SESSION') {
             const userRole = await fetchProfile(session.user.id, session.user.email)
             setRole(userRole)
          }
        } else if (_event === 'SIGNED_OUT') {
          setRole(null)
        }
        
        setLoading(false)
      }
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

  // Tela de Loading com Botão de Emergência
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

  return (
    <AuthContext.Provider value={{ session, user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
