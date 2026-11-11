const POINTS = [[8, 44], [28, 18], [50, 30], [70, 10], [88, 36]] as const;

interface ConstellationLoaderProps {
  label?: string;
  className?: string;
}

/** Loading indicator: a small constellation that keeps tracing itself. */
export default function ConstellationLoader({ label, className = '' }: ConstellationLoaderProps) {
  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-5 ${className}`}>
      <svg width="112" height="64" viewBox="0 0 96 54" className="overflow-visible" aria-hidden>
        <path
          d="M8 44 L28 18 L50 30 L70 10 L88 36"
          pathLength={100}
          className="constellation-loader-path"
          fill="none"
          stroke="rgba(192,132,252,0.75)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {POINTS.map(([x, y], i) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r={2.2}
            fill="#f3e8ff"
            className="constellation-loader-star"
            style={{ animationDelay: `${i * 0.24}s` }}
          />
        ))}
      </svg>
      {label && <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{label}</p>}
    </div>
  );
}
