import { blogPosts } from "@/data/blog-posts";
import { supportedLanguages } from "@/i18n/request";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.curioboxapp.info"
).replace(/\/$/, "");

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

type ChangeFrequency = "weekly" | "monthly" | "yearly";

interface SitemapEntry {
  location: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

function createLocalizedEntry(
  language: string,
  routePath: string,
  changeFrequency: ChangeFrequency,
  priority: number
): SitemapEntry {
  return {
    location: `${BASE_URL}/${language}${routePath}`,
    changeFrequency,
    priority,
  };
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      ({ location, changeFrequency, priority }) => `<url>
<loc>${escapeXml(location)}</loc>
<changefreq>${changeFrequency}</changefreq>
<priority>${priority}</priority>
</url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function GET(): Response {
  const entries: SitemapEntry[] = [
    {
      location: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...supportedLanguages.map((language) =>
      createLocalizedEntry(language, "", "weekly", 0.9)
    ),
    ...supportedLanguages.flatMap((language) => [
      createLocalizedEntry(language, "/tools", "weekly", 0.8),
      createLocalizedEntry(language, "/blog", "weekly", 0.7),
      createLocalizedEntry(language, "/about", "monthly", 0.5),
      createLocalizedEntry(language, "/privacy-policy", "yearly", 0.3),
    ]),
    ...supportedLanguages.flatMap((language) =>
      blogPosts.map((post) =>
        createLocalizedEntry(language, `/blog/${post.slug}`, "monthly", 0.6)
      )
    ),
    ...supportedLanguages.flatMap((language) =>
      TOOL_SLUGS.map((slug) =>
        createLocalizedEntry(
          language,
          `/tools/${slug}`,
          WEEKLY_TOOLS.has(slug) ? "weekly" : "monthly",
          WEEKLY_TOOLS.has(slug) ? 0.9 : 0.7
        )
      )
    ),
  ];

  return new Response(createSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
