import { useGameStore } from '../store/gameStore'

let audioCtx: AudioContext | null = null
let bgmOscillator: OscillatorNode | null = null
let bgmGain: GainNode | null = null

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
}

export const playBgm = (type: 'explore' | 'combat') => {
  if (!audioCtx) return
  const volume = useGameStore.getState().volume
  
  if (bgmOscillator) {
    bgmOscillator.stop()
    bgmOscillator.disconnect()
  }
  if (bgmGain) {
    bgmGain.disconnect()
  }

  bgmOscillator = audioCtx.createOscillator()
  bgmGain = audioCtx.createGain()

  if (type === 'explore') {
    bgmOscillator.type = 'sine'
    bgmOscillator.frequency.value = 200 // ambient sine wave
  } else {
    bgmOscillator.type = 'square'
    bgmOscillator.frequency.value = 150 // tense square wave
  }

  bgmGain.gain.value = volume * 0.1 // keep it quiet
  
  bgmOscillator.connect(bgmGain)
  bgmGain.connect(audioCtx.destination)
  
  bgmOscillator.start()
}

export const updateBgmVolume = (volume: number) => {
  if (bgmGain) {
    bgmGain.gain.setValueAtTime(volume * 0.1, audioCtx?.currentTime || 0)
  }
}

export const stopBgm = () => {
  if (bgmOscillator) {
    bgmOscillator.stop()
    bgmOscillator.disconnect()
    bgmOscillator = null
  }
}

export const playSfx = (type: 'hit' | 'heal' | 'mirror_swap' | 'illusion_shatter' | 'nat20_hope') => {
  if (!audioCtx) return
  const volume = useGameStore.getState().volume
  if (volume === 0) return

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)

  const now = audioCtx.currentTime
  gain.gain.setValueAtTime(volume, now)

  switch (type) {
    case 'hit':
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(100, now)
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc.start(now)
      osc.stop(now + 0.1)
      break
    case 'heal':
      osc.type = 'sine'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.linearRampToValueAtTime(800, now + 0.3)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.3)
      break
    case 'mirror_swap':
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.linearRampToValueAtTime(300, now + 0.2)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.2)
      break
    case 'illusion_shatter':
      osc.type = 'square'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.3)
      break
    case 'nat20_hope':
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now) // A5
      gain.gain.setValueAtTime(volume, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5)
      osc.start(now)
      osc.stop(now + 1.5)
      break
  }
}