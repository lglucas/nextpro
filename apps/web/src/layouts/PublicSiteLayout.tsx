import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, User, X, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV_ITEMS = [
  { label: 'Como Funciona', to: '/como-funciona' },
  { label: 'Projeto', to: '/projeto' },
  { label: 'Para Pais', to: '/pais' },
  { label: 'Para Atletas', to: '/atletas' },
  { label: 'Para Escolinhas', to: '/escolinhas' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contato', to: '/contato' },
]

export function PublicSiteLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut, actualRole, role, roleOverride, setRoleOverride } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const returnTo = useMemo(() => encodeURIComponent(location.pathname + location.search), [location.pathname, location.search])
  const canImpersonate = actualRole === 'super_admin'

  const handlePersonaChange = (nextRole: string) => {
    if (!canImpersonate) return

    if (nextRole === actualRole || nextRole === 'super_admin') {
      setRoleOverride(null)
    } else {
      setRoleOverride(nextRole)
    }

    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)

    if (nextRole === 'user') {
      navigate('/app', { replace: true })
      return
    }

    navigate('/dashboard', { replace: true })
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsUserMenuOpen(false)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [location.pathname])

  const userLabel = useMemo(() => {
    if (!user) return ''
    return user.email || user.id
  }, [user])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-secondary">NextPro</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                  aria-label="Menu do usuário"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 max-w-[220px] truncate">{userLabel}</span>
                </button>

                {isUserMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    <Link
                      to="/app/meu-perfil"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Meu perfil
                    </Link>
                    {canImpersonate ? (
                      <div className="px-4 py-3 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500">Modo de visualização</p>
                        <select
                          value={role || 'user'}
                          onChange={(e) => handlePersonaChange(e.target.value)}
                          className="mt-2 w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700"
                        >
                          <option value="super_admin">CTO (Super Admin)</option>
                          <option value="partner">Sócio (Partner)</option>
                          <option value="school_admin">Gestor de Escolinha</option>
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
                      type="button"
                      onClick={async () => {
                        await signOut()
                        navigate('/', { replace: true })
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                to={`/login?returnTo=${returnTo}`}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Entrar
              </Link>
            )}

            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-50"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Abrir menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'text-primary bg-primary/5' : 'text-slate-700 hover:bg-slate-50',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="pt-2">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/app/meu-perfil"
                      className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    >
                      Meu perfil
                    </Link>
                    {canImpersonate ? (
                      <div className="bg-white border border-slate-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-slate-500">Modo de visualização</p>
                        <select
                          value={role || 'user'}
                          onChange={(e) => handlePersonaChange(e.target.value)}
                          className="mt-2 w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700"
                        >
                          <option value="super_admin">CTO (Super Admin)</option>
                          <option value="partner">Sócio (Partner)</option>
                          <option value="school_admin">Gestor de Escolinha</option>
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
                      type="button"
                      onClick={async () => {
                        await signOut()
                        navigate('/', { replace: true })
                      }}
                      className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to={`/login?returnTo=${returnTo}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                    >
                      Entrar
                    </Link>
                    <Link
                      to={`/register?returnTo=${returnTo}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    >
                      Criar acesso
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-lg text-secondary">NextPro</span>
              </div>
              <p className="text-sm text-slate-600 max-w-md">
                A plataforma que digitaliza a operação da Reglobo Soccer — com organização, consistência e transparência no dia a dia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link className="text-slate-600 hover:text-slate-900" to="/termos">
                Termos
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" to="/privacidade">
                Privacidade
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" to="/blog">
                Blog
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" to="/parceiros">
                Parceiros
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} NextPro. Todos os direitos reservados.</p>
            <Link to="/contato" className="text-xs text-slate-500 hover:text-slate-700">
              Contato institucional
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
