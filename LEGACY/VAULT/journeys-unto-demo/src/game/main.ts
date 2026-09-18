import Phaser from 'phaser'
import { Room2 } from './scenes/Room2'
import { Room3 } from './scenes/Room3'

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false
    }
  },
  scene: [Room2, Room3],
  backgroundColor: '#000000',
  pixelArt: true
}

let game: Phaser.Game | null = null

export const initGame = () => {
  if (!game) {
    game = new Phaser.Game(config)
  }
  return game
}

export const destroyGame = () => {
  if (game) {
    game.destroy(true)
    game = null
  }
}