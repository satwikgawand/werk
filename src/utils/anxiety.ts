import type { Task, AnxietyLevel } from '../types'

export function getAnxietyLevel(task: Task): number {
  const hoursOld = (Date.now() - new Date(task.createdAt).getTime()) / 36e5
  const multiplier = task.priority === 'urgent' ? 3 : task.priority === 'normal' ? 2 : 1
  const base = Math.min((hoursOld / 72) * 100, 99) * multiplier / 3
  const overdueBump = task.dueDate && new Date(task.dueDate) < new Date() ? 20 : 0
  return Math.min(Math.round(base + overdueBump), 100)
}

export function getAnxietyLabel(level: number): AnxietyLevel {
  if (level <= 25) return 'chill'
  if (level <= 50) return 'building'
  if (level <= 75) return 'spiralling'
  if (level <= 99) return 'cooked'
  return 'terminal'
}

export function getBarColor(level: AnxietyLevel): string {
  switch (level) {
    case 'chill': return 'bg-green-400'
    case 'building': return 'bg-amber-400'
    case 'spiralling': return 'bg-orange-500'
    case 'cooked': return 'bg-red-500'
    case 'terminal': return 'bg-red-600'
  }
}
