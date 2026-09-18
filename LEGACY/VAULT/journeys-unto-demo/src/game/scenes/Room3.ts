import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'
import { playBgm } from '../../audio/audioUtils'
import { EventBus } from '../../utils/EventBus'

export class Room3 extends Phaser.Scene {
  player!: Phaser.GameObjects.Rectangle
  followers: Phaser.GameObjects.Rectangle[] = []
  magiProj!: Phaser.GameObjects.Rectangle
  remnant!: Phaser.GameObjects.Rectangle
  posHist: {x: number, y: number}[] = []
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  keys!: any
  gridSize = 48
  lastMoveTime = 0
  combatTriggered = false
  playerClone: Phaser.GameObjects.Rectangle | null = null

  constructor() { super('Room3') }

  create() {
    this.cameras.main.setBackgroundColor('#2c3e50')
    this.cameras.main.fadeIn(1000, 0, 0, 0)

    this.add.rectangle(400, 24, 800, 48, 0x1a252f)
    this.add.rectangle(150, 300, 96, 96, 0x34495e)
    this.add.rectangle(650, 300, 96, 96, 0x34495e)
    this.add.rectangle(400, 550, 144, 48, 0x7f8c8d)

    this.add.circle(400, 300, 100, 0x111111)
    this.magiProj = this.add.rectangle(400, 300, 48, 48, 0x808080)

    this.player = this.add.rectangle(400, 96, 48, 48, 0x004d00)
    this.physics.add.existing(this.player)

    for (let i = 0; i < 4; i++) {
      const f = this.add.rectangle(400, 96 - (i+1)*48, 48, 48, 0x555555)
      this.followers.push(f)
      this.posHist.push({x: f.x, y: f.y})
    }

    this.cameras.main.startFollow(this.player)
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keys = this.input.keyboard!.addKeys('ONE,TWO,THREE,FOUR')
    this.updateLeaderAppearance(useGameStore.getState().activeCharacterId)

    useGameStore.subscribe((state, prev) => {
      if (state.activeCharacterId !== prev.activeCharacterId) this.updateLeaderAppearance(state.activeCharacterId)
      if (state.flags.hasDefeatedWarden && !prev.flags.hasDefeatedWarden) this.triggerReversal()
      if (state.combatState.hasClone && !prev.combatState.hasClone) this.spawnClone()
      else if (!state.combatState.hasClone && prev.combatState.hasClone && this.playerClone) {
        this.playerClone.destroy(); this.playerClone = null
      }
    })

    EventBus.on('EVENT_SWAP_CLONE', () => this.swapWithClone())
  }

  updateLeaderAppearance(id: string) {
    const leader = useGameStore.getState().party.find(p => p.id === id)
    if (leader) {
      this.player.fillColor = parseInt(leader.sprite.color.replace('0x', ''), 16)
      this.player.width = leader.sprite.width
      this.player.height = leader.sprite.height
    }
  }

  spawnClone() { this.playerClone = this.add.rectangle(this.player.x + 48, this.player.y, 32, 48, 0xffcccc) }

  swapWithClone() {
    if (this.playerClone) {
      const px = this.player.x, py = this.player.y
      this.player.setPosition(this.playerClone.x, this.playerClone.y)
      this.playerClone.setPosition(px, py)
    }
  }

  triggerReversal() {
    this.tweens.add({ targets: this.magiProj, height: 96, y: this.magiProj.y - 24, fillColor: 0xffffff, duration: 1000 })
    if (useGameStore.getState().activeCharacterId === 'bozog') {
      this.tweens.add({ targets: this.player, height: 24, y: this.player.y + 12, duration: 1000, onComplete: () => this.cameras.main.fadeOut(2000) })
    } else this.cameras.main.fadeOut(2000)
  }

  update(time: number) {
    const state = useGameStore.getState()
    if (state.dialogueState.isActive || state.combatState.isActive) { this.physics.world.pause(); return }
    else this.physics.world.resume()

    if (Phaser.Input.Keyboard.JustDown(this.keys.ONE)) state.setActiveCharacter('bozog')
    if (Phaser.Input.Keyboard.JustDown(this.keys.TWO)) state.setActiveCharacter('matchstick')
    if (Phaser.Input.Keyboard.JustDown(this.keys.THREE)) state.setActiveCharacter('kairon')
    if (Phaser.Input.Keyboard.JustDown(this.keys.FOUR)) state.setActiveCharacter('atreyu')

    if (time > this.lastMoveTime) {
      let moved = false; const oldX = this.player.x, oldY = this.player.y
      if (this.cursors.left.isDown) { this.player.x -= this.gridSize; moved = true }
      else if (this.cursors.right.isDown) { this.player.x += this.gridSize; moved = true }
      else if (this.cursors.up.isDown) { this.player.y -= this.gridSize; moved = true }
      else if (this.cursors.down.isDown) { this.player.y += this.gridSize; moved = true }

      if (moved) {
        this.lastMoveTime = time + 150
        this.posHist.unshift({ x: oldX, y: oldY })
        if (this.posHist.length > this.followers.length) this.posHist.pop()
        this.followers.forEach((f, i) => { if (this.posHist[i]) { f.x = this.posHist[i].x; f.y = this.posHist[i].y } })

        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, 400, 300) <= 96 && !this.combatTriggered) {
          this.combatTriggered = true
          useGameStore.getState().setDialogue(true, 2, "Warden: Intruders... engage Stasis Protocol.")
          this.remnant = this.add.rectangle(400, 520, 48, 48, 0x4a004a)
          playBgm('combat')
        }
      }
    }
  }

  destroy() { EventBus.off('EVENT_SWAP_CLONE', this.swapWithClone) }
}