import type { NPC } from '@/types'
import { useJournalStore } from '@/stores/useJournalStore'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './NPCCard.css'

interface NPCCardProps {
  npc: NPC
  locationId: number
}

export function NPCCard({ npc, locationId }: NPCCardProps) {
  const updateNPC = useJournalStore((s) => s.updateNPC)
  const deleteNPC = useJournalStore((s) => s.deleteNPC)
  const toggleNPCCollapse = useJournalStore((s) => s.toggleNPCCollapse)

  const update = (updates: Partial<NPC>) => {
    updateNPC(locationId, npc.id, updates)
  }

  return (
    <div className={`npc-card ${npc.collapsed ? 'collapsed' : ''}`}>
      <div className="npc-header" onClick={() => toggleNPCCollapse(locationId, npc.id)}>
        <button className="arrow-btn">
          {npc.collapsed ? '▶' : '▼'}
        </button>
        <input
          className="npc-name-input"
          value={npc.name}
          onChange={(e) => update({ name: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="NPC name..."
        />
        <button
          className="btn-list-action"
          onClick={(e) => {
            e.stopPropagation()
            deleteNPC(locationId, npc.id)
          }}
        >
          ✕
        </button>
      </div>
      {!npc.collapsed && (
        <div className="npc-body">
          <div className="npc-stats-row">
            <label>
              Race
              <input value={npc.race} onChange={(e) => update({ race: e.target.value })} />
            </label>
            <label>
              Lvl
              <input value={npc.l} onChange={(e) => update({ l: e.target.value })} />
            </label>
            <label>
              Life
              <input value={npc.life} onChange={(e) => update({ life: e.target.value })} />
            </label>
            <label>
              Attacks
              <input value={npc.attacks} onChange={(e) => update({ attacks: e.target.value })} />
            </label>
          </div>
          <AutoTextarea
            className="npc-details"
            value={npc.details}
            onChange={(details) => update({ details })}
            placeholder="NPC details..."
          />
        </div>
      )}
    </div>
  )
}
