"use client";
import { useState } from "react";
import confetti from "canvas-confetti";
import { useRewardsStore } from "@/store/rewardsStore";

const SEGMENTS = [
  { label: "10% OFF", color: "#0C831F" },
  { label: "50 pts", color: "#F8C200" },
  { label: "Free Delivery", color: "#1A1A2E" },
  { label: "20% OFF", color: "#0C831F" },
  { label: "100 pts", color: "#F8C200" },
  { label: "5% OFF", color: "#1A1A2E" },
  { label: "200 pts", color: "#0C831F" },
  { label: "Free Beer 🍺", color: "#F8C200" },
];

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = SIZE / 2;
const SEG = 360 / SEGMENTS.length;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(index: number) {
  const start = polar(CX, CY, R, index * SEG);
  const end = polar(CX, CY, R, (index + 1) * SEG);
  return `M ${CX} ${CY} L ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y} Z`;
}

export function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const earn = useRewardsStore((s) => s.earn);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const winner = Math.floor(Math.random() * SEGMENTS.length);
    // 5 full turns + land the winning segment at the top pointer
    const target = 360 * 5 + (360 - winner * SEG - SEG / 2);
    setRotation((prev) => prev + target);

    setTimeout(() => {
      setSpinning(false);
      const label = SEGMENTS[winner].label;
      setResult(label);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      const m = label.match(/(\d+)\s*pts/);
      if (m) earn(Number(m[1]), `Spin & Win: ${label}`);
    }, 4200);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* pointer */}
        <div className="absolute left-1/2 top-[-6px] z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[16px] border-x-transparent border-t-danger" />
        <svg
          width={SIZE}
          height={SIZE}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {SEGMENTS.map((s, i) => {
            const mid = polar(CX, CY, R * 0.62, i * SEG + SEG / 2);
            return (
              <g key={i}>
                <path d={arcPath(i)} fill={s.color} stroke="#fff" strokeWidth={2} />
                <text
                  x={mid.x}
                  y={mid.y}
                  fill="#fff"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                  transform={`rotate(${i * SEG + SEG / 2}, ${mid.x}, ${mid.y})`}
                >
                  {s.label}
                </text>
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r={20} fill="#fff" />
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="rounded bg-primary px-10 py-3 font-bold text-white active:scale-95 disabled:opacity-50"
      >
        {spinning ? "Spinning…" : "SPIN"}
      </button>

      {result && (
        <div className="rounded bg-gold-light px-4 py-2 text-center font-bold text-dark">
          🎉 You won: {result}!
        </div>
      )}
    </div>
  );
}
