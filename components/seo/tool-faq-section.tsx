'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

interface Faq {
  question: string;
  answer: string;
}

interface ToolFaqSectionProps {
  toolId: string;
}

function FaqItem({ faq, isOpen, onToggle }: { faq: Faq; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-muted/40 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-base">{faq.question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-primary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-4 pt-1 text-muted-foreground leading-relaxed border-t border-border/50">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

export function ToolFaqSection({ toolId }: ToolFaqSectionProps) {
  const t = useTranslations(`tools.${toolId}.seo`);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  let faqs: Faq[] = [];
  try {
    faqs = t.raw('faqs') as Faq[];
  } catch {
    return null;
  }

  if (!faqs || faqs.length === 0) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-16 space-y-6 border-t pt-12">
      {/* JSON-LD FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Visual FAQ Accordion */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircleQuestion className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{t('faqTitle')}</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}
