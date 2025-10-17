import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blog-posts';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('blog');
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('blog');
  const tCategories = await getTranslations('blog.categories');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      {tCategories(post.category)}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">
                    {t(`posts.${post.slug}.title`)}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {t(`posts.${post.slug}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString(locale)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} {t('readTime')}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

