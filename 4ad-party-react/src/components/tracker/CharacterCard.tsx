import { useCallback } from 'react'
import type { Character } from '@/types'
import { usePartyStore } from '@/stores/usePartyStore'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { StatBox } from '@/components/common/StatBox'
import { EditableList } from '@/components/common/EditableList'
import { SpellTraitList } from '@/components/common/SpellTraitList'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './CharacterCard.css'

interface CharacterCardProps {
  index: number
  character: Character
}

export function CharacterCard({ index, character }: CharacterCardProps) {
  const updateCharacter = usePartyStore((s) => s.updateCharacter)
  const { dragHandlers } = useDragAndDrop()

  const update = useCallback(
    (updates: Partial<Character>) => {
      updateCharacter(index, updates)
    },
    [index, updateCharacter],
  )

  // HP helpers
  const hpParts = character.hp.split('/')
  const currentHp = parseInt(hpParts[0] ?? '0', 10)
  const maxHp = parseInt(hpParts[1] ?? '0', 10)

  const changeHp = (delta: number) => {
    const newHp = Math.max(0, currentHp + delta)
    update({ hp: `${newHp}/${maxHp}` })
  }

  const changeLvl = (delta: number) => {
    update({ lvl: Math.max(0, character.lvl + delta) })
  }

  return (
    <div
      className="char-card"
      style={{ borderTopColor: character.color }}
      {...dragHandlers(index)}
    >
      <div className="card-header">
        <div className="header-left">
          <input
            className="char-name"
            value={character.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Name"
          />
          <input
            className="char-class"
            value={character.class}
            onChange={(e) => update({ class: e.target.value })}
            placeholder="Class"
          />
        </div>
        <div className="header-right">
          <span className="lvl-label">Lv</span>
          <button className="arrow-btn" onClick={() => changeLvl(-1)}>
            <img src="/arrow_down.png" alt="-" className="arrow-icon" />
          </button>
          <span className="lvl-value">{character.lvl}</span>
          <button className="arrow-btn" onClick={() => changeLvl(1)}>
            <img src="/arrow_up.png" alt="+" className="arrow-icon" />
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <StatBox
          label="HP"
          value={character.hp}
          onChange={(val) => update({ hp: val })}
          onDecrement={() => changeHp(-1)}
          onIncrement={() => changeHp(1)}
        />
        <StatBox
          label="Gold"
          value={character.gp}
          onChange={(val) => update({ gp: parseInt(val) || 0 })}
          onDecrement={() => update({ gp: Math.max(0, character.gp - 1) })}
          onIncrement={() => update({ gp: character.gp + 1 })}
        />
        <StatBox
          label="ATK"
          value={character.atk}
          onChange={(val) => update({ atk: val })}
        />
        <StatBox
          label="DEF"
          value={character.def}
          onChange={(val) => update({ def: val })}
        />
      </div>

      <div className="toggle-group">
        <label>
          <input
            type="checkbox"
            className="circle-check"
            checked={character.lantern}
            onChange={(e) => update({ lantern: e.target.checked })}
          />
          Lantern
        </label>
        <label>
          <input
            type="checkbox"
            className="circle-check"
            checked={character.bandaged}
            onChange={(e) => update({ bandaged: e.target.checked })}
          />
          Bandaged
        </label>
      </div>

      <div className="card-scroll-area">
        <EditableList
          title="Inventory"
          items={character.gear}
          onItemsChange={(gear) => update({ gear })}
          color={character.color}
        />
        <SpellTraitList
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

        <div className="secondary-stats">
          <label>
            Clues
            <input
              type="number"
              value={character.clues}
              onChange={(e) => update({ clues: parseInt(e.target.value) || 0 })}
            />
          </label>
          <label>
            Madness
            <input
              type="number"
              value={character.madness}
              onChange={(e) => update({ madness: parseInt(e.target.value) || 0 })}
            />
          </label>
          <label>
            Rations
            <input
              type="number"
              value={character.rations}
              onChange={(e) => update({ rations: parseInt(e.target.value) || 0 })}
            />
          </label>
          <label>
            XP
            <input
              type="number"
              value={character.xp}
              onChange={(e) => update({ xp: parseInt(e.target.value) || 0 })}
            />
          </label>
        </div>

        <EditableList
          title="Milestones"
          items={character.milestones}
          onItemsChange={(milestones) =>
            update({
              milestones: milestones.map((m) => ({
                ...m,
                completed: (m as unknown as { completed?: boolean }).completed ?? false,
              })),
            })
          }
          color={character.color}
        />

        <AutoTextarea
          value={character.notes}
          onChange={(notes) => update({ notes })}
          placeholder="Notes..."
          className="card-notes"
        />
      </div>
    </div>
  )
}
