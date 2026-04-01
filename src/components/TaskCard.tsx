import { useState } from 'react'
import type { Task, Priority } from '../types'
import { getAnxietyLevel, getAnxietyLabel } from '../utils/anxiety'
import { AnxietyMeter } from './AnxietyMeter'

type Props = {
  task: Task
  onComplete: (id: string) => void
  onDelete: (id: string) => void
  tick: number
}

const priorityBadgeStyles: Record<Priority, string> = {
  urgent: 'bg-red-100 text-red-600',
  normal: 'bg-amber-100 text-amber-600',
  whenever: 'bg-gray-100 text-gray-500',
}

function formatDueDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toLowerCase()
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function TaskCard({ task, onComplete, onDelete, tick: _tick }: Props) {
  const [hovered, setHovered] = useState(false)
  const isCompleted = !!task.completedAt

  if (isCompleted) {
    return (
      <div
        className="group flex items-start gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 opacity-50"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-gray-300 bg-gray-200 flex items-center justify-center shrink-0">
          <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm text-gray-400 line-through">{task.title}</span>
          <div className="text-xs text-gray-300 mt-0.5">done {formatTimeAgo(task.completedAt!)}</div>
        </div>
        {hovered && (
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-300 hover:text-red-400 transition shrink-0 mt-0.5"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }

  const anxietyLevel = getAnxietyLevel(task)
  const anxietyLabel = getAnxietyLabel(anxietyLevel)
  const isTerminal = anxietyLabel === 'terminal'
  const isOverdue = !!task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3 rounded-xl bg-white border transition ${isTerminal ? 'border-red-300' : 'border-gray-100'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => onComplete(task.id)}
        className="mt-0.5 w-4 h-4 rounded-full border-2 border-gray-300 hover:border-gray-500 flex items-center justify-center shrink-0 transition"
        aria-label="Complete task"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-800">{task.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${priorityBadgeStyles[task.priority]}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={`text-xs shrink-0 ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              due {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
        <AnxietyMeter level={anxietyLevel} />
        <p className="text-xs text-gray-400 mt-1.5 italic">{task.roast}</p>
      </div>
      {hovered && (
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-400 transition shrink-0 mt-0.5"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
