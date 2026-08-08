import { Clock, Tv, ExternalLink, Heart } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { computeCountdown } from '@/lib/schedule';
import { useI18n } from '@/hooks/useI18n';
import type { ScheduleEntry, Locale } from '@/lib/types';

interface ScheduleCardProps {
  entry: ScheduleEntry;
  locale: Locale;
  isFollowing: boolean;
  onToggleFollow: () => void;
  compact?: boolean;
}

export function ScheduleCard({ entry, locale, isFollowing, onToggleFollow, compact = false }: ScheduleCardProps) {
  const { t } = useI18n(locale);
  const countdown = computeCountdown(entry.airingAt);
  const title = entry.title.chinese || entry.title.romaji || entry.title.english || entry.title.native || '???';
  const sub = entry.title.native || entry.title.romaji || '';

  return (
    <GlassCard className={compact ? 'p-3' : 'p-4'} hover>
      <div className="flex items-start gap-3">
        {entry.coverImage ? (
          <img
            src={entry.coverImage}
            alt={title}
            className="h-16 w-12 flex-shrink-0 rounded-lg object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-16 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--moon-purple-dim)]">
            <Tv size={20} className="text-[var(--moon-purple)]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]" title={title}>
              {title}
            </h3>
            <button
              onClick={onToggleFollow}
              aria-label={isFollowing ? t('action.unfollow') : t('action.follow')}
              className={[
                'rounded-full p-1 transition-colors',
                isFollowing ? 'text-[var(--cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="truncate text-xs text-[var(--text-muted)]">{sub}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {t('schedule.episode', { episode: entry.episode })}
            </span>
            <span
              className={[
                'rounded-full px-2 py-0.5 font-medium',
                countdown.isLive
                  ? 'bg-[var(--cyan-dim)] text-[var(--cyan)]'
                  : 'bg-[var(--moon-purple-dim)] text-[var(--moon-purple)]',
              ].join(' ')}
            >
              {countdown.isLive ? t('schedule.countdown.live') : countdown.label}
            </span>
          </div>
          {entry.isFallback && (
            <span className="mt-2 inline-block rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-300">
              DEMO
            </span>
          )}
        </div>
        {entry.siteUrl && (
          <a
            href={entry.siteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--cyan)]"
            aria-label="AniList"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </GlassCard>
  );
}
