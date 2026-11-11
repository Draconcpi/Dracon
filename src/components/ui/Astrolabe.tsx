import { ReactNode } from 'react';

// Bayer letters used to name the brightest stars of each constellation
const BAYER = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ'];

interface AstrolabeProps {
  className?: string;
  /** Content shown at the heart of the astrolabe (defaults to a glowing core). */
  children?: ReactNode;
}

/** Pure-CSS 3D armillary/astrolabe: tilted dial plus gimbal rings. */
export default function Astrolabe({ className = '', children }: AstrolabeProps) {
  return (
    <div className={`astrolabe relative aspect-square ${className}`}>
      <div
        aria-hidden
        className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(168,85,244,0.32)_0%,rgba(124,34,206,0.12)_45%,transparent_70%)] blur-2xl"
      />

      <div aria-hidden className="astrolabe-stage absolute inset-0">
        <div className="astrolabe-dial absolute inset-0 rounded-full border border-dracon-purple-100/20">
          <div className="absolute inset-[7%] rounded-full border border-dashed border-dracon-purple-100/15" />
          {BAYER.map((letter, i) => (
            <div key={letter} className="absolute inset-0" style={{ transform: `rotate(${i * 30}deg)` }}>
              <span className="absolute left-1/2 top-[1.5%] -translate-x-1/2 font-display text-[clamp(8px,1.4vw,12px)] text-dracon-purple-100/60">
                {letter}
              </span>
            </div>
          ))}
        </div>

        <div className="astrolabe-ring-a absolute inset-[9%] rounded-full border border-dracon-orange-300/40 shadow-[0_0_18px_rgba(251,146,60,0.25)]">
          <span className="astrolabe-bead bg-dracon-orange-200 shadow-[0_0_12px_3px_rgba(251,146,60,0.7)]" />
        </div>
        <div className="astrolabe-ring-b absolute inset-[16%] rounded-full border border-dracon-purple-100/35">
          <span className="astrolabe-bead bg-dracon-purple-50 shadow-[0_0_12px_3px_rgba(216,180,254,0.7)]" />
        </div>
        <div className="astrolabe-ring-c absolute inset-[23%] rounded-full border border-dashed border-indigo-300/30" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <div
            aria-hidden
            className="w-[18%] aspect-square rounded-full bg-[radial-gradient(circle_at_40%_35%,#fff7ed_0%,#fdba74_25%,#a855f4_65%,transparent_72%)] shadow-[0_0_40px_10px_rgba(168,85,244,0.35)]"
          />
        )}
      </div>
    </div>
  );
}
