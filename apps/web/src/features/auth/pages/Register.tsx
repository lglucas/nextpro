import { Link } from 'react-router-dom'

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-100 text-center">
        <h1 className="text-2xl font-bold text-secondary mb-4">Criar Conta</h1>
        <p className="text-slate-500 mb-6">O cadastro de atletas e responsáveis será implementado aqui.</p>
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Voltar para Login
        </Link>
      </div>
    </div>
  )
}
