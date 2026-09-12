import { Menu, Moon, Search, Sun } from 'lucide-react'
import { useApp } from '../../context/AppProvider'
import { useTheme } from '../../hooks/useTheme'
import { formatRelative } from '../../lib/format'

export function TopBar() {
  const { currentProject, setMobileNavOpen, setSearchOpen } = useApp()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-md lg:px-8">
      <button
        type="button"
        className="rounded-md p-1.5 text-muted hover:bg-elevated lg:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-muted">
          {currentProject?.name ?? 'ProjectOS'}
          {currentProject ? (
            <span className="text-faint">
              {' '}
              · Updated {formatRelative(currentProject.updatedAt)}
            </span>
          ) : null}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-[13px] text-faint hover:text-muted sm:flex"
      >
        <Search size={14} />
        Search
        <kbd className="rounded border border-border px-1 font-mono text-[10px]">⌘K</kbd>
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-md p-1.5 text-muted hover:bg-elevated hover:text-fg"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  )
}
