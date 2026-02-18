import { describe, it, expect, beforeEach } from 'vitest'
import { useQuestStore } from './useQuestStore'

describe('useQuestStore', () => {
  beforeEach(() => {
    useQuestStore.setState({ quests: [] })
  })

  it('adds a quest', () => {
    useQuestStore.getState().addQuest({ title: 'Find the Amulet' })
    expect(useQuestStore.getState().quests).toHaveLength(1)
    expect(useQuestStore.getState().quests[0]?.title).toBe('Find the Amulet')
    expect(useQuestStore.getState().quests[0]?.status).toBe('active')
  })

  it('adds and toggles tasks', () => {
    useQuestStore.getState().addQuest({ title: 'Test Quest' })
    const questId = useQuestStore.getState().quests[0]!.id
    useQuestStore.getState().addTask(questId, 'Gather supplies')
    expect(useQuestStore.getState().quests[0]?.tasks).toHaveLength(1)
    expect(useQuestStore.getState().quests[0]?.tasks[0]?.done).toBe(false)

    const taskId = useQuestStore.getState().quests[0]!.tasks[0]!.id
    useQuestStore.getState().toggleTask(questId, taskId)
    expect(useQuestStore.getState().quests[0]?.tasks[0]?.done).toBe(true)
  })

  it('updates quest status', () => {
    useQuestStore.getState().addQuest()
    const questId = useQuestStore.getState().quests[0]!.id
    useQuestStore.getState().updateQuest(questId, { status: 'completed' })
    expect(useQuestStore.getState().quests[0]?.status).toBe('completed')
  })

  it('deletes a quest', () => {
    useQuestStore.getState().addQuest({ title: 'Quest A' })
    // Ensure unique ID by setting quests directly
    const questA = useQuestStore.getState().quests[0]!
    useQuestStore.setState({
      quests: [
        questA,
        { id: questA.id + 1, title: 'Quest B', desc: '', giver: '', location: '', status: 'active', collapsed: false, tasks: [] },
      ],
    })
    expect(useQuestStore.getState().quests).toHaveLength(2)
    useQuestStore.getState().deleteQuest(questA.id)
    expect(useQuestStore.getState().quests).toHaveLength(1)
    expect(useQuestStore.getState().quests[0]?.title).toBe('Quest B')
  })
})
