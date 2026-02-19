import { useState, useMemo } from 'react'
import { Modal } from '@/components/common/Modal'
import { useUIStore } from '@/stores/useUIStore'
import { usePartyStore } from '@/stores/usePartyStore'
import { useEncounterStore } from '@/stores/useEncounterStore'
import { defaultBestiary } from '@/data/defaultBestiary'
import { getHCL, getTier, resolveExpression, rollCountFormula } from '@/utils/hclTier'
import type { EncounterCategory, BestiaryEnvironment } from '@/types'
import './EncounterModals.css'

interface EncounterTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

type EnvironmentFilter = 'any' | Exclude<BestiaryEnvironment, 'custom'>

const ENVIRONMENTS: { key: EnvironmentFilter; label: string }[] = [
  { key: 'any', label: 'Any' },
  { key: 'dungeon', label: 'Dungeon' },
  { key: 'caverns', label: 'Caverns' },
  { key: 'fungal_grottoes', label: 'Fungal Grottoes' },
  { key: 'fiendish_foes', label: 'Fiendish Foes' },
]

const CATEGORIES: { key: EncounterCategory; icon: string; name: string; desc: string }[] = [
  { key: 'vermin', icon: '\u{1F41B}', name: 'Vermin', desc: 'Rats, bats, insects and crawling things' },
  { key: 'minion', icon: '\u2694', name: 'Minion', desc: 'Goblins, skeletons, orcs and other common foes' },
  { key: 'boss', icon: '\u2620', name: 'Boss / Special', desc: 'Powerful enemies and named adversaries' },
  { key: 'weird', icon: '\u2756', name: 'Weird Monster', desc: 'Strange and unusual creatures' },
]

export function EncounterTypeModal({ isOpen, onClose }: EncounterTypeModalProps) {
  const openModal = useUIStore((s) => s.openModal)
  const addEncounter = useEncounterStore((s) => s.addEncounter)
  const characters = usePartyStore((s) => s.characters)

  const [envFilter, setEnvFilter] = useState<EnvironmentFilter>('any')
  const [search, setSearch] = useState('')

  const filteredEntries = useMemo(() => {
    return defaultBestiary
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) => {
        if (envFilter !== 'any' && entry.environment !== envFilter) return false
        if (search && !entry.type.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
  }, [envFilter, search])

  const selectType = (category: string) => {
    sessionStorage.setItem('4AD_pending_enc_category', category)
    openModal('encounter-creation')
  }

  const selectEntry = (index: number, category: EncounterCategory) => {
    const compositeKey = `default-${index}`
    sessionStorage.setItem('4AD_pending_enc_bestiary_key', compositeKey)
    sessionStorage.setItem('4AD_pending_enc_category', category)
    if (envFilter !== 'any') {
      sessionStorage.setItem('4AD_pending_enc_environment', envFilter)
    }
    openModal('encounter-creation')
  }

  const rollRandom = (category: EncounterCategory) => {
    const candidates = defaultBestiary
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) => {
        if (entry.category !== category) return false
        if (envFilter !== 'any' && entry.environment !== envFilter) return false
        return true
      })

    if (candidates.length === 0) return

    const pick = candidates[Math.floor(Math.random() * candidates.length)]!
    const hcl = getHCL(characters)
    const tier = getTier(hcl)

    const resolvedLvl = resolveExpression(pick.entry.lvl, hcl, tier, pick.entry.maxLvl)
    const resolvedLife = resolveExpression(pick.entry.life, hcl, tier, pick.entry.maxLife)
    const rolledCount = rollCountFormula(pick.entry.count)

    addEncounter({
      type: pick.entry.type,
      category: pick.entry.category,
      lvl: String(resolvedLvl),
      life: String(resolvedLife),
      morale: pick.entry.morale,
      attacks: pick.entry.attacks,
      treasure: pick.entry.treasure,
      abilities: pick.entry.abilities,
      notes: pick.entry.notes ?? '',
      count: rolledCount,
    })

    onClose()
  }

  const openManual = () => {
    sessionStorage.removeItem('4AD_pending_enc_category')
    sessionStorage.removeItem('4AD_pending_enc_bestiary_key')
    sessionStorage.removeItem('4AD_pending_enc_environment')
    openModal('encounter-creation')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Encounter">
      {/* Environment pills */}
      <div className="enc-env-selector">
        {ENVIRONMENTS.map(({ key, label }) => (
          <button
            key={key}
            className={`enc-env-pill${envFilter === key ? ' active' : ''}`}
            onClick={() => setEnvFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category cards with random dice buttons */}
      <div className="enc-type-grid">
        {CATEGORIES.map(({ key, icon, name, desc }) => (
          <div key={key} className="enc-type-option-wrap">
            <button className="enc-type-option" onClick={() => selectType(key)}>
              <span className="enc-type-icon">{icon}</span>
              <div className="enc-type-info">
                <div className="enc-type-name">{name}</div>
                <div className="enc-type-desc">{desc}</div>
              </div>
            </button>
            <button
              className="enc-type-random-btn"
              onClick={(e) => {
                e.stopPropagation()
                rollRandom(key)
              }}
              title={`Random ${name} encounter`}
            >
              &#127922;
            </button>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="enc-divider">
        <span>or search the bestiary</span>
      </div>

      {/* Search */}
      <div className="enc-search-container">
        <input
          className="enc-search-input"
          placeholder="Search enemies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <div className="enc-search-results">
            {filteredEntries.length === 0 ? (
              <div className="enc-search-empty">No matches</div>
            ) : (
              filteredEntries.slice(0, 20).map(({ entry, index }) => (
                <button
                  key={`default-${index}`}
                  className="enc-search-row"
                  onClick={() => selectEntry(index, entry.category)}
                >
                  <span className="enc-search-row-name">{entry.type}</span>
                  <span className="enc-search-row-meta">
                    {entry.category} &middot; {entry.environment.replace('_', ' ')}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Enter manually */}
      <button className="enc-manual-link" onClick={openManual}>
        Enter manually
      </button>
    </Modal>
  )
}
