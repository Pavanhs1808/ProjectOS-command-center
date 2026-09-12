export const labels = {
  projectStatus: {
    planning: 'Planning',
    building: 'Building',
    paused: 'Paused',
    shipped: 'Shipped',
  },
  phaseStatus: {
    completed: 'Completed',
    in_progress: 'In Progress',
    planned: 'Planned',
  },
  taskStatus: {
    backlog: 'Backlog',
    planned: 'Planned',
    in_progress: 'In Progress',
    review: 'Review',
    blocked: 'Blocked',
    completed: 'Completed',
  },
  priority: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  },
  agentStatus: {
    planned: 'Planned',
    active: 'Active',
    idle: 'Idle',
    offline: 'Offline',
  },
  milestoneStatus: {
    completed: 'Completed',
    in_progress: 'In Progress',
    planned: 'Planned',
  },
  decisionStatus: {
    proposed: 'Proposed',
    accepted: 'Accepted',
    superseded: 'Superseded',
    rejected: 'Rejected',
  },
} as const
