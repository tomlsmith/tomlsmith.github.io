import { createHash } from "node:crypto";
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

  test("performance pages link to the benchmark harness without internal run metadata", () => {
    const benchmarkComponent = readFileSync(
      join(repositoryRoot, "theme", "BenchmarkResults.tsx"),
      "utf8",
    );
    expect(benchmarkComponent).not.toContain("benchmarkData.evidencePath");
    expect(benchmarkComponent).not.toContain("benchmarkData.checksumPath");
    expect(benchmarkComponent).not.toContain("benchmarkData.environment");
    expect(benchmarkComponent).not.toContain("ts-benchmark-context");
    expect(benchmarkComponent).not.toContain("SummaryPlate");
    expect(benchmarkComponent).not.toContain("ts-benchmark-summary");

    for (const locale of ["en", "zh"] as const) {
      const performancePage = readFileSync(
        join(docsRoot, locale, "guide", "performance.mdx"),
        "utf8",
      );
      expect(performancePage).toContain("https://github.com/tomlsmith/benchmark");
      expect(performancePage).not.toMatch(/outside Git|Git 之外|benchmark revision|精确包版本/u);
      expect(performancePage).not.toMatch(/complete evidence bundle|完整证据包|SHA-256/u);
    }
  });

  test("published benchmark ranges and throughput agree with the recorded sessions", () => {
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
    const canonical = (value: unknown): unknown => {
      if (Array.isArray(value)) return value.map(canonical);
      if (value !== null && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).sort(([a], [b]) =>
          a < b ? -1 : a > b ? 1 : 0,
        ).map(([key, entry]) => [key, canonical(entry)]));
      }
      return value;
    };
    expect(createHash("sha256").update(JSON.stringify(canonical(data.runtimeInputs))).digest("hex"))
      .toBe(data.provenance.runtimeInputsSha256);
    expect(data.provenance.benchmarkRevision).toMatch(/^[a-f0-9]{40}$/u);
    expect(data.bundles).toHaveLength(data.lanes.length * data.measurement.sessions);
    const recordedDirectories = new Set(data.bundles.map(
      (bundle: { resultDirectory: string }) => bundle.resultDirectory,
    ));
    for (const lane of data.lanes) {
      expect(lane.sessionDirectories).toHaveLength(data.measurement.sessions);
      expect(lane.resultDirectory).toBe(lane.sessionDirectories[data.measurement.primarySession - 1]);
      for (const directory of lane.sessionDirectories) expect(recordedDirectories.has(directory)).toBe(true);
      for (const product of lane.products) {
        expect(product.sessionMediansMs).toHaveLength(data.measurement.sessions);
        expect(product.medianMs).toBe(product.sessionMediansMs[data.measurement.primarySession - 1]);
        expect(product.medianRangeMs).toEqual([
          Math.min(...product.sessionMediansMs), Math.max(...product.sessionMediansMs),
        ]);
        expect(product.medianMs).toBeGreaterThan(0);
        expect(product.peakRssMib).toBeGreaterThan(0);
        expect(product.throughputMibPerSecond).toBeCloseTo(lane.inputBytes / 1048576 / (product.medianMs / 1000), 10);
      }
    }
    expect(data).not.toHaveProperty("evidencePath");
    expect(data).not.toHaveProperty("checksumPath");
  });
});
