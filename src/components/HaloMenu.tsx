import { useEffect, useRef, useState, useCallback } from 'react';
import { Calendar, Heart, MessageSquareText, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { Locale, HaloDirection } from '@/lib/types';

interface HaloMenuProps {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  onNavigate: (direction: HaloDirection) => void;
}

const ITEMS: { direction: HaloDirection; icon: typeof Calendar; labelKey: 'nav.schedule' | 'nav.subscriptions' | 'nav.overlay' | 'nav.settings' | 'view.compact' | 'view.dashboard' }[] = [
  { direction: 'up', icon: Calendar, labelKey: 'nav.schedule' },
  { direction: 'forward', icon: Heart, labelKey: 'nav.subscriptions' },
  { direction: 'right', icon: MessageSquareText, labelKey: 'nav.overlay' },
  { direction: 'down', icon: Settings, labelKey: 'nav.settings' },
  { direction: 'left', icon: ChevronUp, labelKey: 'view.compact' },
  { direction: 'back', icon: ChevronDown, labelKey: 'view.dashboard' },
];

export function HaloMenu({ locale, open, onClose, onNavigate }: HaloMenuProps) {
  const { t } = useI18n(locale);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    if (open) {
      setFocused(0);
      dialogRef.current?.focus();
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNavigate(ITEMS[focused].direction);
        return;
      }
      const dirs: Record<string, number> = {
        ArrowUp: 0,
        ArrowRight: 2,
        ArrowDown: 3,
        ArrowLeft: 4,
      };
      if (e.key in dirs) {
        e.preventDefault();
        setFocused(dirs[e.key]);
      }
    },
    [focused, onClose, onNavigate]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t('halo.title')}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="relative flex h-72 w-72 items-center justify-center rounded-full focus:outline-none"
      >
        {/* Orbital rings */}
        <div className="absolute inset-0 rounded-full border border-[var(--moon-purple-dim)]" />
        <div className="absolute inset-8 rounded-full border border-[var(--cyan-dim)]" />

        {/* Center label */}
        <div className="z-10 text-center">
          <p className="text-lg font-bold text-gradient">{t('halo.title')}</p>
          <p className="text-[10px] text-[var(--text-muted)]">{t('halo.hint')}</p>
        </div>

        {/* Directional items */}
        {ITEMS.map((item, idx) => {
          const angle = idx * 60; // 0, 60, 120, 180, 240, 300
          const rad = (angle * Math.PI) / 180;
          const radius = 110;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const Icon = item.icon;
          const active = focused === idx;
          return (
            <button
              key={item.direction}
              onClick={() => onNavigate(item.direction)}
              onMouseEnter={() => setFocused(idx)}
              className={[
                'absolute flex h-14 w-14 flex-col items-center justify-center rounded-full border transition-all',
                active
                  ? 'border-[var(--cyan)] bg-[var(--cyan-dim)] text-[var(--cyan)]'
                  : 'border-[var(--glass-border)] bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              aria-label={t(item.labelKey)}
            >
              <Icon size={18} />
              <span className="mt-0.5 text-[9px]">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
