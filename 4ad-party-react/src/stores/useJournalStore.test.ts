import { describe, it, expect, beforeEach } from 'vitest'
import { useJournalStore } from './useJournalStore'

describe('useJournalStore', () => {
  beforeEach(() => {
    useJournalStore.getState().resetJournal()
  })

  it('adds a journal entry', () => {
    useJournalStore.getState().addEntry('Room 1')
    expect(useJournalStore.getState().journalData.entries).toHaveLength(1)
    expect(useJournalStore.getState().journalData.entries[0]?.title).toBe('Room 1')
  })

  it('updates a journal entry', () => {
    useJournalStore.getState().addEntry('Test')
    const id = useJournalStore.getState().journalData.entries[0]!.id
    useJournalStore.getState().updateEntry(id, { content: 'Found a treasure chest' })
    expect(useJournalStore.getState().journalData.entries[0]?.content).toBe('Found a treasure chest')
  })

  it('deletes a journal entry', () => {
    useJournalStore.getState().addEntry('To delete')
    const id = useJournalStore.getState().journalData.entries[0]!.id
    useJournalStore.getState().deleteEntry(id)
    expect(useJournalStore.getState().journalData.entries).toHaveLength(0)
  })

  it('toggles entry collapse', () => {
    useJournalStore.getState().addEntry('Test')
    const id = useJournalStore.getState().journalData.entries[0]!.id
    expect(useJournalStore.getState().journalData.entries[0]?.collapsed).toBe(false)
    useJournalStore.getState().toggleEntryCollapse(id)
    expect(useJournalStore.getState().journalData.entries[0]?.collapsed).toBe(true)
  })

  it('adds NPC location', () => {
    useJournalStore.getState().addNPCLocation('The Tavern')
    expect(useJournalStore.getState().journalData.npcLocations).toHaveLength(1)
    expect(useJournalStore.getState().journalData.npcLocations[0]?.name).toBe('The Tavern')
  })

  it('adds NPC to location', () => {
    useJournalStore.getState().addNPCLocation('Town')
    const locId = useJournalStore.getState().journalData.npcLocations[0]!.id
    useJournalStore.getState().addNPC(locId)
    expect(useJournalStore.getState().journalData.npcLocations[0]?.list).toHaveLength(1)
  })

  it('updates NPC', () => {
    useJournalStore.getState().addNPCLocation('Town')
    const locId = useJournalStore.getState().journalData.npcLocations[0]!.id
    useJournalStore.getState().addNPC(locId)
    const npcId = useJournalStore.getState().journalData.npcLocations[0]!.list[0]!.id
    useJournalStore.getState().updateNPC(locId, npcId, { name: 'Garrick', race: 'Dwarf' })
    const npc = useJournalStore.getState().journalData.npcLocations[0]?.list[0]
    expect(npc?.name).toBe('Garrick')
    expect(npc?.race).toBe('Dwarf')
  })
})
