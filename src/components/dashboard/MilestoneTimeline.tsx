import { Circle, CircleDot, Flag } from 'lucide-react'
import { useApp } from '../../context/AppProvider'
import { cn } from '../../lib/cn'
import { formatShortDate } from '../../lib/format'
import type { Milestone } from '../../types'
import { EmptyState } from '../ui/EmptyState'

export function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const { openModal } = useApp()

  if (milestones.length === 0) {
    return (
      <EmptyState
        icon={Flag}
        title="No milestones yet"
        description="Milestones mark the moments a project actually moves. Add the first one when the destination is clear."
      />
    )
  }

  return (
    <ol className="space-y-0">
      {milestones.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            onClick={() => openModal({ type: 'milestone', milestoneId: m.id })}
            className="flex w-full items-start gap-3 rounded-lg py-2.5 text-left hover:bg-elevated/50"
          >
            <span className="mt-0.5 text-muted">
              {m.status === 'completed' ? (
                <span className="text-success">✓</span>
              ) : m.status === 'in_progress' ? (
                <CircleDot size={14} className="text-accent" />
              ) : (
                <Circle size={14} className="text-faint" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn('block text-sm', m.status === 'planned' ? 'text-muted' : 'text-fg')}>
                {m.title}
              </span>
              <span className="mt-0.5 block text-[12px] text-faint">{m.description}</span>
            </span>
            <span className="shrink-0 font-mono text-[11px] text-faint">{formatShortDate(m.date)}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}
