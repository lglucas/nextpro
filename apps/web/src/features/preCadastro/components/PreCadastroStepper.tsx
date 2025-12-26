export function PreCadastroStepper({
  currentStep,
  steps,
}: {
  currentStep: number
  steps: string[]
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((label, index) => {
        const isActive = index === currentStep
        const isDone = index < currentStep
        const className = isActive
          ? 'bg-slate-900 text-white border-slate-900'
          : isDone
            ? 'bg-white text-slate-900 border-slate-200'
            : 'bg-slate-50 text-slate-500 border-slate-200'

        return (
          <div key={label} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${className}`}>
            {index + 1}. {label}
          </div>
        )
      })}
    </div>
  )
}

