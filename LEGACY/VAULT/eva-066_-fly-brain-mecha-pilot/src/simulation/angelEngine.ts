/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Angel, AngelType, Projectile } from '../types';

export const ANGEL_CATALOG: Record<AngelType, Omit<Angel, 'id' | 'position' | 'velocity' | 'state' | 'attackCooldown' | 'phase'>> = {
  SACHIEL_SPIDER: {
    type: 'SACHIEL_SPIDER',
    name: 'SACHIEL-ARACHNIDA',
    title: 'THE 3RD ANGEL // PREDATORY ORB-WEAVER',
    codeName: 'ANGEL-03 [ARACHNE]',
    description: 'Eight-legged biological horror. Deploys crystalline sticky web clusters and lunges suddenly across the Tokyo-3 ruins.',
    predatorTrait: 'Web trapping slows EVA thrusters; close-quarters lunges deal massive crushing damage.',
    health: 700,
    maxHealth: 700,
    maxAttackCooldown: 120,
    atFieldIntegrity: 100,
  },
  RAMIEL_SWAT: {
    type: 'RAMIEL_SWAT',
    name: 'RAMIEL-SWAT',
    title: 'THE 4TH ANGEL // THE MONOLITHIC FLYSWATTER',
    codeName: 'ANGEL-04 [OCTAHEDRON]',
    description: 'A floating crystalline octahedron that rotates with terrifying mathematical perfection. Charges lethal high-yield swat lasers.',
    predatorTrait: 'Audible beam charge-up siren preceding catastrophic geometric particle beam.',
    health: 900,
    maxHealth: 900,
    maxAttackCooldown: 180,
    atFieldIntegrity: 100,
  },
  MANTIS_IEL: {
    type: 'MANTIS_IEL',
    name: 'MANTIS-IEL',
    title: 'THE 5TH ANGEL // THE APEX AMBUSH SCYTHE',
    codeName: 'ANGEL-05 [MANTODEA]',
    description: 'Fastest biological predator in the connectome records. Slashes with geometric high-frequency scythes at blinding acceleration.',
    predatorTrait: 'Rapid lateral strafing and dual scythe cross-slashes designed to bracket evasions.',
    health: 780,
    maxHealth: 780,
    maxAttackCooldown: 100,
    atFieldIntegrity: 100,
  },
  FROG_IEL: {
    type: 'FROG_IEL',
    name: 'FROG-IEL',
    title: 'THE 6TH ANGEL // AMPHIBIAN DOOMSDAY',
    codeName: 'ANGEL-06 [ANURA]',
    description: 'Immense subterranean behemoth. Extends a supersonic biological harpoon tongue that crosses Tokyo-3 in 350 milliseconds.',
    predatorTrait: 'Extreme looming angular expansion velocity; requires split-second Giant Fiber jumping reflex.',
    health: 1050,
    maxHealth: 1050,
    maxAttackCooldown: 150,
    atFieldIntegrity: 100,
  },
};

export class AngelEngine {
  public activeAngel: Angel | null = null;
  public projectiles: Projectile[] = [];
  public angelQueue: AngelType[] = ['SACHIEL_SPIDER', 'RAMIEL_SWAT', 'MANTIS_IEL', 'FROG_IEL'];
  private currentAngelIndex = 0;

  constructor() {
    this.spawnNextAngel();
  }

  public spawnNextAngel(): Angel {
    const type = this.angelQueue[this.currentAngelIndex % this.angelQueue.length];
    this.currentAngelIndex++;

    const base = ANGEL_CATALOG[type];
    this.activeAngel = {
      ...base,
      id: `ANGEL_${Date.now()}`,
      position: { x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 20, z: 420 },
      velocity: { x: 0, y: 0, z: -0.6 },
      state: 'APPROACHING',
      attackCooldown: base.maxAttackCooldown,
      phase: 0,
      atFieldIntegrity: 100,
    };
    return this.activeAngel;
  }

  public update(evaPos: { x: number; y: number }): {
    newProjectiles: Projectile[];
    loomingExpansion: number;
    opticFlowX: number;
  } {
    const newProjectiles: Projectile[] = [];
    let loomingExpansion = 0;
    let opticFlowX = 0;

    if (!this.activeAngel) {
      return { newProjectiles, loomingExpansion, opticFlowX };
    }

    const angel = this.activeAngel;
    const isEnraged = angel.health < angel.maxHealth * 0.4;
    angel.phase += isEnraged ? 0.055 : 0.03;

    // Movement toward Eva
    if (angel.state === 'APPROACHING' || angel.state === 'CHARGING_BEAM') {
      // Natural stalking motion
      if (angel.state !== 'CHARGING_BEAM') {
        angel.position.z += isEnraged ? angel.velocity.z * 1.3 : angel.velocity.z;
      }

      // Weaving & positioning
      if (angel.type === 'MANTIS_IEL') {
        angel.position.x += Math.sin(angel.phase * 1.8) * (isEnraged ? 1.4 : 0.9);
        angel.position.y += Math.cos(angel.phase * 1.1) * (isEnraged ? 0.7 : 0.4);
      } else if (angel.type === 'SACHIEL_SPIDER') {
        angel.position.x += Math.sin(angel.phase * 0.9) * (isEnraged ? 0.9 : 0.5);
      } else if (angel.type === 'RAMIEL_SWAT') {
        // Floating rotation in center
        angel.position.x += (0 - angel.position.x) * 0.02;
        angel.position.y += (0 - angel.position.y) * 0.02;
      }

      // Calculate looming visual stimulus (dθ/dt)
      // Angular size theta ≈ Size / Z
      const currentAngularSize = 60 / Math.max(10, angel.position.z);
      const nextAngularSize = 60 / Math.max(10, angel.position.z + angel.velocity.z);
      loomingExpansion = Math.max(0, (nextAngularSize - currentAngularSize) * 25);

      // Optic flow
      opticFlowX = angel.position.x - evaPos.x;

      // Attack countdown (faster when enraged)
      angel.attackCooldown -= isEnraged ? 1.5 : 1;

      // Ramiel Beam Charge state trigger
      if (angel.type === 'RAMIEL_SWAT' && angel.attackCooldown <= 45 && angel.state !== 'CHARGING_BEAM') {
        angel.state = 'CHARGING_BEAM';
      }

      if (angel.attackCooldown <= 0) {
        this.triggerAngelAttack(angel, evaPos, newProjectiles);
        angel.state = 'APPROACHING';
        angel.attackCooldown = isEnraged ? angel.maxAttackCooldown * 0.65 : angel.maxAttackCooldown;
      }

      // If too close, lunge and initiate melee clash
      if (angel.position.z < 65) {
        angel.state = 'ATTACKING';
        angel.velocity.z = 1.6; // Back off after striking close quarters
        // Spawn immediate close-quarters shockwave
        newProjectiles.push({
          id: `MELEE_${Date.now()}`,
          x: angel.position.x,
          y: angel.position.y,
          z: angel.position.z,
          vx: (evaPos.x - angel.position.x) * 0.1,
          vy: (evaPos.y - angel.position.y) * 0.1,
          vz: -7.0,
          radius: 24,
          color: '#ff0033',
          isHostile: true,
          type: 'ANGEL_BEAT',
        });
      }
    } else if (angel.state === 'ATTACKING') {
      angel.position.z += angel.velocity.z;
      if (angel.position.z > 280) {
        angel.state = 'APPROACHING';
        angel.velocity.z = isEnraged ? -1.0 : -0.75;
      }
    } else if (angel.state === 'STUNNED') {
      angel.position.z += 0.2;
      angel.attackCooldown -= 1;
      if (angel.attackCooldown <= 0) {
        angel.state = 'APPROACHING';
        angel.attackCooldown = angel.maxAttackCooldown;
      }
    }

    return { newProjectiles, loomingExpansion, opticFlowX };
  }

  private triggerAngelAttack(angel: Angel, evaPos: { x: number; y: number }, newProjectiles: Projectile[]) {
    const isEnraged = angel.health < angel.maxHealth * 0.4;
    const speedMult = isEnraged ? 1.25 : 1.0;
    const vz = (angel.type === 'FROG_IEL' ? -10.5 : angel.type === 'RAMIEL_SWAT' ? -9.0 : angel.type === 'MANTIS_IEL' ? -6.8 : -5.5) * speedMult;
    const flightFrames = Math.max(10, Math.abs((angel.position.z - 10) / (-vz)));
    const targetVx = (evaPos.x - angel.position.x) / flightFrames;
    const targetVy = (evaPos.y - angel.position.y) / flightFrames;

    if (angel.type === 'SACHIEL_SPIDER') {
      // Fires 3 web filaments in a spread (center hits EVA position, flanking webs catch lateral dodges)
      for (let i = -1; i <= 1; i++) {
        newProjectiles.push({
          id: `PROJ_${Date.now()}_${i}`,
          x: angel.position.x + i * 8,
          y: angel.position.y,
          z: angel.position.z,
          vx: targetVx + i * 0.32,
          vy: targetVy,
          vz: vz,
          radius: 11,
          color: '#ff0055',
          isHostile: true,
          type: 'ANGEL_WEB',
        });
      }
    } else if (angel.type === 'RAMIEL_SWAT') {
      // Swat beam: colossal high velocity particle beam aimed directly at EVA
      newProjectiles.push({
        id: `PROJ_${Date.now()}`,
        x: angel.position.x,
        y: angel.position.y,
        z: angel.position.z,
        vx: targetVx,
        vy: targetVy,
        vz: vz,
        radius: 22,
        color: '#ffaa00',
        isHostile: true,
        type: 'ANGEL_BEAT',
      });
    } else if (angel.type === 'MANTIS_IEL') {
      // High speed scythe wave flanking cross-slash
      for (let i = -1; i <= 1; i += 2) {
        newProjectiles.push({
          id: `PROJ_${Date.now()}_${i}`,
          x: angel.position.x + i * 14,
          y: angel.position.y,
          z: angel.position.z,
          vx: targetVx + i * 0.45,
          vy: targetVy,
          vz: vz,
          radius: 13,
          color: '#00ffaa',
          isHostile: true,
          type: 'ANGEL_SCYTHE',
        });
      }
    } else if (angel.type === 'FROG_IEL') {
      // Supersonic Tongue Strike (Giant Looming)
      newProjectiles.push({
        id: `PROJ_${Date.now()}`,
        x: angel.position.x,
        y: angel.position.y - 2,
        z: angel.position.z,
        vx: targetVx,
        vy: targetVy,
        vz: vz,
        radius: 24,
        color: '#ff2200',
        isHostile: true,
        type: 'ANGEL_BEAT',
      });
    }
  }

  public damageAngel(amount: number): boolean {
    if (!this.activeAngel) return false;
    // Multi-layered AT Field defense
    if (this.activeAngel.atFieldIntegrity > 0) {
      this.activeAngel.atFieldIntegrity = Math.max(0, this.activeAngel.atFieldIntegrity - amount * 0.6);
      // Chip damage penetrates through to core
      this.activeAngel.health = Math.max(0, this.activeAngel.health - amount * 0.35);
    } else {
      // Core unprotected
      this.activeAngel.health = Math.max(0, this.activeAngel.health - amount);
    }

    if (this.activeAngel.health <= 0) {
      this.activeAngel.state = 'DEFEATED';
      return true; // Angel eliminated!
    }
    return false;
  }
}
