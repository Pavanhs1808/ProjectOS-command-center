import { GanttChart } from 'lucide-react'
import { useApp } from '../context/AppProvider'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { PhaseStatusPill } from '../components/ui/StatusPills'
import { cn } from '../lib/cn'

export function RoadmapPage() {
  const { phases, currentProject, openModal } = useApp()

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-8">
      <SectionHeader
        kicker={currentProject?.name}
        title="Roadmap"
        description="Work grouped by phase. Horizontal on desktop, stacked on smaller screens."
      />
      {phases.length === 0 ? (
        <EmptyState
          icon={GanttChart}
          title="No roadmap yet"
          description="Phases will appear here once this project has a sequence of work. Until then, the destination is still being named."
        />
      ) : (
        <div className="lg:overflow-x-auto">
          <div className="flex flex-col gap-6 lg:min-w-[1100px] lg:flex-row lg:gap-0">
            {phases.map((phase, index) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => openModal({ type: 'phase', phaseId: phase.id })}
                className="flex-1 text-left lg:px-3"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Phase {index + 1}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <h3 className="text-[15px] font-semibold">{phase.name}</h3>
                  <PhaseStatusPill status={phase.status} />
                </div>
                <div className="relative mt-4 hidden h-px bg-border lg:block">
                  <span
                    className={cn(
                      'absolute -top-1.5 left-0 h-3 w-3 rounded-full border border-border bg-bg',
                      phase.status === 'completed' && 'border-accent bg-accent',
                      phase.status === 'in_progress' && 'border-accent',
                    )}
                  />
                </div>
                <ul className="mt-4 space-y-1.5">
                  {phase.goals.map((goal) => (
                    <li key={goal} className="text-sm text-muted">
                      {goal}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
