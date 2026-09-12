import { col } from './db.ts'
import { seed } from '../src/data/seed.ts'
import type { Store } from '../src/types/index.ts'

export async function seedIfEmpty() {
  projects: 'projects',
  phases: 'phases',
  tasks: 'tasks',
  agents: 'agents',
  members: 'members',
  milestones: 'milestones',
  decisions: 'decisions',
  achievements: 'achievements',
  activities: 'activities',
  architecture: 'architecture',
  focuses: 'focuses',
  meta: 'meta',
} as const

function asDocs<T extends { id: string }>(rows: T[]) {
  return rows.map((row) => ({ ...row, _key: row.id }))
}

export async function seedIfEmpty() {
  const count = await col(names.projects).countDocuments()
  if (count > 0) return false

  await Promise.all([
    col(names.projects).insertMany(asDocs(seed.projects)),
    col(names.phases).insertMany(asDocs(seed.phases)),
    col(names.tasks).insertMany(asDocs(seed.tasks)),
    col(names.agents).insertMany(asDocs(seed.agents)),
    col(names.members).insertMany(asDocs(seed.members)),
    col(names.milestones).insertMany(asDocs(seed.milestones)),
    col(names.decisions).insertMany(asDocs(seed.decisions)),
    col(names.achievements).insertMany(asDocs(seed.achievements)),
    col(names.activities).insertMany(asDocs(seed.activities)),
    col(names.architecture).insertMany(asDocs(seed.architecture)),
    col(names.focuses).insertMany(asDocs(seed.focuses)),
    col(names.meta).insertOne({
      _key: 'workspace',
      user: seed.user,
      github: { connected: false },
    }),
  ])
  return true
}

function strip<T extends { _key?: string; _id?: unknown }>(doc: T | null) {
  if (!doc) return null
  const { _key: _k, _id: _i, ...rest } = doc
  return rest
}

export async function readStore(): Promise<Store> {
  const [
    projects,
    phases,
    tasks,
    agents,
    members,
    milestones,
    decisions,
    achievements,
    activities,
    architecture,
    focuses,
    meta,
  ] = await Promise.all([
    col(names.projects).find().toArray(),
    col(names.phases).find().toArray(),
    col(names.tasks).find().toArray(),
    col(names.agents).find().toArray(),
    col(names.members).find().toArray(),
    col(names.milestones).find().toArray(),
    col(names.decisions).find().toArray(),
    col(names.achievements).find().toArray(),
    col(names.activities).find().toArray(),
    col(names.architecture).find().toArray(),
    col(names.focuses).find().toArray(),
    col(names.meta).findOne({ _key: 'workspace' }),
  ])

  const workspace = strip(meta) as { user: Store['user']; github?: Store['github'] } | null

  return {
    projects: projects.map((d) => strip(d)) as Store['projects'],
    phases: phases.map((d) => strip(d)) as Store['phases'],
    tasks: tasks.map((d) => strip(d)) as Store['tasks'],
    agents: agents.map((d) => strip(d)) as Store['agents'],
    members: members.map((d) => strip(d)) as Store['members'],
    milestones: milestones.map((d) => strip(d)) as Store['milestones'],
    decisions: decisions.map((d) => strip(d)) as Store['decisions'],
    achievements: achievements.map((d) => strip(d)) as Store['achievements'],
    activities: activities.map((d) => strip(d)) as Store['activities'],
    architecture: architecture.map((d) => strip(d)) as Store['architecture'],
    focuses: focuses.map((d) => strip(d)) as Store['focuses'],
    user: workspace?.user ?? seed.user,
    github: workspace?.github
      ? {
          connected: Boolean(workspace.github.connected),
          login: workspace.github.login,
          name: workspace.github.name,
          avatarUrl: workspace.github.avatarUrl,
          connectedAt: workspace.github.connectedAt,
        }
      : { connected: false },
  }
}

export async function recordActivity(
  projectId: string,
  type: Store['activities'][number]['type'],
  title: string,
  description: string,
) {
  const id = `act_${Math.random().toString(36).slice(2, 9)}`
  const timestamp = new Date().toISOString()
  await col(names.activities).insertOne({
    _key: id,
    id,
    projectId,
    type,
    title,
    description,
    timestamp,
  })
  await col(names.projects).updateOne({ id: projectId }, { $set: { updatedAt: timestamp } })
}
