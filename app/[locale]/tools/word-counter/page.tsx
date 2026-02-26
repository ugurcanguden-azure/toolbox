"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FileText, BarChart2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress, JsonLdTool, ToolSeoContent, ToolFaqSection, Textarea } from "@/components";
import { useParams } from "next/navigation";
import * as React from "react";

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it',
  'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these',
  'they', 'this', 'to', 'was', 'will', 'with'
]);

export default function WordCounterPage() {
  const t = useTranslations("tools.wordCounter");
  const tc = useTranslations("common");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const [text, setText] = useState("");

  const { stats, keywords } = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const wordsArray = text.trim() === "" ? [] : text.trim().toLowerCase().split(/[\s.,!?();:'""\-]+/);
    const words = wordsArray.filter(w => w.length > 0).length;
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\n+/).filter((p) => p.trim()).length;
    const lines = text === "" ? 0 : text.split(/\n/).length;
    const readingTime = Math.ceil(words / 200);

    // Calculate Keyword Density
    const wordCounts: Record<string, number> = {};
    let totalValidWords = 0;
    
    wordsArray.forEach(word => {
      if (word.length > 2 && !STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
        totalValidWords++;
      }
    });

    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percentage: totalValidWords > 0 ? ((count / words) * 100).toFixed(1) : "0" // Percentage relative to total words
      }));

    return { 
      stats: { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime },
      keywords: topKeywords
    };
  }, [text]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("textInput")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t("inputPlaceholder")}
                  value={text}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("statistics")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{t("characters")}</p>
                    <p className="text-3xl font-bold">{stats.characters}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{t("charactersNoSpaces")}</p>
                    <p className="text-3xl font-bold">{stats.charactersNoSpaces}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{t("words")}</p>
                    <p className="text-3xl font-bold">{stats.words}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{t("sentences")}</p>
                    <p className="text-3xl font-bold">{stats.sentences}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{t("paragraphs")}</p>
                    <p className="text-3xl font-bold">{stats.paragraphs}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{t("lines")}</p>
                    <p className="text-3xl font-bold">{stats.lines}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">{t("readingTime")} (~200 wpm)</p>
                    <p className="text-3xl font-bold">
                      {stats.readingTime} <span className="text-sm font-normal text-muted-foreground">{t("minutes")}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart2 className="w-5 h-5" />
                  Keyword Density
                </CardTitle>
                <CardDescription>
                  Top keywords excluding common stop words.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {keywords.length > 0 ? (
                  <div className="space-y-4">
                    {keywords.map((k, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium truncate max-w-[120px]" title={k.word}>{k.word}</span>
                          <span className="text-muted-foreground">{k.count} ({k.percentage}%)</span>
                        </div>
                        <Progress value={parseFloat(k.percentage) * 2} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Not enough text to analyze.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("info.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("info.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <ToolSeoContent toolId="wordCounter" />
      </div>
      <JsonLdTool 
        locale={locale}
        tool={{
          id: "word-counter",
          title: t("title"),
          description: t("description"),
          category: "utilities"
        }}
        faqs={[
          {
            question: locale === 'tr' ? "Kelime sayacı nasıl çalışır?" : "How does the word counter work?",
            answer: locale === 'tr' ? "Metninizi kutuya yapıştırdığınız anda kelime, karakter ve satır sayıları anlık olarak hesaplanır." : "As soon as you paste your text into the box, the word, character, and line counts are calculated instantly."
          }
        ]}
      />
      <ToolFaqSection toolId="wordCounter" />
    </div>
  );
}
