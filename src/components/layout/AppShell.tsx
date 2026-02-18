import { type ReactNode, useCallback } from 'react'
import { useTheme } from '@/hooks/useTheme'
import './AppShell.css'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  useTheme()

  return (
    <div className="app-shell">
      <div className="app-background" />
      <div className="app-content">
        {children}
      </div>
    </div>
  )
}

export function useFullscreen() {
  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  return { toggleFullscreen: toggle }
}
