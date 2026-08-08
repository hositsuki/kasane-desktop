import { useEffect, useRef, useState } from 'react';
import { Move } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { AppSettings, SubtitleCue } from '@/lib/types';

interface SubtitleOverlayProps {
  settings: AppSettings;
  cues: SubtitleCue[];
}

export function SubtitleOverlay({ settings, cues }: SubtitleOverlayProps) {
  const { t } = useI18n(settings.locale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: settings.overlay.x, y: settings.overlay.y });
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    setPos({ x: settings.overlay.x, y: settings.overlay.y });
  }, [settings.overlay.x, settings.overlay.y]);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPos({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  };

  const handlePointerUp = () => setDragging(false);

  const latest = cues[cues.length - 1];

  return (
    <div
      ref={containerRef}
      className={[
        'fixed z-40 flex max-w-2xl flex-col items-center rounded-xl px-6 py-3',
        'border border-white/10 bg-black/40 backdrop-blur-md',
        dragging ? 'cursor-grabbing' : 'cursor-grab',
      ].join(' ')}
      style={{
        left: pos.x,
        top: pos.y,
        fontSize: settings.overlay.fontSize,
        opacity: settings.overlay.opacity,
        color: latest?.state === 'final' ? settings.overlay.finalColor : settings.overlay.tentativeColor,
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/60">
        <Move size={10} />
        {t('overlay.title')}
      </div>
      <p className="min-h-[1.2em] whitespace-pre-wrap text-center font-medium leading-tight">
        {latest?.text || '…'}
      </p>
      {cues.length > 1 && (
        <p className="mt-1 text-xs text-white/40">
          {cues.length} cues
        </p>
      )}
    </div>
  );
}
