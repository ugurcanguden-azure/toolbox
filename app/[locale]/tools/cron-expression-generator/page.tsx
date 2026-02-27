'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import cronstrue from 'cronstrue/i18n';
import * as cronParser from 'cron-parser';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  JsonLdTool,
} from '@/components';
import { Copy, AlertCircle, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';

const LOCALE_MAP: Record<string, string> = {
  en: 'en',
  tr: 'tr',
  de: 'de',
  fr: 'fr',
  pt: 'pt_BR',
  es: 'es',
  it: 'it',
  nl: 'nl',
  ja: 'ja',
  ru: 'ru',
};

type CronTemplate = {
  key: string;
  expression: string;
};

const CRON_TEMPLATES: CronTemplate[] = [
  { key: 'everyHour', expression: '0 * * * *' },
  { key: 'dailyMidnight', expression: '0 0 * * *' },
  { key: 'weekdaysAt9', expression: '0 9 * * 1-5' },
  { key: 'everyWeekend', expression: '0 0 * * 6,0' },
  { key: 'every15Minutes', expression: '*/15 * * * *' },
  { key: 'firstDayOfMonth', expression: '0 0 1 * *' },
];

function getNextRuns(expression: string, count = 10): Date[] {
  if (!expression.trim()) return [];

  try {
    const parserAny = cronParser as any;
    let interval: any;

    if (typeof parserAny.parseExpression === 'function') {
      interval = parserAny.parseExpression(expression, { currentDate: new Date() });
    } else if (parserAny.CronExpressionParser?.parse) {
      interval = parserAny.CronExpressionParser.parse(expression, { currentDate: new Date() });
    } else {
      return [];
    }

    const runs: Date[] = [];
    for (let i = 0; i < count; i += 1) {
      const nextValue = interval.next();
      if (!nextValue) break;
      const nextDate = typeof nextValue.toDate === 'function' ? nextValue.toDate() : new Date(nextValue);
      runs.push(nextDate);
    }

    return runs;
  } catch {
    return [];
  }
}

export default function CronExpressionGeneratorPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const cronstrueLocale = LOCALE_MAP[locale] || 'en';

  const t = useTranslations('tools.cronExpressionGenerator');
  const { copied, copy } = useCopyToClipboard();

  const [expression, setExpression] = React.useState('');
  const [humanText, setHumanText] = React.useState('');
  const [parseError, setParseError] = React.useState('');
  const [nextRuns, setNextRuns] = React.useState<Date[]>([]);

  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'full',
        timeStyle: 'medium',
      }),
    [locale]
  );

  const examples = (t.raw('examples.items') as string[]) || [];
  const commonExamples = (t.raw('seoContent.commonExamples.items') as string[]) || [];

  React.useEffect(() => {
    const value = expression.trim();
    if (!value) {
      setHumanText('');
      setParseError('');
      setNextRuns([]);
      return;
    }

    const parts = value.split(/\s+/);
    if (parts.length !== 5) {
      setHumanText('');
      setNextRuns([]);
      setParseError(t('invalidCron'));
      return;
    }

    try {
      const text = cronstrue.toString(value, {
        locale: cronstrueLocale,
        throwExceptionOnParseError: true,
        verbose: true,
      });
      setHumanText(text);
      setParseError('');
      setNextRuns(getNextRuns(value, 10));
    } catch {
      setHumanText('');
      setNextRuns([]);
      setParseError(t('parseError'));
    }
  }, [expression, cronstrueLocale, t]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('inputLabel')}</CardTitle>
              <CardDescription>{t('placeholder')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="0 0 * * *"
                className="font-mono"
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setExpression('0 0 * * *')}>
                  {t('sample')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setExpression('')}>
                  {t('clear')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copy(expression)}
                  disabled={!expression}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {t('copy')}
                </Button>
              </div>
              {parseError && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded p-3">
                  <AlertCircle className="h-4 w-4" />
                  {parseError}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('templates.title')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CRON_TEMPLATES.map((template) => (
                <button
                  key={template.key}
                  type="button"
                  onClick={() => setExpression(template.expression)}
                  className="text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium text-sm">{t(`templates.${template.key}`)}</div>
                  <code className="text-xs text-muted-foreground">{template.expression}</code>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('explainer.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{humanText || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('nextRuns.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {nextRuns.length === 0 ? (
                <p className="text-muted-foreground">{t('nextRuns.empty')}</p>
              ) : (
                <ul className="space-y-2">
                  {nextRuns.map((date, index) => (
                    <li key={`${date.toISOString()}-${index}`} className="text-sm">
                      {index + 1}. {formatter.format(date)}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('fieldsInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-mono">1</span> - {t('fieldsInfo.minute')}
              </p>
              <p>
                <span className="font-mono">2</span> - {t('fieldsInfo.hour')}
              </p>
              <p>
                <span className="font-mono">3</span> - {t('fieldsInfo.dayOfMonth')}
              </p>
              <p>
                <span className="font-mono">4</span> - {t('fieldsInfo.month')}
              </p>
              <p>
                <span className="font-mono">5</span> - {t('fieldsInfo.dayOfWeek')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('examples.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {examples.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-12 border-t pt-10 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">{t('seoContent.whatIsCron.title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seoContent.whatIsCron.body')}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">{t('seoContent.starsMeaning.title')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('seoContent.starsMeaning.body')}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3">{t('seoContent.commonExamples.title')}</h2>
          <ul className="space-y-2">
            {commonExamples.map((item, index) => (
              <li key={`${item}-${index}`} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLdTool
        locale={locale}
        tool={{
          id: 'cron-expression-generator',
          title: t('title'),
          description: t('description'),
          category: 'utilities',
        }}
      />
    </div>
  );
}
