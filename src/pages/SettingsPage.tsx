import { useEffect, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { useTheme } from '../hooks/useTheme'
import { Button } from '../components/ui/Button'
import { Field, Input } from '../components/ui/Field'
import { SectionHeader } from '../components/ui/SectionHeader'

export function SettingsPage() {
  const { user, updateUser, sidebarCollapsed, setSidebarCollapsed } = useApp()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState(user.role)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(user.name)
    setEmail(user.email)
    setRole(user.role)
  }, [user])

  return (
    <div className="mx-auto max-w-xl animate-in space-y-10">
      <SectionHeader title="Settings" description="Workspace preferences for this operator." />
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          await updateUser({ name, email, role })
          setSaved(true)
          setTimeout(() => setSaved(false), 1500)
        }}
      >
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Role">
          <Input value={role} onChange={(e) => setRole(e.target.value)} />
        </Field>
        <Button type="submit">{saved ? 'Saved' : 'Save profile'}</Button>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Appearance</h2>
        <div className="flex gap-2">
          <Button variant={theme === 'dark' ? 'primary' : 'outline'} size="sm" onClick={() => setTheme('dark')}>
            Dark
          </Button>
          <Button variant={theme === 'light' ? 'primary' : 'outline'} size="sm" onClick={() => setTheme('light')}>
            Light
          </Button>
        </div>
        <p className="text-sm text-muted">Dark is the default. Light is a warm, quiet studio surface.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Sidebar</h2>
        <Button variant="outline" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        </Button>
      </section>
    </div>
  )
}
