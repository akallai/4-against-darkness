import { useRef, useEffect, useCallback } from 'react'

interface AutoTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function AutoTextarea({ value, onChange, placeholder, className }: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  return (
    <textarea
      ref={ref}
      className={className}
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        resize()
      }}
      placeholder={placeholder}
      rows={1}
    />
  )
}
