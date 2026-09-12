import { useEffect, useState } from 'react'
import { Box } from 'lucide-react'
import { useApp } from '../context/AppProvider'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { cn } from '../lib/cn'
import type { ArchitectureNode } from '../types'

const layers = ['Interface', 'Command', 'Control', 'Workers', 'Tools', 'Infrastructure'] as const

export function ArchitecturePage() {
  const { architecture, currentProject } = useApp()
  const [selected, setSelected] = useState<ArchitectureNode | null>(null)

  useEffect(() => {
    setSelected((current) => architecture.find((n) => n.id === current?.id) ?? architecture[0] ?? null)
  }, [architecture])

  const byLayer = (layer: string) => architecture.filter((n) => n.layer === layer)

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-8">
      <SectionHeader
        kicker={currentProject?.name}
        title="Architecture"
        description="A readable map of how this project is meant to run. Click a component for detail."
      />
      {architecture.length === 0 ? (
        <EmptyState
          icon={Box}
          title="No architecture recorded"
          description="When the system shape is known, it will be drawn here as a simple stack — not an enterprise diagram."
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            {layers.map((layer) => {
              const nodes = byLayer(layer)
              if (nodes.length === 0) return null
              return (
                <section key={layer}>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-faint">{layer}</p>
                  <div className="flex flex-wrap gap-2">
                    {nodes.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelected(node)}
                        className={cn(
                          'rounded-lg border bg-surface px-3 py-2 text-sm transition-colors',
                          selected?.id === node.id
                            ? 'border-accent text-fg'
                            : 'border-border text-fg hover:border-accent/40',
                        )}
                      >
                        {node.name}
                      </button>
                    ))}
                  </div>
                  {layer !== 'Infrastructure' ? (
                    <div className="mt-4 flex justify-center text-faint" aria-hidden>
                      ↓
                    </div>
                  ) : null}
                </section>
              )
            })}
          </div>
          <aside className="h-fit rounded-xl border border-border p-5">
            {selected ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.16em] text-faint">{selected.layer}</p>
                <h3 className="mt-2 text-lg font-semibold">{selected.name}</h3>
                <p className="mt-2 text-sm text-muted">{selected.description}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{selected.details}</p>
              </>
            ) : (
              <p className="text-sm text-muted">Select a component.</p>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
