# 快速上手

从 crates.io 安装 TomlSmith 原生 CLI。

## 安装 CLI

```bash
cargo install tomlsmith-cli --locked
```

crate 声明的最低 Rust 版本是 1.85；可以使用 [rustup](https://rustup.rs) 安装并选择兼容工具链。

## 检查、格式化、解析

```bash
tomlsmith check Cargo.toml
tomlsmith fmt Cargo.toml
tomlsmith fmt --check Cargo.toml
tomlsmith parse Cargo.toml
```

- `check` 校验文档，并输出带精确源码位置的诊断。
- `fmt` 就地格式化文档；`fmt --check` 只报告格式化是否会产生改动，适合在 CI 中使用。
- `parse` 以 JSON 输出所选版本、文档是否有效以及诊断。

## 选择 TOML 版本

默认使用 TOML 1.1。当文件必须与 Cargo 等只支持 1.0 的消费者保持兼容时，显式选择 TOML 1.0：

```bash
tomlsmith --toml-version 1.0 check Cargo.toml
```

两个版本都是严格模式：1.0 模式下写了 1.1 语法，会直接报诊断。
LSP 与 VS Code 扩展则为了生态兼容默认使用 1.0；所有入口的默认值见 [TOML 版本策略](/zh/guide/version-policy)。

## 标准输入与自动化

每个命令都接受文件路径或 `-`（标准输入），诊断可以输出为机器可读的 JSON，方便接入工具与自动化。

```bash
echo 'title = "TomlSmith"' | tomlsmith check -
```

列出全部命令与参数：

```bash
tomlsmith --help
```

## 浏览器工作台

[Playground](https://tomlsmith.github.io/playground/) 在浏览器中检查和格式化 TOML。你可以切换 TOML 1.0 与 1.1、查看诊断与 token，并在不改动源码的情况下预览格式化结果。
