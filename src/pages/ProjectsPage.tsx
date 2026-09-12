import { useNavigate } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import { useApp } from '../context/AppProvider'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ProjectStatusPill } from '../components/ui/StatusPills'
import { formatRelative } from '../lib/format'

export function ProjectsPage() {
  const { projects, setCurrentProjectId, openModal } = useApp()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-8">
      <SectionHeader
        title="Projects"
        description="Every software, AI, or research effort lives in its own workspace."
        action={{ label: 'New project', onClick: () => openModal({ type: 'project' }) }}
      />
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project to start tracking phases, tasks, agents, and the decisions that shape the work."
          action={{ label: 'Create project', onClick: () => openModal({ type: 'project' }) }}
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => {
                  setCurrentProjectId(project.id)
                  navigate(`/projects/${project.id}`)
                }}
                className="flex w-full flex-col gap-3 py-5 text-left sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-[15px] font-medium">{project.name}</p>
                  <p className="mt-1 max-w-xl text-sm text-muted">{project.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted">
                  <ProjectStatusPill status={project.status} />
                  <span>{project.progress}%</span>
                  <span>{project.currentPhase}</span>
                  <span className="text-faint">{formatRelative(project.updatedAt)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
