import { useCallback } from 'react'
import { usePartyStore } from '@/stores/usePartyStore'
import { useJournalStore } from '@/stores/useJournalStore'
import { useEncounterStore } from '@/stores/useEncounterStore'
import { useFollowerStore } from '@/stores/useFollowerStore'
import { useQuestStore } from '@/stores/useQuestStore'
import { useTavernStore } from '@/stores/useTavernStore'
import { useUIStore } from '@/stores/useUIStore'
import {
  saveParty,
  loadParty,
  deleteParty,
  partyKeyFromName,
  setLastLoadedParty,
  saveCreationMode,
} from '@/utils/persistence'
import { createEmptyJournalData, createEmptyFollowersData } from '@/types'

export function useGameSession() {
  const partyStore = usePartyStore
  const journalStore = useJournalStore
  const encounterStore = useEncounterStore
  const followerStore = useFollowerStore
  const questStore = useQuestStore
  const tavernStore = useTavernStore
  const uiStore = useUIStore

  const save = useCallback((notify = true) => {
    const key = partyStore.getState().currentPartyKey
    if (!key) return

    const bundle = {
      characters: partyStore.getState().characters,
      journalData: journalStore.getState().journalData,
      followersData: followerStore.getState().followersData,
      encounters: encounterStore.getState().encounters,
      partyStats: partyStore.getState().partyStats,
      quests: questStore.getState().quests,
    }

    saveParty(key, bundle)
    tavernStore.getState().syncFromParty(bundle.characters)

    if (notify) {
      alert('Game Saved & Tavern Updated!')
    }
  }, [partyStore, journalStore, followerStore, encounterStore, questStore, tavernStore])

  const saveAndQuit = useCallback(() => {
    save(false)
    uiStore.getState().setScreen('setup')
  }, [save, uiStore])

  const loadGame = useCallback((key: string) => {
    const bundle = loadParty(key)
    if (!bundle) return false

    partyStore.getState().setPartyKey(key)
    partyStore.getState().setPartyName(key.replace('4AD_Party_', '').replace(/_/g, ' '))
    partyStore.getState().setCharacters(bundle.characters)
    partyStore.getState().setPartyStats(bundle.partyStats)
    journalStore.getState().setJournalData(bundle.journalData)
    followerStore.getState().setFollowersData(bundle.followersData)
    encounterStore.getState().setEncounters(bundle.encounters)
    questStore.getState().setQuests(bundle.quests)
    setLastLoadedParty(key)
    uiStore.getState().setScreen('tracker')

    return true
  }, [partyStore, journalStore, followerStore, encounterStore, questStore, uiStore])

  const embark = useCallback(() => {
    const { characters, partyName, creationMode } = partyStore.getState()
    const name = partyName.trim()
    if (!name) {
      alert('Please enter a party name.')
      return
    }

    const hasChars = characters.some((c) => c.name.trim())
    if (!hasChars) {
      alert('Please add at least one character.')
      return
    }

    const key = partyKeyFromName(name)
    partyStore.getState().setPartyKey(key)

    // Reset world data for new adventure
    journalStore.getState().setJournalData(createEmptyJournalData())
    followerStore.getState().setFollowersData(createEmptyFollowersData())
    encounterStore.getState().resetEncounters()
    questStore.getState().resetQuests()
    partyStore.getState().setPartyStats({ mv: 0, bw: 0 })

    // Save creation mode
    saveCreationMode(creationMode)

    // Save immediately
    const bundle = {
      characters,
      journalData: journalStore.getState().journalData,
      followersData: followerStore.getState().followersData,
      encounters: encounterStore.getState().encounters,
      partyStats: partyStore.getState().partyStats,
      quests: questStore.getState().quests,
    }
    saveParty(key, bundle)
    setLastLoadedParty(key)

    uiStore.getState().setScreen('tracker')
  }, [partyStore, journalStore, followerStore, encounterStore, questStore, uiStore])

  const deleteGame = useCallback((key: string) => {
    deleteParty(key)
  }, [])

  return { save, saveAndQuit, loadGame, embark, deleteGame }
}
