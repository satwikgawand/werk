import { useEffect, useState, useCallback } from 'react'
import type { Task } from '../types'
import { getAnxietyLabel } from '../utils/anxiety'
import { getAnxietyLevel } from '../utils/anxiety'
import dialogue from '../data/dialogue.json'

type DialogueKey = keyof typeof dialogue

function getDialogueKey(task: Task): DialogueKey {
  const anxLevel = getAnxietyLevel(task)
  const label = getAnxietyLabel(anxLevel)
  const key = `${task.priority}_${label}` as DialogueKey
  if (key in dialogue) return key
  return `${task.priority}_building` as DialogueKey
}

function pickLines(task: Task): string[] {
  const key = getDialogueKey(task)
  const pool = dialogue[key]
  return pool[Math.floor(Math.random() * pool.length)]
}

const NPC_COLORS = [
  { bg: 'bg-violet-100', border: 'border-violet-300', dot: 'bg-violet-400' },
  { bg: 'bg-sky-100', border: 'border-sky-300', dot: 'bg-sky-400' },
  { bg: 'bg-rose-100', border: 'border-rose-300', dot: 'bg-rose-400' },
  { bg: 'bg-emerald-100', border: 'border-emerald-300', dot: 'bg-emerald-400' },
  { bg: 'bg-amber-100', border: 'border-amber-300', dot: 'bg-amber-400' },
]

const NPC_NAMES = ['grumble', 'sigh', 'eyeroll', 'facepalm', 'shrug']

type Props = {
  task: Task
  onClose: () => void
}

export function NPCCutscene({ task, onClose }: Props) {
  const [lines] = useState(() => pickLines(task))
  const [lineIndex, setLineIndex] = useState(0)
  const npc = NPC_COLORS[task.npcId]
  const npcName = NPC_NAMES[task.npcId]
  const isLast = lineIndex >= lines.length - 1

  const advance = useCallback(() => {
    if (isLast) {
      onClose()
    } else {
      setLineIndex(i => i + 1)
    }
  }, [isLast, onClose])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [advance, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-12 px-4 bg-black/30 backdrop-blur-sm"
      onClick={advance}
    >
      {/* JRPG dialogue box — slightly wrong */}
      <div
        className="w-full max-w-xl bg-gray-950 border-4 border-gray-700 rounded-sm shadow-2xl p-0 overflow-hidden"
        style={{ fontFamily: '"Courier New", Courier, monospace' }}
        onClick={e => e.stopPropagation()}
      >
        {/* top bar — slightly off alignment */}
        <div className="bg-gray-800 px-4 py-1.5 flex items-center gap-2 border-b-2 border-gray-700">
          <div className={`w-2 h-2 rounded-full ${npc.dot}`} />
          <span className="text-gray-400 text-xs uppercase tracking-widest">{npcName}</span>
          <span className="text-gray-600 text-xs ml-auto">press space / click to advance</span>
        </div>

        <div className="flex gap-0">
          {/* NPC portrait — slightly misaligned */}
          <div className={`w-24 shrink-0 ${npc.bg} border-r-2 ${npc.border} flex items-center justify-center`} style={{ minHeight: '100px' }}>
            <NPCPortrait npcId={task.npcId} />
          </div>

          {/* dialogue text */}
          <div className="flex-1 px-5 py-4 min-h-[100px] flex flex-col justify-between">
            <p className="text-gray-100 text-sm leading-relaxed" style={{ minHeight: '3em' }}>
              {lines[lineIndex]}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-gray-600 text-xs">{lineIndex + 1} / {lines.length}</span>
              <button
                className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-sm border border-gray-600 transition"
                onClick={advance}
              >
                {isLast ? '[ done ]' : '[ next ]'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 text-xs text-white/40">esc to skip</div>
    </div>
  )
}

function NPCPortrait({ npcId }: { npcId: number }) {
  // Simple inline SVG pixel-art style portraits, one per npcId
  const portraits = [
    // 0 — grumble: frowning square face
    <svg key={0} viewBox="0 0 32 32" width="56" height="56" shapeRendering="crispEdges">
      <rect x="8" y="6" width="16" height="18" fill="#c4b5fd" />
      <rect x="10" y="8" width="4" height="4" fill="#1e1b4b" />
      <rect x="18" y="8" width="4" height="4" fill="#1e1b4b" />
      <rect x="10" y="8" width="4" height="2" fill="#fff" opacity="0.4" />
      <rect x="18" y="8" width="4" height="2" fill="#fff" opacity="0.4" />
      <rect x="11" y="16" width="10" height="2" fill="#1e1b4b" />
      <rect x="10" y="18" width="2" height="2" fill="#1e1b4b" />
      <rect x="20" y="18" width="2" height="2" fill="#1e1b4b" />
      <rect x="6" y="10" width="2" height="6" fill="#c4b5fd" />
      <rect x="24" y="10" width="2" height="6" fill="#c4b5fd" />
      <rect x="10" y="24" width="4" height="4" fill="#7c3aed" />
      <rect x="18" y="24" width="4" height="4" fill="#7c3aed" />
    </svg>,
    // 1 — sigh: droopy eyes
    <svg key={1} viewBox="0 0 32 32" width="56" height="56" shapeRendering="crispEdges">
      <rect x="8" y="6" width="16" height="18" fill="#bae6fd" />
      <rect x="10" y="9" width="4" height="3" fill="#0c4a6e" />
      <rect x="18" y="9" width="4" height="3" fill="#0c4a6e" />
      <rect x="10" y="9" width="4" height="1" fill="#fff" opacity="0.3" />
      <rect x="18" y="9" width="4" height="1" fill="#fff" opacity="0.3" />
      <rect x="11" y="15" width="10" height="2" fill="#0c4a6e" />
      <rect x="6" y="10" width="2" height="6" fill="#bae6fd" />
      <rect x="24" y="10" width="2" height="6" fill="#bae6fd" />
      <rect x="10" y="24" width="4" height="4" fill="#0369a1" />
      <rect x="18" y="24" width="4" height="4" fill="#0369a1" />
    </svg>,
    // 2 — eyeroll: pupils up
    <svg key={2} viewBox="0 0 32 32" width="56" height="56" shapeRendering="crispEdges">
      <rect x="8" y="6" width="16" height="18" fill="#fda4af" />
      <rect x="10" y="8" width="4" height="5" fill="#fff" />
      <rect x="18" y="8" width="4" height="5" fill="#fff" />
      <rect x="11" y="8" width="2" height="2" fill="#881337" />
      <rect x="19" y="8" width="2" height="2" fill="#881337" />
      <rect x="11" y="16" width="10" height="1" fill="#881337" />
      <rect x="11" y="17" width="2" height="2" fill="#881337" />
      <rect x="19" y="17" width="2" height="2" fill="#881337" />
      <rect x="6" y="10" width="2" height="6" fill="#fda4af" />
      <rect x="24" y="10" width="2" height="6" fill="#fda4af" />
      <rect x="10" y="24" width="4" height="4" fill="#be123c" />
      <rect x="18" y="24" width="4" height="4" fill="#be123c" />
    </svg>,
    // 3 — facepalm: hand over face
    <svg key={3} viewBox="0 0 32 32" width="56" height="56" shapeRendering="crispEdges">
      <rect x="8" y="6" width="16" height="18" fill="#bbf7d0" />
      <rect x="10" y="9" width="4" height="4" fill="#064e3b" />
      <rect x="18" y="9" width="4" height="4" fill="#064e3b" />
      <rect x="10" y="9" width="4" height="2" fill="#fff" opacity="0.3" />
      <rect x="18" y="9" width="4" height="2" fill="#fff" opacity="0.3" />
      <rect x="13" y="16" width="6" height="3" fill="#064e3b" />
      <rect x="8" y="12" width="16" height="6" fill="#86efac" opacity="0.7" />
      <rect x="6" y="10" width="2" height="6" fill="#bbf7d0" />
      <rect x="24" y="10" width="2" height="6" fill="#bbf7d0" />
      <rect x="10" y="24" width="4" height="4" fill="#059669" />
      <rect x="18" y="24" width="4" height="4" fill="#059669" />
    </svg>,
    // 4 — shrug: raised brows
    <svg key={4} viewBox="0 0 32 32" width="56" height="56" shapeRendering="crispEdges">
      <rect x="8" y="6" width="16" height="18" fill="#fef08a" />
      <rect x="10" y="9" width="4" height="4" fill="#713f12" />
      <rect x="18" y="9" width="4" height="4" fill="#713f12" />
      <rect x="10" y="9" width="4" height="1" fill="#fff" opacity="0.4" />
      <rect x="18" y="9" width="4" height="1" fill="#fff" opacity="0.4" />
      <rect x="9" y="7" width="6" height="2" fill="#713f12" />
      <rect x="17" y="7" width="6" height="2" fill="#713f12" />
      <rect x="12" y="16" width="8" height="2" fill="#713f12" />
      <rect x="14" y="18" width="4" height="2" fill="#713f12" />
      <rect x="6" y="14" width="3" height="2" fill="#fef08a" />
      <rect x="23" y="14" width="3" height="2" fill="#fef08a" />
      <rect x="5" y="12" width="3" height="2" fill="#713f12" />
      <rect x="24" y="12" width="3" height="2" fill="#713f12" />
      <rect x="10" y="24" width="4" height="4" fill="#ca8a04" />
      <rect x="18" y="24" width="4" height="4" fill="#ca8a04" />
    </svg>,
  ]
  return portraits[npcId] ?? portraits[0]
}
