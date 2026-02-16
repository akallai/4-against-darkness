import { useState } from 'react'
import type { Character } from '@/types'
import { usePartyStore } from '@/stores/usePartyStore'
import { EditableList } from '@/components/common/EditableList'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './CharacterInputGroup.css'

interface CharacterInputGroupProps {
  index: number
  character: Character
}

export function CharacterInputGroup({ index, character }: CharacterInputGroupProps) {
  const updateCharacter = usePartyStore((s) => s.updateCharacter)
  const [showDetails, setShowDetails] = useState(false)

  const update = (updates: Partial<Character>) => {
    updateCharacter(index, updates)
  }

  return (
    <div className="char-input-group">
      <h3>
        <span className="slot-label">Slot {index + 1}</span>
        <input
          type="color"
          className="color-picker"
          value={character.color}
          onChange={(e) => update({ color: e.target.value })}
          title="Accent color"
        />
      </h3>

      <div className="input-row">
        <input
          type="text"
          placeholder="Character Name"
          value={character.name}
          onChange={(e) => update({ name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Class"
          value={character.class}
          onChange={(e) => update({ class: e.target.value })}
        />
      </div>

      <button
        className="btn-secondary detail-toggle"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? '▲ Hide Details' : '▼ Detailed Setup'}
      </button>

      {showDetails && (
        <div className="detail-section">
          <div className="setup-stats-row">
            <label>
              Lvl
              <input
                type="number"
                value={character.lvl}
                onChange={(e) => update({ lvl: parseInt(e.target.value) || 0 })}
              />
            </label>
            <label>
              HP
              <input
                type="text"
                value={character.hp}
                onChange={(e) => update({ hp: e.target.value })}
                placeholder="0/0"
              />
            </label>
            <label>
              GP
              <input
                type="number"
                value={character.gp}
                onChange={(e) => update({ gp: parseInt(e.target.value) || 0 })}
              />
            </label>
            <label>
              ATK
              <input
                type="text"
                value={character.atk}
                onChange={(e) => update({ atk: e.target.value })}
              />
            </label>
            <label>
              DEF
              <input
                type="text"
                value={character.def}
                onChange={(e) => update({ def: e.target.value })}
              />
            </label>
          </div>

          <EditableList
            title="Gear"
            items={character.gear}
            onItemsChange={(gear) => update({ gear })}
            color={character.color}
          />
          <EditableList
            title="Spells"
            items={character.spells}
            onItemsChange={(spells) => update({ spells })}
            color={character.color}
          />
          <EditableList
            title="Abilities"
            items={character.abilities}
            onItemsChange={(abilities) => update({ abilities })}
            color={character.color}
          />
          <EditableList
            title="Traits"
            items={character.traits}
            onItemsChange={(traits) => update({ traits })}
            color={character.color}
          />

          <AutoTextarea
            value={character.notes}
            onChange={(notes) => update({ notes })}
            placeholder="Notes..."
            className="setup-notes"
          />
        </div>
      )}
    </div>
  )
}
