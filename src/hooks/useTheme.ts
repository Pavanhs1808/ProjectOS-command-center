import { useEffect, useState } from 'react'

const KEY = 'projectos.theme'

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark') return stored
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem(KEY, theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0b0c' : '#f6f5f2')
  }, [theme])

  return {
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
  }
}
