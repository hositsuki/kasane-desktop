import type { ScheduleEntry, Countdown, Weekday } from './types';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

export const WEEKDAY_LABELS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function getCurrentWeekday(now = new Date()): Weekday {
  return now.getDay() as Weekday;
}

export function japaneseBroadcastHour(hour: number): string {
  // AniList stores 24:xx and later as the following calendar day in UTC.
  // We render the original broadcast hour in the 30-hour clock when the data indicates it.
  if (hour >= 24) return `${hour}:00`;
  return `${hour.toString().padStart(2, '0')}:00`;
}

export function formatAiringTime(ts: number, locale: string, timeZone?: string): string {
  const d = new Date(ts * 1000);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone,
  }).format(d);
}

export function normalizeSchedule(entries: ScheduleEntry[]): ScheduleEntry[] {
  // Sort by weekday then by airing time, then deduplicate by id+episode.
  const sorted = [...entries].sort((a, b) => {
    if (a.weekday !== b.weekday) return a.weekday - b.weekday;
    return a.airingAt - b.airingAt;
  });

  const seen = new Set<string>();
  return sorted.filter((e) => {
    const key = `${e.id}#${e.episode}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function computeCountdown(targetUnixSeconds: number, now = Date.now()): Countdown {
  const totalSeconds = Math.max(0, Math.floor((targetUnixSeconds * 1000 - now) / MS_PER_SECOND));
  const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
  const hours = Math.floor((totalSeconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;

  let label = '';
  if (totalSeconds === 0) {
    label = 'live';
  } else if (days > 0) {
    label = `${days}d ${hours}h`;
  } else if (hours > 0) {
    label = `${hours}h ${minutes}m`;
  } else {
    label = `${minutes}m ${seconds}s`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    label,
    isLive: totalSeconds === 0,
  };
}

export function nextAiringEntry(entries: ScheduleEntry[], now = Date.now()): ScheduleEntry | null {
  const future = entries.filter((e) => e.airingAt * 1000 > now);
  if (future.length === 0) return null;
  return future.reduce((acc, cur) => (cur.airingAt < acc.airingAt ? cur : acc));
}

export function filterEntries(entries: ScheduleEntry[], query: string): ScheduleEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  return entries.filter((e) => {
    const texts = [e.title.romaji, e.title.english, e.title.native, e.title.chinese]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return texts.includes(q);
  });
}
