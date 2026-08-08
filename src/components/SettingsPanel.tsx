import { useI18n } from '@/hooks/useI18n';
import type { AppSettings, Locale, ThemeMode, ViewMode } from '@/lib/types';

interface SettingsPanelProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const { t } = useI18n(settings.locale);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-gradient">{t('settings.title')}</h2>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-[var(--text-secondary)]">{t('settings.language')}</span>
        <select
          value={settings.locale}
          onChange={(e) => onChange({ locale: e.target.value as Locale })}
          className="glass rounded-xl px-3 py-2 text-sm"
        >
          <option value="zh-CN">简体中文</option>
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-[var(--text-secondary)]">{t('settings.theme')}</span>
        <select
          value={settings.theme}
          onChange={(e) => onChange({ theme: e.target.value as ThemeMode })}
          className="glass rounded-xl px-3 py-2 text-sm"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">System</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-[var(--text-secondary)]">{t('settings.viewMode')}</span>
        <select
          value={settings.viewMode}
          onChange={(e) => onChange({ viewMode: e.target.value as ViewMode })}
          className="glass rounded-xl px-3 py-2 text-sm"
        >
          <option value="dashboard">{t('view.dashboard')}</option>
          <option value="compact">{t('view.compact')}</option>
        </select>
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-panel)] px-3 py-2">
        <input
          type="checkbox"
          checked={settings.reduceMotion}
          onChange={(e) => onChange({ reduceMotion: e.target.checked })}
          className="h-4 w-4 accent-[var(--moon-purple)]"
        />
        <span className="text-sm">{t('settings.reduceMotion')}</span>
      </label>
    </div>
  );
}
