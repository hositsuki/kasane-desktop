import { useMemo } from 'react';
import { ScheduleCard } from './ScheduleCard';
import { GlassCard } from './GlassCard';
import { weekdayLabel } from '@/i18n';
import { getCurrentWeekday } from '@/lib/schedule';
import type { ScheduleEntry, Locale, Weekday } from '@/lib/types';

interface ScheduleGridProps {
  entries: ScheduleEntry[];
  locale: Locale;
  selectedDay: Weekday;
  onSelectDay: (day: Weekday) => void;
  isFollowing: (id: number) => boolean;
  onToggleFollow: (id: number) => void;
}

export function ScheduleGrid({
  entries,
  locale,
  selectedDay,
  onSelectDay,
  isFollowing,
  onToggleFollow,
}: ScheduleGridProps) {
  const days = useMemo(() => [0, 1, 2, 3, 4, 5, 6] as Weekday[], []);
  const today = getCurrentWeekday();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const active = day === selectedDay;
          const isToday = day === today;
          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-[var(--moon-purple)] text-white'
                  : 'glass text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              {weekdayLabel(locale, day)}
              {isToday && <span className="ml-1 text-[10px] opacity-80">●</span>}
            </button>
          );
        })}
      </div>

      {entries.length === 0 ? (
        <GlassCard className="py-12 text-center text-[var(--text-muted)]">
          No entries for this day.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <ScheduleCard
              key={`${entry.id}-${entry.episode}`}
              entry={entry}
              locale={locale}
              isFollowing={isFollowing(entry.id)}
              onToggleFollow={() => onToggleFollow(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
