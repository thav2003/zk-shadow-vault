import { useEffect, useRef } from "react";

const EncryptedParticleShield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // ---- CONFIG (đã giảm intensity) ----
    const coreRadius = 300;
    const ringCount = 3;
    const particlesPerRing = 35;
    const noiseParticlesCount = 30;

    type RingParticle = {
      angle: number;
      radius: number;
      speed: number;
      wobble: number;
      wobbleSpeed: number;
    };

    type NoiseParticle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
    };

    const ringParticles: RingParticle[] = [];
    const noiseParticles: NoiseParticle[] = [];

    const initRings = () => {
      ringParticles.length = 0;

      for (let r = 0; r < ringCount; r++) {
        const baseRadius = coreRadius + 40 + r * 40;
        for (let i = 0; i < particlesPerRing; i++) {
          ringParticles.push({
            angle: (Math.PI * 2 * i) / particlesPerRing,
            radius: baseRadius,
            speed: (0.0015 + Math.random() * 0.0015) * (r % 2 === 0 ? 1 : -1),
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.01 + Math.random() * 0.015,
          });
        }
      }
    };

    const initNoise = () => {
      noiseParticles.length = 0;
      for (let i = 0; i < noiseParticlesCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = coreRadius + 120 + Math.random() * 250;
        noiseParticles.push({
          x: canvas.width / 2 + Math.cos(angle) * dist,
          y: canvas.height / 2 + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: 0.6 + Math.random() * 1.0,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 100,
        });
      }
    };

    initRings();
    initNoise();

    let animationId: number;

    const draw = () => {
      const { width, height } = canvas;
      const cx = width / 2;
      const cy = height / 2;

      // trail nền nhẹ hơn
      ctx.fillStyle = "rgba(3, 4, 10, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalAlpha = 0.55; // toàn bộ background mờ đi

      // ---- CORE GLOW (mờ hơn) ----
      const coreGradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        coreRadius * 2.2
      );
      coreGradient.addColorStop(0, "rgba(0, 255, 255, 0.18)");
      coreGradient.addColorStop(0.4, "rgba(80, 220, 255, 0.10)");
      coreGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // ---- Lõi inside (giảm sáng 60%) ----
      const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      inner.addColorStop(0, "rgba(0, 255, 255, 0.4)");
      inner.addColorStop(0.6, "rgba(0, 150, 255, 0.25)");
      inner.addColorStop(1, "rgba(10, 15, 30, 0.85)");

      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = inner;
      ctx.fill();

      // ---- RING PARTICLES (mờ + nhỏ hơn) ----
      ctx.globalCompositeOperation = "lighter";
      ringParticles.forEach((p) => {
        p.angle += p.speed;
        p.wobble += p.wobbleSpeed;

        const wobble = Math.sin(p.wobble) * 4;
        const radius = p.radius + wobble;

        const x = cx + Math.cos(p.angle) * radius;
        const y = cy + Math.sin(p.angle) * radius;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 7);
        grad.addColorStop(0, "rgba(0, 255, 255, 0.5)");
        grad.addColorStop(0.6, "rgba(120, 200, 255, 0.25)");
        grad.addColorStop(1, "rgba(180, 90, 255, 0)");

        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,255,255,0.5)";
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";

      // ---- NOISE PARTICLES (rất subtle) ----
      noiseParticles.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.life++;

        if (n.life > n.maxLife) {
          n.life = 0;
        }

        const alpha = 0.09 * (1 - Math.abs(n.life / n.maxLife - 0.5) * 2); // fade in/out nhẹ

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,255,${alpha})`;
        ctx.fill();
      });

      ctx.globalAlpha = 1; // reset

      animationId = requestAnimationFrame(draw);
    };

    ctx.fillStyle = "rgba(3, 4, 10, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none  opacity-60"
      style={{ zIndex: 0 }}
    />
  );
};

export default EncryptedParticleShield;
