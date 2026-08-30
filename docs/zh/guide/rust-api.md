# 在 Rust 中使用

`tomlsmith` crate 通过不可变的 `Document` API 提供解析、诊断、格式化、高亮与解码后的值。

## 添加依赖

```toml
[dependencies]
tomlsmith = "=0.1.0"
```

## 解析文档

```rust
use tomlsmith::{Document, TomlVersion};

let document = Document::parse_as("title = \"TomlSmith\"\n", TomlVersion::V1_1);
assert!(document.diagnostics().is_empty());
```

`Document` 是不可变快照。解析一次后，可以从同一个对象查询诊断、格式化输出、高亮区间和解码后的值。如果格式化目标版本不同，安全检查会额外解析一次；可复用接入应保持解析版本与格式化版本一致。

## API 覆盖范围

| 领域 | 提供的能力 |
| --- | --- |
| 解析 | TOML 1.0 或 1.1 的无损语法树，版本在每次解析时显式指定 |
| 诊断 | 带精确源码区间与稳定诊断码的错误和警告 |
| 格式化 | 格式化输出；已覆盖的场景会保留注释与字面量写法 |
| 高亮 | 由同一次解析产出的语义高亮区间 |
| 解码值 | 键、表与值，便于程序化访问 |

## 版本选择

解析时传入 `TomlVersion::V1_0` 或 `TomlVersion::V1_1`。应用可以同时持有两个版本的文档。`Document::parse` 默认使用 1.1；可复用接入应显式选择版本。详见 [TOML 版本策略](/zh/guide/version-policy)。

## 了解更多

- [核心仓库](https://github.com/tomlsmith/tomlsmith)中 `crates/tomlsmith` 是库的源码，CLI 与 LSP crate 构建在它之上。
- [一致性验证](/zh/guide/conformance)覆盖这个 API 的 decoder 路径。
