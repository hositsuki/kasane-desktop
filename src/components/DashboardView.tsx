import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { ScheduleGrid } from './ScheduleGrid';
import { GlassCard } from './GlassCard';
import { computeCountdown } from '@/lib/schedule';
import { useI18n } from '@/hooks/useI18n';
import type { UseScheduleResult } from '@/hooks/useSchedule';
import type { AppSettings } from '@/lib/types';

interface DashboardViewProps {
  schedule: UseScheduleResult;
  settings: AppSettings;
  isFollowing: (id: number) => boolean;
  onToggleFollow: (id: number) => void;
  onRefresh: () => void;
}

export function DashboardView({ schedule, settings, isFollowing, onToggleFollow, onRefresh }: DashboardViewProps) {
  const { t } = useI18n(settings.locale);
  const next = schedule.nextAiring;
  const nextCountdown = next ? computeCountdown(next.airingAt) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">{t('schedule.title')}</h1>
          <p className="text-sm text-[var(--text-muted)]">{t('app.tagline')}</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={schedule.loading}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-[var(--moon-purple-dim)] disabled:opacity-50"
        >
          <RefreshCw size={14} className={schedule.loading ? 'animate-spin' : ''} />
          {t('action.refresh')}
        </button>
      </div>

      {schedule.source === 'fallback' && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
          <AlertCircle size={16} />
          {t('schedule.fallback')}
          {schedule.error && <span className="text-[var(--text-muted)]"> — {schedule.error}</span>}
        </div>
      )}

      {next && nextCountdown && (
        <GlassCard className="relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--moon-purple-dim)] blur-2xl" />
          <div className="relative flex items-center gap-4">
            <Sparkles className="text-[var(--cyan)]" size={28} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                {t('schedule.nextAiring')}
              </p>
              <h2 className="text-lg font-semibold">
                {next.title.chinese || next.title.romaji || next.title.english}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('schedule.episode', { episode: next.episode })} · {nextCountdown.label}
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="flex items-center gap-3">
        <input
          value={schedule.query}
          onChange={(e) => schedule.setQuery(e.target.value)}
          placeholder={t('schedule.search')}
          className="glass w-full rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-purple)]"
        />
      </div>

      <ScheduleGrid
        entries={schedule.displayed}
        locale={settings.locale}
        selectedDay={schedule.selectedDay}
        onSelectDay={schedule.setSelectedDay}
        isFollowing={isFollowing}
        onToggleFollow={onToggleFollow}
      />
    </div>
  );
}
