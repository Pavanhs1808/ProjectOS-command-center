import { Check } from 'lucide-react'
import { useApp } from '../../context/AppProvider'
import { cn } from '../../lib/cn'
import type { Phase } from '../../types'

export function PhaseProgress({ phases }: { phases: Phase[] }) {
  const { openModal } = useApp()

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[720px] items-start">
        {phases.map((phase, index) => {
          const done = phase.status === 'completed'
          const current = phase.status === 'in_progress'
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => openModal({ type: 'phase', phaseId: phase.id })}
              className="group relative flex flex-1 flex-col items-center text-center"
            >
              {index < phases.length - 1 ? (
                <span
                  className={cn(
                    'absolute top-3 left-1/2 h-px w-full',
                    done ? 'bg-accent' : 'bg-border',
                  )}
                />
              ) : null}
              <span
                className={cn(
                  'relative z-[1] flex h-6 w-6 items-center justify-center rounded-full border text-[11px] transition-colors',
                  done && 'border-accent bg-accent text-accent-fg',
                  current && 'border-accent bg-bg text-accent',
                  !done && !current && 'border-border bg-bg text-faint',
                )}
              >
                {done ? <Check size={12} /> : index + 1}
              </span>
              <span
                className={cn(
                  'mt-2 max-w-[110px] text-[12px] leading-snug',
                  current ? 'font-medium text-fg' : done ? 'text-muted' : 'text-faint',
                )}
              >
                {phase.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
