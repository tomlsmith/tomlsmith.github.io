# 介绍

TomlSmith 用于检查、格式化和解码 TOML 1.0 与 1.1，提供 Rust 库、CLI、语言服务器和浏览器 Playground。

## 你会得到什么

**在终端与 CI 中：**

- 校验 TOML 1.0 或 1.1，并报告带源码位置的诊断。
- 格式化文档；已覆盖的场景会保留注释与字面量写法，也可以使用 `fmt --check` 只检查、不改文件。
- 为工具与自动化输出机器可读的诊断 JSON。

**在编辑器中：**

- 通过 LSP 提供诊断、格式化、语义高亮、悬停、文档符号与折叠。

**在 Rust 应用中：**

- 解析一次文档，再通过不可变的 `Document` API 查询诊断、格式化结果、高亮和解码后的值。

**在浏览器中：**

- [Playground](https://tomlsmith.github.io/playground/) 使用 WebAssembly 在当前浏览器标签页中检查和格式化 TOML。

## 行为

- TOML 1.0 和 1.1 是独立模式，各产品入口的默认值不同，详见 [TOML 版本策略](/zh/guide/version-policy)。只支持 1.0 的工具要读取文件时，选择 1.0。
- 解析或语义错误会中止格式化；已覆盖的场景会保留注释和字面量写法。
- TomlSmith 通过 TOML 1.0 与 1.1 的全部 1,360 个 `toml-test` 解码用例。测试范围与命令见[一致性验证](/zh/guide/conformance)。

## 下一步

- [快速上手](/zh/guide/quick-start) —— 用 CLI 检查你的第一个文件。
- [在 Rust 中使用](/zh/guide/rust-api) —— 嵌入 `Document` API。
- [编辑器与 LSP](/zh/guide/editors) —— 连接你的编辑器。
- [性能数据](/zh/guide/performance) —— 测量结果与方法。
