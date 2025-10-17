export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: 'encoders' | 'formatters' | 'generators' | 'converters' | 'utilities';
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  content: {
    introduction: string;
    sections: BlogSection[];
    conclusion: string;
  };
  relatedTools: string[];
  seo: {
    keywords: string[];
    ogImage?: string;
  };
}

export interface BlogSection {
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
  codeExample?: {
    language: string;
    code: string;
  };
}

export type BlogCategory = BlogPost['category'];

