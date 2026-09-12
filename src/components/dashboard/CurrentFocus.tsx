import type { ReactNode } from 'react'
import { ArrowUpRight, Target } from 'lucide-react'
import { useApp } from '../../context/AppProvider'
import { formatShortDate } from '../../lib/format'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { PriorityPill, TaskStatusPill } from '../ui/StatusPills'

export function CurrentFocus() {
  const { focus, openModal } = useApp()

  if (!focus) {
    return (
      <EmptyState
        icon={Target}
        title="No active focus"
        description="When a project has a current thrust, it will appear here so the team always knows what matters this week."
      />
    )
  }

  return (
    <div className="border-t border-border pt-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Current Focus</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{focus.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{focus.description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => openModal({ type: 'focus' })}>
          View details
          <ArrowUpRight size={14} />
        </Button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-5">
        <Meta label="Status">
          <TaskStatusPill status={focus.status} />
        </Meta>
        <Meta label="Owner">{focus.owner}</Meta>
        <Meta label="Started">{formatShortDate(focus.startedAt)}</Meta>
        <Meta label="Progress">
          <span className="font-medium">{focus.progress}%</span>
        </Meta>
        <Meta label="Priority">
          <PriorityPill priority={focus.priority} />
        </Meta>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full bg-accent" style={{ width: `${focus.progress}%` }} />
      </div>
      <p className="mt-2 text-[12px] text-faint">Related milestone · {focus.relatedMilestone}</p>
    </div>
  )
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] text-faint">{label}</p>
      {children}
    </div>
  )
}
