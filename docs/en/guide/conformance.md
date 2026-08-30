# Conformance

TomlSmith passes all 1,360 decoder cases provided by [`toml-test`](https://github.com/toml-lang/toml-test) for TOML 1.0 and 1.1.

| TOML version | Valid cases | Invalid cases |
| --- | ---: | ---: |
| 1.0 | 205 | 474 |
| 1.1 | 214 | 467 |

## Run the tests

The core repository runs every decoder case in CI without an allowlist or skip list. Run the same check locally:

```bash
bash tools/toml-test/run.sh
```

The runner's [README](https://github.com/tomlsmith/tomlsmith/tree/main/tools/toml-test) records the test dependency and expected counts.

## Scope

The 1,360 cases cover decoding: parsing documents and producing the values expected by the suite under each version's rules. They do not test the formatter, language server, VS Code extension, or playground interface.

## Version modes

The two versions run separately. A construct accepted only by TOML 1.1 is rejected in TOML 1.0 mode. Use `--toml-version 1.0` in CI for files read by 1.0-only tools.
