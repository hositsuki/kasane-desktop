import { useHaloGesture } from '@/hooks/useHaloGesture';
import { useI18n } from '@/hooks/useI18n';
import type { Locale } from '@/lib/types';

interface GestureDemoProps {
  locale: Locale;
  onTrigger?: () => void;
}

export function GestureDemo({ locale, onTrigger }: GestureDemoProps) {
  const { t } = useI18n(locale);
  const { state, binders } = useHaloGesture({ onTrigger });

  return (
    <div
      {...binders}
      className={[
        'glass select-none rounded-2xl p-6 text-center transition-colors',
        state.phase === 'triggered' ? 'bg-[var(--cyan-dim)]' : '',
      ].join(' ')}
    >
      <p className="text-sm font-medium text-[var(--text-primary)]">{t('halo.title')}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        {state.phase === 'idle' && '按住鼠标左键，在 220ms 内按下右键，然后同时向下拖动 ≥80px 触发。'}
        {state.phase === 'waiting_second' && '等待第二键…'}
        {state.phase === 'tracking' && '拖动中…'}
        {state.phase === 'triggered' && '已触发！'}
        {state.phase === 'cancelled' && '已取消'}
      </p>
      <div className="mt-3 font-mono text-[10px] text-[var(--text-muted)]">
        phase: {state.phase} | x: {Math.round(state.current.x)} | y: {Math.round(state.current.y)}
      </div>
    </div>
  );
}
