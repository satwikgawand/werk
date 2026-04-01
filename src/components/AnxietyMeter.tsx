import { getAnxietyLabel, getBarColor } from '../utils/anxiety'

type Props = { level: number }

export function AnxietyMeter({ level }: Props) {
  const label = getAnxietyLabel(level)
  const barColor = getBarColor(label)
  const isTerminal = label === 'terminal'

  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor} ${isTerminal ? 'animate-pulse' : ''}`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  )
}
