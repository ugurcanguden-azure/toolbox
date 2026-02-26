import { FC } from 'react';

interface CanonicalProps {
  url?: string;
  baseUrl?: string;
}

/**
 * Canonical URL Component
 * Generates self-canonical URLs for SEO optimization
 */
export const Canonical: FC<CanonicalProps> = ({ 
  url, 
  baseUrl = process.env.SITE_URL || 'https://toolbox.curioboxapp.info/' 
}) => {
  // Generate canonical URL
  const canonicalUrl = url ? `${baseUrl}${url}` : baseUrl;
  
  return (
    <link 
      rel="canonical" 
      href={canonicalUrl}
    />
  );
};

export default Canonical;
