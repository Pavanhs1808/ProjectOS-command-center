import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDb } from './db.ts'
import {
  githubConnect,
  githubDisconnect,
  githubOauthCallback,
  githubOauthStart,
  githubRepos,
  githubStatus,
} from './github.ts'
import { col } from './db.ts'
import { names, readStore, recordActivity, seedIfEmpty } from './store.ts'
import type { Member, Task, TimelineEvent } from '../src/types/index.ts'

const app = express()
const port = Number(process.env.PORT ?? 8787)

app.use(
  cors({
    origin: true,
  }),
)
app.use(express.json())

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, db: process.env.MONGODB_DB ?? 'projectos' })
})

app.get('/api/store', async (_req, res) => {
  res.json(await readStore())
})

app.post('/api/projects', async (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  if (!name) {
    res.status(400).json({ error: 'Name is required.' })
    return
  }
  const now = new Date().toISOString()
  const project = {
    id: id('prj'),
    name,
    description: String(req.body?.description ?? ''),
    status: 'planning' as const,
    progress: 0,
    currentPhase: 'Discovery',
    currentMilestone: 'Define the first milestone',
    createdAt: now,
    updatedAt: now,
  }
  await col(names.projects).insertOne({ ...project, _key: project.id })
  await recordActivity(project.id, 'system', `Project created: ${project.name}`, project.description)
  res.json(project)
})

app.post('/api/tasks', async (req, res) => {
  const title = String(req.body?.title ?? '').trim()
  const projectId = String(req.body?.projectId ?? '')
  if (!title || !projectId) {
    res.status(400).json({ error: 'Title and projectId are required.' })
    return
  }
  const now = new Date().toISOString()
  const status = req.body?.status ?? 'planned'
  const task: Task = {
    id: id('tsk'),
    projectId,
    title,
    description: String(req.body?.description ?? ''),
    area: String(req.body?.area ?? 'Engineering'),
    status,
    priority: req.body?.priority ?? 'medium',
    owner: String(req.body?.owner ?? 'Unassigned'),
    assigneeId: req.body?.assigneeId || undefined,
    createdAt: now,
    updatedAt: now,
    completedAt: status === 'completed' ? now : undefined,
  }
  await col(names.tasks).insertOne({ ...task, _key: task.id })
  await recordActivity(projectId, 'task', `Task created: ${task.title}`, task.description)
  res.json(task)
})

app.patch('/api/tasks/:id', async (req, res) => {
  const existing = await col<Task & { _key: string }>(names.tasks).findOne({ id: req.params.id })
  if (!existing) {
    res.status(404).json({ error: 'Task not found.' })
    return
  }
  const now = new Date().toISOString()
  const patch = { ...req.body } as Partial<Task>
  const nextStatus = patch.status ?? existing.status
  const update: Partial<Task> = {
    ...patch,
    updatedAt: now,
    completedAt:
      nextStatus === 'completed' ? (existing.completedAt ?? now) : nextStatus ? undefined : existing.completedAt,
  }
  if (patch.status && patch.status !== 'completed') update.completedAt = undefined
  await col(names.tasks).updateOne({ id: req.params.id }, { $set: update })
  if (patch.assigneeId || patch.owner) {
    await recordActivity(
      existing.projectId,
      'task',
      `Task assigned: ${existing.title}`,
      `Now owned by ${patch.owner ?? existing.owner}`,
    )
  }
  const saved = await col<Task>(names.tasks).findOne({ id: req.params.id })
  res.json(saved)
})

app.post('/api/members', async (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  const projectId = String(req.body?.projectId ?? '')
  if (!name || !projectId) {
    res.status(400).json({ error: 'Name and projectId are required.' })
    return
  }
  const member: Member = {
    id: id('mem'),
    projectId,
    name,
    email: String(req.body?.email ?? ''),
    role: String(req.body?.role ?? 'Member'),
    githubLogin: req.body?.githubLogin || undefined,
  }
  await col(names.members).insertOne({ ...member, _key: member.id })
  await recordActivity(projectId, 'member', `Member added: ${member.name}`, member.role)
  res.json(member)
})

app.patch('/api/members/:id', async (req, res) => {
  await col(names.members).updateOne({ id: req.params.id }, { $set: req.body })
  const saved = await col(names.members).findOne({ id: req.params.id })
  res.json(saved)
})

app.delete('/api/members/:id', async (req, res) => {
  const member = await col<Member>(names.members).findOne({ id: req.params.id })
  await col(names.members).deleteOne({ id: req.params.id })
  if (member) {
    await col(names.tasks).updateMany({ assigneeId: member.id }, { $unset: { assigneeId: '' }, $set: { owner: 'Unassigned' } })
  }
  res.json({ ok: true })
})

app.post('/api/decisions', async (req, res) => {
  const projectId = String(req.body?.projectId ?? '')
  const title = String(req.body?.title ?? '').trim()
  if (!projectId || !title) {
    res.status(400).json({ error: 'Title and projectId are required.' })
    return
  }
  const decision = {
    id: id('dec'),
    projectId,
    title,
    status: req.body?.status ?? 'accepted',
    decision: String(req.body?.decision ?? ''),
    context: String(req.body?.context ?? ''),
    reasoning: String(req.body?.reasoning ?? ''),
    consequences: String(req.body?.consequences ?? ''),
    date: new Date().toISOString(),
  }
  await col(names.decisions).insertOne({ ...decision, _key: decision.id })
  await recordActivity(projectId, 'decision', `Decision created: ${decision.title}`, decision.decision)
  res.json(decision)
})

app.post('/api/achievements', async (req, res) => {
  const projectId = String(req.body?.projectId ?? '')
  const title = String(req.body?.title ?? '').trim()
  if (!projectId || !title) {
    res.status(400).json({ error: 'Title and projectId are required.' })
    return
  }
  const achievement = {
    id: id('ach'),
    projectId,
    title,
    description: String(req.body?.description ?? ''),
    category: String(req.body?.category ?? 'Engineering'),
    date: req.body?.date ?? new Date().toISOString(),
    relatedDecisionId: req.body?.relatedDecisionId,
  }
  await col(names.achievements).insertOne({ ...achievement, _key: achievement.id })
  await recordActivity(projectId, 'achievement', achievement.title, achievement.description)
  res.json(achievement)
})

app.patch('/api/user', async (req, res) => {
  await col(names.meta).updateOne({ _key: 'workspace' }, { $set: { user: req.body } }, { upsert: true })
  res.json(req.body)
})

app.get('/api/projects/:id/timeline', async (req, res) => {
  const projectId = req.params.id
  const [tasks, milestones, achievements, decisions, phases] = await Promise.all([
    col<Task>(names.tasks).find({ projectId }).toArray(),
    col(names.milestones).find({ projectId }).toArray(),
    col(names.achievements).find({ projectId }).toArray(),
    col(names.decisions).find({ projectId }).toArray(),
    col(names.phases).find({ projectId }).toArray(),
  ])
  const events: TimelineEvent[] = []
  for (const task of tasks) {
    if (task.status === 'completed' && (task.completedAt || task.updatedAt)) {
      events.push({
        id: `tl_${task.id}`,
        projectId,
        kind: 'task',
        title: task.title,
        description: `Completed${task.owner ? ` by ${task.owner}` : ''}`,
        date: task.completedAt || task.updatedAt,
        actor: task.owner,
      })
    }
  }
  for (const milestone of milestones) {
    if (milestone.status === 'completed') {
      events.push({
        id: `tl_${milestone.id}`,
        projectId,
        kind: 'milestone',
        title: milestone.title,
        description: milestone.description,
        date: milestone.date,
      })
    }
  }
  for (const achievement of achievements) {
    events.push({
      id: `tl_${achievement.id}`,
      projectId,
      kind: 'achievement',
      title: achievement.title,
      description: achievement.description,
      date: achievement.date,
    })
  }
  for (const decision of decisions) {
    if (decision.status === 'accepted') {
      events.push({
        id: `tl_${decision.id}`,
        projectId,
        kind: 'decision',
        title: decision.title,
        description: decision.decision,
        date: decision.date,
      })
    }
  }
  for (const phase of phases) {
    if (phase.status === 'completed') {
      events.push({
        id: `tl_${phase.id}`,
        projectId,
        kind: 'phase',
        title: `${phase.name} completed`,
        description: phase.description,
        date: new Date().toISOString(),
      })
    }
  }
  events.sort((a, b) => +new Date(b.date) - +new Date(a.date))
  res.json(events)
})

app.get('/api/github', githubStatus)
app.post('/api/github/connect', githubConnect)
app.delete('/api/github', githubDisconnect)
app.get('/api/github/repos', githubRepos)
app.get('/api/github/oauth', githubOauthStart)
app.get('/api/github/callback', githubOauthCallback)

async function start() {
  try {
    await connectDb()
    const seeded = await seedIfEmpty()
    app.listen(port, () => {
      console.log(`ProjectOS API on http://localhost:${port}`)
      console.log(`MongoDB ${process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017'} / ${process.env.MONGODB_DB ?? 'projectos'}`)
      if (seeded) console.log('Seeded workspace into MongoDB')
    })
  } catch (error) {
    console.error('Could not start API. Is MongoDB running locally?')
    console.error(error)
    process.exit(1)
  }
}

void start()
