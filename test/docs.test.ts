import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const docsRoot = join(repositoryRoot, "docs");
const benchmarkDataPath = join(repositoryRoot, "theme", "benchmark-data.json");

function filesBelow(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

function pageKeys(locale: "en" | "zh"): string[] {
  const localeRoot = join(docsRoot, locale);
  return filesBelow(localeRoot)
    .filter((path) => [".md", ".mdx"].includes(extname(path)))
    .map((path) => relative(localeRoot, path).replace(/\.(?:md|mdx)$/u, ""))
    .sort();
}

function routeExists(route: string): boolean {
  const clean = route.split(/[?#]/u, 1)[0]?.replace(/\/$/u, "") ?? "";
  const localized = clean.startsWith("/zh/") || clean === "/zh";
  const locale = localized ? "zh" : "en";
  const routePath = localized ? clean.replace(/^\/zh\/?/u, "") : clean.replace(/^\//u, "");
  const page = routePath === "" ? "index" : routePath;
  return [".md", ".mdx"].some((extension) =>
    existsSync(join(docsRoot, locale, `${page}${extension}`)),
  );
}

describe("documentation integrity", () => {
  test("English and Simplified Chinese expose the same page structure", () => {
    expect(pageKeys("zh")).toEqual(pageKeys("en"));
  });

  test("every internal documentation route resolves to a source page", () => {
    const sources = [
      ...filesBelow(join(docsRoot, "en")),
      ...filesBelow(join(docsRoot, "zh")),
      join(repositoryRoot, "rspress.config.ts"),
    ].filter((path) => [".md", ".mdx", ".ts"].includes(extname(path)));
    const missing: string[] = [];
    const routePattern = /(?:\]\(|href=["']|link:\s*["'])(\/(?:zh\/)?(?:guide\/[^)"'\s]+)?)/gu;

    for (const source of sources) {
      const contents = readFileSync(source, "utf8");
      for (const match of contents.matchAll(routePattern)) {
        const route = match[1];
        if (route !== undefined && !routeExists(route)) {
          missing.push(`${relative(repositoryRoot, source)} -> ${route}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  test("both homepages lead with the shared measured performance data", () => {
    for (const [locale, featureTitle] of [
      ["en", "What TomlSmith does"],
      ["zh", "TomlSmith 能做什么"],
    ] as const) {
      const homepage = readFileSync(join(docsRoot, locale, "index.mdx"), "utf8");
      expect(homepage.indexOf(`<BenchmarkResults locale="${locale}" />`)).toBeGreaterThan(-1);
      expect(homepage.indexOf(`<BenchmarkResults locale="${locale}" />`)).toBeLessThan(
        homepage.indexOf(featureTitle),
      );
    }
  });

  test("performance pages explain where raw benchmark results are retained", () => {
    const benchmarkComponent = readFileSync(
      join(repositoryRoot, "theme", "BenchmarkResults.tsx"),
      "utf8",
    );
    expect(benchmarkComponent).not.toContain("benchmarkData.evidencePath");
    expect(benchmarkComponent).not.toContain("benchmarkData.checksumPath");

    for (const locale of ["en", "zh"] as const) {
      const performancePage = readFileSync(
        join(docsRoot, locale, "guide", "performance.mdx"),
        "utf8",
      );
      expect(performancePage).toContain("https://github.com/tomlsmith/benchmark");
      expect(performancePage).toMatch(/outside Git|Git 之外/u);
      expect(performancePage).not.toMatch(/complete evidence bundle|完整证据包|SHA-256/u);
    }
  });

  test("the published benchmark data records reproducible package provenance", () => {
    const data = JSON.parse(readFileSync(benchmarkDataPath, "utf8"));
    expect(data.lanes.map((lane: { operation: string; tomlVersion: string }) =>
      `${lane.operation}/${lane.tomlVersion}`,
    )).toEqual(["check/1.0", "check/1.1", "format/1.0", "format/1.1"]);
    expect(
      data.lanes.every(
        (lane: { products: Array<{ id: string; displayName: string }> }) =>
          lane.products.some(
            (product) =>
              product.id === "tomlsmith" && product.displayName === "TomlSmith native CLI",
          ),
      ),
    ).toBe(true);
    expect(data.provenance).toEqual({
      benchmarkRevision: "39fb1aaf16180f46d7e010b00cb3f365bf11f2d0",
      runtimeInputsSha256: "315cbeb8ecbdfc5cb20eb71e4b0df13d6a077c05aecf2dcb3f5ea5a6ccdf5f84",
      packages: {
        tomlsmith: "0.1.0",
        "tomlsmith-cli": "0.1.0",
      },
    });
    expect(data.environment).toEqual({
      measuredOn: "2026-08-31",
      operatingSystem: "macOS 26.5.2",
      architecture: "aarch64",
      cpu: "Apple M4 Pro",
      rustc: "1.92.0",
    });
    expect(
      data.lanes.every(({ resultDirectory }: { resultDirectory: string }) =>
        resultDirectory.startsWith("release-20260831-macos-arm64-"),
      ),
    ).toBe(true);
    expect(data).not.toHaveProperty("evidencePath");
    expect(data).not.toHaveProperty("checksumPath");
  });
});
