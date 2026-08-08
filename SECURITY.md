# Security Policy / 安全策略

## 支持的版本 / Supported Versions

| 版本 | 是否接收安全更新 |
|------|------------------|
| 0.1.x | ✅ |
| < 0.1 | ❌ |

v0.1.0 仍在早期开发，强烈建议订阅仓库的 *Watch → Releases only*，以便在补丁发布时收到通知。

## 私密披露 / Private Disclosure

**请勿** 在公开 Issue 中披露安全漏洞。请通过以下任一私密渠道联系维护者：

- GitHub 私密报告：[Security Advisories → New draft](https://github.com/hositsuki/kasane-desktop/security/advisories/new)

如果私密报告入口暂不可用，请先提交一个不含漏洞细节的普通 Issue，维护者会提供后续私密沟通方式。请勿在公开 Issue 中披露利用步骤、密钥或个人数据。

收到报告后，我们会在 72 小时内确认；修复周期视严重程度而定。

Do **not** open a public issue. Email the maintainers privately at the address above (PGP preferred) or open a GitHub Security Advisory draft. We will acknowledge within 72 hours.

## 报告内容 / What to Include

- 影响范围与可复现步骤（最简 PoC）
- 受影响版本、操作系统、Node / pnpm 版本
- 是否已公开披露 / 是否在野利用
- 任何已知的变通方法

## 严重性分级 / Severity Tiers

| 级别 | 处理时效 |
|------|----------|
| Critical (RCE / 凭据泄露) | 24h 内响应，48h 内修复 |
| High (任意代码执行 / 提权) | 72h 内响应，7d 内修复 |
| Medium (信息泄露 / 拒绝服务) | 7d 内响应，30d 内修复 |
| Low (UI 缺陷 / 增强) | 下一常规发布 |

## 当前安全姿态 / Current Posture

- 仓库不包含后端服务，无账号体系，无遥测。
- Tauri 能力受限于 `core:default` 与 `shell:allow-open`；shell 插件 `open` 仅允许 `^https://anilist.co/`。
- 所有用户数据仅存于本机（`localStorage` / 未来的 `app_data_dir`）。
- v0.1.0 **未** 实现系统级音频捕获、原生 ASR、OS 全局鼠标钩子；这些是路线图功能，请勿在 PR 中声称实现。
- 我们不接收 macOS 签名证书，因此 GitHub 构件为未签名 / 未公证，请自行评估风险。

## 致谢 / Hall of Fame

我们会在修复发布后向报告者致谢（除非你希望匿名）。
