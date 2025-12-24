import { useState } from 'react'

export function ContatoPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSent, setIsSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSent(true)
  }

  return (
    <div className="bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Contato</h1>
        <p className="mt-4 text-slate-600">Fale com a equipe NextPro pelo canal institucional.</p>

        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {isSent ? (
            <div className="space-y-2">
              <p className="font-semibold text-slate-900">Mensagem enviada.</p>
              <p className="text-sm text-slate-600">Obrigado pelo contato. Retornaremos assim que possível.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nome</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Assunto</label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Mensagem</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Enviar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

