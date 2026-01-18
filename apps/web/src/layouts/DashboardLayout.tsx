import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  Trophy,
  ShieldAlert,
  UserPlus,
  GraduationCap,
  ClipboardList
} from 'lucide-react'

export function DashboardLayout() {
  const { signOut, user, role, actualRole, roleOverride, setRoleOverride } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const canImpersonate = actualRole === 'super_admin'

  const handlePersonaChange = (nextRole: string) => {
    if (!canImpersonate) return
    if (nextRole === actualRole || nextRole === 'super_admin') {
      setRoleOverride(null)
    } else {
      setRoleOverride(nextRole)
    }

    if (nextRole === 'user') {
      navigate('/app', { replace: true })
      return
    }
    navigate('/dashboard', { replace: true })
  }

  const navigation = [
    { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Escolas', href: '/dashboard/schools', icon: Users, show: role === 'super_admin' },
    { name: 'Alunos', href: '/dashboard/students', icon: UserPlus, show: role === 'school_admin' || role === 'super_admin' || role === 'coach' },
    { name: 'Turmas', href: '/dashboard/classes', icon: GraduationCap, show: role === 'school_admin' || role === 'super_admin' || role === 'coach' },
    { name: 'Pré‑cadastros', href: '/dashboard/pre-cadastros', icon: ClipboardList, show: role === 'school_admin' || role === 'super_admin' },
    // Cantinho do CTO
    { name: 'Cantinho do CTO', href: '/dashboard/settings', icon: ShieldAlert, show: role === 'super_admin', special: true },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Link to="/app" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl text-secondary">NextPro</span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              if (item.show === false) return null
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary/5 text-primary' 
                      : item.special 
                        ? 'text-amber-600 hover:bg-amber-50' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${item.special ? 'text-amber-500' : ''}`} />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {role === 'super_admin'
                    ? 'Super Admin'
                    : role === 'partner'
                      ? 'Sócio'
                      : role === 'school_admin'
                        ? 'Gestor'
                        : 'Usuário'}
                </p>
              </div>
            </div>
            {canImpersonate ? (
              <div className="mb-3 px-2">
                <p className="text-xs font-semibold text-slate-500">Modo de visualização</p>
                <select
                  value={role || 'user'}
                  onChange={(e) => handlePersonaChange(e.target.value)}
                  className="mt-2 w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700"
                >
                  <option value="super_admin">CTO (Super Admin)</option>
                  <option value="partner">Sócio (Partner)</option>
                  <option value="school_admin">Gestor de Escolinha</option>
                  <option value="coach">Professor (Coach)</option>
                  <option value="user">Usuário</option>
                </select>
                {roleOverride ? (
                  <button
                    type="button"
                    onClick={() => handlePersonaChange(actualRole || 'super_admin')}
                    className="mt-2 w-full text-xs text-slate-500 hover:text-slate-700 underline"
                  >
                    Voltar para o meu perfil real
                  </button>
                ) : null}
              </div>
            ) : null}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/app" className="font-bold text-lg text-secondary hover:opacity-80 transition-opacity">
            NextPro
          </Link>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
