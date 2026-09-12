import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ActivityPage } from './pages/ActivityPage'
import { AgentsPage } from './pages/AgentsPage'
import { ArchitecturePage } from './pages/ArchitecturePage'
import { DecisionsPage } from './pages/DecisionsPage'
import { OverviewPage } from './pages/OverviewPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { SettingsPage } from './pages/SettingsPage'
import { TasksPage } from './pages/TasksPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <Navigate to="overview" replace /> },
      { path: 'projects/:projectId/:tab', element: <ProjectDetailPage /> },
      { path: 'roadmap', element: <RoadmapPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'agents', element: <AgentsPage /> },
      { path: 'architecture', element: <ArchitecturePage /> },
      { path: 'decisions', element: <DecisionsPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
