import { labels } from '../../lib/labels'
import { Pill } from './Pill'
import type {
  AgentStatus,
  DecisionStatus,
  MilestoneStatus,
  PhaseStatus,
  Priority,
  ProjectStatus,
  TaskStatus,
} from '../../types'

const taskTone: Record<TaskStatus, 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'outline'> = {
  backlog: 'outline',
  planned: 'default',
  in_progress: 'accent',
  review: 'warning',
  blocked: 'danger',
  completed: 'success',
}

const projectTone: Record<ProjectStatus, 'default' | 'accent' | 'success' | 'warning'> = {
  planning: 'default',
  building: 'accent',
  paused: 'warning',
  shipped: 'success',
}

export function TaskStatusPill({ status }: { status: TaskStatus }) {
  return <Pill tone={taskTone[status]}>{labels.taskStatus[status]}</Pill>
}

export function ProjectStatusPill({ status }: { status: ProjectStatus }) {
  return <Pill tone={projectTone[status]}>{labels.projectStatus[status]}</Pill>
}

export function PhaseStatusPill({ status }: { status: PhaseStatus }) {
  return (
    <Pill tone={status === 'completed' ? 'success' : status === 'in_progress' ? 'accent' : 'outline'}>
      {labels.phaseStatus[status]}
    </Pill>
  )
}

export function PriorityPill({ priority }: { priority: Priority }) {
  return (
    <Pill tone={priority === 'urgent' || priority === 'high' ? 'warning' : 'default'}>
      {labels.priority[priority]}
    </Pill>
  )
}

export function AgentStatusPill({ status }: { status: AgentStatus }) {
  return (
    <Pill tone={status === 'active' ? 'success' : status === 'planned' ? 'outline' : 'default'}>
      {labels.agentStatus[status]}
    </Pill>
  )
}

export function MilestoneStatusPill({ status }: { status: MilestoneStatus }) {
  return (
    <Pill tone={status === 'completed' ? 'success' : status === 'in_progress' ? 'accent' : 'outline'}>
      {labels.milestoneStatus[status]}
    </Pill>
  )
}

export function DecisionStatusPill({ status }: { status: DecisionStatus }) {
  return (
    <Pill
      tone={
        status === 'accepted'
          ? 'success'
          : status === 'rejected'
            ? 'danger'
            : status === 'proposed'
              ? 'accent'
              : 'default'
      }
    >
      {labels.decisionStatus[status]}
    </Pill>
  )
}
