import './styles/theme.css'
import { AppShell } from '@/components/layout/AppShell'
import { useUIStore } from '@/stores/useUIStore'
import { SetupScreen } from '@/components/setup/SetupScreen'
import { TrackerScreen } from '@/components/tracker/TrackerScreen'
import { JournalScreen } from '@/components/journal/JournalScreen'
import { EncountersScreen } from '@/components/encounters/EncountersScreen'
import { FollowersScreen } from '@/components/followers/FollowersScreen'
import { ModalManager } from '@/components/modals/ModalManager'

function App() {
  const screen = useUIStore((s) => s.screen)

  return (
    <AppShell>
      {screen === 'setup' && <SetupScreen />}
      {screen === 'tracker' && <TrackerScreen />}
      {screen === 'journal' && <JournalScreen />}
      {screen === 'encounters' && <EncountersScreen />}
      {screen === 'followers' && <FollowersScreen />}
      <ModalManager />
    </AppShell>
  )
}

export default App
