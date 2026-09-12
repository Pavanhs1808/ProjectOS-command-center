import { Button } from './Button'

export function SectionHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker ? (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">{kicker}</p>
        ) : null}
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {action ? (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
