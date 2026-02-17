import type { TileTemplate } from '@/types/map'
import { parseGrid } from '@/utils/mapGeometry'

interface TilePreviewProps {
  template: TileTemplate
  size?: number
}

export function TilePreview({ template, size = 6 }: TilePreviewProps) {
  const grid = parseGrid(template.grid)

  return (
    <div
      className="tile-preview"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${template.width}, ${size}px)`,
        gridTemplateRows: `repeat(${template.height}, ${size}px)`,
        gap: 0,
      }}
    >
      {grid.map((row, r) =>
        row.map((isFloor, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: size,
              height: size,
              backgroundColor: isFloor ? 'var(--map-wall-color)' : 'transparent',
            }}
          />
        )),
      )}
    </div>
  )
}
