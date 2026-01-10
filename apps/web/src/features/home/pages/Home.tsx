import { Trophy, Calendar, User, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Olá, {user?.user_metadata?.full_name || 'Atleta'}! 👋
            </h1>
            <p className="text-slate-600">
              Bem-vindo ao NextPro. Aqui você acompanha sua evolução no futebol.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Agendar Treino
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Próximo Jogo</h3>
          <p className="text-sm text-slate-500 mb-4">Sábado, 14:00 vs Eagles FC</p>
          <Link to="#" className="text-sm text-blue-600 font-medium flex items-center hover:underline">
            Ver detalhes <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Frequência</h3>
          <p className="text-sm text-slate-500 mb-4">Você compareceu a 8/10 treinos</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Meu Perfil</h3>
          <p className="text-sm text-slate-500 mb-4">Atualize suas estatísticas</p>
          <Link to="/app/meu-perfil" className="text-sm text-purple-600 font-medium flex items-center hover:underline">
            Editar perfil <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
