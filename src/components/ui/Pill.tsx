import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

const tones: Record<string, string> = {
  default: 'bg-elevated text-muted',
  accent: 'bg-accent/12 text-accent',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/12 text-warning',
  danger: 'bg-danger/12 text-danger',
  outline: 'border border-border text-muted',
}

export function Pill({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
