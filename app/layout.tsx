import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_CONFIG } from "@/lib/config";
import { GoogleAdSense } from "next-google-adsense";
import { GoogleAnalytics } from "@/components/analytics";

// 🎨 FONT OPTIMIZATION - Critical for PageSpeed
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Prevents invisible text during font load
  preload: true, // Preload critical font
  fallback: ['system-ui', 'arial'], // Fallback fonts
  variable: '--font-inter', // CSS variable for better performance
});

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
  authors: [
    { 
      name: "Uğurcan Güden",
      url: "https://github.com/ugurcanguden"
    }
  ],
  creator: "Uğurcan Güden",
  publisher: "Uğurcan Güden",
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
    creator: "@ugurcanguden",
    site: "@ugurcanguden",
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
    "alternateName": "Developer Toolbox",
    "url": SITE_CONFIG.url,
    "description": "Free online toolbox with 30+ tools: JSON Formatter, Base64 Encoder/Decoder, UUID Generator, Hash Generator, Password Generator, QR Code Generator, Color Converter, Regex Tester, String Tools, Markdown Preview, and more!",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "2.1.0",
    "author": {
      "@type": "Person",
      "name": "Uğurcan Güden",
      "url": "https://github.com/ugurcanguden",
      "sameAs": [
        "https://github.com/ugurcanguden",
        "https://linkedin.com/in/ugurcanguden",
        "https://free-dev-tools.net.tr"
      ],
      "jobTitle": "Software Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "İntertech"
      },
      "knowsAbout": [
        ".NET Core",
        "Microservices",
        "React",
        "Next.js",
        "Docker",
        "PostgreSQL",
        "Redis",
        "TypeScript",
        "Web Development"
      ]
    },
    "creator": {
      "@type": "Person",
      "name": "Uğurcan Güden",
      "url": "https://github.com/ugurcanguden"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "JSON Formatter & Validator",
      "Base64 Encoder/Decoder",
      "UUID Generator (v4)",
      "Hash Generator (MD5, SHA-1, SHA-256, SHA-512)",
      "Password Generator",
      "QR Code Generator",
      "Color Converter (HEX, RGB, HSL, CMYK)",
      "Regex Tester",
      "String Manipulation Tools",
      "Markdown Live Preview",
      "JWT Token Decoder",
      "Timestamp Converter",
      "XML/HTML/YAML/SQL Formatter",
      "Text Diff Comparison",
      "30+ Tools Total"
    ],
    "inLanguage": ["en", "de", "tr", "fr", "pt", "es", "it", "nl", "ja", "ru"],
    "availableLanguage": [
      { "@type": "Language", "name": "English", "alternateName": "en" },
      { "@type": "Language", "name": "German", "alternateName": "de" },
      { "@type": "Language", "name": "Turkish", "alternateName": "tr" },
      { "@type": "Language", "name": "French", "alternateName": "fr" },
      { "@type": "Language", "name": "Portuguese", "alternateName": "pt" },
      { "@type": "Language", "name": "Spanish", "alternateName": "es" },
      { "@type": "Language", "name": "Italian", "alternateName": "it" },
      { "@type": "Language", "name": "Dutch", "alternateName": "nl" },
      { "@type": "Language", "name": "Japanese", "alternateName": "ja" },
      { "@type": "Language", "name": "Russian", "alternateName": "ru" }
    ],
    "keywords": "developer tools, online tools, json formatter, base64, uuid, hash generator, password generator, qr code, regex tester",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://free-dev-tools.net.tr/en?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      {/* 🎨 FONT PRELOAD - Critical for performance */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      
      {/* Google Site Verification */}
      <meta name="google-site-verification" content="JTl7ocUCsAiICDbWUYpv8B3wfSKQSdRLdg1tPXDDTac" />
      
      {/* Google AdSense Account Meta */}
      <meta name="google-adsense-account" content="ca-pub-9339461513261360" />
      
      {/* 🚀 PERFORMANCE HINTS */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      
      {/* 🔥 RESOURCE HINTS */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          suppressHydrationWarning
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        {/* Google AdSense Script (via next-google-adsense) - temporarily disabled */}
        {/* <GoogleAdSense publisherId="pub-9339461513261360" /> */}
        {children}
      </body>
    </html>
  );
}

