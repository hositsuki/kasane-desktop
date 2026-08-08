export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
  chinese?: string;
}

export interface AnimeEpisode {
  airingAt: number; // Unix seconds (UTC)
  episode: number;
  timeUntilAiring: number; // seconds
}

export interface ScheduleEntry {
  id: number;
  title: AnimeTitle;
  coverImage?: string;
  siteUrl?: string;
  weekday: Weekday;
  airingAt: number; // Unix seconds (UTC)
  episode: number;
  source: 'anilist' | 'fallback' | 'manual';
  isFallback?: boolean;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  label: string;
  isLive: boolean;
}

export type ViewMode = 'compact' | 'dashboard';
export type ThemeMode = 'dark' | 'light' | 'system';
export type Locale = 'zh-CN' | 'ja' | 'en';

export interface AppSettings {
  locale: Locale;
  theme: ThemeMode;
  viewMode: ViewMode;
  reduceMotion: boolean;
  overlay: {
    x: number;
    y: number;
    fontSize: number;
    opacity: number;
    tentativeColor: string;
    finalColor: string;
  };
  halo: {
    enabled: boolean;
    keyboardShortcut: boolean;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  locale: 'zh-CN',
  theme: 'dark',
  viewMode: 'dashboard',
  reduceMotion: false,
  overlay: {
    x: 120,
    y: 80,
    fontSize: 32,
    opacity: 0.92,
    tentativeColor: '#a78bfa', // moon-purple
    finalColor: '#22d3ee', // cyan
  },
  halo: {
    enabled: true,
    keyboardShortcut: true,
  },
};

export interface SubtitleCue {
  id: string;
  text: string;
  state: 'tentative' | 'final';
  receivedAt: number;
}

export type HaloDirection = 'up' | 'down' | 'left' | 'right' | 'forward' | 'back';
