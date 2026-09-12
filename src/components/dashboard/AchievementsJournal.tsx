import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { formatDate } from '../../lib/format'
import { EmptyState } from '../ui/EmptyState'
import { Pill } from '../ui/Pill'
import type { Achievement, Decision } from '../../types'

export function AchievementsJournal({
  achievements,
  decisions,
  onAdd,
}: {
  achievements: Achievement[]
  decisions: Decision[]
  onAdd: () => void
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Achievement[]>()
    for (const item of [...achievements].sort((a, b) => +new Date(b.date) - +new Date(a.date))) {
      const key = formatDate(item.date)
      map.set(key, [...(map.get(key) ?? []), item])
    }
    return [...map.entries()]
  }, [achievements])

  if (achievements.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="The journal is empty"
        description="Achievements are the development log — architecture choices, first agents, and the days the project actually moved."
        action={{ label: 'Add achievement', onClick: onAdd }}
      />
    )
  }

  return (
    <div className="space-y-8">
      {grouped.map(([day, items]) => (
        <div key={day} className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <p className="pt-0.5 text-[13px] text-faint">{day}</p>
          <div className="space-y-5">
            {items.map((item) => {
              const related = decisions.find((d) => d.id === item.relatedDecisionId)
              return (
                <article key={item.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-medium">{item.title}</h3>
                    <Pill>{item.category}</Pill>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                  {related ? (
                    <Link to="/decisions" className="mt-2 inline-block text-[12px] text-accent hover:underline">
                      Related decision · {related.title}
                    </Link>
                  ) : null}
                </article>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
