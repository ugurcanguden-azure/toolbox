import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { 
  Code2, 
  User, 
  Mail, 
  Linkedin, 
  Github, 
  Globe, 
  Award, 
  Target, 
  Heart,
  Lightbulb,
  Zap,
  Shield,
  TrendingUp,
  Monitor,
  Smartphone,
  Database,
  Cloud
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  
  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "Uğurcan Güden",
      "Software Developer",
      "Full Stack Developer",
      ".NET Core Developer",
      "React Developer",
      "Next.js Developer",
      "Mikroservis",
      "Microservices",
      "Docker",
      "DevOps",
      "QQRCHEF",
      "Free Dev Tools",
      "guden-core",
      "Muğla Developer"
    ],
    authors: [{ name: "Uğurcan Güden", url: "https://github.com/ugurcanguden" }],
    openGraph: {
      title: t("subtitle"),
      description: t("description"),
      type: "profile",
      url: "https://toolbox.curioboxapp.info//about"
    }
  };
}

export default function AboutPage() {
  const t = useTranslations("about");
  
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Uğurcan Güden",
    "jobTitle": "Software Developer",
    "description": "Software Developer focusing on .NET Core, Microservices, React, Next.js, Docker and DevOps",
    "url": "https://toolbox.curioboxapp.info/",
    "sameAs": [
      "https://github.com/ugurcanguden",
      "https://linkedin.com/in/ugurcanguden",
      "https://www.npmjs.com/~ugurcanguden"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "İntertech"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Muğla"
    },
    "knowsAbout": [
      ".NET Core",
      "Microservices Architecture",
      "React",
      "Next.js",
      "Docker",
      "Nginx",
      "PostgreSQL",
      "Redis",
      "Entity Framework Core",
      "TypeScript",
      "JWT Authentication",
      "CI/CD",
      "GitHub Actions",
      "Azure DevOps"
    ],
    "email": "ugurcanguden@gmail.com"
  };

  const stats = [
    { icon: Award, value: "5+", label: t("stats.experience") },
    { icon: Code2, value: "50+", label: t("stats.projects") },
    { icon: Target, value: "30+", label: t("stats.tools") },
    { icon: Globe, value: "10", label: t("stats.languages") },
  ];

  const experienceItems = [
    {
      icon: Monitor,
      title: t("experience.frontend.title"),
      description: t("experience.frontend.description"),
      color: "bg-blue-500"
    },
    {
      icon: Database,
      title: t("experience.backend.title"),
      description: t("experience.backend.description"),
      color: "bg-green-500"
    },
    {
      icon: Cloud,
      title: t("experience.devops.title"),
      description: t("experience.devops.description"),
      color: "bg-purple-500"
    },
    {
      icon: Smartphone,
      title: t("experience.mobile.title"),
      description: t("experience.mobile.description"),
      color: "bg-orange-500"
    }
  ];

  const philosophyItems = [
    {
      icon: Heart,
      title: t("philosophy.principle1.title"),
      description: t("philosophy.principle1.description"),
      color: "text-red-500"
    },
    {
      icon: Zap,
      title: t("philosophy.principle2.title"),
      description: t("philosophy.principle2.description"),
      color: "text-yellow-500"
    },
    {
      icon: Shield,
      title: t("philosophy.principle3.title"),
      description: t("philosophy.principle3.description"),
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: t("philosophy.principle4.title"),
      description: t("philosophy.principle4.description"),
      color: "text-blue-500"
    }
  ];

  return (
    <>
      {/* Person Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        suppressHydrationWarning
      />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{t("subtitle")}</h1>
          <p className="text-xl text-muted-foreground">{t("intro")}</p>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Experience Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">{t("experience.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experienceItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color} text-white`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Toolbox Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary" />
              {t("tools.title")}
            </CardTitle>
            <CardDescription className="text-lg">
              {t("tools.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">{t("tools.features.title")}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Badge key={i} variant="secondary" className="justify-center">
                    {t(`tools.features.feature${i}`)}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t("tools.tech.title")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Badge key={i} variant="outline" className="justify-start">
                    {t(`tools.tech.tech${i}`)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Philosophy Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">{t("philosophy.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {philosophyItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              {t("contact.title")}
            </CardTitle>
            <CardDescription className="text-lg">
              {t("contact.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <a href="mailto:ugurcanguden@gmail.com">
                  <Mail className="w-5 h-5" />
                  <span>{t("contact.email")}</span>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <a href="https://www.linkedin.com/in/u%C4%9Furcan-g%C3%BCden-5a982613a" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                  <span>{t("contact.linkedin")}</span>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                <a href="https://github.com/ugurcanguden" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  <span>{t("contact.github")}</span>
                </a>
              </Button>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-blue-700 dark:text-blue-300">
                {t("contact.message")}
              </p>
            </div>
          </CardContent>
        </Card>

        </div>
      </div>
    </>
  );
}
