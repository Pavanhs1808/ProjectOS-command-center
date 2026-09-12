import { useMemo, useState } from 'react'
import { CheckSquare } from 'lucide-react'
import { formatUpdated } from '../../lib/format'
import { labels } from '../../lib/labels'
import { EmptyState } from '../ui/EmptyState'
import { Select } from '../ui/Field'
import { PriorityPill, TaskStatusPill } from '../ui/StatusPills'
import type { Priority, Task, TaskStatus } from '../../types'

export function TaskTable({
  tasks,
  onCreate,
}: {
  tasks: Task[]
  onCreate: () => void
}) {
  const [status, setStatus] = useState<string>('all')
  const [area, setArea] = useState('all')
  const [priority, setPriority] = useState('all')
  const [owner, setOwner] = useState('all')

  const areas = [...new Set(tasks.map((t) => t.area))]
  const owners = [...new Set(tasks.map((t) => t.owner))]

  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (status === 'all' || t.status === status) &&
          (area === 'all' || t.area === area) &&
          (priority === 'all' || t.priority === priority) &&
          (owner === 'all' || t.owner === owner),
      ),
    [tasks, status, area, priority, owner],
  )

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {(Object.keys(labels.taskStatus) as TaskStatus[]).map((s) => (
            <option key={s} value={s}>
              {labels.taskStatus[s]}
            </option>
          ))}
        </Select>
        <Select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="all">All areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="all">All priorities</option>
          {(Object.keys(labels.priority) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {labels.priority[p]}
            </option>
          ))}
        </Select>
        <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="all">All owners</option>
          {owners.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={tasks.length === 0 ? 'No tasks yet' : 'No tasks match these filters'}
          description={
            tasks.length === 0
              ? 'This project does not have work on the board. Create the first task when you know the next concrete step.'
              : 'Try clearing a filter to see the rest of the board.'
          }
          action={tasks.length === 0 ? { label: 'Create task', onClick: onCreate } : undefined}
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-[11px] uppercase tracking-wider text-faint">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Task</th>
                  <th className="px-4 py-2.5 font-medium">Area</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Priority</th>
                  <th className="px-4 py-2.5 font-medium">Owner</th>
                  <th className="px-4 py-2.5 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => (
                  <tr key={task.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{task.title}</p>
                      {task.description ? (
                        <p className="mt-0.5 max-w-md truncate text-[12px] text-faint">{task.description}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted">{task.area}</td>
                    <td className="px-4 py-3">
                      <TaskStatusPill status={task.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityPill priority={task.priority} />
                    </td>
                    <td className="px-4 py-3 text-muted">{task.owner}</td>
                    <td className="px-4 py-3 text-faint">{formatUpdated(task.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 md:hidden">
            {filtered.map((task) => (
              <div key={task.id} className="rounded-xl border border-border px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{task.title}</p>
                  <TaskStatusPill status={task.status} />
                </div>
                <p className="mt-2 text-[12px] text-muted">
                  {task.area} · {task.owner} · {formatUpdated(task.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
