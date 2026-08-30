# 编辑器与 LSP

`tomlsmith-lsp` 通过 stdio 实现语言服务器协议（LSP）。带通用 LSP 客户端的编辑器可以使用它提供的诊断、格式化、高亮、悬停、符号和折叠。

## 能力

- 带精确源码位置的诊断
- 格式化（与 CLI 格式化器遵循同样的安全规则）
- 语义高亮
- 悬停
- 文档符号
- 折叠

已实现的编辑器能力不包括基于 schema 的补全与 code action。

客户端未提供 `tomlVersion` 时，服务器默认使用 TOML 1.0。客户端可在初始化参数或配置更新中选择 1.1，详见 [TOML 版本策略](/zh/guide/version-policy)。

## VS Code

[TomlSmith for VS Code](https://github.com/tomlsmith/vscode-plugin) 负责启动 `tomlsmith-lsp`，并内置 TextMate 语法，在服务器未运行时提供高亮。其 README 说明了分平台 VSIX 的打包和安装方式。

## 其他编辑器

先用 `cargo install tomlsmith-lsp --version '=0.1.0' --locked` 安装服务器，再配置编辑器的 LSP 客户端通过 stdio 启动 `tomlsmith-lsp`。Neovim、Helix、Emacs 及其他支持通用 LSP 的编辑器都可以这样接入。

## 浏览器 Playground

[Playground](https://tomlsmith.github.io/playground/) 提供实时诊断、只在应用后改动源码的格式化预览，以及 token 检查器。
