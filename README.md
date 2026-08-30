# TomlSmith Website

**English** | [简体中文](README.zh-Hans.md)

The homepage and user documentation for [TomlSmith](https://github.com/tomlsmith/tomlsmith).

The [playground](https://tomlsmith.github.io/playground/) deploys independently from the [playground repository](https://github.com/tomlsmith/playground) through GitHub Pages.

## Develop

Install Node.js 22.12 or newer and pnpm, then:

```bash
pnpm install
pnpm dev
```

`pnpm build` writes the production site to `doc_build/`; `pnpm preview` serves that build locally.

## Content guidelines

- Describe what a user can do before explaining how the project is implemented.
- Keep claims concrete: name the behavior, limitation, input, or measurement behind them.
- Put dependency versions, checksums, and test-runner details in the relevant reference page instead of repeating them on the homepage.
- Update the English and Simplified Chinese pages together, preserving meaning rather than translating word for word.

## Deploy

Pushing to `main` builds and publishes the site after **Settings → Pages → Source: GitHub Actions** has been enabled once on the repository.

## License

MIT. See [LICENSE](LICENSE).
