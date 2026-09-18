import React from 'react'
import { useGameStore } from '../store/gameStore'
import { initAudio } from '../audio/audioUtils'

export const LandingPage: React.FC = () => {
  const loadState = useGameStore((state) => state.loadState)

  const handleEnter = async () => {
    initAudio()
    const res = await fetch('/mock_states/state_act1_5.json')
    const data = await res.json()
    loadState({
      party: data.party,
      flags: { ...useGameStore.getState().flags, ...data.flags, hasPassedLanding: true },
      activeCharacterId: data.activeCharacterId
    })
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-green-500 font-mono p-8">
      <div className="max-w-2xl w-full border border-green-500 p-8 shadow-[0_0_15px_rgba(34,197,94,0.5)] bg-gray-900 bg-opacity-50">
        <h1 className="text-4xl mb-2 text-center">JOURNEYS ACT 2 -- THE SITTING MAN STANDS</h1>
        <h2 className="text-xl mb-8 text-center opacity-70">by ESSENCE DESIGNS | 09/01/2026 @ 04:00 AM</h2>
        
        <div className="mb-8 space-y-4">
          <div className="border border-green-700 p-4 bg-green-900 bg-opacity-20 flex items-center">
            <span className="mr-4 text-green-400">[Active]</span>
            <span>v0.1 - The Garden & The Warden's Arena (Act 1.5)</span>
          </div>
          <div className="border border-gray-700 p-4 opacity-50 flex items-center">
            <span className="mr-4 text-gray-400">[Locked]</span>
            <span>v0.2 - The Descent into Phandelver (Act 1)</span>
          </div>
          <div className="border border-gray-700 p-4 opacity-50 flex items-center">
            <span className="mr-4 text-gray-400">[Locked]</span>
            <span>v0.3 - The Black Knights at Bozog's Bar (Act 0)</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleEnter}
            className="px-8 py-4 bg-green-800 hover:bg-green-600 text-white font-bold text-xl transition-all border-2 border-green-400"
          >
            [ ENTER THE REALM ]
          </button>
        </div>
      </div>
    </div>
  )
}