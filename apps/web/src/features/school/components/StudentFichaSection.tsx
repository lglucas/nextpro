type StudentRow = {
  birth_date: string | null
  category: string | null
  active: boolean | null
  blood_type: string | null
  allergies: string | null
  guardian: { full_name: string | null; phone: string | null; email: string | null } | null
}

type Props = {
  student: StudentRow
}

export function StudentFichaSection({ student }: Props) {
  const birthLabel = student.birth_date ? new Date(student.birth_date).toLocaleDateString('pt-BR') : '—'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Ficha do atleta</h2>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Data de nascimento</p>
          <p className="mt-1 font-semibold text-slate-900">{birthLabel}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Categoria</p>
          <p className="mt-1 font-semibold text-slate-900">{student.category || '—'}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p className="mt-1 font-semibold text-slate-900">{student.active ? 'Ativo' : 'Inativo'}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Tipo sanguíneo</p>
          <p className="mt-1 font-semibold text-slate-900">{student.blood_type || '—'}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs text-slate-500">Alergias</p>
        <p className="mt-1 text-sm text-slate-900">{student.allergies || '—'}</p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        <h3 className="text-sm font-bold text-slate-900">Responsável</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Nome</p>
            <p className="mt-1 font-semibold text-slate-900">{student.guardian?.full_name || '—'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Telefone</p>
            <p className="mt-1 font-semibold text-slate-900">{student.guardian?.phone || '—'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-900 break-all">{student.guardian?.email || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

