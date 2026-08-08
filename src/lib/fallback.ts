import type { ScheduleEntry, Weekday, AnimeTitle } from './types';

// KASANE fallback dataset: original fictional titles used when AniList is unreachable.
// All titles, cover placeholders and schedules are demo data and clearly marked.

function makeTitle(romaji: string, english: string, native: string, chinese: string): AnimeTitle {
  return { romaji, english, native, chinese };
}

// Anchor to next Sunday UTC 00:00 so the schedule always looks alive.
function anchorSunday(): number {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const daysUntilSunday = (7 - d.getUTCDay()) % 7;
  return Math.floor(d.getTime() / 1000) + daysUntilSunday * 86400;
}

function buildFallbackEntries(): ScheduleEntry[] {
  const sun = anchorSunday();
  const titles = [
    makeTitle('Glass no Hoshi', 'Star of Glass', 'ガラスの星', '玻璃之星'),
    makeTitle('Aoi Keikoku', 'Cyan Warning', '青い警告', '青色警告'),
    makeTitle('Yoru no Orbit', 'Night Orbit', '夜の軌道', '夜之轨道'),
    makeTitle('Halo Senshi', 'Halo Soldier', '光輪戦士', '光环战士'),
    makeTitle('Tsukiakari no Uta', 'Moonlight Song', '月明かりの詩', '月光之歌'),
    makeTitle('Neon Kumori', 'Neon Cloudiness', 'ネオン曇り', '霓虹阴霾'),
    makeTitle('Kasane no Kage', 'Shadow of Kasane', 'かさねの影', '重影'),
    makeTitle('Sora no Palette', 'Palette of the Sky', '空のパレット', '天空调色盘'),
  ];

  const slots: Array<[Weekday, number, number]> = [
    [0, 22, 30],
    [0, 23, 45],
    [1, 0, 0],
    [1, 21, 0],
    [2, 18, 30],
    [2, 24, 0], // Japanese 24:xx next-day broadcast
    [3, 19, 0],
    [3, 22, 0],
    [4, 20, 30],
    [5, 16, 0],
    [5, 23, 15],
    [6, 17, 0],
    [6, 23, 30],
  ];

  const entries: ScheduleEntry[] = [];
  slots.forEach(([weekday, hour, minute], idx) => {
    const title = titles[idx % titles.length];
    const offsetDays = weekday;
    const hourOfDay = hour % 24;
    const extraDay = hour >= 24 ? 1 : 0;
    const airingAt = sun + (offsetDays + extraDay) * 86400 + hourOfDay * 3600 + minute * 60;
    entries.push({
      id: 10000 + idx,
      title,
      weekday,
      airingAt,
      episode: 1 + Math.floor(idx / titles.length),
      source: 'fallback',
      isFallback: true,
    });
  });

  return entries;
}

export const FALLBACK_SCHEDULE: ScheduleEntry[] = buildFallbackEntries();
