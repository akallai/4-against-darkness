import { useUIStore } from '@/stores/useUIStore'
import { ThemeMenuModal } from './ThemeMenuModal'
import { CreditsModal } from './CreditsModal'
import { DiceRollerModal } from './DiceRollerModal'
import { OracleModal } from './OracleModal'
import { QuestTrackerModal } from './QuestTrackerModal'
import { EncounterTypeModal } from './EncounterTypeModal'
import { EncounterCreationModal } from './EncounterCreationModal'
import { BestiaryManagerModal } from './BestiaryManagerModal'
import { JournalToolsModal } from './JournalToolsModal'
import { TavernCreatorModal } from './TavernCreatorModal'

export function ModalManager() {
  const activeModal = useUIStore((s) => s.activeModal)
  const closeModal = useUIStore((s) => s.closeModal)

  return (
    <>
      <ThemeMenuModal isOpen={activeModal === 'theme-menu'} onClose={closeModal} />
      <CreditsModal isOpen={activeModal === 'credits'} onClose={closeModal} />
      <DiceRollerModal isOpen={activeModal === 'dice-roller'} onClose={closeModal} />
      <OracleModal isOpen={activeModal === 'gm-tools'} onClose={closeModal} />
      <QuestTrackerModal isOpen={activeModal === 'quest-tracker'} onClose={closeModal} />
      <EncounterTypeModal isOpen={activeModal === 'encounter-type'} onClose={closeModal} />
      <EncounterCreationModal isOpen={activeModal === 'encounter-creation'} onClose={closeModal} />
      <BestiaryManagerModal isOpen={activeModal === 'bestiary-manager'} onClose={closeModal} />
      <JournalToolsModal isOpen={activeModal === 'journal-tools'} onClose={closeModal} />
      <TavernCreatorModal isOpen={activeModal === 'tavern-creator'} onClose={closeModal} />
    </>
  )
}
