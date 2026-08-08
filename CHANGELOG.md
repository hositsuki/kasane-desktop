# Changelog / 变更日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 风格，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

- 等待下一个迭代合并。

## [0.1.0] - 2026-08-07

首个公开发布版本（v0.1.0）。本版本聚焦“可在浏览器中验证、桌面端基础架构就位”。

### Added

- 玻璃质感 UI（`src/styles/theme.css` + `OrbitalBackground` + `GlassCard`），月紫 / 青色双色调，支持 `prefers-reduced-motion` 与设置内显式减少动画。
- 国际化：简体中文（默认）、日语、英语（`src/i18n/index.ts`）。
- AniList 公开 GraphQL 拉取本周番组（`src/lib/anilist.ts`，无 token）。
- 离线 / 失败时回退到 `src/lib/fallback.ts` 中的虚构演示数据，所有标题标注 `DEMO`。
- 周历视图（`DashboardView` + `ScheduleGrid` + `ScheduleCard`）、紧凑视图（`CompactView`）、下一话倒计时（`schedule.ts: computeCountdown`）、搜索 / 过滤（`schedule.ts: filterEntries`）。
- 关注 / 取消关注 + 持久化（`useSubscriptions` + `storage.ts` 仓储抽象）。
- HALO 六向轨道菜单（`HaloMenu.tsx`），`Ctrl+Space` / `Cmd+Space` 打开，键盘可达。
- 双键向下手势状态机（`src/lib/gesture.ts`），完整 Vitest 覆盖（`gesture.test.ts`）。
  - 阈值：`press_interval ≤ 220ms` / `total ≤ 650ms` / `dy ≥ 80px` / `dy > 1.4·dx`。
- Tauri 2 Rust 外壳：
  - `tauri.conf.json` 定义主窗、字幕窗 capability、shell 受限 scope。
  - `create_overlay_window` / `move_overlay_window` / `resize_overlay_window` 三个 `#[tauri::command]`，构建 `transparent / decorations=false / always_on_top=true / skip_taskbar=true` 的 `subtitle-overlay` 窗。
- 字幕叠层：
  - 浏览器内浮层预览（`SubtitleOverlay.tsx`）。
  - 手动日文输入 + 暂定 / 确定 双状态（`Overlay.tsx`）。
  - 通过 `src/lib/tauri.ts` 的 `TauriBridge` 安全封装窗口命令。
- 工具链：`pnpm typecheck / test / lint / build`；`pnpm-lock.yaml` 由 CI 锁定。
- 文档：MPL-2.0 LICENSE、README（zh-CN 主 + en 摘要 + 特性状态表）、`docs/ARCHITECTURE.md`、CONTRIBUTING、SECURITY、CODE_OF_CONDUCT、CHANGELOG、THIRD_PARTY_NOTICES。
- CI：Windows / macOS / Ubuntu 三平台前端检查（`.github/workflows/ci.yml`）。
- Release：标签触发 Windows / macOS Tauri 构件构建（`.github/workflows/release.yml`），使用 `tauri-apps/tauri-action`，**未签名 / 未公证**。

### Honest Limitations

- 系统级音频捕获（OS loopback / mic）：**未实现**。
- 原生 ASR（whisper.cpp / sherpa-onnx 等）：**未实现**；不随仓库分发任何模型权重 / 二进制。
- OS 全局鼠标 / 键盘钩子：**未实现**；HALO 当前仅在应用内可触发。
- macOS 物理机验证：**未完成**；发布构件未签名 / 未公证。
- `src-tauri/icons/` 暂为占位；维护者需在 release 前填入真实图标。

[Unreleased]: https://github.com/hositsuki/kasane-desktop/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/hositsuki/kasane-desktop/releases/tag/v0.1.0
