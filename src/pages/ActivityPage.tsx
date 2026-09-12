import { useState } from 'react'
import { Activity } from 'lucide-react'
import { useApp } from '../context/AppProvider'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { formatTime, formatShortDate } from '../lib/format'

export function ActivityPage() {
  const { activities, currentProject } = useApp()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-3xl animate-in space-y-6">
      <SectionHeader
        kicker={currentProject?.name}
        title="Activity"
        description="A chronological feed. Later this will include live agent events from the orchestrator."
      />
      {activities.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="The feed is quiet"
          description="Task changes, decisions, and agent events will collect here. Nothing has moved in this project yet."
        />
      ) : (
        <ol className="space-y-0">
          {activities.map((event) => {
            const open = openId === event.id
            return (
              <li key={event.id} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : event.id)}
                  className="flex w-full items-start gap-4 py-3.5 text-left"
                >
                  <span className="w-12 shrink-0 font-mono text-[12px] text-faint">{formatTime(event.timestamp)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{event.title}</span>
                    <span className="mt-0.5 block text-[11px] uppercase tracking-wider text-faint">
                      {event.type} · {formatShortDate(event.timestamp)}
                    </span>
                    {open ? <span className="mt-2 block text-sm text-muted">{event.description}</span> : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
