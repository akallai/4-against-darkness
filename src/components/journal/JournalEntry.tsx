import type { JournalEntry as JournalEntryType } from '@/types'
import { useJournalStore } from '@/stores/useJournalStore'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './JournalEntry.css'

interface JournalEntryProps {
  entry: JournalEntryType
}

export function JournalEntry({ entry }: JournalEntryProps) {
  const updateEntry = useJournalStore((s) => s.updateEntry)
  const deleteEntry = useJournalStore((s) => s.deleteEntry)
  const toggleEntryCollapse = useJournalStore((s) => s.toggleEntryCollapse)

  return (
    <div className={`journal-entry ${entry.collapsed ? 'collapsed' : ''}`}>
      <div className="entry-header" onClick={() => toggleEntryCollapse(entry.id)}>
        <button className="arrow-btn">
          {entry.collapsed ? '▶' : '▼'}
        </button>
        <input
          className="entry-title"
          value={entry.title}
          onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Entry title..."
        />
        <button
          className="btn-list-action"
          onClick={(e) => {
            e.stopPropagation()
            deleteEntry(entry.id)
          }}
          title="Delete entry"
        >
          ✕
        </button>
      </div>
      {!entry.collapsed && (
        <AutoTextarea
          className="entry-content"
          value={entry.content}
          onChange={(content) => updateEntry(entry.id, { content })}
          placeholder="Write your journal entry..."
        />
      )}
    </div>
  )
}
