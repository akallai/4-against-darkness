import { useState } from 'react'
import type { ListItem } from '@/types'
import { AutoTextarea } from './AutoTextarea'
import './EditableList.css'

interface EditableListProps {
  title: string
  items: ListItem[]
  onItemsChange: (items: ListItem[]) => void
  color?: string
}

export function EditableList({ title, items, onItemsChange, color }: EditableListProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

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

  return (
    <div className="editable-list">
      <div className="list-header" style={color ? { borderLeftColor: color } : undefined}>
        <span className="list-title">{title}</span>
        <span className="list-count">{items.length}</span>
      </div>
      <div className="list-rows">
        {items.map((item, i) => (
          <div key={i} className="item-group">
            <div className="list-row">
              <button
                className="btn-toggle-item"
                onClick={() => toggleExpanded(i)}
                title="Toggle details"
              >
                {expanded[i] ? '▼' : '▶'}
              </button>
              <input
                className="list-input"
                value={item.val}
                onChange={(e) => updateItem(i, 'val', e.target.value)}
                placeholder={`${title} name...`}
              />
              <button
                className="btn-list-action"
                onClick={() => deleteItem(i)}
                title="Delete"
              >
                ✕
              </button>
            </div>
            {expanded[i] && (
              <AutoTextarea
                className="list-details"
                value={item.det}
                onChange={(val) => updateItem(i, 'det', val)}
                placeholder="Details..."
              />
            )}
          </div>
        ))}
      </div>
      <button className="btn-list-add" onClick={addItem}>
        + Add
      </button>
    </div>
  )
}
