import { useEffect } from 'react'
import { useUIStore } from '@/stores/useUIStore'

export function useTheme() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

  useEffect(() => {
    if (theme === 'classic') {
      document.body.classList.add('classic-mode')
    } else {
      document.body.classList.remove('classic-mode')
    }

    const meta = document.getElementById('theme-color-meta') as HTMLMetaElement | null
    if (meta) {
      meta.content = theme === 'classic' ? '#1e1b18' : '#1a1a1a'
    }
  }, [theme])

  return { theme, setTheme, toggleTheme }
}
