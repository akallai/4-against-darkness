import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Screen, Theme } from '@/types'

interface UIState {
  screen: Screen
  theme: Theme
  activeModal: string | null
  skipDeleteConfirm: boolean
  skipMilestoneConfirm: boolean

  setScreen: (screen: Screen) => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  openModal: (id: string) => void
  closeModal: () => void
  setSkipDeleteConfirm: (val: boolean) => void
  setSkipMilestoneConfirm: (val: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      screen: 'setup',
      theme: 'dark',
      activeModal: null,
      skipDeleteConfirm: false,
      skipMilestoneConfirm: false,

      setScreen: (screen) => set({ screen }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'classic' : 'dark' })),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
      setSkipDeleteConfirm: (val) => set({ skipDeleteConfirm: val }),
      setSkipMilestoneConfirm: (val) => set({ skipMilestoneConfirm: val }),
    }),
    {
      name: '4AD_UI',
      partialize: (state) => ({
        theme: state.theme,
        skipDeleteConfirm: state.skipDeleteConfirm,
        skipMilestoneConfirm: state.skipMilestoneConfirm,
      }),
    },
  ),
)
