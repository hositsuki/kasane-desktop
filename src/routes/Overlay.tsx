import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { GlassCard } from '@/components/GlassCard';
import type { AppSettings, SubtitleCue } from '@/lib/types';

interface OverlayRouteProps {
  settings: AppSettings;
  onChangeSettings: (patch: Partial<AppSettings>) => void;
  cues: SubtitleCue[];
  onCues: (cues: SubtitleCue[]) => void;
}

export function OverlayRoute({ settings, onChangeSettings, cues, onCues }: OverlayRouteProps) {
  const { t } = useI18n(settings.locale);
  const [input, setInput] = useState('');
  const [draftState, setDraftState] = useState<'tentative' | 'final'>('tentative');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const pushCue = (text: string, state: SubtitleCue['state']) => {
    const cue: SubtitleCue = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      state,
      receivedAt: Date.now(),
    };
    onCues([...cues, cue].slice(-20));
  };

  const handleInput = (value: string) => {
    setInput(value);
    setDraftState('tentative');
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (value.trim()) {
        pushCue(value.trim(), 'tentative');
      }
    }, 400);
  };

  const handleCommit = () => {
    if (!input.trim()) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    pushCue(input.trim(), 'final');
    setInput('');
    setDraftState('final');
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gradient">{t('overlay.title')}</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 text-sm font-medium">{t('overlay.position')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
              X
              <input
                type="number"
                value={settings.overlay.x}
                onChange={(e) => onChangeSettings({ overlay: { ...settings.overlay, x: Number(e.target.value) } })}
                className="glass rounded-lg px-2 py-1"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-[var(--text-secondary)]">
              Y
              <input
                type="number"
                value={settings.overlay.y}
                onChange={(e) => onChangeSettings({ overlay: { ...settings.overlay, y: Number(e.target.value) } })}
                className="glass rounded-lg px-2 py-1"
              />
            </label>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 text-sm font-medium">{t('overlay.fontSize')}</h3>
          <input
            type="range"
            min={16}
            max={72}
            value={settings.overlay.fontSize}
            onChange={(e) => onChangeSettings({ overlay: { ...settings.overlay, fontSize: Number(e.target.value) } })}
            className="w-full accent-[var(--moon-purple)]"
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">{settings.overlay.fontSize}px</p>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 text-sm font-medium">{t('overlay.opacity')}</h3>
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            value={settings.overlay.opacity}
            onChange={(e) => onChangeSettings({ overlay: { ...settings.overlay, opacity: Number(e.target.value) } })}
            className="w-full accent-[var(--cyan)]"
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">{Math.round(settings.overlay.opacity * 100)}%</p>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 text-sm font-medium">{t('overlay.tentativeColor')} / {t('overlay.finalColor')}</h3>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.overlay.tentativeColor}
              onChange={(e) => onChangeSettings({ overlay: { ...settings.overlay, tentativeColor: e.target.value } })}
              className="h-8 w-14 rounded bg-transparent"
            />
            <input
              type="color"
              value={settings.overlay.finalColor}
              onChange={(e) => onChangeSettings({ overlay: { ...settings.overlay, finalColor: e.target.value } })}
              className="h-8 w-14 rounded bg-transparent"
            />
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="mb-2 text-sm font-medium">{t('overlay.demoInput')}</h3>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
            placeholder={t('overlay.demoPlaceholder')}
            className={[
              'glass flex-1 rounded-xl px-4 py-2 text-sm',
              draftState === 'tentative' ? 'border-[var(--moon-purple)]/40' : 'border-[var(--cyan)]/40',
            ].join(' ')}
          />
          <button
            onClick={handleCommit}
            className="rounded-xl bg-[var(--cyan-dim)] px-4 py-2 text-sm font-medium text-[var(--cyan)] hover:bg-[var(--cyan)]/20"
          >
            {draftState === 'tentative' ? 'Tentative' : 'Final'}
          </button>
        </div>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          This is a manual demo only. Real-time ASR/system audio capture is not implemented in v0.1.0.
        </p>
      </GlassCard>

      {cues.length > 0 && (
        <GlassCard className="max-h-48 overflow-auto">
          <ul className="space-y-1 text-xs">
            {cues.map((cue) => (
              <li key={cue.id} className={cue.state === 'final' ? 'text-[var(--cyan)]' : 'text-[var(--moon-purple)]'}>
                <span className="mr-2 rounded bg-white/10 px-1">{cue.state}</span>
                {cue.text}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
