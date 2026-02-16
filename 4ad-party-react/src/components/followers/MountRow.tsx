import type { FollowersData } from '@/types'
import { useFollowerStore } from '@/stores/useFollowerStore'
import { OwnerSelect } from './OwnerSelect'
import './FollowerCard.css'

interface MountRowProps {
  mounts: FollowersData['mounts']
}

export function MountRow({ mounts }: MountRowProps) {
  const updateMount = useFollowerStore((s) => s.updateMount)

  return (
    <div className="mount-row">
      {mounts.map((mount, i) => (
        <div key={i} className="mount-slot">
          <div className="f-card-row">
            <input
              placeholder="Name"
              value={mount.name}
              onChange={(e) => updateMount(i, { name: e.target.value })}
            />
          </div>
          <div className="f-card-row">
            <input
              placeholder="Type"
              value={mount.type}
              onChange={(e) => updateMount(i, { type: e.target.value })}
            />
          </div>
          <div className="f-stat-row">
            <label>
              Life
              <input
                type="number"
                value={mount.life}
                onChange={(e) => updateMount(i, { life: parseInt(e.target.value) || 0 })}
              />
            </label>
          </div>
          <OwnerSelect
            value={mount.owner}
            onChange={(owner) => updateMount(i, { owner })}
          />
        </div>
      ))}
    </div>
  )
}
