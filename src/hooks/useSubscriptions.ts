import { useState, useEffect, useCallback } from 'react';
import { storageGetObject, storageSetObject } from '@/lib/storage';
import type { ScheduleEntry } from '@/lib/types';

const SUBS_KEY = 'kasane:subscriptions:v1';

export interface SubscriptionStore {
  ids: number[];
  note?: string;
}

export function loadSubscriptions(): number[] {
  const data = storageGetObject<SubscriptionStore>(SUBS_KEY);
  return data?.ids ?? [];
}

export function saveSubscriptions(ids: number[]): void {
  storageSetObject<SubscriptionStore>(SUBS_KEY, { ids, note: 'user-subscriptions' });
}

export function useSubscriptions(allEntries: ScheduleEntry[]) {
  const [ids, setIds] = useState<number[]>(() => loadSubscriptions());

  useEffect(() => {
    saveSubscriptions(ids);
  }, [ids]);

  const follow = useCallback((id: number) => {
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const unfollow = useCallback((id: number) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const isFollowing = useCallback((id: number) => ids.includes(id), [ids]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const subscribedEntries = allEntries.filter((e) => ids.includes(e.id));
  const uniqueSubscribed = subscribedEntries.filter(
    (e, idx, arr) => arr.findIndex((x) => x.id === e.id) === idx
  );

  return {
    ids,
    follow,
    unfollow,
    toggle,
    isFollowing,
    subscribedEntries: uniqueSubscribed,
  };
}
