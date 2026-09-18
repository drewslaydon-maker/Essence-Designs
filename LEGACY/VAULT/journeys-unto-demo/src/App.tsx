import React, { useEffect, useRef } from 'react'
import { useGameStore } from './store/gameStore'
import { LandingPage } from './components/LandingPage'
import { Dialogue } from './components/Dialogue'
import { Arsenal } from './components/Arsenal'
import { DevConsole } from './components/DevConsole'
import { initGame, destroyGame } from './game/main'

const App: React.FC = () => {
  const flags = useGameStore(state => state.flags)
  const phaserRef = useRef<HTMLDivElement>(null)

  // Global Key Listener for Swapping
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (flags.hasPassedLanding && !flags.isGameOver && !flags.hasDefeatedWarden) {
        if (e.key === '1') useGameStore.getState().setActiveCharacter('bozog')
        if (e.key === '2') useGameStore.getState().setActiveCharacter('matchstick')
        if (e.key === '3') useGameStore.getState().setActiveCharacter('kairon')
        if (e.key === '4') useGameStore.getState().setActiveCharacter('atreyu')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [flags.hasPassedLanding, flags.isGameOver, flags.hasDefeatedWarden])

  useEffect(() => {
    if (flags.hasPassedLanding) {
      initGame()
    }
    return () => {
      destroyGame()
    }
  }, [flags.hasPassedLanding])

  if (!flags.hasPassedLanding) {
    return <LandingPage />
  }

  return (
    <div className="w-full h-screen relative bg-black flex items-center justify-center overflow-hidden">
      {flags.isGameOver && (
        <div className="absolute inset-0 bg-red-900 bg-opacity-90 flex flex-col items-center justify-center z-50 pointer-events-auto">
          <h1 className="text-red-500 text-6xl font-serif tracking-widest text-center shadow-[0_0_20px_#f00] mb-8">
            PARTY WIPED
          </h1>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-black border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-bold text-xl transition-all"
          >
            [ RESTART ]
          </button>
        </div>
      )}

      <div
        id="phaser-container"
        ref={phaserRef}
        className="w-[800px] h-[600px]"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full max-w-[800px] max-h-[600px] mx-auto pointer-events-none">
          <Dialogue />
          <Arsenal />
        </div>
      </div>
      <DevConsole />

      {flags.hasDefeatedWarden && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 transition-opacity duration-1000">
          <h1 className="text-white text-6xl font-serif tracking-widest text-center shadow-[0_0_20px_#fff]">
            ACT 2:<br/>THE SITTING MAN STANDS
          </h1>
        </div>
      )}
    </div>
  )
}

export default App
