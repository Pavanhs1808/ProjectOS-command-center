const API = (import.meta.env.VITE_API_URL ?? 'http://localhost:8787').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

export const apiBase = API

export const api = {
  getStore: () => request<import('../types').Store>('/api/store'),
  health: () => request<{ ok: boolean }>('/api/health'),
  createProject: (input: { name: string; description: string }) =>
    request<import('../types').Project>('/api/projects', { method: 'POST', body: JSON.stringify(input) }),
  createTask: (input: Omit<import('../types').Task, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<import('../types').Task>('/api/tasks', { method: 'POST', body: JSON.stringify(input) }),
  updateTask: (id: string, patch: Partial<import('../types').Task>) =>
    request<import('../types').Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  createMember: (input: Omit<import('../types').Member, 'id'>) =>
    request<import('../types').Member>('/api/members', { method: 'POST', body: JSON.stringify(input) }),
  createDecision: (input: Omit<import('../types').Decision, 'id' | 'date'>) =>
    request<import('../types').Decision>('/api/decisions', { method: 'POST', body: JSON.stringify(input) }),
  createAchievement: (input: Omit<import('../types').Achievement, 'id' | 'date'> & { date?: string }) =>
    request<import('../types').Achievement>('/api/achievements', { method: 'POST', body: JSON.stringify(input) }),
  updateUser: (patch: import('../types').WorkspaceUser) =>
    request<import('../types').WorkspaceUser>('/api/user', { method: 'PATCH', body: JSON.stringify(patch) }),
  getTimeline: (projectId: string) =>
    request<import('../types').TimelineEvent[]>(`/api/projects/${projectId}/timeline`),
  getGithub: () => request<import('../types').GithubConnection>('/api/github'),
  connectGithub: (token: string) =>
    request<import('../types').GithubConnection>('/api/github/connect', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  disconnectGithub: () => request<{ connected: false }>('/api/github', { method: 'DELETE' }),
  getGithubRepos: () =>
    request<Array<{ id: number; name: string; url: string; private: boolean; description: string | null }>>(
      '/api/github/repos',
    ),
}

export const githubOauthUrl = `${API}/api/github/oauth`
export const DEFAULT_PROJECT_ID = 'prj_ai_company'
