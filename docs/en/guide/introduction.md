# Introduction

TomlSmith checks, formats, and decodes TOML 1.0 and 1.1. It is available as a Rust library, CLI, language server, and browser playground.

## What you get

**In the terminal and CI:**

- Validate TOML 1.0 or 1.1 and report diagnostics with source locations.
- Format documents while preserving comments and literal spellings in covered cases, or use `fmt --check` without changing files.
- Emit machine-readable diagnostic JSON for tools and automation.

**In editors:**

- Diagnostics, formatting, semantic highlighting, hover, document symbols, and folding through LSP.

**In Rust applications:**

- Parse a document once and query diagnostics, formatted output, highlights, and decoded values through the immutable `Document` API.

**In the browser:**

- The [playground](https://tomlsmith.github.io/playground/) checks and formats TOML with WebAssembly in the current browser tab.

## Behavior

- TOML 1.0 and 1.1 are separate modes. Defaults differ by product surface; see the [TOML version policy](/guide/version-policy). Select 1.0 for files read by 1.0-only tools.
- Parse or semantic errors stop formatting. Covered formatter cases preserve comments and literal spellings.
- TomlSmith passes all 1,360 `toml-test` decoder cases for TOML 1.0 and 1.1. See [Conformance](/guide/conformance) for the scope and command.

## Where to go next

- [Quick start](/guide/quick-start) — run the CLI against your first file.
- [Use from Rust](/guide/rust-api) — embed the `Document` API.
- [Editors and LSP](/guide/editors) — connect your editor.
- [Performance](/guide/performance) — results and measurement method.
