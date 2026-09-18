import React, { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { EventBus } from '../utils/EventBus'
import { playSfx } from '../audio/audioUtils'

export const DevConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const store = useGameStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        setIsOpen(!isOpen)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="absolute top-0 right-0 p-4 bg-black bg-opacity-80 border-l border-b border-green-500 text-green-400 font-mono text-sm z-50">
      <div className="flex justify-between items-center mb-4 border-b border-green-800 pb-2">
        <h3 className="font-bold">DEV CONSOLE</h3>
        <button onClick={() => setIsOpen(false)} className="text-red-500">X</button>
      </div>
      <div className="space-y-2 flex flex-col">
        <button className="border border-green-600 hover:bg-green-900 px-2 py-1" onClick={() => { playSfx('nat20_hope'); store.addCombatLog('DEV: Force Nat 20') }}>[Force Nat 20]</button>
        <button className="border border-green-600 hover:bg-green-900 px-2 py-1" onClick={() => { store.addCombatLog('DEV: Force Nat 1') }}>[Force Nat 1]</button>
        <button className="border border-green-600 hover:bg-green-900 px-2 py-1" onClick={() => EventBus.emit('EVENT_WARP_ARENA')}>[Unlock Room 3]</button>
        <button className="border border-green-600 hover:bg-green-900 px-2 py-1" onClick={() => store.startCombat()}>[Spawn Remnant]</button>
        <button className="border border-green-600 hover:bg-green-900 px-2 py-1">[Set Hope +1]</button>
        
        <div className="mt-4 border-t border-green-800 pt-2">
          <label className="flex flex-col">
            Master Volume
            <input 
              type="range" min="0" max="1" step="0.1" 
              value={store.volume} 
              onChange={(e) => store.setVolume(parseFloat(e.target.value))} 
              className="mt-1"
            />
          </label>
        </div>
      </div>
    </div>
  )
}