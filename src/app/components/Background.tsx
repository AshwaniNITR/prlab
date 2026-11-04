"use client";
import React, { useMemo } from "react";

/**
 * Site-wide background for the IntelliPattern Lab website.
 * Theme: robotics / cyberpunk HUD on white. Flat colours only.
 * Place ONCE at the top of <body> in layout.tsx — takes no layout space.
 */

const NAVY = "#0a1020";
const YELLOW = "#facc15";

// Sparse orthogonal "PCB" traces, drawn in a 1440x900 space.
// Longer routes, fewer branches — reads as intentional routing.
const TRACES = [
  "M0,180 H140 L180,220 V420 L220,460 H300",
  "M0,640 H120 L160,680 H280 V780",
  "M1440,240 H1320 L1280,280 V480 L1240,520 H1160",
  "M1440,720 H1340 V820 L1300,860 H1200",
  "M60,0 V120 L100,160 H220",
  "M1380,900 V800 L1340,760",
];
const VIAS: [number, number][] = [
  [300, 460], [280, 780], [1160, 520], [1200, 860], [220, 160], [1340, 760],
];
// Which traces carry a single yellow data pulse
const PULSES = [0, 2, 4];

const Bracket = ({ pos }: { pos: string }) => (
  <span
    className={`absolute h-6 w-6 border-[#0a1020]/50 ${pos}`}
    aria-hidden="true"
  />
);

const Background = () => {
  // Rotating dial tick marks — sparse, one accent
  const ticks = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const a = (i * (360 / 48) * Math.PI) / 180;
        const r1 = i % 4 === 0 ? 262 : 272;
        const r2 = 280;
        return {
          x1: 300 + Math.cos(a) * r1,
          y1: 300 + Math.sin(a) * r1,
          x2: 300 + Math.cos(a) * r2,
          y2: 300 + Math.sin(a) * r2,
        };
      }),
    []
  );

  return (
    <>
      <style>{`
        @keyframes bgScan { from { transform: translateY(-2px); } to { transform: translateY(100vh); } }
        @keyframes bgSpin { to { transform: rotate(360deg); } }
        @keyframes bgSpinRev { to { transform: rotate(-360deg); } }
        @keyframes bgPulse { from { stroke-dashoffset: 5; } to { stroke-dashoffset: -95; } }
        @keyframes bgBlink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: .25; } }
        .bg-scan { animation: bgScan 18s linear infinite; }
        .bg-spin { animation: bgSpin 120s linear infinite; transform-origin: 300px 300px; }
        .bg-spin-rev { animation: bgSpinRev 80s linear infinite; transform-origin: 300px 300px; }
        .bg-pulse { stroke-dasharray: 4 96; animation: bgPulse 9s linear infinite; }
        .bg-blink { animation: bgBlink 1.8s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bg-scan, .bg-spin, .bg-spin-rev, .bg-pulse, .bg-blink { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white"
      >
        {/* Fine technical grid — sparser, calmer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(10,16,32,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,16,32,0.045) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Registration "+" marks — larger interval, thinner stroke */}
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id="bgPlus" width="160" height="160" patternUnits="userSpaceOnUse">
              <path d="M76 80h8M80 76v8" stroke={NAVY} strokeOpacity="0.18" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgPlus)" />
        </svg>

        {/* Circuit traces (tablet / desktop only) */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 hidden h-full w-full md:block"
        >
          <g fill="none" stroke={NAVY} strokeOpacity="0.14" strokeWidth="1">
            {TRACES.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g fill="none" stroke={YELLOW} strokeWidth="2" strokeLinecap="square">
            {PULSES.map((idx, k) => (
              <path
                key={idx}
                d={TRACES[idx]}
                pathLength={100}
                className="bg-pulse"
                style={{ animationDelay: `${k * 2.4}s` }}
              />
            ))}
          </g>
          <g fill="#ffffff" stroke={NAVY} strokeOpacity="0.35" strokeWidth="1">
            {VIAS.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" />
            ))}
          </g>
        </svg>

        {/* Rotating robotics dial, bottom-right — refined, less clutter */}
        <svg
          viewBox="0 0 600 600"
          className="absolute -bottom-40 -right-40 h-[26rem] w-[26rem] md:-bottom-56 md:-right-56 md:h-[44rem] md:w-[44rem]"
        >
          <g className="bg-spin" fill="none" stroke={NAVY} strokeOpacity="0.18">
            <circle cx="300" cy="300" r="280" strokeWidth="1" />
            <g strokeWidth="1">
              {ticks.map((t, i) => (
                <line key={i} {...t} />
              ))}
            </g>
            <path
              d="M300 20 A280 280 0 0 1 498 102"
              stroke={YELLOW}
              strokeOpacity="0.9"
              strokeWidth="4"
              strokeLinecap="butt"
            />
          </g>
          <g className="bg-spin-rev" fill="none" stroke={NAVY} strokeOpacity="0.15">
            <circle cx="300" cy="300" r="220" strokeWidth="1" strokeDasharray="2 10" />
            <circle cx="300" cy="300" r="175" strokeWidth="1" />
          </g>
          <circle cx="300" cy="300" r="3.5" fill={NAVY} fillOpacity="0.35" />
        </svg>

        {/* Left edge ruler (desktop only) — thinner, calmer */}
        <div
          className="absolute bottom-0 left-3 top-0 hidden w-px lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(10,16,32,0.22) 0 1px, transparent 1px 16px)",
          }}
        />

        {/* Slow scan line — single hairline, slower */}
        <div className="bg-scan absolute inset-x-0 top-0 h-px bg-yellow-400/50" />

        {/* HUD frame: corner brackets + readouts */}
        <div className="absolute inset-x-4 bottom-4 top-24 md:inset-x-8 md:bottom-8">
          <Bracket pos="left-0 top-0 border-l border-t" />
          <Bracket pos="right-0 top-0 border-r border-t" />
          <Bracket pos="bottom-0 left-0 border-b border-l" />
          <Bracket pos="bottom-0 right-0 border-b border-r" />

          <div className="absolute left-9 top-2 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#0a1020]/50 md:block">
            IPL // Pattern.Recognition
          </div>
          <div className="absolute right-9 top-2 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#0a1020]/50 md:flex">
            Sys.Online
            <span className="bg-blink inline-block h-1.5 w-1.5 bg-yellow-400" />
          </div>
          <div className="absolute bottom-2 left-9 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#0a1020]/50 md:block">
            NIT Rourkela // 22.25°N 84.90°E
          </div>
          <div className="absolute bottom-2 right-9 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#0a1020]/50 md:block">
            Machine.Intelligence // v2.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Background;