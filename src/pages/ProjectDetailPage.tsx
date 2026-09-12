import { NavLink, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../context/AppProvider'
import { OverviewPage } from './OverviewPage'
import { RoadmapPage } from './RoadmapPage'
import { TasksPage } from './TasksPage'
import { AgentsPage } from './AgentsPage'
import { ArchitecturePage } from './ArchitecturePage'
import { DecisionsPage } from './DecisionsPage'
import { ActivityPage } from './ActivityPage'
import { ProjectStatusPill } from '../components/ui/StatusPills'
import { cn } from '../lib/cn'

const tabs = [
  { to: 'overview', label: 'Overview' },
  { to: 'roadmap', label: 'Roadmap' },
  { to: 'tasks', label: 'Tasks' },
  { to: 'agents', label: 'Agents' },
  { to: 'architecture', label: 'Architecture' },
  { to: 'decisions', label: 'Decisions' },
  { to: 'activity', label: 'Activity' },
]

export function ProjectDetailPage() {
  const { projectId, tab = 'overview' } = useParams()
  const { projects, setCurrentProjectId, currentProject } = useApp()
  const project = projects.find((p) => p.id === projectId) ?? currentProject

  useEffect(() => {
    if (projectId) setCurrentProjectId(projectId)
  }, [projectId, setCurrentProjectId])

  if (!project) return null

  const view = {
    overview: <OverviewPage />,
    roadmap: <RoadmapPage />,
    tasks: <TasksPage />,
    agents: <AgentsPage />,
    architecture: <ArchitecturePage />,
    decisions: <DecisionsPage />,
    activity: <ActivityPage />,
  }[tab] ?? <OverviewPage />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted">
            <ProjectStatusPill status={project.status} />
            <span>Progress {project.progress}%</span>
          </div>
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={`/projects/${project.id}/${t.to}`}
            className={() =>
              cn(
                'shrink-0 border-b-2 px-3 py-2 text-[13px]',
                (tab === t.to || (t.to === 'overview' && !tab))
                  ? 'border-fg text-fg'
                  : 'border-transparent text-muted hover:text-fg',
              )
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      {view}
    </div>
  )
}
