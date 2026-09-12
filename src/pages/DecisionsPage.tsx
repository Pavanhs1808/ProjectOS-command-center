import { useState } from 'react'
import { Scale } from 'lucide-react'
import { useApp } from '../context/AppProvider'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { DecisionStatusPill } from '../components/ui/StatusPills'
import { formatDate } from '../lib/format'

export function DecisionsPage() {
  const { decisions, currentProject, openModal } = useApp()
  const [openId, setOpenId] = useState<string | null>(decisions[0]?.id ?? null)

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-6">
      <SectionHeader
        kicker={currentProject?.name}
        title="Decisions"
        description="The engineering log. Expand an entry to read context, reasoning, and consequences."
        action={{ label: 'Add decision', onClick: () => openModal({ type: 'decision' }) }}
      />
      {decisions.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="No decisions recorded"
          description="When a choice is made that future-you should remember, it belongs here — status, context, and the consequences."
          action={{ label: 'Record a decision', onClick: () => openModal({ type: 'decision' }) }}
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {decisions.map((d) => {
            const open = openId === d.id
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : d.id)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                >
                  <div>
                    <p className="text-[15px] font-medium">{d.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{d.decision}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <DecisionStatusPill status={d.status} />
                    <span className="text-[12px] text-faint">{formatDate(d.date)}</span>
                  </div>
                </button>
                {open ? (
                  <div className="grid gap-4 pb-6 text-sm sm:grid-cols-2">
                    <Block label="Context" text={d.context} />
                    <Block label="Reasoning" text={d.reasoning} />
                    <Block label="Consequences" text={d.consequences} />
                    <Block label="Decision" text={d.decision} />
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="mb-1 text-[11px] uppercase tracking-[0.14em] text-faint">{label}</p>
      <p className="leading-relaxed text-muted">{text || '—'}</p>
    </div>
  )
}
