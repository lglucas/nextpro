import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Trophy, LogOut, LayoutDashboard, User } from 'lucide-react'

export function AppLayout() {
  const { signOut, user, role } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const canAccessDashboard = role === 'super_admin' || role === 'partner' || role === 'school_admin' || role === 'coach'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/app" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-xl text-secondary">NextPro</span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Admin Dashboard Link - Only for Admins/Partners */}
              {canAccessDashboard && (
                <Link 
                  to="/dashboard" 
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Área Administrativa
                </Link>
              )}

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.user_metadata?.full_name?.split(' ')[0]}
                  </p>
                  <p className="text-xs text-slate-500">
                    {role === 'user'
                      ? 'Atleta'
                      : role === 'super_admin'
                        ? 'Super Admin'
                        : role === 'partner'
                          ? 'Sócio'
                          : 'Gestor'}
                  </p>
                </div>
                
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <User className="w-5 h-5" />
                </div>

                <button 
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
