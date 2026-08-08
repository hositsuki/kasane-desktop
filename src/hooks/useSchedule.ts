import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchAniListSchedule } from '@/lib/anilist';
import { FALLBACK_SCHEDULE } from '@/lib/fallback';
import { normalizeSchedule, nextAiringEntry, filterEntries, getCurrentWeekday } from '@/lib/schedule';
import type { ScheduleEntry, Weekday } from '@/lib/types';

export interface UseScheduleResult {
  entries: ScheduleEntry[];
  displayed: ScheduleEntry[];
  loading: boolean;
  source: 'anilist' | 'fallback';
  error?: string;
  selectedDay: Weekday;
  setSelectedDay: (day: Weekday) => void;
  query: string;
  setQuery: (q: string) => void;
  nextAiring: ScheduleEntry | null;
  refresh: () => void;
}

export function useSchedule(): UseScheduleResult {
  const [rawEntries, setRawEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'anilist' | 'fallback'>('anilist');
  const [error, setError] = useState<string | undefined>();
  const [selectedDay, setSelectedDay] = useState<Weekday>(() => getCurrentWeekday());
  const [query, setQuery] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const result = await fetchAniListSchedule(abortRef.current.signal);
    if (result.ok && result.entries.length > 0) {
      setRawEntries(result.entries);
      setSource('anilist');
    } else {
      setRawEntries(FALLBACK_SCHEDULE);
      setSource('fallback');
      if (result.error) setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  const entries = useMemo(() => normalizeSchedule(rawEntries), [rawEntries]);
  const dayEntries = useMemo(() => entries.filter((e) => e.weekday === selectedDay), [entries, selectedDay]);
  const displayed = useMemo(() => filterEntries(dayEntries, query), [dayEntries, query]);
  const nextAiring = useMemo(() => nextAiringEntry(entries), [entries]);

  return {
    entries,
    displayed,
    loading,
    source,
    error,
    selectedDay,
    setSelectedDay,
    query,
    setQuery,
    nextAiring,
    refresh: load,
  };
}
