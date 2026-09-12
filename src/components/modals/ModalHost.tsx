import { useState, type FormEvent } from 'react'
import { useApp } from '../../context/AppProvider'
import { Button } from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Field'
import { Modal } from '../ui/Modal'
import type { DecisionStatus, Priority, TaskStatus } from '../../types'

export function ModalHost() {
  const {
    modal,
    closeModal,
    createTask,
    createDecision,
    createAchievement,
    createProject,
    phases,
    milestones,
    tasks,
    agents,
    focus,
  } = useApp()

  const phase = modal?.type === 'phase' ? phases.find((p) => p.id === modal.phaseId) : undefined
  const milestone = modal?.type === 'milestone' ? milestones.find((m) => m.id === modal.milestoneId) : undefined
  const agent = modal?.type === 'agent' ? agents.find((a) => a.id === modal.agentId) : undefined

  return (
    <>
      <TaskModal open={modal?.type === 'task'} onClose={closeModal} onSubmit={createTask} />
      <DecisionModal open={modal?.type === 'decision'} onClose={closeModal} onSubmit={createDecision} />
      <AchievementModal open={modal?.type === 'achievement'} onClose={closeModal} onSubmit={createAchievement} />
      <ProjectModal open={modal?.type === 'project'} onClose={closeModal} onSubmit={createProject} />
      <Modal
        open={modal?.type === 'phase' && Boolean(phase)}
        title={phase?.name ?? 'Phase'}
        description={phase?.description}
        onClose={closeModal}
      >
        {phase ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Progress {phase.progress}% · {phase.status.replace('_', ' ')}
            </p>
            <ul className="space-y-2">
              {phase.goals.map((goal) => (
                <li key={goal} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Modal>
      <Modal
        open={modal?.type === 'milestone' && Boolean(milestone)}
        title={milestone?.title ?? 'Milestone'}
        description={milestone?.description}
        onClose={closeModal}
      >
        {milestone ? (
          <div className="space-y-3 text-sm">
            <p className="text-muted">
              {milestone.status.replace('_', ' ')} · {new Date(milestone.date).toLocaleDateString()}
            </p>
            <div>
              <p className="mb-1 text-[12px] text-faint">Related tasks</p>
              {milestone.relatedTaskIds.length === 0 ? (
                <p className="text-muted">No linked tasks yet.</p>
              ) : (
                <ul className="space-y-1">
                  {milestone.relatedTaskIds.map((id) => {
                    const task = tasks.find((t) => t.id === id)
                    return <li key={id}>{task?.title ?? id}</li>
                  })}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
      <Modal
        open={modal?.type === 'focus'}
        title={focus?.title ?? 'Current focus'}
        description={focus?.description}
        onClose={closeModal}
        wide
      >
        {focus ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[12px] text-faint">Owner</dt>
              <dd>{focus.owner}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-faint">Priority</dt>
              <dd className="capitalize">{focus.priority}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-faint">Progress</dt>
              <dd>{focus.progress}%</dd>
            </div>
            <div>
              <dt className="text-[12px] text-faint">Milestone</dt>
              <dd>{focus.relatedMilestone}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>
      <Modal
        open={modal?.type === 'agent' && Boolean(agent)}
        title={agent?.name ?? 'Agent'}
        description={agent?.role}
        onClose={closeModal}
      >
        {agent ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[12px] text-faint">Responsibility</dt>
              <dd className="mt-1">{agent.responsibilities}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-faint">Current task</dt>
              <dd className="mt-1">{agent.currentTask}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-[12px] text-faint">Model</dt>
                <dd className="mt-1 font-mono text-[12px]">{agent.model}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-faint">Manager</dt>
                <dd className="mt-1">{agent.manager}</dd>
              </div>
            </div>
            <div>
              <dt className="text-[12px] text-faint">Tools</dt>
              <dd className="mt-1">{agent.tools.join(' · ')}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </>
  )
}

function TaskModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: {
    title: string
    description: string
    area: string
    status: TaskStatus
    priority: Priority
    owner: string
  }) => Promise<void>
}) {
  const { agents } = useApp()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [area, setArea] = useState('Engineering')
  const [status, setStatus] = useState<TaskStatus>('planned')
  const [priority, setPriority] = useState<Priority>('medium')
  const [owner, setOwner] = useState(agents[0]?.name ?? 'Unassigned')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    await onSubmit({ title: title.trim(), description, area, status, priority, owner })
    setBusy(false)
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <Modal open={open} title="New task" description="Add work to the current project." onClose={onClose}>
      <form className="space-y-3" onSubmit={submit}>
        <Field label="Task">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="What needs to happen?" />
        </Field>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Area">
            <Input value={area} onChange={(e) => setArea(e.target.value)} />
          </Field>
          <Field label="Owner">
            <Input value={owner} onChange={(e) => setOwner(e.target.value)} list="owners" />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              <option value="backlog">Backlog</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </Select>
          </Field>
          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </Field>
        </div>
        <datalist id="owners">
          {agents.map((a) => (
            <option key={a.id} value={a.name} />
          ))}
        </datalist>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function DecisionModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: {
    title: string
    status: DecisionStatus
    decision: string
    context: string
    reasoning: string
    consequences: string
  }) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [decision, setDecision] = useState('')
  const [context, setContext] = useState('')
  const [reasoning, setReasoning] = useState('')
  const [consequences, setConsequences] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !decision.trim()) return
    setBusy(true)
    await onSubmit({
      title: title.trim(),
      status: 'accepted',
      decision,
      context,
      reasoning,
      consequences,
    })
    setBusy(false)
    setTitle('')
    setDecision('')
    setContext('')
    setReasoning('')
    setConsequences('')
    onClose()
  }

  return (
    <Modal open={open} title="Record a decision" description="Capture why this path was chosen." onClose={onClose} wide>
      <form className="space-y-3" onSubmit={submit}>
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <Field label="Decision">
          <Textarea value={decision} onChange={(e) => setDecision(e.target.value)} required />
        </Field>
        <Field label="Context">
          <Textarea value={context} onChange={(e) => setContext(e.target.value)} />
        </Field>
        <Field label="Reasoning">
          <Textarea value={reasoning} onChange={(e) => setReasoning(e.target.value)} />
        </Field>
        <Field label="Consequences">
          <Textarea value={consequences} onChange={(e) => setConsequences(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            Save decision
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function AchievementModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: { title: string; description: string; category: string }) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Engineering')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    await onSubmit({ title: title.trim(), description, category })
    setBusy(false)
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <Modal open={open} title="Add achievement" description="What did we just make real?" onClose={onClose}>
      <form className="space-y-3" onSubmit={submit}>
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Category">
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            Add to journal
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function ProjectModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: { name: string; description: string }) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    await onSubmit({ name: name.trim(), description })
    setBusy(false)
    setName('')
    setDescription('')
    onClose()
  }

  return (
    <Modal open={open} title="New project" description="Start another workspace inside ProjectOS." onClose={onClose}>
      <form className="space-y-3" onSubmit={submit}>
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  )
}
