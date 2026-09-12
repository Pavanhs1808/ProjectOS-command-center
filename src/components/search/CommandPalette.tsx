import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, FileText, FolderKanban, Trophy, Users, CheckSquare } from 'lucide-react'
import { useApp } from '../../context/AppProvider'
import { cn } from '../../lib/cn'

type Hit = {
  id: string
  title: string
  subtitle: string
  href: string
  kind: string
}

export function CommandPalette() {
  const {
    searchOpen,
    setSearchOpen,
    projects,
    tasks,
    agents,
    decisions,
    achievements,
    architecture,
    setCurrentProjectId,
    openModal,
  } = useApp()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const hits = useMemo<Hit[]>(() => {
    const q = query.trim().toLowerCase()
    const all: Hit[] = [
      ...projects.map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: p.description,
        href: '/projects',
        kind: 'Project',
      })),
      ...tasks.map((t) => ({
        id: t.id,
        title: t.title,
        subtitle: `${t.area} · ${t.owner}`,
        href: '/tasks',
        kind: 'Task',
      })),
      ...agents.map((a) => ({
        id: a.id,
        title: a.name,
        subtitle: a.role,
        href: '/agents',
        kind: 'Agent',
      })),
      ...decisions.map((d) => ({
        id: d.id,
        title: d.title,
        subtitle: d.decision,
        href: '/decisions',
        kind: 'Decision',
      })),
      ...achievements.map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: a.description,
        href: '/',
        kind: 'Achievement',
      })),
      ...architecture.map((n) => ({
        id: n.id,
        title: n.name,
        subtitle: `${n.layer} · ${n.description}`,
        href: '/architecture',
        kind: 'Architecture',
      })),
    ]
    if (!q) return all.slice(0, 8)
    return all.filter((h) => `${h.title} ${h.subtitle} ${h.kind}`.toLowerCase().includes(q)).slice(0, 12)
  }, [query, projects, tasks, agents, decisions, achievements, architecture])

  if (!searchOpen) return null

  const go = (hit: Hit) => {
    if (hit.kind === 'Project') setCurrentProjectId(hit.id)
    navigate(hit.href)
    setSearchOpen(false)
    setQuery('')
  }

  const icon = (kind: string) => {
    if (kind === 'Task') return CheckSquare
    if (kind === 'Agent') return Users
    if (kind === 'Decision') return FileText
    if (kind === 'Achievement') return Trophy
    if (kind === 'Architecture') return Box
    return FolderKanban
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[18vh]">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, tasks, agents, decisions…"
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-[15px] outline-none placeholder:text-faint"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSearchOpen(false)
            if (e.key === 'Enter' && hits[0]) go(hits[0])
          }}
        />
        <div className="max-h-[360px] overflow-auto p-1.5">
          {hits.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">No matching records in this workspace.</p>
          ) : (
            hits.map((hit, i) => {
              const Icon = icon(hit.kind)
              return (
                <button
                  key={`${hit.kind}-${hit.id}`}
                  type="button"
                  onClick={() => go(hit)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-elevated',
                    i === 0 && 'bg-elevated/60',
                  )}
                >
                  <Icon size={15} className="mt-0.5 text-faint" />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{hit.title}</span>
                      <span className="text-[11px] text-faint">{hit.kind}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-[12px] text-muted">{hit.subtitle}</span>
                  </span>
                </button>
              )
            })
          )}
        </div>
        <div className="flex gap-2 border-t border-border px-3 py-2 text-[11px] text-faint">
          <button type="button" className="hover:text-muted" onClick={() => { openModal({ type: 'task' }); setSearchOpen(false) }}>
            New task
          </button>
          <button type="button" className="hover:text-muted" onClick={() => { openModal({ type: 'decision' }); setSearchOpen(false) }}>
            New decision
          </button>
          <button type="button" className="hover:text-muted" onClick={() => { openModal({ type: 'achievement' }); setSearchOpen(false) }}>
            New achievement
          </button>
        </div>
      </div>
    </div>
  )
}
