# TOML version policy

TomlSmith implements the published TOML 1.0.0 and TOML 1.1.0 specifications as separate modes. The selected version affects parsing, diagnostics, decoded values, and formatter safety checks.

## Defaults

| Surface | Default |
| --- | --- |
| Rust `Document::parse` and `FormatOptions::default` | TOML 1.1 |
| Native CLI and `@tomlsmith/cli` | TOML 1.1 |
| Browser playground after a new or reset session | TOML 1.1 |
| `tomlsmith-lsp` without client configuration | TOML 1.1 |
| TomlSmith for VS Code | TOML 1.1 |

Every product surface defaults to TOML 1.1. Select TOML 1.0 explicitly when a file must be read by a tool that supports only 1.0; the default editor settings do not enforce that compatibility. TomlSmith does not infer the language version from a filename.

## Choose explicitly in integrations

- Use `Document::parse_as` and set `FormatOptions::target_version` in reusable Rust integrations.
- Pass `--toml-version 1.0` or `--toml-version 1.1` to the CLI.
- Send `tomlVersion` in LSP initialization options or configuration updates.
- Set `tomlsmith.toml.version` in VS Code.
- Use TOML 1.0 whenever another tool that reads the file only supports 1.0.

Results across product surfaces are comparable only when the source, TOML version, and relevant options match. Formatting against a version other than the document's parse version performs an additional safety validation and can be refused.
