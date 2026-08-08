import { useReducedMotion } from '@/hooks/useReducedMotion';

interface OrbitalBackgroundProps {
  reduceMotion?: boolean;
}

export function OrbitalBackground({ reduceMotion = false }: OrbitalBackgroundProps) {
  const prefersReduced = useReducedMotion(reduceMotion);
  const animate = !prefersReduced;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-60">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="orb1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="orb2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <ellipse
          cx="50%"
          cy="55%"
          rx="45vw"
          ry="35vh"
          fill="none"
          stroke="url(#orb1)"
          strokeWidth="1"
          opacity="0.4"
        >
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 55"
              to="360 50 55"
              dur="120s"
              repeatCount="indefinite"
            />
          )}
        </ellipse>

        <ellipse
          cx="50%"
          cy="50%"
          rx="30vw"
          ry="22vh"
          fill="none"
          stroke="url(#orb2)"
          strokeWidth="1"
          opacity="0.3"
        >
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="90s"
              repeatCount="indefinite"
            />
          )}
        </ellipse>

        <circle cx="50%" cy="50%" r="4" fill="#a78bfa" opacity="0.5">
          {animate && (
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" />
          )}
        </circle>
      </svg>
    </div>
  );
}
