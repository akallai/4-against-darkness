import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { useEncounterStore } from '@/stores/useEncounterStore'
import { saveBestiary } from '@/utils/persistence'
import { defaultBestiary } from '@/data/defaultBestiary'
import type { DefaultBestiaryEntry } from '@/data/defaultBestiary'
import type { BestiaryEntry, EncounterCategory, BestiaryEnvironment } from '@/types'
import './EncounterModals.css'

interface BestiaryManagerModalProps {
  isOpen: boolean
  onClose: () => void
}

const ENV_LABELS: Record<BestiaryEnvironment | 'all', string> = {
  all: 'All',
  dungeon: 'Dungeon',
  caverns: 'Caverns',
  fungal_grottoes: 'Fungal Grottoes',
  fiendish_foes: 'Fiendish Foes',
  custom: 'Custom',
}

const CAT_LABELS: Record<EncounterCategory | 'all', string> = {
  all: 'All',
  vermin: 'Vermin',
  minion: 'Minion',
  boss: 'Boss',
  weird: 'Weird',
}

function DefaultEntryRow({ entry }: { entry: DefaultBestiaryEntry }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bestiary-entry" onClick={() => setExpanded(!expanded)}>
      <div className="bestiary-entry-header">
        <span className="bestiary-entry-name">{entry.type}</span>
        <span className="bestiary-entry-tag">{entry.category}</span>
        <span className="bestiary-entry-stats">
          Lv {entry.lvl} / Life {entry.life}
        </span>
      </div>
      {expanded && (
        <div className="bestiary-entry-details">
          <div><strong>Count:</strong> {entry.count}</div>
          <div><strong>Morale:</strong> {entry.morale}</div>
          <div><strong>Attacks:</strong> {entry.attacks}</div>
          <div><strong>Treasure:</strong> {entry.treasure}</div>
          {entry.abilities && <div><strong>Abilities:</strong> {entry.abilities}</div>}
          {entry.notes && <div><strong>Notes/Reactions:</strong> {entry.notes}</div>}
        </div>
      )}
    </div>
  )
}

export function BestiaryManagerModal({ isOpen, onClose }: BestiaryManagerModalProps) {
  const bestiary = useEncounterStore((s) => s.bestiary)
  const addBestiaryEntry = useEncounterStore((s) => s.addBestiaryEntry)
  const deleteBestiaryEntry = useEncounterStore((s) => s.deleteBestiaryEntry)

  const [envFilter, setEnvFilter] = useState<BestiaryEnvironment | 'all'>('all')
  const [catFilter, setCatFilter] = useState<EncounterCategory | 'all'>('all')

  const [type, setType] = useState('')
  const [category, setCategory] = useState<EncounterCategory>('minion')
  const [lvl, setLvl] = useState('')
  const [life, setLife] = useState('')
  const [morale, setMorale] = useState('')
  const [attacks, setAttacks] = useState('')
  const [treasure, setTreasure] = useState('')
  const [abilities, setAbilities] = useState('')

  const filteredDefault = defaultBestiary.filter((e) => {
    if (envFilter !== 'all' && e.environment !== envFilter) return false
    if (catFilter !== 'all' && e.category !== catFilter) return false
    return true
  })

  const handleAdd = () => {
    if (!type.trim()) return
    const entry: BestiaryEntry = {
      type: type.trim(),
      category,
      lvl,
      life,
      morale,
      attacks,
      treasure,
      abilities,
      notes: '',
      environment: 'custom',
      count: '1',
    }
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
      <div className="bestiary-filters">
        <select
          value={envFilter}
          onChange={(e) => setEnvFilter(e.target.value as BestiaryEnvironment | 'all')}
        >
          {(Object.keys(ENV_LABELS) as (BestiaryEnvironment | 'all')[])
            .filter((k) => k !== 'custom')
            .map((key) => (
              <option key={key} value={key}>{ENV_LABELS[key]}</option>
            ))}
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value as EncounterCategory | 'all')}
        >
          {(Object.keys(CAT_LABELS) as (EncounterCategory | 'all')[]).map((key) => (
            <option key={key} value={key}>{CAT_LABELS[key]}</option>
          ))}
        </select>
      </div>

      <div style={{ maxHeight: '40vh', overflowY: 'auto', marginBottom: '10px' }}>
        <div className="bestiary-section-header">Core Rulebook</div>
        {filteredDefault.length > 0 ? (
          filteredDefault.map((entry, i) => (
            <DefaultEntryRow key={`default-${entry.type}-${entry.environment}-${i}`} entry={entry} />
          ))
        ) : (
          <p style={{ color: '#666', textAlign: 'center', fontStyle: 'italic', fontSize: '0.8em', padding: '8px 0' }}>
            No entries match the current filters.
          </p>
        )}

        <div className="bestiary-section-header" style={{ marginTop: '8px' }}>Custom Entries</div>
        {bestiary.length > 0 ? (
          bestiary.map((entry, i) => (
            <div key={i} className="bestiary-custom-entry">
              <div>
                <span className="bestiary-custom-info">
                  <strong>{entry.type}</strong>
                </span>
                <span className="bestiary-custom-meta">
                  {entry.category} &bull; Lv {entry.lvl} &bull; Life {entry.life}
                </span>
              </div>
              <button className="btn-list-action" onClick={() => handleDelete(i)}>
                ✕
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: '#666', textAlign: 'center', fontStyle: 'italic', fontSize: '0.8em', padding: '8px 0' }}>
            No custom entries yet.
          </p>
        )}
      </div>

      <div className="bestiary-add-section">
        <h4 style={{ color: 'var(--global-accent)', margin: '0 0 8px', fontSize: '0.9em' }}>Add Custom Entry</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input placeholder="Enemy type" value={type} onChange={(e) => setType(e.target.value)} />
          <div style={{ display: 'flex', gap: '6px' }}>
            <select value={category} onChange={(e) => setCategory(e.target.value as EncounterCategory)} style={{ flex: 1 }}>
              <option value="vermin">Vermin</option>
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
