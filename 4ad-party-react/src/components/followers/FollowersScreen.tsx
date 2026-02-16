import { useFollowerStore } from '@/stores/useFollowerStore'
import { useUIStore } from '@/stores/useUIStore'
import { useGameSession } from '@/hooks/useGameSession'
import { FooterBar } from '@/components/layout/FooterBar'
import { RetainerCard } from './RetainerCard'
import { ProfessionalCard } from './ProfessionalCard'
import { AnimalGrid } from './AnimalGrid'
import { MountRow } from './MountRow'
import './FollowersScreen.css'

export function FollowersScreen() {
  const followersData = useFollowerStore((s) => s.followersData)
  const addRetainer = useFollowerStore((s) => s.addRetainer)
  const addProfessional = useFollowerStore((s) => s.addProfessional)
  const setScreen = useUIStore((s) => s.setScreen)
  const { save, saveAndQuit } = useGameSession()

  return (
    <div className="followers-screen">
      <div className="followers-layout">
        <div className="hireling-column">
          <h2 className="follower-col-header">Retainers</h2>
          {followersData.retainers.map((r, i) => (
            <RetainerCard key={i} index={i} retainer={r} />
          ))}
          <button className="btn-gold-dashed" onClick={() => addRetainer()}>
            + Add Retainer
          </button>
        </div>

        <div className="hireling-column">
          <h2 className="follower-col-header">Professionals</h2>
          {followersData.professionals.map((p, i) => (
            <ProfessionalCard key={i} index={i} professional={p} />
          ))}
          <button className="btn-gold-dashed" onClick={() => addProfessional()}>
            + Add Professional
          </button>
        </div>

        <div className="beast-column-wrapper">
          <h2 className="follower-col-header">Companions &amp; Mounts</h2>
          <AnimalGrid animals={followersData.animals} />
          <MountRow mounts={followersData.mounts} />
        </div>
      </div>

      <div className="followers-footer">
        <button className="btn-main" onClick={() => setScreen('tracker')}>
          &#x2190; Back
        </button>
      </div>
      <FooterBar onSave={save} onQuit={saveAndQuit} />
    </div>
  )
}
