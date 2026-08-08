# 贡献指南 / Contributing to KASANE

感谢你愿意为 KASANE 投入时间！本文档说明开发流程、代码风格与提交流程。请先阅读 [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) 与 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。

Thanks for your interest in KASANE! Please read [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) first.

## 1. 报告问题 / Reporting Issues

- **Bug：** 使用 [Bug Report 模板](.github/ISSUE_TEMPLATE/bug_report.md)，附最小复现、平台 / 浏览器版本、控制台输出。
- **新功能 / 提议：** 使用 [Feature Request 模板](.github/ISSUE_TEMPLATE/feature_request.md)。v0.1.0 严格按 README 表格实现，不在表中的项目请先在 Issue 中讨论。
- **安全问题：** **不要** 公开提 Issue。请阅读 [`SECURITY.md`](SECURITY.md) 的私密披露流程。

## 2. 开发环境

- Node.js ≥ 18（CI 实际使用 Node 20）。
- pnpm 9（仓库声明 `packageManager: pnpm@9.14.0`）。**不要** 提交 `package-lock.json` / `yarn.lock`。
- 可选：Rust 工具链（如需修改 `src-tauri/`，请参考 <https://v2.tauri.app/start/prerequisites/>）。

## 3. 本地构建与检查

```bash
pnpm install
pnpm typecheck      # tsc -b
pnpm test           # vitest run
pnpm lint           # eslint --max-warnings 0
pnpm build          # tsc -b && vite build
pnpm dev:browser    # 纯浏览器开发模式
pnpm tauri:dev      # Tauri 开发模式（需要 Rust）
```

> 提 PR 前请确保以上五条命令全部通过；CI 会在 Windows / macOS / Ubuntu 上重复这些检查。

## 4. 代码风格

- TypeScript：`strict: true`、`noUnusedLocals: true`、`noUnusedParameters: true`。
- React 18 + 函数式组件 + 钩子。`react-refresh/only-export-components` 仅允许常量导出。
- 工具函数优先放在 `src/lib/` 下，并尽量保持纯函数。
- 新增字符串请同时补全 `src/i18n/index.ts` 的 `zh-CN` / `ja` / `en`。**禁止** 在组件里硬编码中文字符串。
- CSS 优先使用 `src/styles/theme.css` 中已定义的 CSS 变量。`lucide-react` 是当前唯一允许的图标源。
- 不要引入带版权的动画封面、动画截图、动画 LOGO。`fallback.ts` 中的虚构标题是唯一允许的占位数据。

## 5. 提交与分支

- 分支：`feat/<short-name>`、`fix/<short-name>`、`docs/<short-name>`、`chore/<short-name>`。
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)：
  ```
  feat(schedule): add weekday quick-jump
  fix(halo): cancel gesture when second button is too late
  docs(readme): clarify experimental status
  ```
- 一次 PR 只解决一个问题；功能越大拆得越细。

## 6. 拉取请求流程

1. Fork 仓库并新建分支。
2. 提交代码；保持提交粒度小、信息清晰。
3. 在本地跑完 `pnpm typecheck && pnpm test && pnpm lint && pnpm build`。
4. 提交 PR：
   - 标题格式：`type(scope): short summary`
   - 正文：动机、变更、截图 / GIF（如涉及 UI）、关联 Issue
5. 等待 review；维护者可能要求拆分或补充测试。

## 7. 国际化贡献

- `src/i18n/index.ts` 中 `I18nKey` 是键的并集。
- 修改现有键前请确认是否破坏其它语言。
- 任何“日语 / 中文”翻译需要自然流畅；如果不确定可使用 Issue 讨论。

## 8. 路线图 / 实验功能

任何被 README 表格标记为 🧪 / 🛣 的功能，请先在 Issue 中讨论并与维护者达成共识；PR 中需要：

- 在 `src/lib/tauri.ts` 或对应模块的注释中明确标注 `EXPERIMENTAL` / `ROADMAP`。
- 在 README / `docs/ARCHITECTURE.md` 中同步状态。
- 不能假装实现：没有真实工作的代码不能写“已支持”。

## 9. 许可

提交即表示你同意按 [MPL-2.0](LICENSE) 许可你的贡献。
