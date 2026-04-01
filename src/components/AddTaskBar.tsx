import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Task, Priority } from '../types'
import roasts from '../data/roasts.json'

const PLACEHOLDERS = [
  'add something you won\'t do...',
  'new task (good luck)',
  'what are we pretending to do today?',
  'add task here. or don\'t. free country.',
]

type Props = { onAdd: (task: Task) => void }

function pickRoast(level: 'chill' | 'building' | 'spiralling' | 'cooked' | 'terminal'): string {
  const pool = roasts[level]
  return pool[Math.floor(Math.random() * pool.length)]
}

export function AddTaskBar({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [dueDate, setDueDate] = useState('')
  const placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const task: Task = {
      id: uuidv4(),
      title: title.trim(),
      priority,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      roast: pickRoast('chill'),
      npcId: Math.floor(Math.random() * 5),
    }

    onAdd(task)
    setTitle('')
    setPriority('normal')
    setDueDate('')
    setOpen(false)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !open) {
      setOpen(true)
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setTitle('')
    }
  }

  const priorityOptions: Priority[] = ['urgent', 'normal', 'whenever']
  const priorityStyles: Record<Priority, string> = {
    urgent: 'bg-red-100 text-red-700 border-red-200',
    normal: 'bg-amber-100 text-amber-700 border-amber-200',
    whenever: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  const priorityActiveStyles: Record<Priority, string> = {
    urgent: 'bg-red-500 text-white border-red-500',
    normal: 'bg-amber-500 text-white border-amber-500',
    whenever: 'bg-gray-500 text-white border-gray-500',
  }

  return (
    <div className="mb-6">
      {!open ? (
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition"
            placeholder={placeholder}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={() => { if (title) setOpen(true) }}
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-lg font-light transition focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Add task"
          >
            +
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 shadow-sm">
          <input
            autoFocus
            type="text"
            className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent border-b border-gray-100 pb-2"
            placeholder="task title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setTitle('') } }}
          />
          <div className="flex items-center gap-2 flex-wrap">
            {priorityOptions.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${priority === p ? priorityActiveStyles[p] : priorityStyles[p]} hover:opacity-80`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 shrink-0">due date</label>
            <input
              type="date"
              className="text-xs text-gray-600 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => { setOpen(false); setTitle('') }}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="text-xs bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              add task
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
