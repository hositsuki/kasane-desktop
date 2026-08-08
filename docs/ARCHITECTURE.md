# KASANE Desktop 架构

> 本文件面向贡献者，描述 v0.1.0 的模块划分、数据流、状态机与前后端边界。
> 任何与本文档冲突的代码以代码为准，并请提交 PR 同步本文件。

## 1. 总览

KASANE 桌面端由两层组成：

1. **Tauri 2 Rust 外壳**（`src-tauri/`）：负责窗口生命周期、原生对话框、未来的 OS 钩子。
2. **React 18 + Vite 前端**（`src/`）：负责 UI、状态、国际化、对外数据获取。

前后端通过 Tauri 的 `invoke` 通道通信。前端在没有 Tauri 的环境下（`pnpm dev:browser`）通过 `src/lib/tauri.ts` 中实现的 `getTauriBridge()` 自动降级为浏览器实现，确保开发与视觉验证不需要 Rust 工具链。

```
┌──────────────────────────────────────────────────────┐
│                   Tauri 2 Native                     │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Rust (src-tauri/src/main.rs)                     │ │
│ │ • main 窗口（来自 tauri.conf.json）              │ │
│ │ • subtitle-overlay 窗口（运行时 create_overlay_  │ │
│ │   window 创建：transparent / no decorations /    │ │
│ │   always_on_top）                                │ │
│ │ • move_overlay_window / resize_overlay_window    │ │
│ │ • tauri-plugin-shell（受限 https://anilist.co）  │ │
│ └──────────────────────────────────────────────────┘ │
│                         │  invoke / event            │
│ ┌──────────────────────────────────────────────────┐ │
│ │ React Frontend                                   │ │
│ │  - App / Routes / Home / Overlay                 │ │
│ │  - components/* (Glass, Halo, Schedule, ...)     │ │
│ │  - hooks/* (useSchedule, useSubscriptions,       │ │
│ │    useHaloGesture, useI18n, useReducedMotion)    │ │
│ │  - lib/* (纯函数 + Tauri 安全适配)               │ │
│ │  - i18n/* (zh-CN / ja / en)                      │ │
│ │  - styles/theme.css (玻璃质感 CSS 变量)          │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## 2. 目录与职责

### 2.1 `src/lib/`（纯函数 + 适配层）

| 文件 | 角色 | 测试 |
|------|------|------|
| `types.ts` | 全部 TypeScript 类型 + 默认设置。 | — |
| `gesture.ts` | 双键向下手势状态机（纯函数，导出常量与事件处理）。 | `gesture.test.ts` |
| `schedule.ts` | 归一化、倒计时、周几、过滤等纯计算。 | `schedule.test.ts` |
| `storage.ts` | 仓储式 `localStorage` 抽象，可注入 mock。 | `storage.test.ts` |
| `anilist.ts` | AniList GraphQL 抓取 + 解析。失败返回 `{ok:false, source:'fallback'}`。 | — |
| `fallback.ts` | 离线 / 失败时的虚构演示数据。 | — |
| `settings.ts` | 设置的加载 / 保存 / `useSettings` 钩子。 | — |
| `tauri.ts` | `TauriBridge` 抽象 + 浏览器侧降级实现。 | — |

设计原则：所有 `lib/` 模块都尽量是无副作用的纯函数。`anilist.ts` 是唯一的网络出口，`storage.ts` 是唯一的持久化出口，`tauri.ts` 是唯一的原生桥接出口。

### 2.2 `src/hooks/`

- `useSchedule()`：拉取 AniList；失败 / 空数据时切到 `FALLBACK_SCHEDULE`；维护 `selectedDay` / `query` / `entries` / `displayed` / `nextAiring`。
- `useSubscriptions(entries)`：维护已关注 ID 集合，持久化到 `localStorage: kasane:subscriptions:v1`。
- `useHaloGesture({ onTrigger })`：把 `gesture.ts` 状态机桥接到 React 指针事件，触发后调用 `onTrigger` 并自动重置。
- `useI18n(locale)`：包装 `i18n/index.ts` 中的 `t()`，提供 `dayLabel` 工具。
- `useReducedMotion(requested?)`：合并系统 `prefers-reduced-motion` 与应用内显式开关。

### 2.3 `src/components/`

- `GlassCard` / `OrbitalBackground`：原子级视觉元件。
- `ScheduleGrid` + `ScheduleCard`：周历视图。
- `DashboardView` / `CompactView`：仪表盘与紧凑两种视图。
- `SettingsPanel`：语言 / 主题 / 视图模式 / 减少动画。
- `HaloMenu`：六向轨道菜单，键盘可达。
- `GestureDemo`：应用内手势演示面板，复用 `useHaloGesture`。
- `SubtitleOverlay`：浏览器内浮层预览（与 Tauri 字幕窗共享同一数据源）。

### 2.4 `src/routes/`

- `Home`：仪表盘 / 紧凑视图 / 字幕 / 设置的容器。
- `Overlay`：被 `Home` 复用的字幕控制面板；当 Tauri 字幕窗加载时也作为路由入口（`/#/overlay`），由 Rust 端 `WebviewUrl::App("/#/overlay")` 打开。

### 2.5 `src-tauri/`

- `Cargo.toml`：仅依赖 `tauri 2`、`tauri-plugin-shell 2`、`serde`、`serde_json`。
- `tauri.conf.json`：主窗定义（`label` 默认为 `main`）、透明 / 置顶属性、安全能力（`core:default` + `shell:allow-open`）、shell 受限 scope（仅 `^https://anilist.co/`）。
- `src/main.rs`：暴露三个命令：
  - `create_overlay_window` → 构建 `subtitle-overlay` 标签的 `WebviewWindow`，设置 `transparent(true) / decorations(false) / always_on_top(true) / skip_taskbar(true)`，初始 `set_ignore_cursor_events(true)`。
  - `move_overlay_window(x, y)` / `resize_overlay_window(w, h)` → 仅对 `subtitle-overlay` 生效。
- `icons/`：占位。`tauri build` 需要 32x32.png、128x128.png、128x128@2x.png、icon.ico、icon.icns。当前仓库未提交；release workflow 必须先由维护者填入真实图标。

## 3. 关键数据流

### 3.1 排程加载

```
useSchedule
  → fetchAniListSchedule
      ├─ ok && entries.length > 0 → setRawEntries + source='anilist'
      └─ else                       → setRawEntries(FALLBACK_SCHEDULE) + source='fallback'
  → normalizeSchedule (sort + 去重)
  → filterEntries(weekday + query) → displayed
  → nextAiringEntry(entries) → nextAiring
```

### 3.2 HALO 触发

```
键盘 Ctrl/Cmd+Space      → Home 打开 HaloMenu
应用内 GestureDemo 指针事件 → useHaloGesture
  → handlePointerDown / Move / Up
  → evaluateGesture（达到阈值后 phase='triggered'）
  → onTrigger() → setHaloOpen(true)
```

`gesture.ts` 内的阈值常量（`GESTURE_PRESS_INTERVAL_MS = 220` / `GESTURE_MAX_DURATION_MS = 650` / `GESTURE_MIN_VERTICAL_PX = 80` / `GESTURE_HORIZONTAL_RATIO = 1.4`）与 README、设计稿保持一致；`gesture.test.ts` 对每条规则都至少有一个对应用例。

### 3.3 字幕状态

```
OverlayRoute 接受 cues[] / onCues(SubtitleCue[])
  ├─ manual 输入 → pushCue(..., 'tentative' | 'final')
  └─ 通过 setSettings 调整浮层位置 / 字号 / 透明度 / 颜色
SubtitleOverlay（浏览器内浮层）渲染最新 cue
Tauri 字幕窗（同路由 /#/overlay）以相同 React 树渲染，命令式窗口控制
  通过 src/lib/tauri.ts 暴露的 WindowControl。
```

## 4. 状态机

### 4.1 手势状态机（`src/lib/gesture.ts`）

```
idle ──左/右键按下──▶ waiting_second
  ▲                       │ 超过 220ms 未按下第二键
  │                       ▼
  │                   cancelled
  │                       │
  │  ┌──第二键在 220ms 内按下──┐
  │  ▼                        ▼
tracking ──(dy ≥ 80 & dy > 1.4·dx)──▶ triggered
  │                                   │ 释放 / 下一帧重置
  └──── 超 650ms / 反向 ─────▶ cancelled
```

### 4.2 排程加载状态机（`useSchedule`）

```
init → loading=true
       ├─ abort 旧请求
       └─ fetchAniListSchedule
              ├─ ok + entries → source='anilist', loading=false
              └─ else         → source='fallback', loading=false, error?
refresh = 重新执行上述流程
```

## 5. 安全 / 隐私

- 无后端、无遥测、无账号。详见 README「隐私与遥测」与 `SECURITY.md`。
- Tauri shell 插件的 `open` 限制为 `^https://anilist.co/`，无法通过插件 `open` 任意 URL。
- 当前不会安装任何 OS 级钩子（全局鼠标 / 键盘）；仅在应用窗口内响应事件。

## 6. 实验 / 路线图

> 与 `README.md` 表格完全一致。这里给出更细的工程化说明。

| 主题 | 当前位置 | 计划落点 |
|------|----------|----------|
| 系统音频捕获 | `src/lib/tauri.ts` 注释 + Rust 端未实现 | 后续版本用 Tauri 命令封装 `cpal` / WASAPI / `ScreenCaptureKit`。 |
| 原生 ASR | 同上 | 引入 `whisper.cpp` / `sherpa-onnx` 的 Rust 绑定，提供“按需下载模型”的 UI；任何权重都不进仓库。 |
| OS 全局鼠标钩子 | `useHaloGesture` 仅监听应用内 PointerEvent | 未来通过 `rdev` / `InputBot` 等 crate 桥接，并在设置中提供显式开关与权限说明。 |
| SQLite 持久化 | 当前使用 `localStorage` | v0.2+ 通过 `tauri-plugin-sql` 迁移到 `app_data_dir()/kasane.db`。 |

## 7. 开发约定

- 包管理：仅 `pnpm`。
- TypeScript：`strict: true`、`noUnusedLocals: true`、`noUnusedParameters: true`。
- ESLint：`@typescript-eslint`、`react-hooks`、`react-refresh`；CI 上 `max-warnings 0`。
- 测试：`vitest` + `jsdom`，运行 `pnpm test`。
- 提交信息：遵循 Conventional Commits（`feat: ...` / `fix: ...` / `docs: ...` / `chore: ...`）。

## 8. 已知限制

- `src-tauri/icons/` 为空，本地 `tauri build` 需要先由维护者填入图标；CI 上 release 流程同样需要这一步。
- macOS 物理机验证尚未完成（仓库无 macOS runner 凭据与签名证书）。
- 任何 OS 全局钩子、系统音频捕获、ASR 模型权重 / 二进制都 **未** 包含在仓库中，文档中以路线图形式标注。
