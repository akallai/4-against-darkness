import './StatBox.css'

interface StatBoxProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  onIncrement?: () => void
  onDecrement?: () => void
  type?: 'text' | 'number'
}

export function StatBox({ label, value, onChange, onIncrement, onDecrement, type = 'text' }: StatBoxProps) {
  return (
    <div className="stat-box">
      <label>{label}</label>
      <div className="stat-controls">
        {onDecrement && (
          <button className="stat-btn" onClick={onDecrement} title={`Decrease ${label}`}>
            <img src="/btn_minus.png" alt="-" className="stat-icon" />
          </button>
        )}
        <input
          className="stat-input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {onIncrement && (
          <button className="stat-btn" onClick={onIncrement} title={`Increase ${label}`}>
            <img src="/btn_plus.png" alt="+" className="stat-icon" />
          </button>
        )}
      </div>
    </div>
  )
}
