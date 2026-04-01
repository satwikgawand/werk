import { useReducer, useEffect } from 'react'
import type { Task, TaskAction } from '../types'

const STORAGE_KEY = 'werk_tasks'
const COMPLETED_TTL_MS = 24 * 60 * 60 * 1000

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function tasksReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.task]
    case 'COMPLETE':
      return state.map(t =>
        t.id === action.id ? { ...t, completedAt: new Date().toISOString() } : t
      )
    case 'DELETE':
      return state.filter(t => t.id !== action.id)
    case 'PURGE_OLD_COMPLETED':
      return state.filter(t => {
        if (!t.completedAt) return true
        return Date.now() - new Date(t.completedAt).getTime() < COMPLETED_TTL_MS
      })
    default:
      return state
  }
}

export function useTasks() {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    dispatch({ type: 'PURGE_OLD_COMPLETED' })
    const id = setInterval(() => dispatch({ type: 'PURGE_OLD_COMPLETED' }), 60_000)
    return () => clearInterval(id)
  }, [])

  return { tasks, dispatch }
}
