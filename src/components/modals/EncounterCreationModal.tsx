import { useState, useEffect, useMemo } from 'react'
import { Modal } from '@/components/common/Modal'
import { useEncounterStore } from '@/stores/useEncounterStore'
import { usePartyStore } from '@/stores/usePartyStore'
import { useUIStore } from '@/stores/useUIStore'
import { defaultBestiary } from '@/data/defaultBestiary'
import type { DefaultBestiaryEntry } from '@/data/defaultBestiary'
import { getHCL, getTier, resolveExpression, rollCountFormula } from '@/utils/hclTier'
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
  const characters = usePartyStore((s) => s.characters)

  const [type, setType] = useState('')
  const [count, setCount] = useState(1)
  const [life, setLife] = useState('')
  const [lvl, setLvl] = useState('')
  const [morale, setMorale] = useState('')
  const [attacks, setAttacks] = useState('')
  const [treasure, setTreasure] = useState('')
  const [abilities, setAbilities] = useState('')
  const [category, setCategory] = useState<EncounterCategory>('minion')
  const [bestiarySearch, setBestiarySearch] = useState('')
  const [showBestiaryResults, setShowBestiaryResults] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')

  const allEntries = useMemo(() => {
    const defaults = defaultBestiary.map((entry, index) => ({
      key: `default-${index}`,
      name: entry.type,
      category: entry.category,
      environment: entry.environment,
      source: 'default' as const,
    }))
    const customs = bestiary.map((entry, index) => ({
      key: `custom-${index}`,
      name: entry.type,
      category: entry.category,
      environment: entry.environment,
      source: 'custom' as const,
    }))
    return [...defaults, ...customs]
  }, [bestiary])

  const filteredBestiary = useMemo(() => {
    if (!bestiarySearch) return []
    const q = bestiarySearch.toLowerCase()
    return allEntries.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 20)
  }, [bestiarySearch, allEntries])

  const loadFromBestiary = (compositeKey: string) => {
    if (!compositeKey) return

    const hcl = getHCL(characters)
    const tier = getTier(hcl)

    if (compositeKey.startsWith('default-')) {
      const index = parseInt(compositeKey.slice('default-'.length), 10)
      const entry: DefaultBestiaryEntry | undefined = defaultBestiary[index]
      if (!entry) return

      setType(entry.type)
      setCategory(entry.category)
      setMorale(entry.morale)
      setAttacks(entry.attacks)
      setTreasure(entry.treasure)
      setAbilities(entry.abilities)

      const resolvedLvl = resolveExpression(entry.lvl, hcl, tier, entry.maxLvl)
      setLvl(String(resolvedLvl))

      const resolvedLife = resolveExpression(entry.life, hcl, tier, entry.maxLife)
      setLife(String(resolvedLife))

      const rolledCount = rollCountFormula(entry.count)
      setCount(rolledCount)
      setSelectedLabel(entry.type)
    } else if (compositeKey.startsWith('custom-')) {
      const index = parseInt(compositeKey.slice('custom-'.length), 10)
      const entry = bestiary[index]
      if (!entry) return

      setType(entry.type)
      setLife(entry.life)
      setLvl(entry.lvl)
      setMorale(entry.morale)
      setAttacks(entry.attacks)
      setTreasure(entry.treasure)
      setAbilities(entry.abilities)
      setCategory(entry.category)
      setSelectedLabel(entry.type)
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Reset search state
      setBestiarySearch('')
      setShowBestiaryResults(false)
      setSelectedLabel('')

      const cat = sessionStorage.getItem('4AD_pending_enc_category') as EncounterCategory | null
      if (cat) {
        setCategory(cat)
        sessionStorage.removeItem('4AD_pending_enc_category')
      }

      const pendingKey = sessionStorage.getItem('4AD_pending_enc_bestiary_key')
      if (pendingKey) {
        sessionStorage.removeItem('4AD_pending_enc_bestiary_key')
        sessionStorage.removeItem('4AD_pending_enc_environment')
        loadFromBestiary(pendingKey)
      } else {
        // Reset form fields when no pending key
        setType('')
        setCount(1)
        setLife('')
        setLvl('')
        setMorale('')
        setAttacks('')
        setTreasure('')
        setAbilities('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

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

  const handleSearchSelect = (key: string) => {
    loadFromBestiary(key)
    setBestiarySearch('')
    setShowBestiaryResults(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Encounter">
      <div className="enc-create-bestiary">
        <label>From Bestiary</label>
        <div className="enc-search-container enc-search-inline">
          <input
            className="enc-search-input"
            placeholder={selectedLabel || 'Search creatures...'}
            value={bestiarySearch}
            onChange={(e) => {
              setBestiarySearch(e.target.value)
              setShowBestiaryResults(true)
            }}
            onFocus={() => {
              if (bestiarySearch) setShowBestiaryResults(true)
            }}
          />
          {showBestiaryResults && bestiarySearch && (
            <div className="enc-search-results">
              {filteredBestiary.length === 0 ? (
                <div className="enc-search-empty">No matches</div>
              ) : (
                filteredBestiary.map((entry) => (
                  <button
                    key={entry.key}
                    className="enc-search-row"
                    onClick={() => handleSearchSelect(entry.key)}
                  >
                    <span className="enc-search-row-name">{entry.name}</span>
                    <span className="enc-search-row-meta">
                      {entry.category}
                      {entry.source === 'custom' ? ' \u00b7 custom' : ` \u00b7 ${entry.environment.replace('_', ' ')}`}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

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
