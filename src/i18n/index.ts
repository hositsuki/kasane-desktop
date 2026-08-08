import type { Locale } from '@/lib/types';

export type I18nKey =
  | 'app.name'
  | 'app.tagline'
  | 'nav.schedule'
  | 'nav.subscriptions'
  | 'nav.overlay'
  | 'nav.settings'
  | 'view.compact'
  | 'view.dashboard'
  | 'schedule.title'
  | 'schedule.search'
  | 'schedule.fallback'
  | 'schedule.nextAiring'
  | 'schedule.countdown.live'
  | 'schedule.episode'
  | 'weekday.sunday'
  | 'weekday.monday'
  | 'weekday.tuesday'
  | 'weekday.wednesday'
  | 'weekday.thursday'
  | 'weekday.friday'
  | 'weekday.saturday'
  | 'settings.title'
  | 'settings.language'
  | 'settings.theme'
  | 'settings.reduceMotion'
  | 'settings.viewMode'
  | 'halo.title'
  | 'halo.hint'
  | 'halo.experimental'
  | 'overlay.title'
  | 'overlay.position'
  | 'overlay.fontSize'
  | 'overlay.opacity'
  | 'overlay.tentativeColor'
  | 'overlay.finalColor'
  | 'overlay.demoInput'
  | 'overlay.demoPlaceholder'
  | 'subscriptions.title'
  | 'subscriptions.empty'
  | 'action.follow'
  | 'action.unfollow'
  | 'action.refresh'
  | 'action.close'
  | 'status.loading'
  | 'status.error'
  | 'status.offline'
  | 'footer.privacy'
  | 'footer.noTelemetry';

const translations: Record<Locale, Record<I18nKey, string>> = {
  'zh-CN': {
    'app.name': 'KASANE',
    'app.tagline': '透亮的追番时刻表与字幕伴侣',
    'nav.schedule': '番组表',
    'nav.subscriptions': '关注',
    'nav.overlay': '字幕',
    'nav.settings': '设置',
    'view.compact': '紧凑',
    'view.dashboard': '仪表盘',
    'schedule.title': '本周番组',
    'schedule.search': '搜索动画…',
    'schedule.fallback': '当前为离线演示数据',
    'schedule.nextAiring': '最近放送',
    'schedule.countdown.live': '直播中',
    'schedule.episode': '第 {episode} 集',
    'weekday.sunday': '周日',
    'weekday.monday': '周一',
    'weekday.tuesday': '周二',
    'weekday.wednesday': '周三',
    'weekday.thursday': '周四',
    'weekday.friday': '周五',
    'weekday.saturday': '周六',
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.theme': '主题',
    'settings.reduceMotion': '减少动画',
    'settings.viewMode': '视图',
    'halo.title': 'HALO 菜单',
    'halo.hint': 'Ctrl+Space / Cmd+Space 打开 HALO 菜单',
    'halo.experimental': '全局手势为实验功能，当前仅应用内演示可用',
    'overlay.title': '字幕浮层',
    'overlay.position': '位置',
    'overlay.fontSize': '字号',
    'overlay.opacity': '不透明度',
    'overlay.tentativeColor': '待定颜色',
    'overlay.finalColor': '确定颜色',
    'overlay.demoInput': '手动输入测试',
    'overlay.demoPlaceholder': '在此输入日文字幕…',
    'subscriptions.title': '我的关注',
    'subscriptions.empty': '还没有关注任何动画',
    'action.follow': '关注',
    'action.unfollow': '取消关注',
    'action.refresh': '刷新',
    'action.close': '关闭',
    'status.loading': '加载中…',
    'status.error': '出错了',
    'status.offline': '离线',
    'footer.privacy': '隐私',
    'footer.noTelemetry': '无遥测、无账号',
  },
  ja: {
    'app.name': 'KASANE',
    'app.tagline': '透明感あるアニメ予定表と字幕コンパニオン',
    'nav.schedule': 'スケジュール',
    'nav.subscriptions': 'フォロー',
    'nav.overlay': '字幕',
    'nav.settings': '設定',
    'view.compact': 'コンパクト',
    'view.dashboard': 'ダッシュボード',
    'schedule.title': '今週の放送予定',
    'schedule.search': 'アニメを検索…',
    'schedule.fallback': '現在はオフラインデモデータです',
    'schedule.nextAiring': '次回放送',
    'schedule.countdown.live': '放送中',
    'schedule.episode': '第 {episode} 話',
    'weekday.sunday': '日曜',
    'weekday.monday': '月曜',
    'weekday.tuesday': '火曜',
    'weekday.wednesday': '水曜',
    'weekday.thursday': '木曜',
    'weekday.friday': '金曜',
    'weekday.saturday': '土曜',
    'settings.title': '設定',
    'settings.language': '言語',
    'settings.theme': 'テーマ',
    'settings.reduceMotion': '動画を減らす',
    'settings.viewMode': '表示',
    'halo.title': 'HALO メニュー',
    'halo.hint': 'Ctrl+Space / Cmd+Space で HALO メニューを開く',
    'halo.experimental': 'グローバルジェスチャは実験的機能です',
    'overlay.title': '字幕オーバーレイ',
    'overlay.position': '位置',
    'overlay.fontSize': 'フォントサイズ',
    'overlay.opacity': '不透明度',
    'overlay.tentativeColor': '仮の色',
    'overlay.finalColor': '確定の色',
    'overlay.demoInput': '手動入力テスト',
    'overlay.demoPlaceholder': 'ここに日本語字幕を入力…',
    'subscriptions.title': 'フォロー一覧',
    'subscriptions.empty': 'フォロー中のアニメはありません',
    'action.follow': 'フォロー',
    'action.unfollow': 'フォロー解除',
    'action.refresh': '更新',
    'action.close': '閉じる',
    'status.loading': '読み込み中…',
    'status.error': 'エラー',
    'status.offline': 'オフライン',
    'footer.privacy': 'プライバシー',
    'footer.noTelemetry': 'テレメトリなし、アカウント不要',
  },
  en: {
    'app.name': 'KASANE',
    'app.tagline': 'A translucent anime schedule and subtitle companion',
    'nav.schedule': 'Schedule',
    'nav.subscriptions': 'Subscriptions',
    'nav.overlay': 'Subtitles',
    'nav.settings': 'Settings',
    'view.compact': 'Compact',
    'view.dashboard': 'Dashboard',
    'schedule.title': 'Weekly Schedule',
    'schedule.search': 'Search anime…',
    'schedule.fallback': 'Showing offline demo data',
    'schedule.nextAiring': 'Next airing',
    'schedule.countdown.live': 'LIVE',
    'schedule.episode': 'Ep. {episode}',
    'weekday.sunday': 'Sun',
    'weekday.monday': 'Mon',
    'weekday.tuesday': 'Tue',
    'weekday.wednesday': 'Wed',
    'weekday.thursday': 'Thu',
    'weekday.friday': 'Fri',
    'weekday.saturday': 'Sat',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.reduceMotion': 'Reduce motion',
    'settings.viewMode': 'View',
    'halo.title': 'HALO Menu',
    'halo.hint': 'Ctrl+Space / Cmd+Space opens the HALO menu',
    'halo.experimental': 'Global gestures are experimental',
    'overlay.title': 'Subtitle Overlay',
    'overlay.position': 'Position',
    'overlay.fontSize': 'Font size',
    'overlay.opacity': 'Opacity',
    'overlay.tentativeColor': 'Tentative color',
    'overlay.finalColor': 'Final color',
    'overlay.demoInput': 'Manual input demo',
    'overlay.demoPlaceholder': 'Type Japanese subtitles here…',
    'subscriptions.title': 'My Subscriptions',
    'subscriptions.empty': 'No subscriptions yet',
    'action.follow': 'Follow',
    'action.unfollow': 'Unfollow',
    'action.refresh': 'Refresh',
    'action.close': 'Close',
    'status.loading': 'Loading…',
    'status.error': 'Error',
    'status.offline': 'Offline',
    'footer.privacy': 'Privacy',
    'footer.noTelemetry': 'No telemetry, no accounts',
  },
};

export function t(locale: Locale, key: I18nKey, params?: Record<string, string | number>): string {
  let text = translations[locale][key] ?? translations['en'][key] ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replaceAll(`{${k}}`, String(v));
    });
  }
  return text;
}

export function weekdayLabel(locale: Locale, day: number): string {
  const keys: I18nKey[] = [
    'weekday.sunday',
    'weekday.monday',
    'weekday.tuesday',
    'weekday.wednesday',
    'weekday.thursday',
    'weekday.friday',
    'weekday.saturday',
  ];
  return t(locale, keys[day] ?? 'weekday.sunday');
}
