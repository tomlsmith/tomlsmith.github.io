# Quick start

Install the native TomlSmith CLI from crates.io.

## Install the CLI

```bash
cargo install tomlsmith-cli --locked
```

The crate declares Rust 1.85 as its minimum supported version. [rustup](https://rustup.rs) can install and select a compatible toolchain.

## Check, format, parse

```bash
tomlsmith check Cargo.toml
tomlsmith fmt Cargo.toml
tomlsmith fmt --check Cargo.toml
tomlsmith parse Cargo.toml
```

- `check` validates the document and prints diagnostics with exact source locations.
- `fmt` formats the document in place; `fmt --check` only reports whether formatting would change anything, which is what you want in CI.
- `parse` emits the selected version, validity, and diagnostics as JSON.

## Choose the TOML version

TOML 1.1 is the default. Select TOML 1.0 explicitly when the file must stay compatible with 1.0-only consumers such as Cargo:

```bash
tomlsmith --toml-version 1.0 check Cargo.toml
```

Both versions are strict modes: a TOML 1.1 construct in a 1.0 run produces a diagnostic.
The LSP and VS Code extension instead default to 1.0 for ecosystem compatibility;
the [version policy](/guide/version-policy) lists every surface.

## Standard input and automation

Every command accepts a file path or `-` for standard input, and diagnostics can be emitted as machine-readable JSON for tools and automation.

```bash
echo 'title = "TomlSmith"' | tomlsmith check -
```

List all commands and options:

```bash
tomlsmith --help
```

## Browser workbench

The [playground](https://tomlsmith.github.io/playground/) checks and formats TOML in the browser. You can switch between TOML 1.0 and 1.1, inspect diagnostics and tokens, and preview formatting without changing the source.
