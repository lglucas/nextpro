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
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Função auxiliar para buscar o perfil
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.warn('AuthContext: Perfil não encontrado ou erro:', error.message)
        return null
      }
      return data?.role || 'user'
    } catch (err) {
      console.error('AuthContext: Erro ao buscar perfil:', err)
      return null
    }
  }

  useEffect(() => {
    console.log('AuthContext: Inicializando...')
    
    // Busca sessão inicial
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('AuthContext: Erro ao buscar sessão:', error)
      } else {
        console.log('AuthContext: Sessão encontrada:', session ? 'Sim' : 'Não')
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const userRole = await fetchProfile(session.user.id)
          setRole(userRole)
        }
      }
      setLoading(false)
    }).catch(err => {
      console.error('AuthContext: Erro crítico:', err)
      setLoading(false)
    })

    // Escuta mudanças de auth (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthContext: Mudança de estado:', _event)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Se acabou de logar, busca a role
        const userRole = await fetchProfile(session.user.id)
        setRole(userRole)
      } else {
        setRole(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setRole(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Carregando NextPro...</p>
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
