import { MetadataRoute } from 'next'

// Structured data for rich snippets
export default function schema(): MetadataRoute.Manifest {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Toolbox - Developer Tools Collection",
    "alternateName": "Toolbox",
    "url": "https://toolbox.curioboxapp.info",
    "description": "A collection of 30+ useful tools for developers and everyone. JSON Formatter, Base64, UUID, Hash, Password, QR Code, Color Converter, Regex Tester, String Tools, Markdown Preview, JWT Decoder, Timestamp Converter and more!",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "JSON Formatter with tree view",
      "Base64 Encoder/Decoder",
      "URL Encoder/Decoder",
      "UUID Generator",
      "Hash Generator (MD5, SHA)",
      "Password Generator",
      "QR Code Generator",
      "Color Converter",
      "Regex Tester",
      "String Tools (31+ operations)",
      "Text Compare",
      "Markdown Preview",
      "JWT Decoder",
      "Timestamp Converter",
      "Lorem Ipsum Generator",
      "Case Converter",
      "HTML Formatter",
      "CSS Minifier",
      "SQL Formatter",
      "Image to Base64",
      "Number Base Converter",
      "Word Counter",
      "Line Sorter",
      "Duplicate Remover",
      "HTML Entity Encoder",
      "JSON to CSV",
      "CSV to JSON",
      "YAML Formatter",
      "Credit Card Validator",
      "XML Formatter",
      "Cron Expression Generator & Explainer"
    ],
    "browserRequirements": "Requires JavaScript enabled",
    "softwareVersion": "2.1.0",
    "author": {
      "@type": "Organization",
      "name": "Toolbox",
      "url": "https://toolbox.curioboxapp.info"
    },
    "inLanguage": ["en", "de", "tr", "fr", "pt", "es", "it", "nl", "ja", "ru"],
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://toolbox.curioboxapp.info"
    }
  } as any
}
