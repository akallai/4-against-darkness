import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { generateNPC, askOracle, randomEvent } from '@/utils/oracle'
import type { GeneratedNPC } from '@/utils/oracle'
import { useJournalStore } from '@/stores/useJournalStore'

interface OracleModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OracleModal({ isOpen, onClose }: OracleModalProps) {
  const [npc, setNpc] = useState<GeneratedNPC | null>(null)
  const [oracleAnswer, setOracleAnswer] = useState('')
  const [event, setEvent] = useState('')
  const addNPC = useJournalStore((s) => s.addNPC)
  const addNPCLocation = useJournalStore((s) => s.addNPCLocation)
  const journalData = useJournalStore((s) => s.journalData)

  const handleGenerateNPC = () => {
    setNpc(generateNPC())
    setOracleAnswer('')
    setEvent('')
  }

  const handleAskOracle = () => {
    setOracleAnswer(askOracle())
    setNpc(null)
    setEvent('')
  }

  const handleRandomEvent = () => {
    setEvent(randomEvent())
    setNpc(null)
    setOracleAnswer('')
  }

  const handleAddNPCToJournal = (locationId?: number) => {
    if (!npc) return
    let locId = locationId
    if (!locId) {
      // Create "The World" location if none exists
      if (journalData.npcLocations.length === 0) {
        addNPCLocation('The World')
        // Get the newly created location
        const newLocs = useJournalStore.getState().journalData.npcLocations
        locId = newLocs[newLocs.length - 1]?.id
      } else {
        locId = journalData.npcLocations[0]?.id
      }
    }
    if (locId) {
      addNPC(locId)
      const locs = useJournalStore.getState().journalData.npcLocations
      const loc = locs.find((l) => l.id === locId)
      if (loc) {
        const lastNpc = loc.list[loc.list.length - 1]
        if (lastNpc) {
          useJournalStore.getState().updateNPC(locId, lastNpc.id, {
            name: npc.name,
            race: npc.race,
            l: String(npc.lvl),
            life: String(npc.life),
            details: npc.trait,
          })
        }
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GM Tools">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
        <button className="btn-main" onClick={handleGenerateNPC}>
          Generate NPC
        </button>
        <button className="btn-main" onClick={handleAskOracle}>
          Yes / No Oracle
        </button>
        <button className="btn-main" onClick={handleRandomEvent}>
          Random Event
        </button>
      </div>

      <div style={{ minHeight: '100px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
        {npc && (
          <div>
            <strong style={{ color: 'var(--global-accent)', fontSize: '1.1em' }}>{npc.name}</strong>
            <br />
            <span style={{ fontSize: '0.85em', color: '#bbb' }}>
              {npc.race} &bull; Lvl {npc.lvl} &bull; Life {npc.life}
            </span>
            <p style={{ fontSize: '0.8em', fontStyle: 'italic', color: '#aaa', margin: '8px 0' }}>
              {npc.trait}
            </p>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.8em' }}
              onClick={() => handleAddNPCToJournal()}
            >
              Add to Journal
            </button>
          </div>
        )}
        {oracleAnswer && (
          <div style={{ textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold', color: 'var(--global-accent)' }}>
            {oracleAnswer}
          </div>
        )}
        {event && (
          <div style={{ textAlign: 'center', fontSize: '1.1em', fontStyle: 'italic', color: '#ddd' }}>
            {event}
          </div>
        )}
        {!npc && !oracleAnswer && !event && (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            Choose a tool above...
          </p>
        )}
      </div>
    </Modal>
  )
}
