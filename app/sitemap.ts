import { supportedLanguages } from "@/i18n/request";
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.curioboxapp.info";
const WEEKLY_TOOLS = new Set([
  "base64",
  "color-converter",
  "hash-generator",
  "json-formatter",
  "password-generator",
  "qr-generator",
  "regex-tester",
  "uuid-generator",
]);

const TOOL_SLUGS = [
  "base64",
  "case-converter",
  "color-converter",
  "credit-card-validator",
  "cron-expression-generator",
  "css-minifier",
  "csv-to-json",
  "duplicate-remover",
  "hash-generator",
  "html-entity-encoder",
  "html-formatter",
  "image-to-base64",
  "json-formatter",
  "json-to-csv",
  "jwt-decoder",
  "line-sorter",
  "lorem-generator",
  "markdown-preview",
  "number-base-converter",
  "password-generator",
  "pdf-merge",
  "pdf-protect",
  "pdf-to-image",
  "pdf-to-word",
  "qr-generator",
  "regex-tester",
  "sql-formatter",
  "string-tools",
  "text-compare",
  "timestamp-converter",
  "url-encoder",
  "uuid-generator",
  "word-counter",
  "xml-formatter",
  "yaml-formatter",
] as const;

function buildLocalizedRoute(
  lang: string,
  routePath: string,
  changeFrequency: "daily" | "weekly" | "monthly",
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}/${lang}${routePath}`,
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      priority: 1,
      changeFrequency: "daily",
    },
    ...supportedLanguages.map((lang) =>
      buildLocalizedRoute(lang, "", "daily", 1)
    ),
    ...supportedLanguages.flatMap((lang) =>
      TOOL_SLUGS.map((slug) =>
        buildLocalizedRoute(
          lang,
          `/tools/${slug}`,
          WEEKLY_TOOLS.has(slug) ? "weekly" : "monthly",
          WEEKLY_TOOLS.has(slug) ? 0.9 : 0.7
        )
      )
    ),
    ...supportedLanguages.map((lang) =>
      buildLocalizedRoute(lang, "/privacy-policy", "monthly", 0.3)
    ),
  ];

  return staticRoutes;
}
