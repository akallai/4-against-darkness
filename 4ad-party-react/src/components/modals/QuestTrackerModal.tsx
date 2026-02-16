import { Modal } from '@/components/common/Modal'
import { useQuestStore } from '@/stores/useQuestStore'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './QuestTrackerModal.css'

interface QuestTrackerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuestTrackerModal({ isOpen, onClose }: QuestTrackerModalProps) {
  const quests = useQuestStore((s) => s.quests)
  const addQuest = useQuestStore((s) => s.addQuest)
  const updateQuest = useQuestStore((s) => s.updateQuest)
  const deleteQuest = useQuestStore((s) => s.deleteQuest)
  const toggleQuestCollapse = useQuestStore((s) => s.toggleQuestCollapse)
  const addTask = useQuestStore((s) => s.addTask)
  const updateTask = useQuestStore((s) => s.updateTask)
  const toggleTask = useQuestStore((s) => s.toggleTask)
  const deleteTask = useQuestStore((s) => s.deleteTask)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quest Tracker">
      <div className="quest-list">
        {quests.map((quest) => (
          <div key={quest.id} className={`quest-card ${quest.status}`}>
            <div className="quest-header" onClick={() => toggleQuestCollapse(quest.id)}>
              <button className="arrow-btn">
                {quest.collapsed ? '▶' : '▼'}
              </button>
              <input
                className="quest-title"
                value={quest.title}
                onChange={(e) => updateQuest(quest.id, { title: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                placeholder="Quest title..."
              />
              <select
                className="quest-status-select"
                value={quest.status}
                onChange={(e) => updateQuest(quest.id, { status: e.target.value as 'active' | 'completed' | 'failed' })}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <button
                className="btn-list-action"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteQuest(quest.id)
                }}
              >
                ✕
              </button>
            </div>

            {!quest.collapsed && (
              <div className="quest-body">
                <div className="quest-meta">
                  <div className="quest-meta-item">
                    <label>Giver</label>
                    <input
                      value={quest.giver}
                      onChange={(e) => updateQuest(quest.id, { giver: e.target.value })}
                      placeholder="Quest giver..."
                    />
                  </div>
                  <div className="quest-meta-item">
                    <label>Location</label>
                    <input
                      value={quest.location}
                      onChange={(e) => updateQuest(quest.id, { location: e.target.value })}
                      placeholder="Location..."
                    />
                  </div>
                </div>

                <AutoTextarea
                  className="quest-desc"
                  value={quest.desc}
                  onChange={(desc) => updateQuest(quest.id, { desc })}
                  placeholder="Quest description..."
                />

                <div className="quest-tasks">
                  {quest.tasks.map((task) => (
                    <div key={task.id} className="quest-task-row">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(quest.id, task.id)}
                      />
                      <input
                        className={`quest-task-input ${task.done ? 'done' : ''}`}
                        value={task.val}
                        onChange={(e) => updateTask(quest.id, task.id, { val: e.target.value })}
                        placeholder="Task..."
                      />
                      <button
                        className="btn-list-action"
                        onClick={() => deleteTask(quest.id, task.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn-list-add"
                    onClick={() => addTask(quest.id)}
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="btn-gold-dashed" style={{ width: '100%', marginTop: '10px' }} onClick={() => addQuest()}>
        + New Quest
      </button>
    </Modal>
  )
}
