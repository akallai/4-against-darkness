import { useState } from 'react'
import type { ListItem } from '@/types'
import { AutoTextarea } from './AutoTextarea'
import './EditableList.css'
import './SpellTraitList.css'

interface SpellTraitListProps {
  title: string
  items: ListItem[]
  onItemsChange: (items: ListItem[]) => void
  maxPips?: number
  color?: string
}

export function SpellTraitList({ title, items, onItemsChange, maxPips = 3, color }: SpellTraitListProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [editingPips, setEditingPips] = useState(false)

  const addItem = () => {
    onItemsChange([...items, { val: '', det: '' }])
  }

  const updateItem = (index: number, field: keyof ListItem, value: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    )
    onItemsChange(updated)
  }

  const deleteItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index))
  }

  const toggleExpanded = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  // Parse pips from the det field (stored as "used:X/total:Y")
  const parsePips = (det: string): { used: number; total: number } => {
    const match = det.match(/pips:(\d+)\/(\d+)/)
    if (match) return { used: parseInt(match[1]!, 10), total: parseInt(match[2]!, 10) }
    return { used: 0, total: maxPips }
  }

  const setPips = (index: number, used: number, total: number) => {
    const item = items[index]!
    // Strip old pip data, append new
    const baseDet = item.det.replace(/ ?pips:\d+\/\d+/, '')
    const newDet = `${baseDet} pips:${used}/${total}`.trim()
    updateItem(index, 'det', newDet)
  }

  return (
    <div className="editable-list spell-list">
      <div className="list-header" style={color ? { borderLeftColor: color } : undefined}>
        <span className="list-title">{title}</span>
        <button
          className={`btn-header-tiny ${editingPips ? 'active-edit' : ''}`}
          onClick={() => setEditingPips(!editingPips)}
          title="Toggle pip editing"
        >
          &#x270E;
        </button>
        <span className="list-count">{items.length}</span>
      </div>
      <div className="list-rows">
        {items.map((item, i) => {
          const pips = parsePips(item.det)
          return (
            <div key={i} className="item-group">
              <div className="list-row">
                <button className="btn-toggle-item" onClick={() => toggleExpanded(i)}>
                  {expanded[i] ? '▼' : '▶'}
                </button>
                <input
                  className="list-input"
                  value={item.val}
                  onChange={(e) => updateItem(i, 'val', e.target.value)}
                  placeholder={`${title} name...`}
                />
                <div className="pip-row">
                  {Array.from({ length: pips.total }, (_, pipIdx) => (
                    <span
                      key={pipIdx}
                      className={`pip ${pipIdx < pips.used ? 'pip-used' : ''}`}
                      onClick={() => {
                        const newUsed = pipIdx < pips.used ? pipIdx : pipIdx + 1
                        setPips(i, newUsed, pips.total)
                      }}
                    />
                  ))}
                </div>
                {editingPips && (
                  <div className="pip-edit-controls">
                    <button
                      className="pip-edit-btn"
                      onClick={() => setPips(i, pips.used, Math.max(0, pips.total - 1))}
                    >
                      −
                    </button>
                    <button
                      className="pip-edit-btn"
                      onClick={() => setPips(i, pips.used, pips.total + 1)}
                    >
                      +
                    </button>
                  </div>
                )}
                <button className="btn-list-action" onClick={() => deleteItem(i)}>
                  ✕
                </button>
              </div>
              {expanded[i] && (
                <AutoTextarea
                  className="list-details"
                  value={item.det.replace(/ ?pips:\d+\/\d+/, '')}
                  onChange={(val) => {
                    const pipPart = item.det.match(/pips:\d+\/\d+/)
                    const newDet = pipPart ? `${val} ${pipPart[0]}` : val
                    updateItem(i, 'det', newDet)
                  }}
                  placeholder="Details..."
                />
              )}
            </div>
          )
        })}
      </div>
      <button className="btn-list-add" onClick={addItem}>
        + Add
      </button>
    </div>
  )
}
