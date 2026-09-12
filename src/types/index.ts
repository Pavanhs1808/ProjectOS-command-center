export type ProjectStatus = 'planning' | 'building' | 'paused' | 'shipped'
export type PhaseStatus = 'completed' | 'in_progress' | 'planned'
export type TaskStatus =
  | 'backlog'
  | 'planned'
  | 'in_progress'
  | 'review'
  | 'blocked'
  | 'completed'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type AgentStatus = 'planned' | 'active' | 'idle' | 'offline'
export type MilestoneStatus = 'completed' | 'in_progress' | 'planned'
export type DecisionStatus = 'proposed' | 'accepted' | 'superseded' | 'rejected'
export type ActivityType =
  | 'architecture'
  | 'decision'
  | 'milestone'
  | 'task'
  | 'achievement'
  | 'agent'
  | 'system'
  | 'github'
  | 'member'

export type TimelineKind = 'task' | 'milestone' | 'achievement' | 'decision' | 'phase'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  currentPhase: string
  currentMilestone: string
  createdAt: string
  updatedAt: string
}

export interface Phase {
  id: string
  projectId: string
  name: string
  status: PhaseStatus
  progress: number
  order: number
  goals: string[]
  description: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  area: string
  status: TaskStatus
  priority: Priority
  owner: string
  assigneeId?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface Agent {
  id: string
  projectId: string
  name: string
  role: string
  status: AgentStatus
  responsibilities: string
  currentTask: string
  model: string
  tools: string[]
  manager: string
  completedTasks: number
}

export interface Milestone {
  id: string
  projectId: string
  title: string
  description: string
  status: MilestoneStatus
  date: string
  relatedTaskIds: string[]
}

export interface Decision {
  id: string
  projectId: string
  title: string
  status: DecisionStatus
  decision: string
  context: string
  reasoning: string
  consequences: string
  date: string
}

export interface Achievement {
  id: string
  projectId: string
  title: string
  description: string
  category: string
  date: string
  relatedDecisionId?: string
  relatedDocument?: string
}

export interface Activity {
  id: string
  projectId: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
}

export interface ArchitectureNode {
  id: string
  projectId: string
  name: string
  layer: string
  description: string
  details: string
}

export interface CurrentFocus {
  id: string
  projectId: string
  title: string
  status: TaskStatus
  description: string
  owner: string
  startedAt: string
  progress: number
  priority: Priority
  relatedMilestone: string
}

export interface WorkspaceUser {
  name: string
  email: string
  role: string
}

export interface Member {
  id: string
  projectId: string
  name: string
  email: string
  role: string
  githubLogin?: string
}

export interface GithubConnection {
  connected: boolean
  login?: string
  name?: string
  avatarUrl?: string
  connectedAt?: string
}

export interface TimelineEvent {
  id: string
  projectId: string
  kind: TimelineKind
  title: string
  description: string
  date: string
  actor?: string
}

export interface Store {
  projects: Project[]
  phases: Phase[]
  tasks: Task[]
  agents: Agent[]
  members: Member[]
  milestones: Milestone[]
  decisions: Decision[]
  achievements: Achievement[]
  activities: Activity[]
  architecture: ArchitectureNode[]
  focuses: CurrentFocus[]
  user: WorkspaceUser
  github: GithubConnection
}
