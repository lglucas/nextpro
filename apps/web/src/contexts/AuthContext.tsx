import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export interface AuthContextType {
  session: Session | null
  user: User | null
  role: string | null
  actualRole: string | null
  roleOverride: string | null
  loading: boolean
  signOut: () => Promise<void>
  setRoleOverride: (next: string | null) => void
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  actualRole: null,
  roleOverride: null,
  loading: true,
  signOut: async () => {},
  setRoleOverride: () => {},
})

export const useAuth = () => useContext(AuthContext)
