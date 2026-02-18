import { usePartyStore } from '@/stores/usePartyStore'
import { useGameSession } from '@/hooks/useGameSession'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { FooterBar } from '@/components/layout/FooterBar'
import { CharacterCard } from './CharacterCard'
import './TrackerScreen.css'

export function TrackerScreen() {
  const characters = usePartyStore((s) => s.characters)
  const { save, saveAndQuit } = useGameSession()
  const { dragHandlers, handleHandlers, draggedIndex, overIndex } =
    useDragAndDrop()

  return (
    <div className="tracker-container">
      <div className="tracker-grid">
        {characters.map((char, i) => (
          <CharacterCard
            key={i}
            index={i}
            character={char}
            dragHandlers={dragHandlers(i)}
            handleHandlers={handleHandlers(i)}
            isDragged={draggedIndex === i}
            isDragOver={overIndex === i && draggedIndex !== i}
          />
        ))}
      </div>
      <FooterBar onSave={save} onQuit={saveAndQuit} />
    </div>
  )
}
