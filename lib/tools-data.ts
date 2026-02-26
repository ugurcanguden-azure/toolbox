import type { Tool, ToolCategory } from '@/types';

export const toolCategories: Record<ToolCategory, { icon: string; color: string }> = {
  encoders: { icon: 'Lock', color: 'text-blue-500' },
  formatters: { icon: 'Code2', color: 'text-green-500' },
  generators: { icon: 'Zap', color: 'text-yellow-500' },
  converters: { icon: 'RefreshCw', color: 'text-purple-500' },
  text: { icon: 'FileText', color: 'text-orange-500' },
  utilities: { icon: 'Wrench', color: 'text-pink-500' },
  pdf: { icon: 'FileOutput', color: 'text-red-500' },
};

// Future tools to be added
export const upcomingTools = [
  'Base64 Encoder/Decoder',
  'URL Encoder/Decoder',
  'UUID Generator',
  'Hash Generator (MD5, SHA)',
  'Password Generator',
  'QR Code Generator',
  'Color Converter',
  'Date Converter',
  'Text Diff Checker',
  'Regex Tester',
  'Minifier (CSS/JS)',
  'XML Formatter',
  'SQL Formatter',
];

