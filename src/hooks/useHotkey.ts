import { useEffect } from 'react'

export function useHotkey(combo: (e: KeyboardEvent) => boolean, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (combo(e)) {
        e.preventDefault()
        handler()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [combo, handler, enabled])
}
