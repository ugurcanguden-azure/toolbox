// Blog post metadata (technical data only, content comes from translations)

export interface BlogPostMeta {
  slug: string;
  category: 'encoders' | 'formatters' | 'generators' | 'converters' | 'utilities';
  tags: string[];
  date: string;
  readTime: string;
  relatedTools: string[];
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'what-is-json',
    category: 'formatters',
    tags: ['JSON', 'API', 'Web Development', 'Data Format'],
    date: '2024-10-17',
    readTime: '8',
    relatedTools: ['json-formatter', 'json-to-csv', 'jwt-decoder']
  },
  {
    slug: 'what-is-xml',
    category: 'formatters',
    tags: ['XML', 'Markup Language', 'Data Format', 'SOAP'],
    date: '2024-10-17',
    readTime: '10',
    relatedTools: ['xml-formatter', 'json-formatter', 'html-formatter']
  },
  {
    slug: 'what-is-base64',
    category: 'encoders',
    tags: ['Base64', 'Encoding', 'Binary', 'Data Transfer'],
    date: '2024-10-17',
    readTime: '7',
    relatedTools: ['base64', 'url-encoder', 'image-to-base64']
  },
  {
    slug: 'what-is-uuid',
    category: 'generators',
    tags: ['UUID', 'GUID', 'Unique ID', 'Generator'],
    date: '2024-10-17',
    readTime: '6',
    relatedTools: ['uuid-generator', 'hash-generator', 'password-generator']
  },
  {
    slug: 'what-is-hash',
    category: 'generators',
    tags: ['Hash', 'MD5', 'SHA256', 'Cryptography', 'Security'],
    date: '2024-10-17',
    readTime: '9',
    relatedTools: ['hash-generator', 'password-generator', 'uuid-generator']
  },
  {
    slug: 'what-is-jwt',
    category: 'encoders',
    tags: ['JWT', 'JSON Web Token', 'Authentication', 'Security'],
    date: '2024-10-17',
    readTime: '8',
    relatedTools: ['jwt-decoder', 'base64', 'hash-generator']
  },
  {
    slug: 'what-is-regex',
    category: 'utilities',
    tags: ['Regex', 'Regular Expression', 'Pattern Matching', 'Text Processing'],
    date: '2024-10-17',
    readTime: '12',
    relatedTools: ['regex-tester', 'string-tools', 'text-compare']
  },
  {
    slug: 'markdown-guide',
    category: 'formatters',
    tags: ['Markdown', 'Documentation', 'Writing', 'Formatting'],
    date: '2024-10-17',
    readTime: '10',
    relatedTools: ['markdown-preview', 'html-formatter', 'text-compare']
  },
  {
    slug: 'sql-optimization',
    category: 'formatters',
    tags: ['SQL', 'Database', 'Query', 'Performance'],
    date: '2024-10-17',
    readTime: '11',
    relatedTools: ['sql-formatter', 'json-formatter', 'csv-to-json']
  },
  {
    slug: 'password-security',
    category: 'generators',
    tags: ['Password', 'Security', 'Cryptography', 'Best Practices'],
    date: '2024-10-17',
    readTime: '9',
    relatedTools: ['password-generator', 'hash-generator', 'uuid-generator']
  }
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: BlogPostMeta['category']): BlogPostMeta[] {
  return blogPosts.filter(post => post.category === category);
}

