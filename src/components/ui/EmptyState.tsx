import type { LucideIcon } from 'lucide-react'
import { Button } from './Button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border px-6 py-10">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[15px] font-medium">{title}</p>
        <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      </div>
      {action ? (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
