import { useCallback, useMemo } from 'react';
import { t as translate, weekdayLabel } from '@/i18n';
import type { Locale, AppSettings } from '@/lib/types';

export function useI18n(locale: Locale) {
  const t = useCallback(
    (key: Parameters<typeof translate>[1], params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale]
  );

  const dayLabel = useCallback((day: number) => weekdayLabel(locale, day), [locale]);

  return useMemo(() => ({ t, dayLabel, locale }), [t, dayLabel, locale]);
}

export function useLocalizedSettings(
  settings: AppSettings,
  setSettings: (patch: Partial<AppSettings>) => void
) {
  const { t, locale } = useI18n(settings.locale);
  return { t, locale, settings, setSettings };
}
