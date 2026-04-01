import { useEffect, useState } from 'react'
import type { Task } from '../types'
import { getAnxietyLevel } from '../utils/anxiety'
import { TaskCard } from './TaskCard'

const PRIORITY_ORDER = { urgent: 0, normal: 1, whenever: 2 }

function sortTasks(tasks: Task[]): Task[] {
  const incomplete = tasks.filter(t => !t.completedAt)
  const completed = tasks.filter(t => !!t.completedAt)

  incomplete.sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (pDiff !== 0) return pDiff
    return getAnxietyLevel(b) - getAnxietyLevel(a)
  })

  completed.sort((a, b) =>
    new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
  )

  return [...incomplete, ...completed]
}

type Props = {
  tasks: Task[]
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onComplete, onDelete }: Props) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const sorted = sortTasks(tasks)

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 text-gray-300 text-sm">
        <p>nothing here.</p>
        <p className="mt-1 text-xs">suspicious level of productivity.</p>
      </div>
    )
  }

  const incomplete = sorted.filter(t => !t.completedAt)
  const completed = sorted.filter(t => !!t.completedAt)

  return (
    <div className="flex flex-col gap-2">
      {incomplete.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          tick={tick}
        />
      ))}
      {completed.length > 0 && (
        <>
          {incomplete.length > 0 && <div className="border-t border-gray-100 my-2" />}
          {completed.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
              tick={tick}
            />
          ))}
        </>
      )}
    </div>
  )
}
