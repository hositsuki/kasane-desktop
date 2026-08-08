import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div
      className={[
        'glass rounded-2xl p-4',
        hover ? 'transition-transform duration-200 hover:-translate-y-0.5' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
