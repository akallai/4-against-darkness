export interface QuestTask {
  id: number
  val: string
  done: boolean
}

export interface Quest {
  id: number
  title: string
  desc: string
  giver: string
  location: string
  status: 'active' | 'completed' | 'failed'
  collapsed: boolean
  tasks: QuestTask[]
}
