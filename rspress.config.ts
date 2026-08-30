import * as path from "node:path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "rspress/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

const GITHUB_ORG = "https://github.com/tomlsmith";

export default defineConfig({
  root: path.join(rootDir, "docs"),
  base: "/",
  title: "TomlSmith",
  description:
    "Parse, check, and format TOML 1.0 and 1.1 from Rust, the command line, editors, and the browser.",
  icon: "/favicon-32.png",
  logo: "/tomlsmith-icon.svg",
  logoText: "TOMLSMITH",
  lang: "en",
  globalStyles: path.join(rootDir, "theme/index.css"),
  route: {
    exclude: ["public/**"],
  },
  locales: [
    {
      lang: "en",
      label: "English",
      title: "TomlSmith",
      description:
        "Parse, check, and format TOML 1.0 and 1.1 from Rust, the command line, editors, and the browser.",
    },
    {
      lang: "zh",
      label: "简体中文",
      title: "TomlSmith",
      description:
        "在 Rust、命令行、编辑器和浏览器中解析、检查和格式化 TOML 1.0 与 1.1。",
    },
  ],
  themeConfig: {
    // Known upstream issue: rspress 1.x's search panel renders through a
    // React portal during hydration, so production builds log recoverable
    // React #418/#423 console errors on every page load (pages still render
    // correctly). Verified against a pristine default-config site; setting
    // `search: false` here silences it. Revisit after upgrading to rspress 2.
    footer: {
      message: "Released under the MIT License. © 2026 TomlSmith contributors.",
    },
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: `${GITHUB_ORG}/tomlsmith`,
      },
    ],
    locales: [
      {
        lang: "en",
        label: "English",
        outlineTitle: "On this page",
        prevPageText: "Previous",
        nextPageText: "Next",
        searchPlaceholderText: "Search",
        nav: [
          { text: "Guide", link: "/guide/introduction", activeMatch: "^/guide/(?!performance|ecosystem)" },
          { text: "Performance", link: "/guide/performance", activeMatch: "^/guide/performance" },
          { text: "Ecosystem", link: "/guide/ecosystem", activeMatch: "^/guide/ecosystem" },
          { text: "Playground", link: "https://tomlsmith.github.io/playground/" },
        ],
        sidebar: {
          "/guide/": [
            {
              text: "Getting started",
              items: [
                { text: "Introduction", link: "/guide/introduction" },
                { text: "Quick start", link: "/guide/quick-start" },
              ],
            },
            {
              text: "Use TomlSmith",
              items: [
                { text: "Use from Rust", link: "/guide/rust-api" },
                { text: "Editors and LSP", link: "/guide/editors" },
                { text: "TOML version policy", link: "/guide/version-policy" },
              ],
            },
            {
              text: "Project",
              items: [
                { text: "Performance", link: "/guide/performance" },
                { text: "Conformance", link: "/guide/conformance" },
                { text: "Ecosystem", link: "/guide/ecosystem" },
              ],
            },
          ],
        },
      },
      {
        lang: "zh",
        label: "简体中文",
        outlineTitle: "本页目录",
        prevPageText: "上一页",
        nextPageText: "下一页",
        searchPlaceholderText: "搜索",
        nav: [
          { text: "指南", link: "/zh/guide/introduction", activeMatch: "^/zh/guide/(?!performance|ecosystem)" },
          { text: "性能", link: "/zh/guide/performance", activeMatch: "^/zh/guide/performance" },
          { text: "生态", link: "/zh/guide/ecosystem", activeMatch: "^/zh/guide/ecosystem" },
          { text: "Playground", link: "https://tomlsmith.github.io/playground/" },
        ],
        sidebar: {
          "/zh/guide/": [
            {
              text: "开始",
              items: [
                { text: "介绍", link: "/zh/guide/introduction" },
                { text: "快速上手", link: "/zh/guide/quick-start" },
              ],
            },
            {
              text: "使用 TomlSmith",
              items: [
                { text: "在 Rust 中使用", link: "/zh/guide/rust-api" },
                { text: "编辑器与 LSP", link: "/zh/guide/editors" },
                { text: "TOML 版本策略", link: "/zh/guide/version-policy" },
              ],
            },
            {
              text: "项目",
              items: [
                { text: "性能数据", link: "/zh/guide/performance" },
                { text: "一致性验证", link: "/zh/guide/conformance" },
                { text: "生态", link: "/zh/guide/ecosystem" },
              ],
            },
          ],
        },
      },
    ],
  },
});
