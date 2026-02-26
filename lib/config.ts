/**
 * Site configuration
 * Production domain: free-dev-tools.net.tr
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox.curioboxapp.info/';

export const SITE_CONFIG = {
  name: 'Toolbox - 30+ Developer Tools',
  shortName: 'Toolbox',
  description: 'Free online toolbox with 30+ developer tools: JSON Formatter, Base64, UUID, Hash, Password, QR Code, Regex, String Tools and more!',
  url: SITE_URL,
} as const;
