import { useCallback } from 'react'
import { Modal } from '@/components/common/Modal'
import { useJournalStore } from '@/stores/useJournalStore'

interface JournalToolsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JournalToolsModal({ isOpen, onClose }: JournalToolsModalProps) {
  const journalData = useJournalStore((s) => s.journalData)
  const setJournalData = useJournalStore((s) => s.setJournalData)

  const handleExportText = useCallback(() => {
    let text = '=== ADVENTURE JOURNAL ===\n\n'
    for (const entry of journalData.entries) {
      text += `--- ${entry.title} ---\n${entry.content}\n\n`
    }
    text += '\n=== NPC LOCATIONS ===\n\n'
    for (const loc of journalData.npcLocations) {
      text += `[${loc.name}]\n${loc.details}\n`
      for (const npc of loc.list) {
        text += `  - ${npc.name} (${npc.race}, Lv${npc.l}, Life ${npc.life})\n`
        if (npc.details) text += `    ${npc.details}\n`
      }
      text += '\n'
    }

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'journal_export.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [journalData])

  const handleBackup = useCallback(() => {
    const data = JSON.stringify(journalData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'journal_backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [journalData])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string)
          setJournalData(data)
          alert('Journal imported successfully!')
        } catch {
          alert('Invalid journal file.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [setJournalData])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Journal Options">
      <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '15px' }}>
        Export your saga as a readable text file, or backup your data.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn-main" onClick={handleExportText}>
          Download Text Log
        </button>
        <button className="btn-main" onClick={handleBackup}>
          Backup Journal (JSON)
        </button>
        <button className="btn-secondary" onClick={handleImport}>
          Import Journal
        </button>
      </div>
    </Modal>
  )
}
