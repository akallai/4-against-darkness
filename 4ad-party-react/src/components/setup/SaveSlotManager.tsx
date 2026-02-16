import { useState, useCallback } from 'react'
import { usePartyStore } from '@/stores/usePartyStore'
import { useGameSession } from '@/hooks/useGameSession'
import {
  listSavedParties,
  partyNameFromKey,
  partyKeyFromName,
  exportAllData,
  importAllData,
  deleteParty,
} from '@/utils/persistence'
import './SaveSlotManager.css'

export function SaveSlotManager() {
  const partyName = usePartyStore((s) => s.partyName)
  const setPartyName = usePartyStore((s) => s.setPartyName)
  const { loadGame } = useGameSession()
  const [selectedSlot, setSelectedSlot] = useState('')
  const savedParties = listSavedParties()

  const handleLoad = useCallback(() => {
    if (!selectedSlot) return
    loadGame(selectedSlot)
  }, [selectedSlot, loadGame])

  const handleDelete = useCallback(() => {
    if (!selectedSlot) return
    if (!confirm(`Delete "${partyNameFromKey(selectedSlot)}"?`)) return
    deleteParty(selectedSlot)
    setSelectedSlot('')
  }, [selectedSlot])

  const handleExport = useCallback(() => {
    const data = exportAllData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '4AD_Backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const ok = importAllData(reader.result as string)
        if (ok) {
          alert('Data imported successfully! Refresh to see changes.')
        } else {
          alert('Import failed. Invalid file format.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  const handleRename = useCallback(() => {
    if (!selectedSlot) return
    const newName = prompt('New party name:', partyNameFromKey(selectedSlot))
    if (!newName?.trim()) return
    const oldData = localStorage.getItem(selectedSlot)
    if (!oldData) return
    const newKey = partyKeyFromName(newName)
    // Copy all related keys
    const suffixes = ['', '_JournalData', '_Followers', '_Encounters', '_PartyStats', '_Quests']
    for (const suffix of suffixes) {
      const val = localStorage.getItem(selectedSlot + suffix)
      if (val) {
        localStorage.setItem(newKey + suffix, val)
        localStorage.removeItem(selectedSlot + suffix)
      }
    }
    setSelectedSlot(newKey)
  }, [selectedSlot])

  return (
    <div className="save-slot-manager">
      <div className="party-name-row">
        <input
          type="text"
          className="party-name-input"
          placeholder="Enter party name..."
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
      </div>

      {savedParties.length > 0 && (
        <div className="save-slots-row">
          <select
            className="save-slots-select"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">-- Saved Parties --</option>
            {savedParties.map((key) => (
              <option key={key} value={key}>
                {partyNameFromKey(key)}
              </option>
            ))}
          </select>
          <div className="slot-buttons">
            <button className="btn-secondary" onClick={handleLoad} disabled={!selectedSlot}>
              Load
            </button>
            <button className="btn-secondary" onClick={handleRename} disabled={!selectedSlot}>
              Rename
            </button>
            <button className="btn-secondary" onClick={handleDelete} disabled={!selectedSlot}>
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="data-buttons">
        <button className="btn-gold-dashed" onClick={handleExport}>
          Export All Data
        </button>
        <button className="btn-gold-dashed" onClick={handleImport}>
          Import Data
        </button>
      </div>
    </div>
  )
}
