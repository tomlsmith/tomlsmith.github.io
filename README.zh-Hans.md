# TomlSmith 网站

[English](README.md) | **简体中文**

[TomlSmith](https://github.com/tomlsmith/tomlsmith) 的首页与用户文档。

[Playground](https://tomlsmith.github.io/playground/) 通过 [playground 仓库](https://github.com/tomlsmith/playground)中的 GitHub Pages workflow 独立部署。

## 开发

安装 Node.js 22.12 或更高版本以及 pnpm，然后：

```bash
pnpm install
pnpm dev
```

`pnpm build` 将生产站点输出到 `doc_build/`；`pnpm preview` 在本地预览该构建。

## 文案规范

- 先说明用户能做什么，再说明项目如何实现。
- 每项表述都应指向具体的行为、限制、输入或测量结果。
- 依赖版本、校验和与测试运行器细节放在对应的参考页面，不在首页重复。
- 英文与简体中文页面同步更新；翻译以含义一致为准，不逐字照译。

## 部署

仓库一次性开启 **Settings → Pages → Source: GitHub Actions** 后，推送到 `main` 会自动构建并发布。

## 许可证

MIT，见 [LICENSE](LICENSE)。
