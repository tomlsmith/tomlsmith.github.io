# TOML 版本策略

TomlSmith 将已发布的 TOML 1.0.0 与 TOML 1.1.0 规范实现为两个独立模式。所选版本会影响解析、诊断、解码值和格式化安全检查。

## 各入口默认值

| 入口 | 默认值 |
| --- | --- |
| Rust `Document::parse` 与 `FormatOptions::default` | TOML 1.1 |
| 原生 CLI 与 `@tomlsmith/cli` | TOML 1.1 |
| 新建或重置后的浏览器 Playground | TOML 1.1 |
| 客户端未配置时的 `tomlsmith-lsp` | TOML 1.0 |
| TomlSmith for VS Code | TOML 1.0 |

库、CLI 与 Playground 面向新的独立文档，默认使用 1.1。编辑器入口以 1.0 作为兼容性默认值，因为许多生态消费者仍只接受 1.0。TomlSmith 不会根据文件名推断语言版本。

## 接入时显式选择

- 可复用的 Rust 接入使用 `Document::parse_as`，并设置 `FormatOptions::target_version`。
- CLI 传入 `--toml-version 1.0` 或 `--toml-version 1.1`。
- LSP 客户端在初始化参数或配置更新中发送 `tomlVersion`。
- VS Code 设置 `tomlsmith.toml.version`。
- 只要还要由仅支持 1.0 的工具读取，就选择 TOML 1.0。

只有源码、TOML 版本和相关选项一致时，才能比较不同产品入口的结果。如果格式化目标版本与文档解析版本不同，TomlSmith 会执行额外的安全校验，并可能拒绝格式化。
