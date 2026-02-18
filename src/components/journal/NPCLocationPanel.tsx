import type { NPCLocation } from '@/types'
import { useJournalStore } from '@/stores/useJournalStore'
import { NPCCard } from './NPCCard'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './NPCLocationPanel.css'

interface NPCLocationPanelProps {
  location: NPCLocation
}

export function NPCLocationPanel({ location }: NPCLocationPanelProps) {
  const updateLocation = useJournalStore((s) => s.updateLocation)
  const deleteLocation = useJournalStore((s) => s.deleteLocation)
  const toggleLocationCollapse = useJournalStore((s) => s.toggleLocationCollapse)
  const addNPC = useJournalStore((s) => s.addNPC)

  return (
    <div className={`npc-location ${location.collapsed ? 'collapsed' : ''}`}>
      <div className="entry-header" onClick={() => toggleLocationCollapse(location.id)}>
        <button className="arrow-btn">
          {location.collapsed ? '▶' : '▼'}
        </button>
        <input
          className="entry-title"
          value={location.name}
          onChange={(e) => updateLocation(location.id, { name: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Location name..."
        />
        <button
          className="btn-list-action"
          onClick={(e) => {
            e.stopPropagation()
            deleteLocation(location.id)
          }}
          title="Delete location"
        >
          ✕
        </button>
      </div>
      {!location.collapsed && (
        <div className="npc-list-container">
          <AutoTextarea
            className="location-details"
            value={location.details}
            onChange={(details) => updateLocation(location.id, { details })}
            placeholder="Location details..."
          />
          <div className="npc-list">
            {location.list.map((npc) => (
              <NPCCard key={npc.id} npc={npc} locationId={location.id} />
            ))}
          </div>
          <button className="btn-gold-dashed npc-add-btn" onClick={() => addNPC(location.id)}>
            + Add NPC
          </button>
        </div>
      )}
    </div>
  )
}
