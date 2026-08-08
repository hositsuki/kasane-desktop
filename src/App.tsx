import { Routes, Route } from 'react-router-dom';
import { Home } from '@/routes/Home';
import { OverlayRoute } from '@/routes/Overlay';
import { GlassCard } from '@/components/GlassCard';
import { useI18n } from '@/hooks/useI18n';
import { useSettings } from '@/lib/settings';

/**
 * Application root.
 *
 * Tauri-only routes are mounted under /overlay, matching the Tauri
 * config (see src-tauri/tauri.conf.json). The "/" route is the
 * single-page Home experience.
 */
export default function App() {
  const { settings } = useSettings();
  const { t } = useI18n(settings.locale);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/overlay"
        element={
          <main className="mx-auto max-w-3xl p-6">
            <GlassCard>
              <h1 className="text-lg font-semibold text-gradient">{t('overlay.title')}</h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {t('halo.experimental')}
              </p>
              <OverlayRoute
                settings={settings}
                onChangeSettings={() => {
                  /* Standalone route uses local state; see Home for full wiring. */
                }}
                cues={[]}
                onCues={() => {
                  /* No-op in standalone route. */
                }}
              />
            </GlassCard>
          </main>
        }
      />
      <Route
        path="*"
        element={
          <main className="mx-auto max-w-3xl p-6">
            <GlassCard>
              <h1 className="text-lg font-semibold text-gradient">404</h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {t('status.error')}
              </p>
            </GlassCard>
          </main>
        }
      />
    </Routes>
  );
}
