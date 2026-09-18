import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  color: string;
}

interface RuneGlyph {
  x: number;
  y: number;
  char: string;
  alpha: number;
  size: number;
  vy: number;
  color: string;
}

export const ConstellationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'];
    const starColors = ['#38bdf8', '#fbbf24', '#c084fc', '#e2e8f0', '#34d399'];

    let stars: Star[] = [];
    let runeGlyphs: RuneGlyph[] = [];
    const mouse = { x: -1000, y: -1000, active: false };

    const initEntities = () => {
      const starCount = Math.floor((width * height) / 12000);
      stars = [];
      for (let i = 0; i < Math.max(40, Math.min(starCount, 95)); i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.5 + 0.6,
          baseAlpha: Math.random() * 0.5 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }

      runeGlyphs = [];
      for (let i = 0; i < 14; i++) {
        runeGlyphs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          char: runes[Math.floor(Math.random() * runes.length)],
          alpha: Math.random() * 0.12 + 0.04,
          size: Math.floor(Math.random() * 18) + 14,
          vy: -0.1 - Math.random() * 0.15,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initEntities();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render floating subtle runes
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const glyph of runeGlyphs) {
        glyph.y += glyph.vy;
        if (glyph.y < -30) {
          glyph.y = height + 20;
          glyph.x = Math.random() * width;
        }

        ctx.save();
        ctx.font = `${glyph.size}px serif`;
        ctx.fillStyle = glyph.color;
        ctx.globalAlpha = glyph.alpha * (0.8 + 0.2 * Math.sin(time + glyph.x));
        ctx.shadowColor = glyph.color;
        ctx.shadowBlur = 6;
        ctx.fillText(glyph.char, glyph.x, glyph.y);
        ctx.restore();
      }

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const currentAlpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed * 100) * 0.2;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 4;
        ctx.fill();

        // Connect nearby stars with delicate constellation lines
        for (let j = i + 1; j < stars.length; j++) {
          const other = stars[j];
          const dx = star.x - other.x;
          const dy = star.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const lineAlpha = (1 - dist / 100) * 0.18;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        if (mouse.active) {
          const mdx = star.x - mouse.x;
          const mdy = star.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 140) {
            const mAlpha = (1 - mDist / 140) * 0.35;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = '#f59e0b';
            ctx.globalAlpha = mAlpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block opacity-65" />
    </div>
  );
};
