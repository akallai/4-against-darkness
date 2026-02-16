import { useRef, useCallback } from 'react'
import { usePartyStore } from '@/stores/usePartyStore'

export function useDragAndDrop() {
  const dragIndex = useRef<number | null>(null)
  const swapCharacters = usePartyStore((s) => s.swapCharacters)

  const dragHandlers = useCallback(
    (index: number) => ({
      draggable: true,
      onDragStart: () => {
        dragIndex.current = index
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault()
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        if (dragIndex.current !== null && dragIndex.current !== index) {
          swapCharacters(dragIndex.current, index)
        }
        dragIndex.current = null
      },
      onDragEnd: () => {
        dragIndex.current = null
      },
    }),
    [swapCharacters],
  )

  return { dragHandlers }
}
