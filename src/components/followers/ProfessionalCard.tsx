import type { Professional } from '@/types'
import { useFollowerStore } from '@/stores/useFollowerStore'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './FollowerCard.css'

interface ProfessionalCardProps {
  index: number
  professional: Professional
}

export function ProfessionalCard({ index, professional }: ProfessionalCardProps) {
  const updateProfessional = useFollowerStore((s) => s.updateProfessional)
  const deleteProfessional = useFollowerStore((s) => s.deleteProfessional)

  return (
    <div className="f-card">
      <div className="f-card-header">
        <input
          placeholder="Name"
          value={professional.name}
          onChange={(e) => updateProfessional(index, { name: e.target.value })}
        />
        <button className="btn-list-action" onClick={() => deleteProfessional(index)}>
          ✕
        </button>
      </div>
      <div className="f-card-row">
        <input
          placeholder="Role"
          value={professional.role}
          onChange={(e) => updateProfessional(index, { role: e.target.value })}
        />
        <input
          placeholder="Fee"
          value={professional.fee}
          onChange={(e) => updateProfessional(index, { fee: e.target.value })}
          className="f-small-input"
        />
      </div>
      <AutoTextarea
        value={professional.notes}
        onChange={(notes) => updateProfessional(index, { notes })}
        placeholder="Notes..."
        className="f-notes"
      />
    </div>
  )
}
