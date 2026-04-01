export type Priority = 'urgent' | 'normal' | 'whenever'

export type AnxietyLevel = 'chill' | 'building' | 'spiralling' | 'cooked' | 'terminal'

export type Task = {
  id: string
  title: string
  priority: Priority
  dueDate: string | null
  createdAt: string
  completedAt: string | null
  roast: string
  npcId: number
}

export type TaskAction =
  | { type: 'ADD'; task: Task }
  | { type: 'COMPLETE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'PURGE_OLD_COMPLETED' }
