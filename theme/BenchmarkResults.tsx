import benchmarkData from "./benchmark-data.json";

type Locale = "en" | "zh";
type Lane = (typeof benchmarkData.lanes)[number];
type Product = Lane["products"][number];

const copy = {
  en: {
    label: "01 — Measured performance",
    title: "TOML 1.0 format and check, compared",
    intro:
      "Direct-CLI cold-start medians; package-manager launchers and wrapper processes are excluded.",
    details: "See TOML 1.1 and all four lanes",
    compactLower: "median latency · lower is better",
    compactTomll: "* tomll does not preserve comments or literal styles.",
    range: "session range",
    sessions: "Three sequential sessions; displayed medians use session 2, selected before measurement. Ranges show observed session drift, not confidence intervals.",
    lower: "median latency · logarithmic scale · lower is better",
    tomll:
      "* tomll is a semantic re-printer: it discards comments and rewrites literal styles, so it does less work than the comment-preserving formatters.",
  },
  zh: {
    label: "01 — 实测性能",
    title: "TOML 1.0 格式化与检查对比",
    intro:
      "直接 CLI 冷启动耗时中位数；不计入包管理器 launcher 或包装进程。",
    details: "查看 TOML 1.1 与完整四条赛道",
    compactLower: "耗时中位数 · 越短越好",
    compactTomll: "* tomll 不保留注释和字面量写法。",
    range: "会话范围",
    sessions: "顺序执行三次会话；显示测量前指定的第二次会话中位数。范围反映会话波动，并非置信区间。",
    lower: "耗时中位数 · 对数刻度 · 越短越好",
    tomll:
      "* tomll 是语义重打印器，会丢弃注释并改写字面量，因此它完成的工作少于保留注释的格式化器。",
  },
} as const;

const productNames: Record<string, string> = {
  "burntsushi-toml": "tomlv · BurntSushi",
  dprint: "dprint + TOML",
  "go-toml-tomll": "tomll · go-toml*",
  prettier: "Prettier + TOML",
  taplo: "Taplo CLI",
  tombi: "Tombi",
  tomlsmith: "TomlSmith native CLI",
};

function operationName(operation: string, locale: Locale) {
  if (locale === "zh") {
    return operation === "check" ? "检查" : "格式化";
  }
  return operation === "check" ? "Check" : "Format";
}

function formatLatency(value: number) {
  return `${value.toFixed(2)} ms`;
}

function barWidth(products: Product[], value: number) {
  const values = products.map((product) => product.medianMs);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  if (minimum === maximum) {
    return 100;
  }
  const position =
    (Math.log(value) - Math.log(minimum)) / (Math.log(maximum) - Math.log(minimum));
  return 12 + position * 88;
}

function ComparisonPanels({
  locale,
  lanes = benchmarkData.lanes,
  compact = false,
}: {
  locale: Locale;
  lanes?: readonly Lane[];
  compact?: boolean;
}) {
  const text = copy[locale];
  return (
    <div className={`ts-bench${compact ? " ts-bench--compact" : ""}`}>
      {lanes.map((lane) => {
        const products = compact ? lane.products.slice(0, 4) : lane.products;
        return (
          <div className="ts-bench__panel" key={lane.laneId}>
            <div className="ts-bench__head">
              <h3>
                {operationName(lane.operation, locale)} · TOML {lane.tomlVersion}
              </h3>
              <span>{compact ? text.compactLower : text.lower}</span>
            </div>
            <div className="ts-bench__rows">
              {products.map((product) => {
                const isTomlSmith = product.id === "tomlsmith";
                return (
                  <div
                    className={`ts-bar-row${isTomlSmith ? " ts-bar-row--self" : ""}`}
                    key={product.id}
                  >
                    <span className="ts-bar-row__name">
                      {productNames[product.id] ?? product.displayName}
                    </span>
                    <div className="ts-bar">
                      <div
                        className="ts-bar__track"
                        aria-label={`${product.displayName}: ${formatLatency(product.medianMs)}`}
                        role="img"
                      >
                        <div
                          className="ts-bar__fill"
                          style={{ width: `${barWidth(products, product.medianMs)}%` }}
                        ></div>
                      </div>
                      <span className="ts-bar__meta">
                        {isTomlSmith ? (
                          <b>{formatLatency(product.medianMs)}</b>
                        ) : (
                          formatLatency(product.medianMs)
                        )}
                        {compact ? null : (
                          <>
                            {" · "}
                            {product.throughputMibPerSecond.toFixed(2)} MiB/s
                            {" · "}
                            {product.peakRssMib.toFixed(2)} MiB RSS
                            <span className="ts-bar__range">
                              {text.range}: {product.medianRangeMs[0].toFixed(2)}–{product.medianRangeMs[1].toFixed(2)} ms
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HomeComparison({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const lanes = benchmarkData.lanes
    .filter((lane) => lane.tomlVersion === "1.0")
    .sort((left, right) =>
      left.operation === "format" ? -1 : right.operation === "format" ? 1 : 0,
    );
  return (
    <>
      <ComparisonPanels locale={locale} lanes={lanes} compact />
      <p className="ts-footnote">{text.compactTomll}</p>
    </>
  );
}

function DetailedResults({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <>
      <ComparisonPanels locale={locale} />
      <p className="ts-footnote">{text.sessions}</p>
      <p className="ts-footnote">{text.tomll}</p>
    </>
  );
}

export function BenchmarkResults({
  locale,
  mode = "home",
}: {
  locale: Locale;
  mode?: "home" | "page";
}) {
  const text = copy[locale];
  const performancePath = locale === "zh" ? "/zh/guide/performance" : "/guide/performance";
  if (mode === "page") {
    return (
      <div className="ts-benchmark-results ts-benchmark-results--page">
        <DetailedResults locale={locale} />
      </div>
    );
  }
  return (
    <section className="ts-section ts-benchmark-results">
      <p className="ts-microlabel">{text.label}</p>
      <h2 className="ts-section__title">{text.title}</h2>
      <p className="ts-section__note">
        {text.intro} <a href={performancePath}>{text.details}</a>
        {locale === "zh" ? "。" : "."}
      </p>
      <HomeComparison locale={locale} />
    </section>
  );
}
