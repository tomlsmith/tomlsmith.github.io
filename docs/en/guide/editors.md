# Editors and LSP

`tomlsmith-lsp` implements the Language Server Protocol over stdio. Editors with a generic LSP client can use its diagnostics, formatting, highlighting, hover, symbols, and folding.

## Capabilities

- Diagnostics with exact source locations
- Formatting (with the same safety rules as the CLI formatter)
- Semantic highlighting
- Hover
- Document symbols
- Folding

The implemented editor surface does not include Schema-backed completion or code actions.

The server defaults to TOML 1.0 when the client supplies no `tomlVersion`.
Clients can select 1.1 in initialization options or configuration updates; see
the [TOML version policy](/guide/version-policy).

## VS Code

[TomlSmith for VS Code](https://github.com/tomlsmith/vscode-plugin) launches `tomlsmith-lsp` and includes a TextMate grammar for highlighting when the server is not running. Its README documents platform-specific VSIX packaging and installation.

## Other editors

Install the latest stable server with `cargo install tomlsmith-lsp --locked`, then configure your editor's LSP client to launch the `tomlsmith-lsp` binary over stdio. This applies to Neovim, Helix, Emacs, and other editors with generic LSP support.

## Browser playground

The [playground](https://tomlsmith.github.io/playground/) provides live diagnostics, a format preview that changes the source only when applied, and a token inspector.
