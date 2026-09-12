import { useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
import { useHotkey } from '../../hooks/useHotkey'
import { MobileNav } from '../navigation/MobileNav'
import { Sidebar } from '../navigation/Sidebar'
import { TopBar } from '../navigation/TopBar'
import { CommandPalette } from '../search/CommandPalette'
import { ModalHost } from '../modals/ModalHost'

export function AppShell() {
  const { setSearchOpen, searchOpen, ready } = useApp()

  const openSearch = useCallback(() => setSearchOpen(true), [setSearchOpen])
  const combo = useCallback((e: KeyboardEvent) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k', [])
  useHotkey(combo, openSearch)

  const closeSearch = useCallback(() => setSearchOpen(false), [setSearchOpen])
  const esc = useCallback((e: KeyboardEvent) => e.key === 'Escape' && searchOpen, [searchOpen])
  useHotkey(esc, closeSearch, searchOpen)

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 pb-20 pt-6 lg:px-8 lg:pb-10">
          {ready ? <Outlet /> : <p className="text-sm text-muted">Loading workspace…</p>}
        </main>
      </div>
      <MobileNav />
      <CommandPalette />
      <ModalHost />
    </div>
  )
}
