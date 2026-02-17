import { useState, useCallback } from 'react'
import { useMapStore } from '@/stores/useMapStore'
import { TILE_TEMPLATES, getEntranceTiles, getDungeonTiles } from '@/data/tileTemplates'
import { rollD66 } from '@/utils/dice'
import { TilePreview } from './TilePreview'
import type { TileTemplate } from '@/types/map'
import './TileCatalog.css'

type Filter = 'all' | 'entrance' | 'corridor' | 'room'

export function TileCatalog() {
  const selectedTemplateId = useMapStore((s) => s.selectedTemplateId)
  const setSelectedTemplate = useMapStore((s) => s.setSelectedTemplate)

  const [filter, setFilter] = useState<Filter>('all')
  const [rolledId, setRolledId] = useState<number | null>(null)

  const filteredTiles = getFilteredTiles(filter)

  const handleRollD66 = useCallback(() => {
    const result = rollD66()
    const tile = TILE_TEMPLATES.find((t) => t.id === result)
    if (tile) {
      setSelectedTemplate(tile.id)
      setRolledId(tile.id)
      setTimeout(() => setRolledId(null), 1500)
    }
  }, [setSelectedTemplate])

  return (
    <div className="tile-catalog">
      <div className="tile-catalog-header">
        <h3>Tiles</h3>
        <button className="tile-d66-btn" onClick={handleRollD66}>
          Roll d66
        </button>
        <div className="tile-catalog-filters">
          {(['all', 'entrance', 'corridor', 'room'] as const).map((f) => (
            <button
              key={f}
              className={`tile-filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="tile-catalog-list">
        {filteredTiles.map((t) => (
          <div
            key={t.id}
            className={`tile-thumb${selectedTemplateId === t.id ? ' selected' : ''}${rolledId === t.id ? ' rolled' : ''}`}
            onClick={() => setSelectedTemplate(t.id)}
          >
            <span className="tile-thumb-id">{t.id}</span>
            <TilePreview template={t} size={5} />
            <span className="tile-thumb-name">#{t.id}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function getFilteredTiles(filter: Filter): TileTemplate[] {
  switch (filter) {
    case 'entrance':
      return getEntranceTiles()
    case 'corridor':
      return getDungeonTiles().filter((t) => t.category === 'corridor')
    case 'room':
      return getDungeonTiles().filter((t) => t.category === 'room')
    default:
      return TILE_TEMPLATES
  }
}
