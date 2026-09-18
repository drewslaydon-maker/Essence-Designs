import React from 'react'
import { useGameStore } from '../store/gameStore'
import { playSfx, stopBgm } from '../audio/audioUtils'
import { EventBus } from '../utils/EventBus'

export const Arsenal: React.FC = () => {
  const { combatState, party, activeCharacterId, setDialogue, setEnemyHp, addCombatLog, setTurn, setHasClone } = useGameStore()
  
  if (!combatState.isActive) return null

  const activeChar = party.find(p => p.id === activeCharacterId)
  if (!activeChar) return null

  const handleAction = (abilityName: string, type: string) => {
    // Roll d20
    const roll = Math.floor(Math.random() * 20) + 1
    const isNat20 = roll === 20
    const isHit = roll >= combatState.enemyAc || isNat20

    if (isNat20) {
      playSfx('nat20_hope')
      addCombatLog(`CRITICAL SUCCESS! ${activeChar.name} rolled a NAT 20!`)
    }

    if (type === 'dmg' || type === 'heavy_dmg' || type === 'aoe_dmg') {
      if (isHit) {
        const dmg = isNat20 ? 30 : 15
        addCombatLog(`${activeChar.name} used ${abilityName} for ${dmg} damage.`)
        playSfx('hit')
        const newHp = Math.max(0, combatState.enemyHp - dmg)
        setEnemyHp(newHp)
        if (newHp === 0) {
          handleWin()
          return
        }
      } else {
        addCombatLog(`${activeChar.name} missed ${abilityName}.`)
      }
    } else if (type === 'heal' || type === 'buff_ac' || type === 'buff_ally_next' || type === 'buff_self' || type === 'guard_ally') {
      playSfx('heal')
      addCombatLog(`${activeChar.name} used ${abilityName}.`)
    } else if (type === 'spawn_entity') {
      playSfx('illusion_shatter')
      setHasClone(true)
      addCombatLog(`${activeChar.name} summoned a Clone!`)
    } else if (type === 'teleport') {
      playSfx('mirror_swap')
      EventBus.emit('EVENT_SWAP_CLONE')
      addCombatLog(`${activeChar.name} swapped with Clone!`)
    } else {
      addCombatLog(`${activeChar.name} used ${abilityName}.`)
    }

    setTurn('enemy')
    setTimeout(enemyTurn, 1000)
  }

  const enemyTurn = () => {
    const store = useGameStore.getState()
    if (store.combatState.enemyHp <= 0) return
    
    if (store.combatState.hasClone) {
      store.addCombatLog('Stasis Remnant attacked the Clone! Clone destroyed.')
      playSfx('illusion_shatter')
      store.setHasClone(false)
    } else {
      store.addCombatLog(`Stasis Remnant attacks ${store.activeCharacterId}!`)
      playSfx('hit')
    }
    store.setTurn('player')
  }

  const handleWin = () => {
    stopBgm()
    setDialogue(true, 3, "Warden: Protocol... disabled. You may pass.")
  }

  return (
    <div className={`absolute inset-0 pointer-events-none z-30 ${combatState.turn === 'player' ? 'border-4 border-yellow-500' : ''}`}>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-900 bg-opacity-80 p-4 border-2 border-red-500 rounded text-white text-center pointer-events-auto">
        <h2 className="font-bold text-xl mb-2">Stasis Remnant</h2>
        <div className="w-64 h-4 bg-gray-700">
          <div className="h-full bg-red-500" style={{ width: `${(combatState.enemyHp / combatState.enemyMaxHp) * 100}%` }}></div>
        </div>
        <p>{combatState.enemyHp} / {combatState.enemyMaxHp} HP</p>
      </div>

      <div className="absolute top-4 right-4 bg-black bg-opacity-80 p-4 border border-gray-500 w-64 h-64 overflow-y-auto text-sm text-gray-300 font-mono pointer-events-auto flex flex-col-reverse">
        {combatState.log.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
      </div>

      <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-900 bg-opacity-90 p-4 border-2 border-blue-400 rounded pointer-events-auto flex flex-col items-center min-w-[400px]">
        <h3 className="text-white font-bold mb-4">{activeChar.name}'s Turn (Press 1-4 to Swap)</h3>
        {combatState.turn === 'player' ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            {Object.entries(activeChar.abilities).map(([name, type]) => (
              <button 
                key={name}
                onClick={() => handleAction(name, type)}
                className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 border border-gray-500 rounded transition-colors"
                disabled={name === 'Swap' && !combatState.hasClone}
              >
                {name}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">Enemy Turn...</div>
        )}
      </div>
    </div>
  )
}