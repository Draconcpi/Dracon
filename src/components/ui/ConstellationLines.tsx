'use client';

import { motion } from 'framer-motion';

const constellationPaths = [
  // Draco-inspired constellation
  { points: [[100, 50], [130, 80], [160, 70], [190, 110], [170, 150], [200, 180], [230, 160]] },
  // Small triangle
  { points: [[300, 100], [340, 60], [380, 100], [300, 100]] },
  // Arc
  { points: [[500, 200], [530, 170], [570, 160], [610, 170], [640, 200]] },
];

export default function ConstellationLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-20">
      <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {constellationPaths.map((constellation, i) => {
          const pathData = constellation.points
            .map((point, j) => `${j === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`)
            .join(' ');

          return (
            <g key={i}>
              <motion.path
                d={pathData}
                fill="none"
                stroke="rgba(168, 85, 244, 0.4)"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 3, delay: i * 1.5, ease: 'easeInOut' },
                  opacity: { duration: 1, delay: i * 1.5 },
                }}
              />
              {constellation.points.map((point, j) => (
                <motion.circle
                  key={j}
                  cx={point[0]}
                  cy={point[1]}
                  r="3"
                  fill="rgba(200, 180, 255, 0.6)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 1.5 + j * 0.3,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
