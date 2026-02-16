import { usePartyStore } from '@/stores/usePartyStore'

interface OwnerSelectProps {
  value: string
  onChange: (value: string) => void
}

export function OwnerSelect({ value, onChange }: OwnerSelectProps) {
  const characters = usePartyStore((s) => s.characters)
  const names = characters.map((c) => c.name).filter(Boolean)

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">-- Owner --</option>
      {names.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  )
}
