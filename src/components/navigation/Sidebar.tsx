import { NavLink, useLocation } from 'react-router-dom'
import {
  Activity,
  Box,
  CheckSquare,
  Compass,
  FolderKanban,
  GanttChart,
  LayoutGrid,
  PanelLeft,
  Scale,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { useApp } from '../../context/AppProvider'
import { cn } from '../../lib/cn'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

const nav = [
  { to: '/', label: 'Overview', icon: LayoutGrid },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/roadmap', label: 'Roadmap', icon: GanttChart },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/agents', label: 'Agents', icon: Users },
  { to: '/architecture', label: 'Architecture', icon: Box },
  { to: '/decisions', label: 'Decisions', icon: Scale },
  { to: '/activity', label: 'Activity', icon: Activity },
]

export function Sidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileNavOpen,
    setMobileNavOpen,
    user,
    setSearchOpen,
  } = useApp()
  const location = useLocation()

  const content = (
    <div className="flex h-full flex-col">
      <div className={cn('flex items-center gap-2 px-3 pt-4 pb-3', sidebarCollapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-elevated">
          <Compass size={15} className="text-accent" />
        </div>
        {!sidebarCollapsed ? (
          <div className="min-w-0">
            <p className="text-[13px] font-semibold tracking-tight">ProjectOS</p>
            <p className="text-[11px] text-faint">Command center</p>
          </div>
        ) : null}
        <button
          type="button"
          className="ml-auto hidden rounded-md p-1.5 text-muted hover:bg-elevated hover:text-fg lg:inline-flex"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label="Collapse sidebar"
        >
          <PanelLeft size={15} />
        </button>
        <button
          type="button"
          className="ml-auto rounded-md p-1.5 text-muted hover:bg-elevated lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        >
          <X size={16} />
        </button>
      </div>

      <div className={cn('px-3 pb-3', sidebarCollapsed && 'px-2')}>
        <WorkspaceSwitcher collapsed={sidebarCollapsed} />
      </div>

      <button
        type="button"
        onClick={() => {
          setSearchOpen(true)
          setMobileNavOpen(false)
        }}
        className={cn(
          'mx-3 mb-3 flex items-center gap-2 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-[13px] text-faint hover:text-muted',
          sidebarCollapsed && 'mx-2 justify-center px-0',
        )}
      >
        <Search size={14} />
        {!sidebarCollapsed ? (
          <>
            <span className="flex-1 text-left">Search</span>
            <kbd className="rounded border border-border px-1 font-mono text-[10px]">⌘K</kbd>
          </>
        ) : null}
      </button>

      <nav className="flex-1 space-y-0.5 px-2">
        {nav.map((item) => {
          const active =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileNavOpen(false)}
              title={item.label}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors',
                sidebarCollapsed && 'justify-center px-0',
                active ? 'bg-elevated text-fg' : 'text-muted hover:bg-elevated/70 hover:text-fg',
              )}
            >
              <item.icon size={16} />
              {!sidebarCollapsed ? <span>{item.label}</span> : null}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto space-y-0.5 border-t border-border px-2 py-3">
        <NavLink
          to="/settings"
          onClick={() => setMobileNavOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]',
              sidebarCollapsed && 'justify-center px-0',
              isActive ? 'bg-elevated text-fg' : 'text-muted hover:bg-elevated/70 hover:text-fg',
            )
          }
        >
          <Settings size={16} />
          {!sidebarCollapsed ? <span>Settings</span> : null}
        </NavLink>
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-lg px-2.5 py-2',
            sidebarCollapsed && 'justify-center px-0',
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">
            {user.name.slice(0, 1) || 'U'}
          </div>
          {!sidebarCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium">{user.name}</p>
              <p className="truncate text-[11px] text-faint">{user.role}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={cn(
          'hidden h-screen shrink-0 border-r border-border bg-surface lg:block',
          sidebarCollapsed ? 'w-[72px]' : 'w-[240px]',
        )}
      >
        {content}
      </aside>
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative h-full w-[260px] bg-surface">{content}</aside>
        </div>
      ) : null}
    </>
  )
}
