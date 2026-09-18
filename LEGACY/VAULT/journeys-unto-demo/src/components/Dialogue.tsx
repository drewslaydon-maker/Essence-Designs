import React from 'react'
import { useGameStore } from '../store/gameStore'
import { EventBus } from '../utils/EventBus'

export const Dialogue: React.FC = () => {
  const { dialogueState, setDialogue, startCombat, endCombat } = useGameStore()
  
  if (!dialogueState.isActive) return null

  const handleNext = () => {
    if (dialogueState.stage === 1) {
      setDialogue(false)
      EventBus.emit('EVENT_WARP_ARENA')
    } else if (dialogueState.stage === 2) {
      setDialogue(false)
      startCombat()
    } else if (dialogueState.stage === 3) {
      setDialogue(false)
      endCombat(true)
    }
  }

  return (
    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-900 bg-opacity-90 border-t-4 border-gray-400 p-6 flex flex-col justify-between z-40">
      <div className="text-white text-xl font-sans tracking-wide">
        {dialogueState.text}
      </div>
      <div className="flex justify-end">
        <button 
          onClick={handleNext}
          className="px-6 py-2 bg-gray-200 text-black font-bold rounded hover:bg-white"
        >
          Next ▼
        </button>
      </div>
    </div>
  )
}