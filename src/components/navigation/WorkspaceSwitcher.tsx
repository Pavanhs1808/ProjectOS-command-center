import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
import { cn } from '../../lib/cn'

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const { projects, currentProject, setCurrentProjectId } = useApp()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  if (!currentProject) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg border border-border bg-bg px-2 py-1.5 text-left hover:bg-elevated',
          collapsed && 'justify-center px-0',
        )}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/15 text-[10px] font-semibold text-accent">
          {currentProject.name.slice(0, 1)}
        </span>
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{currentProject.name}</span>
            <ChevronsUpDown size={14} className="text-faint" />
          </>
        ) : null}
      </button>
      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-20" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-xl">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  setCurrentProjectId(project.id)
                  setOpen(false)
                  navigate('/')
                }}
                className="flex w-full items-center gap-2 px-2 py-2 text-left text-[13px] hover:bg-elevated"
              >
                <span className="flex-1 truncate">{project.name}</span>
                {project.id === currentProject.id ? <Check size={14} className="text-accent" /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
