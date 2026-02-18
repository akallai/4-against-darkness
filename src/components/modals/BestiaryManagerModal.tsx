import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { useEncounterStore } from '@/stores/useEncounterStore'
import { saveBestiary } from '@/utils/persistence'
import type { BestiaryEntry, EncounterCategory } from '@/types'

interface BestiaryManagerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BestiaryManagerModal({ isOpen, onClose }: BestiaryManagerModalProps) {
  const bestiary = useEncounterStore((s) => s.bestiary)
  const addBestiaryEntry = useEncounterStore((s) => s.addBestiaryEntry)
  const deleteBestiaryEntry = useEncounterStore((s) => s.deleteBestiaryEntry)

  const [type, setType] = useState('')
  const [category, setCategory] = useState<EncounterCategory>('minion')
  const [lvl, setLvl] = useState('')
  const [life, setLife] = useState('')
  const [morale, setMorale] = useState('')
  const [attacks, setAttacks] = useState('')
  const [treasure, setTreasure] = useState('')
  const [abilities, setAbilities] = useState('')

  const handleAdd = () => {
    if (!type.trim()) return
    const entry: BestiaryEntry = { type: type.trim(), category, lvl, life, morale, attacks, treasure, abilities, notes: '' }
    addBestiaryEntry(entry)
    saveBestiary([...bestiary, entry])
    setType('')
    setLvl('')
    setLife('')
    setMorale('')
    setAttacks('')
    setTreasure('')
    setAbilities('')
  }

  const handleDelete = (index: number) => {
    deleteBestiaryEntry(index)
    const updated = bestiary.filter((_, i) => i !== index)
    saveBestiary(updated)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enemy Bestiary">
      <div style={{ maxHeight: '40vh', overflowY: 'auto', marginBottom: '10px' }}>
        {bestiary.map((entry, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>
              <strong>{entry.type}</strong>
              <span style={{ fontSize: '0.75em', color: '#999', marginLeft: '8px' }}>
                {entry.category} &bull; Lv{entry.lvl} &bull; Life {entry.life}
              </span>
            </div>
            <button className="btn-list-action" onClick={() => handleDelete(i)}>
              ✕
            </button>
          </div>
        ))}
        {bestiary.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
            No bestiary entries yet.
          </p>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
        <h4 style={{ color: 'var(--global-accent)', margin: '0 0 8px', fontSize: '0.9em' }}>Add Entry</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input placeholder="Enemy type" value={type} onChange={(e) => setType(e.target.value)} />
          <div style={{ display: 'flex', gap: '6px' }}>
            <select value={category} onChange={(e) => setCategory(e.target.value as EncounterCategory)} style={{ flex: 1 }}>
              <option value="minion">Minion</option>
              <option value="boss">Boss</option>
              <option value="weird">Weird</option>
            </select>
            <input placeholder="Lvl" value={lvl} onChange={(e) => setLvl(e.target.value)} style={{ flex: 1 }} />
            <input placeholder="Life" value={life} onChange={(e) => setLife(e.target.value)} style={{ flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input placeholder="Morale" value={morale} onChange={(e) => setMorale(e.target.value)} style={{ flex: 1 }} />
            <input placeholder="Attacks" value={attacks} onChange={(e) => setAttacks(e.target.value)} style={{ flex: 1 }} />
            <input placeholder="Treasure" value={treasure} onChange={(e) => setTreasure(e.target.value)} style={{ flex: 1 }} />
          </div>
          <input placeholder="Abilities" value={abilities} onChange={(e) => setAbilities(e.target.value)} />
          <button className="btn-main" onClick={handleAdd}>Add to Bestiary</button>
        </div>
      </div>
    </Modal>
  )
}
