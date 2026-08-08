import { Tv, Heart, Clock } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { computeCountdown } from '@/lib/schedule';
import { useI18n } from '@/hooks/useI18n';
import type { ScheduleEntry, Locale } from '@/lib/types';

interface CompactViewProps {
  entries: ScheduleEntry[];
  locale: Locale;
  isFollowing: (id: number) => boolean;
  onToggleFollow: (id: number) => void;
}

export function CompactView({ entries, locale, isFollowing, onToggleFollow }: CompactViewProps) {
  const { t } = useI18n(locale);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => {
        const countdown = computeCountdown(entry.airingAt);
        const title = entry.title.chinese || entry.title.romaji || entry.title.english || '???';
        return (
          <GlassCard key={`${entry.id}-${entry.episode}`} className="p-3" hover>
            <div className="flex items-center gap-3">
              {entry.coverImage ? (
                <img src={entry.coverImage} alt={title} className="h-12 w-9 rounded-md object-cover" loading="lazy" />
              ) : (
                <div className="flex h-12 w-9 items-center justify-center rounded-md bg-[var(--moon-purple-dim)]">
                  <Tv size={16} className="text-[var(--moon-purple)]" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{title}</p>
                <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Clock size={10} />
                  {t('schedule.episode', { episode: entry.episode })} · {countdown.label}
                </p>
              </div>
              <button
                onClick={() => onToggleFollow(entry.id)}
                className={[
                  'rounded-full p-1',
                  isFollowing(entry.id) ? 'text-[var(--cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                ].join(' ')}
              >
                <Heart size={16} fill={isFollowing(entry.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
