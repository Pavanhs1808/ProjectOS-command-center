import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import { useApp } from '../context/AppProvider'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { AgentStatusPill } from '../components/ui/StatusPills'
import { Select } from '../components/ui/Field'
import { labels } from '../lib/labels'
import type { AgentStatus } from '../types'

export function AgentsPage() {
  const { agents, currentProject, openModal } = useApp()
  const [status, setStatus] = useState('all')
  const filtered = useMemo(
    () => agents.filter((a) => status === 'all' || a.status === status),
    [agents, status],
  )

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-6">
      <SectionHeader
        kicker={currentProject?.name}
        title="AI Organization"
        description="The agents building the system. Designed for live activity once orchestration is connected."
      />
      <div className="max-w-xs">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {(Object.keys(labels.agentStatus) as AgentStatus[]).map((s) => (
            <option key={s} value={s}>
              {labels.agentStatus[s]}
            </option>
          ))}
        </Select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No agents yet"
          description="Your AI organization will appear here as employees are created. Human teams can live here too."
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {filtered.map((agent) => (
            <li key={agent.id}>
              <button
                type="button"
                onClick={() => openModal({ type: 'agent', agentId: agent.id })}
                className="grid w-full gap-3 py-5 text-left sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-medium">{agent.name}</p>
                    <AgentStatusPill status={agent.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted">{agent.role}</p>
                  <p className="mt-2 max-w-xl text-sm text-muted">{agent.responsibilities}</p>
                </div>
                <div className="space-y-1 text-[13px] text-muted">
                  <p>
                    <span className="text-faint">Current · </span>
                    {agent.currentTask}
                  </p>
                  <p className="font-mono text-[12px]">
                    <span className="font-sans text-faint">Model · </span>
                    {agent.model}
                  </p>
                  <p>
                    <span className="text-faint">Tools · </span>
                    {agent.tools.join(', ')}
                  </p>
                </div>
                <div className="text-[13px] text-faint sm:text-right">
                  <p>Manager · {agent.manager}</p>
                  <p className="mt-1">{agent.completedTasks} completed</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
