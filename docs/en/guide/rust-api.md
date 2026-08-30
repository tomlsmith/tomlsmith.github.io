# Use from Rust

The `tomlsmith` crate provides parsing, diagnostics, formatting, highlighting, and decoded values through an immutable `Document` API.

## Add the dependency

```toml
[dependencies]
tomlsmith = "=0.1.0"
```

## Parse a document

```rust
use tomlsmith::{Document, TomlVersion};

let document = Document::parse_as("title = \"TomlSmith\"\n", TomlVersion::V1_1);
assert!(document.diagnostics().is_empty());
```

`Document` is an immutable snapshot. Parse once, then query diagnostics, formatted output, highlight spans, and decoded values from the same object. Formatting with a different target version performs a separate safety parse; reusable integrations should keep the parse and format versions aligned.

## What the API covers

| Area | What you get |
| --- | --- |
| Parsing | Lossless syntax tree for TOML 1.0 or 1.1, selected explicitly per parse |
| Diagnostics | Errors and warnings with exact source spans and stable codes |
| Formatting | Formatted output that preserves comments and literal spellings in covered cases |
| Highlighting | Semantic highlight spans produced by the same parse |
| Decoded values | Keys, tables, and values for programmatic access |

## Version selection

The parse call accepts `TomlVersion::V1_0` or `TomlVersion::V1_1`. An application can hold documents of both versions at the same time. `Document::parse` defaults to 1.1; prefer explicit selection in reusable integrations. See the [version policy](/guide/version-policy).

## Learn more

- The [repository](https://github.com/tomlsmith/tomlsmith) contains the crate sources under `crates/tomlsmith`, plus the CLI and LSP crates built on top of it.
- The [conformance tests](/guide/conformance) cover the decoder path of this API.
