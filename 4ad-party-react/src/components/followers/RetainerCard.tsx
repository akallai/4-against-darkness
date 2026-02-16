import type { Retainer } from '@/types'
import { useFollowerStore } from '@/stores/useFollowerStore'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './FollowerCard.css'

interface RetainerCardProps {
  index: number
  retainer: Retainer
}

export function RetainerCard({ index, retainer }: RetainerCardProps) {
  const updateRetainer = useFollowerStore((s) => s.updateRetainer)
  const deleteRetainer = useFollowerStore((s) => s.deleteRetainer)

  return (
    <div className="f-card">
      <div className="f-card-header">
        <input
          placeholder="Name"
          value={retainer.name}
          onChange={(e) => updateRetainer(index, { name: e.target.value })}
        />
        <button className="btn-list-action" onClick={() => deleteRetainer(index)}>
          ✕
        </button>
      </div>
      <div className="f-card-row">
        <input
          placeholder="Role"
          value={retainer.role}
          onChange={(e) => updateRetainer(index, { role: e.target.value })}
        />
        <input
          placeholder="Fee"
          value={retainer.fee}
          onChange={(e) => updateRetainer(index, { fee: e.target.value })}
          className="f-small-input"
        />
      </div>
      <AutoTextarea
        value={retainer.notes}
        onChange={(notes) => updateRetainer(index, { notes })}
        placeholder="Notes..."
        className="f-notes"
      />
    </div>
  )
}
