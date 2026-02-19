import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { useTavernStore } from '@/stores/useTavernStore'
import type { TavernHero } from '@/stores/useTavernStore'
import { applyClassTemplate, CLASS_NAMES } from '@/utils/applyClassTemplate'

interface TavernCreatorModalProps {
  isOpen: boolean
  onClose: () => void
}

const defaultColors = ['#d4af37', '#c0c0c0', '#cd7f32', '#b87333', '#4a90d9', '#50c878']

export function TavernCreatorModal({ isOpen, onClose }: TavernCreatorModalProps) {
  const addHero = useTavernStore((s) => s.addHero)

  const [name, setName] = useState('')
  const [charClass, setCharClass] = useState('')
  const [lvl, setLvl] = useState(1)
  const [hp, setHp] = useState('')
  const [gp, setGp] = useState(0)
  const [atk, setAtk] = useState('+0')
  const [def, setDef] = useState('+0')
  const [color, setColor] = useState(defaultColors[0]!)

  const handleCreate = () => {
    if (!name.trim()) return
    const trimmedClass = charClass.trim()
    const template = CLASS_NAMES.includes(trimmedClass)
      ? applyClassTemplate(trimmedClass, lvl)
      : undefined
    const hero: TavernHero = {
      tavernId: Date.now(),
      name: name.trim(),
      class: trimmedClass,
      lvl,
      hp: hp || `${lvl}/${lvl}`,
      gp,
      atk,
      def,
      madness: 0,
      clues: 0,
      rations: template?.rations ?? 0,
      xp: 0,
      color,
      lantern: template?.lantern ?? false,
      bandaged: false,
      gear: template?.gear ?? [],
      spells: template?.spells ?? [],
      abilities: template?.abilities ?? [],
      traits: template?.traits ?? [],
      milestones: [],
      notes: '',
    }
    addHero(hero)
    setName('')
    setCharClass('')
    setLvl(1)
    setHp('')
    setGp(0)
    setAtk('+0')
    setDef('+0')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Tavern Hero">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input placeholder="Hero name" value={name} onChange={(e) => setName(e.target.value)} />
        <select
          value={CLASS_NAMES.includes(charClass) ? charClass : charClass === '' ? '' : '__custom__'}
          onChange={(e) => {
            const cls = e.target.value
            if (cls === '__custom__') {
              setCharClass(' ')
              return
            }
            setCharClass(cls)
            const template = applyClassTemplate(cls, lvl)
            if (template) {
              if (template.hp) setHp(template.hp)
              if (template.gp !== undefined) setGp(template.gp)
              if (template.atk) setAtk(template.atk)
              if (template.def) setDef(template.def)
            }
          }}
        >
          <option value="">— Select Class —</option>
          {CLASS_NAMES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
          <option value="__custom__">Custom...</option>
        </select>
        {charClass !== '' && !CLASS_NAMES.includes(charClass) && (
          <input placeholder="Custom Class" value={charClass.trim()} onChange={(e) => setCharClass(e.target.value)} autoFocus />
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <label style={{ flex: 1, fontSize: '0.8em' }}>
            Level
            <input type="number" value={lvl} onChange={(e) => setLvl(parseInt(e.target.value) || 1)} min={1} />
          </label>
          <label style={{ flex: 1, fontSize: '0.8em' }}>
            HP
            <input placeholder="1/1" value={hp} onChange={(e) => setHp(e.target.value)} />
          </label>
          <label style={{ flex: 1, fontSize: '0.8em' }}>
            Gold
            <input type="number" value={gp} onChange={(e) => setGp(parseInt(e.target.value) || 0)} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <label style={{ flex: 1, fontSize: '0.8em' }}>
            ATK
            <input value={atk} onChange={(e) => setAtk(e.target.value)} />
          </label>
          <label style={{ flex: 1, fontSize: '0.8em' }}>
            DEF
            <input value={def} onChange={(e) => setDef(e.target.value)} />
          </label>
          <label style={{ flex: 1, fontSize: '0.8em' }}>
            Color
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        </div>
      </div>

      <button className="btn-main" style={{ width: '100%', marginTop: '15px' }} onClick={handleCreate}>
        Create Hero
      </button>
    </Modal>
  )
}
