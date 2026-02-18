import { useRef, useCallback, useEffect } from 'react'

interface UseLongPressOptions {
  onLongPress: () => void
  onClick: () => void
  threshold?: number
}

export function useLongPress({ onLongPress, onClick, threshold = 500 }: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firedRef = useRef(false)

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      firedRef.current = false
      timerRef.current = setTimeout(() => {
        firedRef.current = true
        onLongPress()
      }, threshold)
    },
    [onLongPress, threshold],
  )

  const onPointerUp = useCallback(() => {
    clear()
    if (!firedRef.current) {
      onClick()
    }
  }, [clear, onClick])

  const onPointerLeave = useCallback(() => {
    clear()
    firedRef.current = true // prevent onClick from firing
  }, [clear])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { onPointerDown, onPointerUp, onPointerLeave }
}
