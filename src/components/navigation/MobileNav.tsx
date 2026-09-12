import { Activity, Box, CheckSquare, FolderKanban, GanttChart, LayoutGrid, Scale, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'

const items = [
  { to: '/', label: 'Home', icon: LayoutGrid },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/roadmap', label: 'Roadmap', icon: GanttChart },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/agents', label: 'Agents', icon: Users },
  { to: '/architecture', label: 'Arch', icon: Box },
  { to: '/decisions', label: 'Decisions', icon: Scale },
  { to: '/activity', label: 'Activity', icon: Activity },
]

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-surface/95 px-1 py-1 backdrop-blur md:hidden">
      {items.slice(0, 4).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 rounded-md py-1.5 text-[10px]',
              isActive ? 'text-fg' : 'text-faint',
            )
          }
        >
          <item.icon size={16} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
