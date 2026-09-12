import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { seed } from '../data/seed'
import { api, DEFAULT_PROJECT_ID } from '../lib/api'
import type {
  Achievement,
  Activity,
  Agent,
  ArchitectureNode,
  CurrentFocus,
  Decision,
  GithubConnection,
  Member,
  Milestone,
  Phase,
  Project,
  Store,
  Task,
  TimelineEvent,
} from '../types'

type Modal =
  | { type: 'task' }
  | { type: 'achievement' }
  | { type: 'decision' }
  | { type: 'project' }
  | { type: 'member' }
  | { type: 'phase'; phaseId: string }
  | { type: 'milestone'; milestoneId: string }
  | { type: 'focus' }
  | { type: 'agent'; agentId: string }
  | null

type AppContextValue = {
  ready: boolean
  apiError: string | null
  user: Store['user']
  github: GithubConnection
  projects: Project[]
  currentProjectId: string
  currentProject: Project | undefined
  phases: Phase[]
  tasks: Task[]
  agents: Agent[]
  members: Member[]
  milestones: Milestone[]
  decisions: Decision[]
  achievements: Achievement[]
  activities: Activity[]
  architecture: ArchitectureNode[]
  timeline: TimelineEvent[]
  focus: CurrentFocus | undefined
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  searchOpen: boolean
  modal: Modal
  setCurrentProjectId: (id: string) => void
  setSidebarCollapsed: (value: boolean) => void
  setMobileNavOpen: (value: boolean) => void
  setSearchOpen: (value: boolean) => void
  openModal: (modal: Modal) => void
  closeModal: () => void
  refresh: () => Promise<void>
  createTask: (
    input: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId'> & { projectId?: string },
  ) => Promise<void>
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>
  createMember: (input: Omit<Member, 'id' | 'projectId'> & { projectId?: string }) => Promise<void>
  createDecision: (
    input: Omit<Decision, 'id' | 'date' | 'projectId'> & { projectId?: string },
  ) => Promise<void>
  createAchievement: (
    input: Omit<Achievement, 'id' | 'date' | 'projectId'> & { projectId?: string; date?: string },
  ) => Promise<void>
  createProject: (input: { name: string; description: string }) => Promise<void>
  updateUser: (patch: Partial<Store['user']>) => Promise<void>
  connectGithub: (token: string) => Promise<void>
  disconnectGithub: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

const PROJECT_KEY = 'projectos.currentProject'
const SIDEBAR_KEY = 'projectos.sidebarCollapsed'

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(() => structuredClone(seed))
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [currentProjectId, setCurrentProjectIdState] = useState(
    () => localStorage.getItem(PROJECT_KEY) ?? DEFAULT_PROJECT_ID,
  )
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === '1',
  )
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [modal, setModal] = useState<Modal>(null)

  const refresh = useCallback(async () => {
    try {
      const next = await api.getStore()
      setStore(next)
      setApiError(null)
      const pid = localStorage.getItem(PROJECT_KEY) ?? next.projects[0]?.id
      if (pid) {
        const events = await api.getTimeline(pid).catch(() => [])
        setTimeline(events)
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Could not reach the ProjectOS API')
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const setCurrentProjectId = useCallback(
    (id: string) => {
      setCurrentProjectIdState(id)
      localStorage.setItem(PROJECT_KEY, id)
      void api.getTimeline(id).then(setTimeline).catch(() => setTimeline([]))
    },
    [],
  )

  const setSidebarCollapsed = useCallback((value: boolean) => {
    setSidebarCollapsedState(value)
    localStorage.setItem(SIDEBAR_KEY, value ? '1' : '0')
  }, [])

  const createTask = useCallback(
    async (input: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId'> & { projectId?: string }) => {
      await api.createTask({ ...input, projectId: input.projectId ?? currentProjectId })
      await refresh()
    },
    [currentProjectId, refresh],
  )

  const updateTask = useCallback(
    async (id: string, patch: Partial<Task>) => {
      await api.updateTask(id, patch)
      await refresh()
    },
    [refresh],
  )

  const createMember = useCallback(
    async (input: Omit<Member, 'id' | 'projectId'> & { projectId?: string }) => {
      await api.createMember({ ...input, projectId: input.projectId ?? currentProjectId })
      await refresh()
    },
    [currentProjectId, refresh],
  )

  const createDecision = useCallback(
    async (input: Omit<Decision, 'id' | 'date' | 'projectId'> & { projectId?: string }) => {
      await api.createDecision({ ...input, projectId: input.projectId ?? currentProjectId })
      await refresh()
    },
    [currentProjectId, refresh],
  )

  const createAchievement = useCallback(
    async (input: Omit<Achievement, 'id' | 'date' | 'projectId'> & { projectId?: string; date?: string }) => {
      await api.createAchievement({ ...input, projectId: input.projectId ?? currentProjectId })
      await refresh()
    },
    [currentProjectId, refresh],
  )

  const createProject = useCallback(
    async (input: { name: string; description: string }) => {
      const project = await api.createProject(input)
      await refresh()
      setCurrentProjectId(project.id)
    },
    [refresh, setCurrentProjectId],
  )

  const updateUser = useCallback(
    async (patch: Partial<Store['user']>) => {
      await api.updateUser({ ...store.user, ...patch })
      await refresh()
    },
    [refresh, store.user],
  )

  const connectGithub = useCallback(
    async (token: string) => {
      await api.connectGithub(token)
      await refresh()
    },
    [refresh],
  )

  const disconnectGithub = useCallback(async () => {
    await api.disconnectGithub()
    await refresh()
  }, [refresh])

  const value = useMemo<AppContextValue>(() => {
    const projects = store.projects
    const currentProject = projects.find((p) => p.id === currentProjectId) ?? projects[0]
    const pid = currentProject?.id ?? currentProjectId

    return {
      ready: true,
      apiError,
      user: store.user,
      github: store.github ?? { connected: false },
      projects,
      currentProjectId: pid,
      currentProject,
      phases: store.phases.filter((p) => p.projectId === pid).sort((a, b) => a.order - b.order),
      tasks: store.tasks.filter((t) => t.projectId === pid),
      agents: store.agents.filter((a) => a.projectId === pid),
      members: (store.members ?? []).filter((m) => m.projectId === pid),
      milestones: store.milestones.filter((m) => m.projectId === pid),
      decisions: store.decisions.filter((d) => d.projectId === pid),
      achievements: store.achievements.filter((a) => a.projectId === pid),
      activities: store.activities
        .filter((a) => a.projectId === pid)
        .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)),
      architecture: store.architecture.filter((n) => n.projectId === pid),
      timeline,
      focus: store.focuses.find((f) => f.projectId === pid),
      sidebarCollapsed,
      mobileNavOpen,
      searchOpen,
      modal,
      setCurrentProjectId,
      setSidebarCollapsed,
      setMobileNavOpen,
      setSearchOpen,
      openModal: setModal,
      closeModal: () => setModal(null),
      refresh,
      createTask,
      updateTask,
      createMember,
      createDecision,
      createAchievement,
      createProject,
      updateUser,
      connectGithub,
      disconnectGithub,
    }
  }, [
    store,
    timeline,
    apiError,
    currentProjectId,
    sidebarCollapsed,
    mobileNavOpen,
    searchOpen,
    modal,
    setCurrentProjectId,
    setSidebarCollapsed,
    refresh,
    createTask,
    updateTask,
    createMember,
    createDecision,
    createAchievement,
    createProject,
    updateUser,
    connectGithub,
    disconnectGithub,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
