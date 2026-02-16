import type { FollowersData } from '@/types'
import { useFollowerStore } from '@/stores/useFollowerStore'
import { OwnerSelect } from './OwnerSelect'
import './FollowerCard.css'

interface AnimalGridProps {
  animals: FollowersData['animals']
}

export function AnimalGrid({ animals }: AnimalGridProps) {
  const updateAnimal = useFollowerStore((s) => s.updateAnimal)

  return (
    <div className="animal-grid">
      {animals.map((animal, i) => (
        <div key={i} className="animal-slot">
          <div className="f-card-row">
            <input
              placeholder="Name"
              value={animal.name}
              onChange={(e) => updateAnimal(i, { name: e.target.value })}
            />
          </div>
          <div className="f-card-row">
            <input
              placeholder="Type"
              value={animal.type}
              onChange={(e) => updateAnimal(i, { type: e.target.value })}
            />
            <OwnerSelect
              value={animal.owner}
              onChange={(owner) => updateAnimal(i, { owner })}
            />
          </div>
          <div className="f-stat-row">
            <label>
              Life
              <input
                type="number"
                value={animal.life}
                onChange={(e) => updateAnimal(i, { life: parseInt(e.target.value) || 0 })}
              />
            </label>
            <label>
              ATK
              <input
                value={animal.atk}
                onChange={(e) => updateAnimal(i, { atk: e.target.value })}
              />
            </label>
            <label>
              DEF
              <input
                value={animal.def}
                onChange={(e) => updateAnimal(i, { def: e.target.value })}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}
