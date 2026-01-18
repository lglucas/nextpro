import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function DashboardIndexPage() {
  const { role } = useAuth()

  if (role === 'coach' || role === 'school_admin') {
    return <Navigate to="/dashboard/operacao" replace />
  }

  return <Navigate to="/dashboard/overview" replace />
}

