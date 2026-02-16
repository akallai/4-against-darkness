import { create } from 'zustand'
import type { FollowersData, Retainer, Professional, AnimalCompanion, Mount } from '@/types'
import { createEmptyFollowersData } from '@/types'

interface FollowerState {
  followersData: FollowersData

  setFollowersData: (data: FollowersData) => void
  resetFollowers: () => void

  addRetainer: (retainer?: Partial<Retainer>) => void
  updateRetainer: (index: number, updates: Partial<Retainer>) => void
  deleteRetainer: (index: number) => void

  addProfessional: (professional?: Partial<Professional>) => void
  updateProfessional: (index: number, updates: Partial<Professional>) => void
  deleteProfessional: (index: number) => void

  updateAnimal: (index: number, updates: Partial<AnimalCompanion>) => void
  updateMount: (index: number, updates: Partial<Mount>) => void
}

export const useFollowerStore = create<FollowerState>()((set) => ({
  followersData: createEmptyFollowersData(),

  setFollowersData: (data) => set({ followersData: data }),
  resetFollowers: () => set({ followersData: createEmptyFollowersData() }),

  addRetainer: (retainer) =>
    set((state) => ({
      followersData: {
        ...state.followersData,
        retainers: [
          ...state.followersData.retainers,
          { name: '', role: '', fee: '', notes: '', ...retainer },
        ],
      },
    })),

  updateRetainer: (index, updates) =>
    set((state) => ({
      followersData: {
        ...state.followersData,
        retainers: state.followersData.retainers.map((r, i) =>
          i === index ? { ...r, ...updates } : r,
        ),
      },
    })),

  deleteRetainer: (index) =>
    set((state) => ({
      followersData: {
        ...state.followersData,
        retainers: state.followersData.retainers.filter((_, i) => i !== index),
      },
    })),

  addProfessional: (professional) =>
    set((state) => ({
      followersData: {
        ...state.followersData,
        professionals: [
          ...state.followersData.professionals,
          { name: '', role: '', fee: '', notes: '', ...professional },
        ],
      },
    })),

  updateProfessional: (index, updates) =>
    set((state) => ({
      followersData: {
        ...state.followersData,
        professionals: state.followersData.professionals.map((p, i) =>
          i === index ? { ...p, ...updates } : p,
        ),
      },
    })),

  deleteProfessional: (index) =>
    set((state) => ({
      followersData: {
        ...state.followersData,
        professionals: state.followersData.professionals.filter((_, i) => i !== index),
      },
    })),

  updateAnimal: (index, updates) =>
    set((state) => {
      const animals = [...state.followersData.animals] as FollowersData['animals']
      animals[index] = { ...animals[index]!, ...updates }
      return { followersData: { ...state.followersData, animals } }
    }),

  updateMount: (index, updates) =>
    set((state) => {
      const mounts = [...state.followersData.mounts] as FollowersData['mounts']
      mounts[index] = { ...mounts[index]!, ...updates }
      return { followersData: { ...state.followersData, mounts } }
    }),
}))
