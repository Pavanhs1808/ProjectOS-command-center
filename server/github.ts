import type { Request, Response } from 'express'
import { col } from './db.ts'
import { names, recordActivity } from './store.ts'

type GithubMeta = {
  connected?: boolean
  login?: string
  name?: string
  avatarUrl?: string
  connectedAt?: string
  token?: string
}

function publicGithub(data: GithubMeta | undefined) {
  if (!data?.connected) return { connected: false as const }
  return {
    connected: true as const,
    login: data.login,
    name: data.name,
    avatarUrl: data.avatarUrl,
    connectedAt: data.connectedAt,
  }
}

async function workspace() {
  return col<{ _key: string; github?: GithubMeta }>(names.meta).findOne({ _key: 'workspace' })
}

export async function saveGithubToken(token: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ProjectOS',
    },
  })
  if (!response.ok) throw new Error('GitHub rejected that token.')
  const user = (await response.json()) as { login: string; name?: string; avatar_url?: string }
  const connectedAt = new Date().toISOString()
  const github = {
    connected: true,
    login: user.login,
    name: user.name ?? user.login,
    avatarUrl: user.avatar_url,
    connectedAt,
    token,
  }
  await col(names.meta).updateOne({ _key: 'workspace' }, { $set: { github } }, { upsert: true })
  await recordActivity(
    'prj_ai_company',
    'github',
    `GitHub connected as ${user.login}`,
    'Repository linking will use this account. Further GitHub actions can be added next.',
  )
  return publicGithub(github)
}

export async function githubStatus(_req: Request, res: Response) {
  const doc = await workspace()
  res.json(publicGithub(doc?.github))
}

export async function githubConnect(req: Request, res: Response) {
  const token = String(req.body?.token ?? '').trim()
  if (!token) {
    res.status(400).json({ error: 'A GitHub token is required.' })
    return
  }
  try {
    res.json(await saveGithubToken(token))
  } catch {
    res.status(401).json({ error: 'GitHub rejected that token.' })
  }
}

export async function githubDisconnect(_req: Request, res: Response) {
  await col(names.meta).updateOne({ _key: 'workspace' }, { $set: { github: { connected: false } } })
  res.json({ connected: false })
}

export async function githubRepos(_req: Request, res: Response) {
  const doc = await workspace()
  const token = doc?.github?.token
  if (!token) {
    res.status(401).json({ error: 'Connect GitHub first.' })
    return
  }
  const response = await fetch('https://api.github.com/user/repos?per_page=20&sort=updated', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ProjectOS',
    },
  })
  if (!response.ok) {
    res.status(502).json({ error: 'Could not list repositories.' })
    return
  }
  const repos = (await response.json()) as Array<{
    id: number
    full_name: string
    html_url: string
    private: boolean
    description: string | null
  }>
  res.json(
    repos.map((repo) => ({
      id: repo.id,
      name: repo.full_name,
      url: repo.html_url,
      private: repo.private,
      description: repo.description,
    })),
  )
}

export function githubOauthStart(_req: Request, res: Response) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const callback = process.env.GITHUB_CALLBACK_URL ?? 'http://localhost:8787/api/github/callback'
  if (!clientId) {
    res.status(400).json({
      error: 'GitHub OAuth is not configured yet. Use a personal access token, or add GITHUB_CLIENT_ID.',
    })
    return
  }
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', callback)
  url.searchParams.set('scope', 'read:user repo')
  res.redirect(url.toString())
}

export async function githubOauthCallback(req: Request, res: Response) {
  const code = String(req.query.code ?? '')
  const frontend = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'
  const clientId = process.env.GITHUB_CLIENT_ID
  const secret = process.env.GITHUB_CLIENT_SECRET
  if (!code || !clientId || !secret) {
    res.redirect(`${frontend}/github?error=oauth`)
    return
  }
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: secret,
      code,
    }),
  })
  const tokenBody = (await tokenRes.json()) as { access_token?: string }
  if (!tokenBody.access_token) {
    res.redirect(`${frontend}/github?error=token`)
    return
  }
  try {
    await saveGithubToken(tokenBody.access_token)
    res.redirect(`${frontend}/github?connected=1`)
  } catch {
    res.redirect(`${frontend}/github?error=user`)
  }
}
