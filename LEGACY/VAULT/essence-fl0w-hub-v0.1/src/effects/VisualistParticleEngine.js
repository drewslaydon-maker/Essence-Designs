/**
 * VisualistParticleEngine.js
 * ESSENCE FL0W v0.1 • The Visualist (Pure-JS Particle Juice & Canvas Rendering Polish)
 * 
 * Invariants Enforced:
 * - Zero Heap Allocations in 60fps render tick (Pre-allocated Object Pool N=160).
 * - Multi-Type Juice:
 *     1. DUST_MOTE: Floating luminous amber dust particles in lantern cones.
 *     2. SMOKE_WISP: Gentle rising curls of tobacco smoke from Matchstick's booth & hearth.
 *     3. LANTERN_EMBER: Microscopic orange sparks drifting from whale-oil chandeliers.
 *     4. MUSIC_NOTE: Ethereal runic notes drifting from Kairon's stage when rhythm is active.
 *     5. ALE_DROP: Froth splatter when Bozog or Atreyu slam flagons.
 *     6. SHOCKWAVE: Dynamic expanding ripple rings from body drumming and table slams.
 * - Dynamic Lighting Bloom: Radial gradient ambient light passes on chandeliers and windows.
 */

export class VisualistParticleEngine {
  /**
   * @param {number} [maxParticles=160]
   */
  constructor(maxParticles = 160) {
    this.maxParticles = maxParticles;
    this.pool = new Array(maxParticles);

    for (let i = 0; i < maxParticles; i++) {
      this.pool[i] = {
        active: false,
        type: 'DUST_MOTE', // 'DUST_MOTE' | 'SMOKE_WISP' | 'LANTERN_EMBER' | 'MUSIC_NOTE' | 'ALE_DROP' | 'SHOCKWAVE'
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 2,
        maxSize: 4,
        alpha: 1.0,
        life: 0,
        maxLife: 1.0,
        color: '#fef08a',
        char: '♪',
        scale: 1.0
      };
    }

    this.ambientTimer = 0;
    this.shockwaves = []; // Small ring pool (up to 8)
    for (let i = 0; i < 8; i++) {
      this.shockwaves.push({
        active: false,
        x: 0,
        y: 0,
        radius: 0,
        maxRadius: 60,
        alpha: 0,
        color: '#38bdf8'
      });
    }

    // Seed ambient dust motes
    this.seedAmbientMotes(40);
  }

  seedAmbientMotes(count = 40) {
    for (let i = 0; i < count; i++) {
      this.spawn({
        type: 'DUST_MOTE',
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 6 - 2,
        size: 1 + Math.random() * 2,
        life: Math.random() * 4,
        maxLife: 4 + Math.random() * 6,
        color: Math.random() > 0.4 ? '#fef08a' : '#fed7aa',
        alpha: 0.15 + Math.random() * 0.35
      });
    }
  }

  spawn(params) {
    // Find first inactive particle
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (!p.active) {
        p.active = true;
        p.type = params.type || 'DUST_MOTE';
        p.x = params.x || 0;
        p.y = params.y || 0;
        p.vx = params.vx || 0;
        p.vy = params.vy || 0;
        p.size = params.size || 2;
        p.maxSize = params.maxSize || p.size;
        p.life = params.life || 0;
        p.maxLife = params.maxLife || 1.0;
        p.color = params.color || '#fef08a';
        p.char = params.char || '♪';
        p.alpha = params.alpha !== undefined ? params.alpha : 1.0;
        return p;
      }
    }
    return null;
  }

  spawnShockwave(x, y, color = '#38bdf8', maxRadius = 60) {
    for (let i = 0; i < this.shockwaves.length; i++) {
      const sw = this.shockwaves[i];
      if (!sw.active) {
        sw.active = true;
        sw.x = x;
        sw.y = y;
        sw.radius = 4;
        sw.maxRadius = maxRadius;
        sw.alpha = 0.85;
        sw.color = color;
        return;
      }
    }
  }

  spawnAleSplatter(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 65;
      this.spawn({
        type: 'ALE_DROP',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 15,
        size: 1.5 + Math.random() * 2.5,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.25,
        color: Math.random() > 0.3 ? '#fef08a' : '#f59e0b',
        alpha: 0.8
      });
    }
  }

  spawnMusicNotes(x, y, count = 2) {
    const symbols = ['♩', '♪', '♫', '♬', 'ᚱ', 'ᚲ'];
    for (let i = 0; i < count; i++) {
      this.spawn({
        type: 'MUSIC_NOTE',
        x: x + (Math.random() - 0.5) * 20,
        y: y - 10,
        vx: (Math.random() - 0.5) * 15,
        vy: -20 - Math.random() * 25,
        char: symbols[Math.floor(Math.random() * symbols.length)],
        size: 11 + Math.random() * 4,
        life: 0,
        maxLife: 1.2 + Math.random() * 0.6,
        color: Math.random() > 0.5 ? '#c084fc' : '#e879f9',
        alpha: 0.9
      });
    }
  }

  update(dt) {
    this.ambientTimer += dt;
    // Periodically recycle ambient dust motes
    if (this.ambientTimer > 0.4) {
      this.ambientTimer = 0;
      // Respawn 1-2 dust motes near the two chandeliers
      this.spawn({
        type: 'DUST_MOTE',
        x: 220 + (Math.random() - 0.5) * 200,
        y: 200 + (Math.random() - 0.5) * 160,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 4 - 2,
        size: 1.2 + Math.random() * 1.8,
        life: 0,
        maxLife: 5 + Math.random() * 4,
        color: '#fef08a',
        alpha: 0.25
      });
    }

    // Update particles in pool
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Gravity or buoyancy
      if (p.type === 'ALE_DROP') {
        p.vy += 220 * dt; // Gravity
      } else if (p.type === 'SMOKE_WISP' || p.type === 'MUSIC_NOTE') {
        p.vy -= 10 * dt; // Slight rise
        p.vx += Math.sin(p.life * 4) * 5 * dt; // Gentle drift
      } else if (p.type === 'DUST_MOTE') {
        p.x += Math.sin(p.life * 1.5) * 4 * dt;
      }

      // Life decay ratio
      const lifeRatio = p.life / p.maxLife;
      if (p.type === 'ALE_DROP') {
        p.alpha = 1.0 - lifeRatio;
      } else if (p.type === 'MUSIC_NOTE') {
        p.alpha = 1.0 - lifeRatio * lifeRatio;
      } else {
        // Fade in then out
        if (lifeRatio < 0.2) p.alpha = (lifeRatio / 0.2) * 0.35;
        else p.alpha = (1.0 - lifeRatio) * 0.35;
      }
    }

    // Update shockwaves
    for (let i = 0; i < this.shockwaves.length; i++) {
      const sw = this.shockwaves[i];
      if (!sw.active) continue;

      sw.radius += (sw.maxRadius - sw.radius) * Math.min(1.0, dt * 12.0);
      sw.alpha = Math.max(0, sw.alpha - dt * 2.5);

      if (sw.alpha <= 0.02 || sw.radius >= sw.maxRadius - 2) {
        sw.active = false;
      }
    }
  }

  render(ctx) {
    ctx.save();

    // Render Shockwaves
    for (let i = 0; i < this.shockwaves.length; i++) {
      const sw = this.shockwaves[i];
      if (!sw.active) continue;

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 2.5 * sw.alpha;
      ctx.globalAlpha = sw.alpha;
      ctx.stroke();
    }

    // Render Particles
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      ctx.globalAlpha = Math.max(0, Math.min(1.0, p.alpha));

      if (p.type === 'MUSIC_NOTE') {
        ctx.fillStyle = p.color;
        ctx.font = `bold ${Math.round(p.size)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * Render The Visualist's ambient lighting bloom pass
   */
  renderLightingPass(ctx, width = 800, height = 600) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Chandelier 1 (Counter area)
    const g1 = ctx.createRadialGradient(240, 240, 10, 240, 240, 260);
    g1.addColorStop(0, 'rgba(254, 240, 138, 0.18)');
    g1.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
    g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, width, height);

    // Chandelier 2 (Stage area)
    const g2 = ctx.createRadialGradient(580, 150, 10, 580, 150, 240);
    g2.addColorStop(0, 'rgba(192, 132, 252, 0.16)');
    g2.addColorStop(0.6, 'rgba(168, 85, 247, 0.06)');
    g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, width, height);

    // South Door Fog / Mist Cool Spill
    const gDoor = ctx.createRadialGradient(400, 580, 20, 400, 580, 220);
    gDoor.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
    gDoor.addColorStop(0.7, 'rgba(14, 165, 233, 0.04)');
    gDoor.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gDoor;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }
}
