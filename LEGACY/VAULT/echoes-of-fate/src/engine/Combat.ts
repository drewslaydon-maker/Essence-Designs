import { Bullet, EnemyStats } from '../types';

export const ENEMY_DATABASE: Record<string, EnemyStats> = {
  shade: {
    id: 'enemy_shade',
    name: 'Hollow Shade',
    title: 'Echo of Forgotten Dead',
    maxHp: 45,
    hp: 45,
    atk: 9,
    def: 2,
    mercy: 0,
    color: '#8a4fff',
    spriteType: 'shade',
    attackPatternDuration: 4.5,
    attackPhase: 1,
    dialogueReactions: {
      inquire: 'The shade whispers incoherent laments of a shattered bell tower...',
      taunt: 'The shade recoils, its wispy edges shuddering in anger!',
      parley: 'You hum an ancient hamlet lullaby. The shade\'s eyes soften with longing.',
      purify: 'Rift light cascades over the wraith, disentangling its phantom sorrow.',
    },
  },
  sentry: {
    id: 'enemy_sentry',
    name: 'Crypt Sentry',
    title: 'Gargoyle Guardian of the Seal',
    maxHp: 65,
    hp: 65,
    atk: 12,
    def: 5,
    mercy: 0,
    color: '#c05c46',
    spriteType: 'sentry',
    attackPatternDuration: 5.0,
    attackPhase: 1,
    dialogueReactions: {
      inquire: 'The automaton clanks mechanically: "INTRUDER PROTOCOL ACTIVE."',
      taunt: 'Its stone fists grind together with a shower of granite sparks.',
      parley: 'You display the sigil of the Ashen Hamlet. Its gear-eyes spin in hesitation.',
      purify: 'The lantern drains the corrupted ether powering its animated joints.',
    },
  },
  weaver: {
    id: 'enemy_weaver',
    name: 'Void Weaver',
    title: 'Stitcher of Dimensional Horrors',
    maxHp: 90,
    hp: 90,
    atk: 15,
    def: 6,
    mercy: 0,
    color: '#34d399',
    spriteType: 'weaver',
    attackPatternDuration: 5.5,
    attackPhase: 1,
    dialogueReactions: {
      inquire: 'It chitters as it spins strands of hardened moonlight and void webbing.',
      taunt: 'You sever a thread. It screeches in shrill dissonance!',
      parley: 'You offer an uncorrupted aether shard. It pauses its predatory twitching.',
      purify: 'The bright lantern pulse illuminates its trapped victims in the astral tapestry.',
    },
  },
  malakar: {
    id: 'boss_malakar',
    name: 'Commander Malakar',
    title: 'The Outcast Sentinel of the Rift',
    maxHp: 210,
    hp: 210,
    atk: 15,
    def: 7,
    mercy: 0,
    isBoss: true,
    color: '#e11d48',
    spriteType: 'malakar',
    attackPatternDuration: 5.5,
    attackPhase: 1,
    dialogueReactions: {
      inquire: 'Malakar: "You don\'t understand! If the Throne falls, the Interstice devours everything!"',
      taunt: 'Malakar: "Arrogant whelp. I guarded these crypts before your hamlet was carved from rock!"',
      parley: 'Malakar: "You speak of peace? Look at my hands! The rift has already claimed half my skin!"',
      purify: 'Malakar: "Ghhk... That light... The lantern of Ardent? Has Ronald sent a successor at last?"',
    },
  },
};

/**
 * Procedural Bullet Pattern Generator for the Deltarune-style Action Box
 * Arena is normalized: width 240, height 180 (centered at 120, 90)
 */
export class BulletBoxSimulator {
  public bullets: Bullet[] = [];
  public boxWidth: number = 240;
  public boxHeight: number = 180;
  private spawnTimer: number = 0;
  private patternTime: number = 0;

  constructor(width: number = 240, height: number = 180) {
    this.boxWidth = width;
    this.boxHeight = height;
  }

  public reset() {
    this.bullets = [];
    this.spawnTimer = 0;
    this.patternTime = 0;
  }

  public update(dt: number, enemyType: string, phase: number, frostWardActive: boolean) {
    this.patternTime += dt;
    this.spawnTimer += dt;
    const speedMultiplier = frostWardActive ? 0.6 : 1.0;

    // Spawn logic based on enemy type
    switch (enemyType) {
      case 'shade':
        this.updateShadePattern(dt, speedMultiplier);
        break;
      case 'sentry':
        this.updateSentryPattern(dt, speedMultiplier);
        break;
      case 'weaver':
        this.updateWeaverPattern(dt, speedMultiplier);
        break;
      case 'malakar':
        this.updateMalakarPattern(dt, phase, speedMultiplier);
        break;
      default:
        this.updateShadePattern(dt, speedMultiplier);
    }

    // Update bullet positions
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt * 60;
      b.y += b.vy * dt * 60;
      if (b.age !== undefined) b.age += dt;

      // Remove bullets out of bounds with padding
      if (
        b.x < -20 ||
        b.x > this.boxWidth + 20 ||
        b.y < -20 ||
        b.y > this.boxHeight + 20 ||
        (b.lifetime && b.age && b.age > b.lifetime)
      ) {
        this.bullets.splice(i, 1);
      }
    }
  }

  private updateShadePattern(_dt: number, mult: number) {
    // Spiral orbs floating from top and sides
    if (this.spawnTimer > 0.35) {
      this.spawnTimer = 0;
      const angle = this.patternTime * 2.5;
      const originX = this.boxWidth / 2 + Math.cos(angle) * 70;
      const originY = 10;
      const targetX = this.boxWidth / 2 + (Math.random() - 0.5) * 80;
      const targetY = this.boxHeight - 10;

      const dx = targetX - originX;
      const dy = targetY - originY;
      const dist = Math.hypot(dx, dy) || 1;

      this.bullets.push({
        x: originX,
        y: originY,
        vx: (dx / dist) * 1.8 * mult,
        vy: (dy / dist) * 1.8 * mult,
        radius: 6,
        color: '#c084fc',
      });
    }
  }

  private updateSentryPattern(_dt: number, mult: number) {
    // Stone shockwaves moving from bottom and falling debris from top
    if (this.spawnTimer > 0.45) {
      this.spawnTimer = 0;
      // Falling debris
      const dropX = Math.random() * (this.boxWidth - 30) + 15;
      this.bullets.push({
        x: dropX,
        y: 5,
        vx: (Math.random() - 0.5) * 0.4 * mult,
        vy: (1.6 + Math.random() * 0.8) * mult,
        radius: 7,
        color: '#fb923c',
      });

      // Ground shockwave
      if (Math.random() > 0.4) {
        const fromLeft = Math.random() > 0.5;
        this.bullets.push({
          x: fromLeft ? 5 : this.boxWidth - 5,
          y: this.boxHeight - 20,
          vx: (fromLeft ? 2.2 : -2.2) * mult,
          vy: 0,
          radius: 8,
          color: '#ef4444',
        });
      }
    }
  }

  private updateWeaverPattern(_dt: number, mult: number) {
    // Web pulses from center outward
    if (this.spawnTimer > 0.6) {
      this.spawnTimer = 0;
      const centerX = this.boxWidth / 2;
      const centerY = this.boxHeight / 2;
      const count = 7;
      const baseAngle = this.patternTime * 1.2;

      for (let i = 0; i < count; i++) {
        const a = baseAngle + (i * Math.PI * 2) / count;
        this.bullets.push({
          x: centerX + Math.cos(a) * 10,
          y: centerY + Math.sin(a) * 10,
          vx: Math.cos(a) * 1.7 * mult,
          vy: Math.sin(a) * 1.7 * mult,
          radius: 5,
          color: '#34d399',
        });
      }
    }
  }

  private updateMalakarPattern(_dt: number, phase: number, mult: number) {
    // Phase 1: Sweeping Crescent Slashes
    if (phase === 1) {
      if (this.spawnTimer > 0.42) {
        this.spawnTimer = 0;
        const fromTop = Math.sin(this.patternTime * 2.4) > 0;
        const x = Math.random() * (this.boxWidth - 50) + 25;

        this.bullets.push({
          x,
          y: fromTop ? 5 : this.boxHeight - 5,
          vx: (Math.random() - 0.5) * 0.6 * mult,
          vy: (fromTop ? 1.8 : -1.8) * mult,
          radius: 5,
          color: '#f43f5e',
        });
      }
    }
    // Phase 2: Dimensional Crosshairs & Radial Starbursts
    else if (phase === 2) {
      if (this.spawnTimer > 0.48) {
        this.spawnTimer = 0;
        // Rotating 5-way starburst
        const count = 5;
        const baseA = this.patternTime * 2.2;
        for (let i = 0; i < count; i++) {
          const a = baseA + (i * Math.PI * 2) / count;
          this.bullets.push({
            x: this.boxWidth / 2,
            y: 35,
            vx: Math.cos(a) * 1.6 * mult,
            vy: Math.sin(a) * 1.6 * mult,
            radius: 5,
            color: '#fb7185',
          });
        }
      }
    }
    // Phase 3: Calamity Judgment (Final Stand - Fair, Rhythmic Alternating Waves)
    else {
      // Alternating wave cadence: spawns one wave every 0.65s
      if (this.spawnTimer > 0.65) {
        this.spawnTimer = 0;
        const isLeftWave = Math.floor(this.patternTime / 0.65) % 2 === 0;

        // Dynamic safe corridor (62px tall gap)
        const safeY = (Math.sin(this.patternTime * 1.5) * 0.4 + 0.5) * (this.boxHeight - 60) + 30;

        for (let y = 14; y < this.boxHeight - 12; y += 22) {
          // If in safe corridor, leave clear passage
          if (Math.abs(y - safeY) > 31) {
            if (isLeftWave) {
              this.bullets.push({
                x: 4,
                y: y,
                vx: 1.7 * mult,
                vy: 0,
                radius: 4.5,
                color: '#fda4af',
              });
            } else {
              this.bullets.push({
                x: this.boxWidth - 4,
                y: y,
                vx: -1.7 * mult,
                vy: 0,
                radius: 4.5,
                color: '#f43f5e',
              });
            }
          }
        }

        // Occasional slow tracking aether ember in the center
        if (Math.random() > 0.45) {
          this.bullets.push({
            x: this.boxWidth / 2 + (Math.random() - 0.5) * 40,
            y: 8,
            vx: (Math.random() - 0.5) * 0.4 * mult,
            vy: 1.1 * mult,
            radius: 4,
            color: '#fbbf24',
          });
        }
      }
    }
  }

  public clearBulletsNear(soulX: number, soulY: number, radius: number = 32) {
    this.bullets = this.bullets.filter((b) => {
      const dist = Math.hypot(b.x - soulX, b.y - soulY);
      return dist > radius;
    });
  }

  public checkCollision(soulX: number, soulY: number, soulRadius: number = 3.5): boolean {
    for (const b of this.bullets) {
      const dx = b.x - soulX;
      const dy = b.y - soulY;
      const dist = Math.hypot(dx, dy);
      if (dist < b.radius + soulRadius) {
        return true;
      }
    }
    return false;
  }
}
