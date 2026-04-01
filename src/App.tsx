import { useState } from 'react'
import type { Task } from './types'
import { useTasks } from './hooks/useTasks'
import { Header } from './components/Header'
import { AddTaskBar } from './components/AddTaskBar'
import { TaskList } from './components/TaskList'
import { NPCCutscene } from './components/NPCCutscene'

export default function App() {
  const { tasks, dispatch } = useTasks()
  const [cutsceneTask, setCutsceneTask] = useState<Task | null>(null)

  function handleAdd(task: Task) {
    dispatch({ type: 'ADD', task })
  }

  function handleComplete(id: string) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    setCutsceneTask(task)
  }

  function handleCutsceneClose() {
    if (cutsceneTask) {
      dispatch({ type: 'COMPLETE', id: cutsceneTask.id })
      setCutsceneTask(null)
    }
  }

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE', id })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4">
        <Header tasks={tasks} />
        <AddTaskBar onAdd={handleAdd} />
        <TaskList
          tasks={tasks}
          onComplete={handleComplete}
          onDelete={handleDelete}
        />
      </div>
      {cutsceneTask && (
        <NPCCutscene task={cutsceneTask} onClose={handleCutsceneClose} />
      )}
    </div>
  )
}
