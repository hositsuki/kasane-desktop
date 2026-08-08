import { useState, useCallback, useEffect } from 'react';
import { Calendar, Heart, MessageSquareText, Settings } from 'lucide-react';
import { OrbitalBackground } from '@/components/OrbitalBackground';
import { DashboardView } from '@/components/DashboardView';
import { CompactView } from '@/components/CompactView';
import { SettingsPanel } from '@/components/SettingsPanel';
import { HaloMenu } from '@/components/HaloMenu';
import { GestureDemo } from '@/components/GestureDemo';
import { SubtitleOverlay } from '@/components/SubtitleOverlay';
import { useSettings } from '@/lib/settings';
import { useSchedule } from '@/hooks/useSchedule';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useI18n } from '@/hooks/useI18n';
import type { HaloDirection, SubtitleCue } from '@/lib/types';
import { OverlayRoute } from './Overlay';

export function Home() {
  const { settings, setSettings } = useSettings();
  const { t } = useI18n(settings.locale);
  const schedule = useSchedule();
  const { isFollowing, toggle, subscribedEntries } = useSubscriptions(schedule.entries);
  const [haloOpen, setHaloOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'subscriptions' | 'overlay' | 'settings'>('schedule');
  const [subtitleCues, setSubtitleCues] = useState<SubtitleCue[]>([]);

  useEffect(() => {
    document.body.classList.toggle('light', settings.theme === 'light');
    document.body.classList.toggle('kasane-reduced-motion', settings.reduceMotion);
  }, [settings.theme, settings.reduceMotion]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (settings.halo.keyboardShortcut && (e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault();
        setHaloOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [settings.halo.keyboardShortcut]);

  const handleHaloNavigate = useCallback(
    (direction: HaloDirection) => {
      setHaloOpen(false);
      switch (direction) {
        case 'up':
        case 'back':
          setActiveTab('schedule');
          setSettings({ viewMode: 'dashboard' });
          break;
        case 'forward':
          setActiveTab('subscriptions');
          break;
        case 'right':
          setActiveTab('overlay');
          break;
        case 'down':
          setActiveTab('settings');
          break;
        case 'left':
          setActiveTab('schedule');
          setSettings({ viewMode: 'compact' });
          break;
      }
    },
    [setSettings]
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'schedule':
        return settings.viewMode === 'dashboard' ? (
          <DashboardView
            schedule={schedule}
            settings={settings}
            isFollowing={isFollowing}
            onToggleFollow={toggle}
            onRefresh={schedule.refresh}
          />
        ) : (
          <CompactView
            entries={schedule.displayed}
            locale={settings.locale}
            isFollowing={isFollowing}
            onToggleFollow={toggle}
          />
        );
      case 'subscriptions':
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gradient">{t('subscriptions.title')}</h2>
            {subscribedEntries.length === 0 ? (
              <p className="text-[var(--text-muted)]">{t('subscriptions.empty')}</p>
            ) : (
              <CompactView
                entries={subscribedEntries}
                locale={settings.locale}
                isFollowing={isFollowing}
                onToggleFollow={toggle}
              />
            )}
          </div>
        );
      case 'overlay':
        return (
          <OverlayRoute
            settings={settings}
            onChangeSettings={setSettings}
            cues={subtitleCues}
            onCues={setSubtitleCues}
          />
        );
      case 'settings':
        return <SettingsPanel settings={settings} onChange={setSettings} />;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <OrbitalBackground reduceMotion={settings.reduceMotion} />

      <header className="sticky top-0 z-30 border-b border-[var(--glass-border)] bg-[var(--bg-panel)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--moon-purple)] to-[var(--cyan)] text-white shadow-lg">
              K
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">{t('app.name')}</h1>
              <span className="text-[10px] text-[var(--text-muted)]">v0.1.0</span>
            </div>
          </div>
          <nav className="flex gap-1">
            {[
              { key: 'schedule' as const, icon: Calendar, label: t('nav.schedule') },
              { key: 'subscriptions' as const, icon: Heart, label: t('nav.subscriptions') },
              { key: 'overlay' as const, icon: MessageSquareText, label: t('nav.overlay') },
              { key: 'settings' as const, icon: Settings, label: t('nav.settings') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  activeTab === tab.key
                    ? 'bg-[var(--moon-purple-dim)] text-[var(--moon-purple)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                ].join(' ')}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {renderTab()}

        <section className="mt-8">
          <GestureDemo locale={settings.locale} onTrigger={() => setHaloOpen(true)} />
          <p className="mt-2 text-[10px] text-[var(--text-muted)]">
            {t('halo.experimental')}
          </p>
        </section>
      </main>

      <footer className="border-t border-[var(--glass-border)] bg-[var(--bg-panel)]/60 px-4 py-3 text-center text-xs text-[var(--text-muted)]">
        {t('footer.privacy')} · {t('footer.noTelemetry')} · MPL-2.0
      </footer>

      {activeTab === 'overlay' && <SubtitleOverlay settings={settings} cues={subtitleCues} />}

      <HaloMenu
        locale={settings.locale}
        open={haloOpen}
        onClose={() => setHaloOpen(false)}
        onNavigate={handleHaloNavigate}
      />
    </div>
  );
}
