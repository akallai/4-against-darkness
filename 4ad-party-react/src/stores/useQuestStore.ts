import { create } from 'zustand'
import type { Quest, QuestTask } from '@/types'

interface QuestState {
  quests: Quest[]

  setQuests: (quests: Quest[]) => void
  resetQuests: () => void

  addQuest: (quest?: Partial<Quest>) => void
  updateQuest: (id: number, updates: Partial<Quest>) => void
  deleteQuest: (id: number) => void
  toggleQuestCollapse: (id: number) => void

  addTask: (questId: number, val?: string) => void
  updateTask: (questId: number, taskId: number, updates: Partial<QuestTask>) => void
  toggleTask: (questId: number, taskId: number) => void
  deleteTask: (questId: number, taskId: number) => void
}

export const useQuestStore = create<QuestState>()((set) => ({
  quests: [],

  setQuests: (quests) => set({ quests }),
  resetQuests: () => set({ quests: [] }),

  addQuest: (quest) =>
    set((state) => ({
      quests: [
        ...state.quests,
        {
          id: Date.now(),
          title: '',
          desc: '',
          giver: '',
          location: '',
          status: 'active',
          collapsed: false,
          tasks: [],
          ...quest,
        },
      ],
    })),

  updateQuest: (id, updates) =>
    set((state) => ({
      quests: state.quests.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    })),

  deleteQuest: (id) =>
    set((state) => ({
      quests: state.quests.filter((q) => q.id !== id),
    })),

  toggleQuestCollapse: (id) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === id ? { ...q, collapsed: !q.collapsed } : q,
      ),
    })),

  addTask: (questId, val) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId
          ? { ...q, tasks: [...q.tasks, { id: Date.now(), val: val ?? '', done: false }] }
          : q,
      ),
    })),

  updateTask: (questId, taskId, updates) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId
          ? { ...q, tasks: q.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)) }
          : q,
      ),
    })),

  toggleTask: (questId, taskId) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId
          ? { ...q, tasks: q.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
          : q,
      ),
    })),

  deleteTask: (questId, taskId) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId
          ? { ...q, tasks: q.tasks.filter((t) => t.id !== taskId) }
          : q,
      ),
    })),
}))
