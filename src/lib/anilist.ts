import type { ScheduleEntry, Weekday, AnimeTitle } from './types';

const ANILIST_API = 'https://graphql.anilist.co';

const AIRING_QUERY = `
  query Page {
    Page(page: 1, perPage: 50) {
      media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
        id
        title { romaji english native }
        coverImage { medium large }
        siteUrl
        nextAiringEpisode {
          airingAt
          episode
          timeUntilAiring
        }
      }
    }
  }
`;

interface AniListResponse {
  data?: {
    Page?: {
      media?: Array<{
        id: number;
        title: AnimeTitle;
        coverImage?: { medium?: string; large?: string };
        siteUrl?: string;
        nextAiringEpisode?: {
          airingAt: number;
          episode: number;
          timeUntilAiring: number;
        };
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export interface AniListResult {
  ok: boolean;
  entries: ScheduleEntry[];
  source: 'anilist' | 'fallback';
  error?: string;
}

export function weekdayFromUnix(ts: number): Weekday {
  const d = new Date(ts * 1000);
  return d.getDay() as Weekday;
}

export function anilistResponseToEntries(data: AniListResponse['data']): ScheduleEntry[] {
  const media = data?.Page?.media ?? [];
  const entries: ScheduleEntry[] = [];

  for (const m of media) {
    const base = {
      id: m.id,
      title: m.title,
      coverImage: m.coverImage?.large ?? m.coverImage?.medium,
      siteUrl: m.siteUrl,
      source: 'anilist' as const,
    };

    const next = m.nextAiringEpisode;
    if (!next) continue;

    entries.push({
      ...base,
      weekday: weekdayFromUnix(next.airingAt),
      airingAt: next.airingAt,
      episode: next.episode,
    });
  }

  return entries;
}

export async function fetchAniListSchedule(abort?: AbortSignal): Promise<AniListResult> {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query: AIRING_QUERY }),
      signal: abort,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = (await response.json()) as AniListResponse;
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }

    const entries = anilistResponseToEntries(json.data);
    return { ok: true, entries, source: 'anilist' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, entries: [], source: 'fallback', error: message };
  }
}
