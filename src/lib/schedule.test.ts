import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  normalizeSchedule,
  computeCountdown,
  nextAiringEntry,
  filterEntries,
  formatAiringTime,
  getCurrentWeekday,
} from './schedule';
import type { ScheduleEntry } from './types';

function entry(id: number, weekday: number, airingAt: number, episode = 1): ScheduleEntry {
  return {
    id,
    title: { romaji: `Anime ${id}`, english: `Anime ${id}`, native: `アニメ ${id}`, chinese: `动画 ${id}` },
    weekday: weekday as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    airingAt,
    episode,
    source: 'anilist',
  };
}

describe('schedule utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('normalizes and deduplicates by id+episode', () => {
    const entries = [
      entry(1, 1, 1000, 1),
      entry(2, 0, 500, 1),
      entry(1, 1, 1000, 1),
      entry(1, 1, 1200, 2),
    ];
    const normalized = normalizeSchedule(entries);
    expect(normalized).toHaveLength(3);
    expect(normalized[0].id).toBe(2);
    expect(normalized[1].episode).toBe(1);
    expect(normalized[2].episode).toBe(2);
  });

  it('computes countdown correctly', () => {
    const now = Date.parse('2026-08-07T12:00:00Z');
    expect(computeCountdown(now / 1000 + 3665, now)).toEqual({
      days: 0,
      hours: 1,
      minutes: 1,
      seconds: 5,
      totalSeconds: 3665,
      label: '1h 1m',
      isLive: false,
    });
  });

  it('marks live when target reached', () => {
    const now = Date.parse('2026-08-07T12:00:00Z');
    expect(computeCountdown(now / 1000, now).isLive).toBe(true);
    expect(computeCountdown(now / 1000, now).label).toBe('live');
  });

  it('finds next airing entry', () => {
    const now = 1_000_000;
    const entries = [entry(1, 0, now - 100), entry(2, 0, now + 300), entry(3, 0, now + 200)];
    const next = nextAiringEntry(entries, now * 1000);
    expect(next?.id).toBe(3);
  });

  it('returns null when nothing is in the future', () => {
    const now = 1_000_000;
    const entries = [entry(1, 0, now - 100)];
    expect(nextAiringEntry(entries, now * 1000)).toBeNull();
  });

  it('filters by title in multiple languages', () => {
    const entries = [
      entry(1, 0, 100),
      { ...entry(2, 0, 100), title: { romaji: 'Glass', english: 'Glass', native: 'ガラス', chinese: '玻璃' } },
    ];
    expect(filterEntries(entries, '玻璃')).toHaveLength(1);
    expect(filterEntries(entries, 'glass')).toHaveLength(1);
    expect(filterEntries(entries, ' ')).toHaveLength(2);
  });

  it('formats airing time', () => {
    const ts = Date.parse('2026-08-07T22:30:00Z') / 1000;
    const formatted = formatAiringTime(ts, 'zh-CN', 'UTC');
    expect(formatted).toContain('22:30');
  });

  it('detects current weekday', () => {
    vi.setSystemTime(new Date('2026-08-07T00:00:00Z')); // Friday
    expect(getCurrentWeekday()).toBe(5);
  });
});
