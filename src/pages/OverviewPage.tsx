import { useApp } from '../context/AppProvider'
import { AchievementsJournal } from '../components/dashboard/AchievementsJournal'
import { CurrentFocus } from '../components/dashboard/CurrentFocus'
import { MilestoneTimeline } from '../components/dashboard/MilestoneTimeline'
import { PhaseProgress } from '../components/dashboard/PhaseProgress'
import { TaskTable } from '../components/tasks/TaskTable'
import { ProjectStatusPill } from '../components/ui/StatusPills'
import { SectionHeader } from '../components/ui/SectionHeader'
import { formatRelative } from '../lib/format'
import { FolderKanban } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { useParams } from 'react-router-dom'

export function OverviewPage() {
  const { currentProject, phases, milestones, achievements, decisions, tasks, openModal } = useApp()
  const { projectId } = useParams()
  const nested = Boolean(projectId)

  if (!currentProject) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="ProjectOS is ready. Create the first project and this command center will start tracking phases, work, and decisions."
        action={{ label: 'Create project', onClick: () => openModal({ type: 'project' }) }}
      />
    )
  }

  const currentPhase = phases.find((p) => p.status === 'in_progress') ?? phases[0]

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-12">
      <header className="space-y-6">
        {nested ? null : (
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{currentProject.name}</h1>
            <p className="mt-2 max-w-2xl text-base text-muted">{currentProject.description}</p>
          </div>
        )}
        <dl className="grid grid-cols-2 gap-6 border-y border-border py-5 sm:grid-cols-5">
          <Stat label="Current phase" value={currentProject.currentPhase} />
          <Stat label="Progress" value={`${currentProject.progress}%`} />
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-faint">Status</dt>
            <dd className="mt-1.5">
              <ProjectStatusPill status={currentProject.status} />
            </dd>
          </div>
          <Stat label="Last updated" value={formatRelative(currentProject.updatedAt)} />
          <Stat label="Current milestone" value={currentProject.currentMilestone} />
        </dl>
        {phases.length > 0 ? <PhaseProgress phases={phases} /> : null}
        {currentPhase ? (
          <p className="text-[12px] text-faint">
            Highlighting {currentPhase.name}. Click a phase to read its goals.
          </p>
        ) : null}
      </header>

      <CurrentFocus />

      <section className="space-y-4">
        <SectionHeader title="Milestones" description="The sequence that turns this project from intent into something shipped." />
        <MilestoneTimeline milestones={milestones} />
      </section>

      <section className="space-y-6">
        <SectionHeader
          title="What We've Built"
          description="A development journal — not a changelog."
          action={{ label: 'Add achievement', onClick: () => openModal({ type: 'achievement' }) }}
        />
        <AchievementsJournal
          achievements={achievements}
          decisions={decisions}
          onAdd={() => openModal({ type: 'achievement' })}
        />
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Active work"
          description="The board for this project."
          action={{ label: 'New task', onClick: () => openModal({ type: 'task' }) }}
        />
        <TaskTable tasks={tasks} onCreate={() => openModal({ type: 'task' })} />
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-faint">{label}</dt>
      <dd className="mt-1.5 text-[15px] font-medium tracking-tight">{value}</dd>
    </div>
  )
}
