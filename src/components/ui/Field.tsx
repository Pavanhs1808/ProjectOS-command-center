import { cn } from '../../lib/cn'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const field =
  'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none transition-shadow placeholder:text-faint focus:border-accent/50 focus:ring-2 focus:ring-accent/20'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-medium text-muted">{label}</span>
      {children}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, props.className)} {...props} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(field, 'min-h-[88px] resize-y', props.className)} {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(field, props.className)} {...props} />
}
