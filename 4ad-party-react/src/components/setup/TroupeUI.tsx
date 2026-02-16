import { useCallback } from 'react'
import { useTavernStore } from '@/stores/useTavernStore'
import { usePartyStore } from '@/stores/usePartyStore'
import { useUIStore } from '@/stores/useUIStore'
import { createEmptyCharacter } from '@/types'
import './TroupeUI.css'

export function TroupeUI() {
  const roster = useTavernStore((s) => s.roster)
  const characters = usePartyStore((s) => s.characters)
  const setCharacter = usePartyStore((s) => s.setCharacter)
  const openModal = useUIStore((s) => s.openModal)

  const assignSlot = useCallback(
    (slotIndex: number, tavernId: string) => {
      if (!tavernId) {
        setCharacter(slotIndex, createEmptyCharacter(slotIndex))
        return
      }
      const hero = roster.find((h) => h.tavernId === parseInt(tavernId, 10))
      if (hero) {
        setCharacter(slotIndex, { ...hero })
      }
    },
    [roster, setCharacter],
  )

  return (
    <div className="troupe-ui">
      <div className="troupe-slots">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="troupe-slot">
            <label>Slot {i + 1}</label>
            <select
              value={characters[i]?.tavernId?.toString() ?? ''}
              onChange={(e) => assignSlot(i, e.target.value)}
            >
              <option value="">-- Empty --</option>
              {roster.map((hero) => (
                <option key={hero.tavernId} value={hero.tavernId.toString()}>
                  {hero.name} ({hero.class} Lv{hero.lvl})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="troupe-actions">
        <button className="btn-gold-dashed" onClick={() => openModal('tavern-creator')}>
          + Create New Hero
        </button>
        <button className="btn-secondary" onClick={() => openModal('tavern-roster')}>
          Manage Roster ({roster.length})
        </button>
      </div>

      {roster.length > 0 && (
        <div className="roster-chips">
          {roster.map((hero) => (
            <span
              key={hero.tavernId}
              className="roster-chip"
              style={{ borderColor: hero.color }}
              onClick={() => openModal(`tavern-hero-${hero.tavernId}`)}
            >
              {hero.name || 'Unnamed'}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
