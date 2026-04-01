import type { Task } from '../types'

const countPhrases = [
  (n: number) => `${n} thing${n !== 1 ? 's' : ''} you're ignoring`,
  (n: number) => `${n} task${n !== 1 ? 's' : ''} (lol)`,
  (n: number) => `${n} item${n !== 1 ? 's' : ''} pending your attention (🙃)`,
  (n: number) => `${n} thing${n !== 1 ? 's' : ''} you definitely won't forget about`,
]

function getCountPhrase(tasks: Task[]): string {
  const incomplete = tasks.filter(t => !t.completedAt)
  const n = incomplete.length
  if (n === 0) return 'nothing. suspicious.'
  // stable phrase based on total task count so it doesn't jump around
  const idx = tasks.length % countPhrases.length
  return countPhrases[idx](n)
}

type Props = { tasks: Task[] }

export function Header({ tasks }: Props) {
  return (
    <header className="flex items-center justify-between py-6 mb-2">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">werk</h1>
      <span className="text-sm text-gray-400 font-medium">{getCountPhrase(tasks)}</span>
    </header>
  )
}
