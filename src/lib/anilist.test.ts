import { describe, expect, it } from 'vitest';
import { anilistResponseToEntries } from './anilist';

describe('AniList schedule adapter', () => {
  it('keeps only the next airing episode for each releasing title', () => {
    const entries = anilistResponseToEntries({
      Page: {
        media: [
          {
            id: 42,
            title: { romaji: 'Kasane no Hoshi', native: '重ねの星' },
            nextAiringEpisode: {
              airingAt: Date.parse('2026-08-08T12:00:00Z') / 1000,
              episode: 7,
              timeUntilAiring: 3600,
            },
          },
          {
            id: 99,
            title: { romaji: 'No scheduled episode' },
          },
        ],
      },
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ id: 42, episode: 7, source: 'anilist' });
  });
});
