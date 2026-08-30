# 一致性验证

TomlSmith 通过 [`toml-test`](https://github.com/toml-lang/toml-test) 为 TOML 1.0 与 1.1 提供的全部 1,360 个解码用例。

| TOML 版本 | 有效输入 | 无效输入 |
| --- | ---: | ---: |
| 1.0 | 205 | 474 |
| 1.1 | 214 | 467 |

## 运行测试

核心仓库会在 CI 中运行全部解码用例，不使用白名单或跳过列表。本地运行相同检查：

```bash
bash tools/toml-test/run.sh
```

运行器的 [README](https://github.com/tomlsmith/tomlsmith/tree/main/tools/toml-test) 记录了测试依赖与预期数量。

## 范围

这 1,360 个用例覆盖解码：按各版本规则解析文档，并产出套件期望的值。它们不测试格式化器、语言服务器、VS Code 扩展或 Playground 界面。

## 版本模式

两个版本分别运行。只被 TOML 1.1 接受的语法，会在 TOML 1.0 模式中被拒绝。只支持 1.0 的工具要读取文件时，在 CI 中使用 `--toml-version 1.0`。
