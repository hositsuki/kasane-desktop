# Third-Party Notices / 第三方依赖声明

KASANE Desktop 仓库在以下位置使用了第三方软件 / 资源。所有依赖均通过 `package.json` / `Cargo.toml` 自动拉取，不会随源码提交二进制或权重。

| 名称 | 许可 | 用途 | 来源 |
|------|------|------|------|
| [React](https://react.dev/) | MIT | UI 框架 | npm `react`, `react-dom` |
| [React Router](https://reactrouter.com/) | MIT | 路由 | npm `react-router-dom` |
| [Lucide](https://lucide.dev/) | ISC | 图标 | npm `lucide-react` |
| [Vite](https://vitejs.dev/) | MIT | 开发 / 构建工具 | npm `vite` |
| [SWC](https://swc.rs/) | Apache-2.0 | Vite React 插件 | npm `@vitejs/plugin-react-swc` |
| [Vitest](https://vitest.dev/) | MIT | 单元测试 | npm `vitest` |
| [JSDOM](https://github.com/jsdom/jsdom) | MIT | 测试环境 | npm `jsdom` |
| [TypeScript](https://www.typescriptlang.org/) | Apache-2.0 | 类型系统 | npm `typescript`, `typescript-eslint` |
| [ESLint](https://eslint.org/) | MIT | Lint | npm `eslint`, `@eslint/js` |
| [eslint-plugin-react-hooks](https://github.com/facebook/react) | MIT | Lint 钩子规则 | npm |
| [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) | MIT | Lint HMR 规则 | npm |
| [globals](https://github.com/sindresorhus/globals) | MIT | ESLint 全局变量 | npm |
| [Tauri](https://tauri.app/) | Apache-2.0 / MIT | 桌面外壳 | crates `tauri`, `tauri-build`, `tauri-plugin-shell` |
| [serde](https://serde.rs/) | MIT / Apache-2.0 | 序列化 | crates `serde`, `serde_json` |

> 上表为 v0.1.0 锁定版本（`pnpm-lock.yaml` / `Cargo.lock`）对应的上游许可。实际许可文本以拉取到的依赖为准。

## 数据源 / Data Sources

- [AniList](https://anilist.co/) — 公共 GraphQL API（`https://graphql.anilist.co`），仅查询当前在播作品与下一话时间，**不**使用任何用户 token，**不**上传任何用户数据。AniList 内容版权归原作者所有；KASANE 仅做轻量引用与跳转。

## 资源 / Assets

- 应用图标：`public/kasane-icon.svg` 为项目原创（双色月环 + 青色圆心），不包含第三方受版权保护的图像。
- Tauri 图标：`src-tauri/icons/` 由维护者按 `public/kasane-icon.svg` 衍生生成。
- 字体：依赖系统字体栈（`var(--font-sans)`），不内嵌字体文件。

## 工具 / Tools Not Bundled

下述能力在文档中被标记为 🛣 路线图，**当前未实现**：

- `whisper.cpp`（MIT）：未来本地 ASR 后端候选；**任何模型权重都不会随仓库分发**。
- `sherpa-onnx`（Apache-2.0）：未来本地 ASR 后端候选；同上。
- `cpal`（Apache-2.0）：未来 Rust 端音频捕获候选。
- `rdev` / `InputBot`（MIT / Apache-2.0）：未来 OS 全局输入候选。

如果你在 PR 中引入上述任一依赖，请同步更新本文件与 `Cargo.toml` / `package.json`。

## 许可文本

- 本仓库自有代码使用 [MPL-2.0](../LICENSE)。
- 第三方许可文本通常随对应包一起分发（`node_modules/<pkg>/LICENSE`），也可见 [LICENSES collection](https://spdx.org/licenses/)。

最后更新：2026-08-07
