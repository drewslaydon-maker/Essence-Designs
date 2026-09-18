import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'
import { EventBus } from '../../utils/EventBus'
import { playBgm } from '../../audio/audioUtils'

interface Position {
  x: number
  y: number
}

export class Room2 extends Phaser.Scene {
  player!: Phaser.GameObjects.Rectangle
  followers: Phaser.GameObjects.Rectangle[] = []
  magi!: Phaser.GameObjects.Rectangle
  positionHistory: Position[] = []
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  keys!: any
  gridSize = 48
  moveDelay = 150
  lastMoveTime = 0

  constructor() {
    super('Room2')
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a1a')
    
    // Create Magi (Sitting Spot)
    this.magi = this.add.rectangle(400, 300, 48, 48, 0x808080)
    
    // Create Player Leader
    this.player = this.add.rectangle(200, 300, 48, 48, 0x004d00)
    this.physics.add.existing(this.player)
    
    // Create Followers
    for (let i = 0; i < 4; i++) { // 3 members + companion
      const follower = this.add.rectangle(200 - (i+1)*48, 300, 48, 48, 0x555555)
      this.followers.push(follower)
      this.positionHistory.push({x: follower.x, y: follower.y})
    }
    
    this.cameras.main.startFollow(this.player)
    
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keys = this.input.keyboard!.addKeys('ONE,TWO,THREE,FOUR')
    
    playBgm('explore')
    
    EventBus.on('EVENT_WARP_ARENA', () => this.handleWarpArena())
    
    // Listen for party changes
    useGameStore.subscribe((state, prevState) => {
      if (state.activeCharacterId !== prevState.activeCharacterId) {
        this.updateLeaderAppearance(state.activeCharacterId)
      }
    })
    
    this.updateLeaderAppearance(useGameStore.getState().activeCharacterId)
  }

  updateLeaderAppearance(id: string) {
    const party = useGameStore.getState().party
    const leader = party.find(p => p.id === id)
    if (leader) {
      this.player.fillColor = parseInt(leader.sprite.color.replace('0x', ''), 16)
      this.player.width = leader.sprite.width
      this.player.height = leader.sprite.height
    }
  }

  handleWarpArena() {
    this.cameras.main.fadeOut(1000, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('Room3')
    })
  }

  update(time: number) {
    if (useGameStore.getState().dialogueState.isActive || useGameStore.getState().combatState.isActive) {
      this.physics.world.pause()
      return
    } else {
      this.physics.world.resume()
    }

    // Party Swapping Overworld
    if (Phaser.Input.Keyboard.JustDown(this.keys.ONE)) useGameStore.getState().setActiveCharacter('bozog')
    if (Phaser.Input.Keyboard.JustDown(this.keys.TWO)) useGameStore.getState().setActiveCharacter('matchstick')
    if (Phaser.Input.Keyboard.JustDown(this.keys.THREE)) useGameStore.getState().setActiveCharacter('kairon')
    if (Phaser.Input.Keyboard.JustDown(this.keys.FOUR)) useGameStore.getState().setActiveCharacter('atreyu')

    if (time > this.lastMoveTime) {
      let moved = false
      const oldX = this.player.x
      const oldY = this.player.y

      if (this.cursors.left.isDown) { this.player.x -= this.gridSize; moved = true }
      else if (this.cursors.right.isDown) { this.player.x += this.gridSize; moved = true }
      else if (this.cursors.up.isDown) { this.player.y -= this.gridSize; moved = true }
      else if (this.cursors.down.isDown) { this.player.y += this.gridSize; moved = true }

      if (moved) {
        this.lastMoveTime = time + this.moveDelay
        
        // Update history queue for followers
        this.positionHistory.unshift({ x: oldX, y: oldY })
        if (this.positionHistory.length > this.followers.length) {
          this.positionHistory.pop()
        }

        this.followers.forEach((f, i) => {
          if (this.positionHistory[i]) {
            f.x = this.positionHistory[i].x
            f.y = this.positionHistory[i].y
          }
        })

        // Check interaction with Magi
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.magi.x, this.magi.y)
        if (dist <= this.gridSize * 1.5 && !useGameStore.getState().dialogueState.isActive) {
          useGameStore.getState().setDialogue(true, 1, "Magi: The path ahead is sealed... unless you prove your worth.")
        }
      }
    }
  }

  destroy() {
    EventBus.off('EVENT_WARP_ARENA', this.handleWarpArena)
  }
}