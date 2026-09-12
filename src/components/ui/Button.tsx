import { cn } from '../../lib/cn'
import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline' | 'subtle'
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-40',
        size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-9 px-3.5 text-sm',
        variant === 'primary' && 'bg-accent text-accent-fg hover:opacity-90',
        variant === 'ghost' && 'text-muted hover:bg-elevated hover:text-fg',
        variant === 'outline' && 'border border-border bg-transparent text-fg hover:bg-elevated',
        variant === 'subtle' && 'bg-elevated text-fg hover:bg-border',
        className,
      )}
      {...props}
    />
  )
}
