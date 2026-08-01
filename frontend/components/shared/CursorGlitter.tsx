"use client";
import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number; // 1 -> 0
  decay: number;
  rot: number;
  vrot: number;
  color: string;
}

const COLORS = ["#F8C200", "#FFE47A", "#0C831F", "#5FD873", "#FFFFFF"];

/**
 * Glitter cursor trail: sparkles are emitted as the pointer moves and burst
 * outward on click. Canvas-based for performance; pointer-events disabled so
 * it never blocks the UI. Respects reduced-motion and skips touch devices.
 */
export function CursorGlitter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Opt out for reduced-motion users and coarse (touch) pointers.
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const sparkles: Sparkle[] = [];
    let lastX = 0;
    let lastY = 0;
    let raf = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

    function spawn(x: number, y: number, count: number, spread: number) {
      for (let i = 0; i < count; i++) {
        sparkles.push({
          x,
          y,
          vx: rand(-spread, spread),
          vy: rand(-spread, spread) - 0.4,
          size: rand(2, 5),
          life: 1,
          decay: rand(0.012, 0.03),
          rot: rand(0, Math.PI * 2),
          vrot: rand(-0.2, 0.2),
          color: pick(COLORS),
        });
      }
    }

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;
      // more movement -> more sparkles (capped)
      const count = Math.min(6, 1 + (dist / 8) | 0);
      spawn(e.clientX, e.clientY, count, 1.2);
    };

    const onClick = (e: MouseEvent) => spawn(e.clientX, e.clientY, 24, 4);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    // draw a 4-point sparkle star
    function star(x: number, y: number, r: number, rot: number) {
      ctx!.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = rot + (i * Math.PI) / 2;
        ctx!.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        ctx!.lineTo(x + Math.cos(a + Math.PI / 4) * r * 0.4, y + Math.sin(a + Math.PI / 4) * r * 0.4);
      }
      ctx!.closePath();
      ctx!.fill();
    }

    function frame() {
      ctx!.clearRect(0, 0, w, h);
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05; // gravity
        s.vx *= 0.96;
        s.rot += s.vrot;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, s.life);
        ctx!.fillStyle = s.color;
        ctx!.shadowBlur = 8;
        ctx!.shadowColor = s.color;
        star(s.x, s.y, s.size * s.life, s.rot);
        ctx!.restore();
      }
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[300]"
    />
  );
}
