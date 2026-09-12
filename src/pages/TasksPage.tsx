import { useApp } from '../context/AppProvider'
import { TaskTable } from '../components/tasks/TaskTable'
import { SectionHeader } from '../components/ui/SectionHeader'

export function TasksPage() {
  const { tasks, currentProject, openModal } = useApp()

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-6">
      <SectionHeader
        kicker={currentProject?.name}
        title="Tasks"
        description="Filter by status, area, priority, or owner."
        action={{ label: 'New task', onClick: () => openModal({ type: 'task' }) }}
      />
      <TaskTable tasks={tasks} onCreate={() => openModal({ type: 'task' })} />
    </div>
  )
}
