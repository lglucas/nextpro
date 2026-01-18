import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export interface AuthContextType {
  session: Session | null
  user: User | null
  role: string | null
  actualRole: string | null
  roleOverride: string | null
  blocked: boolean
  loading: boolean
  signOut: () => Promise<void>
  refreshBlocked: () => Promise<boolean>
  setRoleOverride: (next: string | null) => void
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  actualRole: null,
  roleOverride: null,
  blocked: false,
  loading: true,
  signOut: async () => {},
  refreshBlocked: async () => false,
  setRoleOverride: () => {},
})

export const useAuth = () => useContext(AuthContext)
