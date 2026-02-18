import { useState, useEffect } from 'react'
import { Modal } from '@/components/common/Modal'
import { useEncounterStore } from '@/stores/useEncounterStore'
import { useUIStore } from '@/stores/useUIStore'
import type { EncounterCategory } from '@/types'
import './EncounterModals.css'

interface EncounterCreationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EncounterCreationModal({ isOpen, onClose }: EncounterCreationModalProps) {
  const addEncounter = useEncounterStore((s) => s.addEncounter)
  const bestiary = useEncounterStore((s) => s.bestiary)
  const closeModal = useUIStore((s) => s.closeModal)

  const [type, setType] = useState('')
  const [count, setCount] = useState(1)
  const [life, setLife] = useState('')
  const [lvl, setLvl] = useState('')
  const [morale, setMorale] = useState('')
  const [attacks, setAttacks] = useState('')
  const [treasure, setTreasure] = useState('')
  const [abilities, setAbilities] = useState('')
  const [category, setCategory] = useState<EncounterCategory>('minion')
  const [selectedBestiary, setSelectedBestiary] = useState('')

  useEffect(() => {
    if (isOpen) {
      const cat = sessionStorage.getItem('4AD_pending_enc_category') as EncounterCategory | null
      if (cat) setCategory(cat)
    }
  }, [isOpen])

  const loadFromBestiary = (index: string) => {
    setSelectedBestiary(index)
    const entry = bestiary[parseInt(index)]
    if (!entry) return
    setType(entry.type)
    setLife(entry.life)
    setLvl(entry.lvl)
    setMorale(entry.morale)
    setAttacks(entry.attacks)
    setTreasure(entry.treasure)
    setAbilities(entry.abilities)
    setCategory(entry.category)
  }

  const handleCreate = () => {
    if (!type.trim()) return
    addEncounter({
      type: type.trim(),
      category,
      lvl,
      life,
      morale,
      treasure,
      attacks,
      abilities,
      notes: '',
      count,
    })
    closeModal()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Encounter">
      {bestiary.length > 0 && (
        <div className="enc-create-bestiary">
          <label>From Bestiary</label>
          <select value={selectedBestiary} onChange={(e) => loadFromBestiary(e.target.value)}>
            <option value="">-- Select creature --</option>
            {bestiary.map((b, i) => (
              <option key={i} value={i}>{b.type} ({b.category})</option>
            ))}
          </select>
        </div>
      )}

      <div className="enc-create-form">
        <input
          className="enc-create-name-input"
          placeholder="Enemy name"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <div className="enc-create-section-label">Combat Stats</div>

        <div className="enc-create-stat-row">
          <div className="enc-create-field">
            <label>Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              min={1}
            />
          </div>
          <div className="enc-create-field">
            <label>Life</label>
            <input value={life} onChange={(e) => setLife(e.target.value)} placeholder="HP" />
          </div>
          <div className="enc-create-field">
            <label>Level</label>
            <input value={lvl} onChange={(e) => setLvl(e.target.value)} placeholder="Lvl" />
          </div>
        </div>

        <div className="enc-create-stat-row">
          <div className="enc-create-field">
            <label>Morale</label>
            <input value={morale} onChange={(e) => setMorale(e.target.value)} />
          </div>
          <div className="enc-create-field">
            <label>Attacks</label>
            <input value={attacks} onChange={(e) => setAttacks(e.target.value)} />
          </div>
          <div className="enc-create-field">
            <label>Treasure</label>
            <input value={treasure} onChange={(e) => setTreasure(e.target.value)} />
          </div>
        </div>

        <div className="enc-create-section-label">Special</div>

        <input
          className="enc-create-abilities-input"
          placeholder="Abilities (e.g. regeneration, flying...)"
          value={abilities}
          onChange={(e) => setAbilities(e.target.value)}
        />
      </div>

      <button className="btn-main enc-create-submit" onClick={handleCreate}>
        Create Encounter
      </button>
    </Modal>
  )
}
