import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogPosts, getBlogPost } from '@/data/blog-posts';
import { Clock, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const t = await getTranslations('blog');
  
  return {
    title: t(`posts.${post.slug}.title`),
    description: t(`posts.${post.slug}.description`),
    keywords: post.tags,
  };
}

// Tool slug to translation key mapping
const toolNameMap: Record<string, string> = {
  'json-formatter': 'tools.jsonFormatter',
  'json-to-csv': 'tools.jsonToCsv',
  'jwt-decoder': 'tools.jwtDecoder',
  'xml-formatter': 'tools.xmlFormatter',
  'html-formatter': 'tools.htmlFormatter',
  'base64': 'tools.base64',
  'url-encoder': 'tools.urlEncoder',
  'image-to-base64': 'tools.imageToBase64',
  'uuid-generator': 'tools.uuidGenerator',
  'hash-generator': 'tools.hashGenerator',
  'password-generator': 'tools.passwordGenerator',
  'regex-tester': 'tools.regexTester',
  'string-tools': 'tools.stringTools',
  'text-compare': 'tools.textCompare',
  'markdown-preview': 'tools.markdownPreview',
  'sql-formatter': 'tools.sqlFormatter',
  'csv-to-json': 'tools.csvToJson',
};

export default async function BlogPostPage({ params: { locale, slug } }: BlogPostPageProps) {
  const post = getBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  const t = await getTranslations('blog');
  const tCategories = await getTranslations('blog.categories');
  
  // Get tool translations
  const toolTranslations = await Promise.all(
    post.relatedTools.map(async (toolSlug) => {
      const toolKey = toolNameMap[toolSlug];
      const tTool = await getTranslations(toolKey || 'tools.base64');
      return {
        slug: toolSlug,
        title: tTool('title')
      };
    })
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href={`/${locale}/blog`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToBlog')}
          </Button>
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">
                {tCategories(post.category)}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              {t(`posts.${slug}.title`)}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {t(`posts.${slug}.description`)}
            </p>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString(locale)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} {t('readTime')}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                {t('shareArticle')}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-muted-foreground mb-0">
                {t(`posts.${slug}.content`)}
              </p>
            </div>
          </div>

          {/* Related Tools */}
          {toolTranslations.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">{t('relatedTools')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {toolTranslations.map((tool) => (
                    <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                          <h3 className="font-semibold text-center">
                            {tool.title}
                          </h3>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </article>
      </div>
    </div>
  );
}

