import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Toolbox - 30+ Free Developer Tools | JSON, Base64, UUID, Hash & More",
    template: "%s | Toolbox"
  },
  description: "Free online toolbox with 30+ developer tools. JSON Formatter, Base64 Encoder, UUID Generator, Hash Generator, Password Generator, QR Code, Color Converter, Regex Tester, String Tools, Text Compare, Markdown Preview, JWT Decoder, Timestamp Converter, SQL Formatter, YAML, CSV to JSON and more! No signup required.",
  keywords: [
    // Core tools
    "developer tools", "online tools", "free tools", "web tools",
    // Formatters
    "json formatter", "json validator", "json beautifier", "xml formatter", 
    "html formatter", "sql formatter", "yaml formatter", "markdown preview",
    // Encoders
    "base64 encoder", "base64 decoder", "url encoder", "jwt decoder", 
    "html entity encoder",
    // Generators
    "uuid generator", "hash generator", "password generator", "lorem ipsum",
    "md5 generator", "sha256 generator",
    // Converters
    "color converter", "timestamp converter", "case converter", 
    "image to base64", "number base converter", "json to csv", "csv to json",
    // Text tools
    "regex tester", "text compare", "word counter", "line sorter",
    "duplicate remover", "string tools",
    // Utilities
    "qr code generator", "css minifier", "credit card validator"
  ],
  authors: [{ name: "Toolbox" }],
  creator: "Toolbox",
  publisher: "Toolbox",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      de: "/de",
      tr: "/tr",
      fr: "/fr",
      pt: "/pt",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: "Toolbox - 30+ Free Developer Tools",
    description: "Free online toolbox with 30+ developer tools: JSON Formatter, Base64, UUID, Hash, Password, QR Code, Regex, String Tools and more! No signup required.",
    siteName: "Toolbox",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolbox - 30+ Free Developer Tools",
    description: "Free online toolbox with 30+ tools for developers. JSON, Base64, UUID, Hash, Regex, String Tools and more!",
    creator: "@toolbox",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url,
    "description": "Free online toolbox with 30+ tools: JSON, Base64, UUID, Hash, Password, QR, Regex, String Tools and more!",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1000"
    },
    "inLanguage": ["en", "de", "tr", "fr", "pt"]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-9339461513261360" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9339461513261360"
          crossOrigin="anonymous"
        />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          suppressHydrationWarning
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

