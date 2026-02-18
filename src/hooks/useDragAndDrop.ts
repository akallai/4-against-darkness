import { useState, useCallback } from 'react'
import { usePartyStore } from '@/stores/usePartyStore'

export function useDragAndDrop() {
  const swapCharacters = usePartyStore((s) => s.swapCharacters)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const dragHandlers = useCallback(
    (index: number) => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setOverIndex(index)
      },
      onDragLeave: () => {
        setOverIndex((prev) => (prev === index ? null : prev))
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
        if (!isNaN(sourceIndex) && sourceIndex !== index) {
          swapCharacters(sourceIndex, index)
        }
        setDraggedIndex(null)
        setOverIndex(null)
      },
    }),
    [swapCharacters],
  )

  const handleHandlers = useCallback(
    (index: number) => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(index))
        setDraggedIndex(index)
      },
      onDragEnd: () => {
        setDraggedIndex(null)
        setOverIndex(null)
      },
    }),
    [],
  )

  return { dragHandlers, handleHandlers, draggedIndex, overIndex }
}
