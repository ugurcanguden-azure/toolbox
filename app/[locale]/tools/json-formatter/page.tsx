'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea, JsonTreeViewer, InArticleAd } from '@/components';
import { Copy, Check, AlertCircle, Code2, TreePine, Download, FileJson, Search, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';

type ViewMode = 'formatted' | 'tree';

const SAMPLE_JSON = {
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "isActive": true,
    "roles": ["admin", "user"],
    "profile": {
      "age": 30,
      "location": "San Francisco",
      "preferences": {
        "theme": "dark",
        "notifications": true
      }
    }
  },
  "posts": [
    {
      "id": 101,
      "title": "First Post",
      "content": "This is a sample JSON data",
      "tags": ["sample", "json", "demo"]
    },
    {
      "id": 102,
      "title": "Second Post",
      "content": "Another example",
      "tags": ["example"]
    }
  ],
  "meta": {
    "version": "1.0.0",
    "timestamp": "2025-10-07T12:00:00Z"
  }
};

export default function JsonFormatterPage() {
  const t = useTranslations('tools.jsonFormatter');
  const tc = useTranslations('common');
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [parsedJson, setParsedJson] = React.useState<any>(null);
  const [error, setError] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('tree');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandAll, setExpandAll] = React.useState(true);
  const { copied, copy } = useCopyToClipboard();

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setParsedJson(parsed);
      setError('');
    } catch (e) {
      setError(t('invalidJson'));
      setOutput('');
      setParsedJson(null);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setParsedJson(parsed);
      setError('');
    } catch (e) {
      setError(t('invalidJson'));
      setOutput('');
      setParsedJson(null);
    }
  };

  const validateJson = () => {
    try {
      const parsed = JSON.parse(input);
      setParsedJson(parsed);
      setError('');
      alert(t('validJson'));
    } catch (e) {
      setError(t('invalidJson'));
      setParsedJson(null);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setParsedJson(null);
    setError('');
  };

  const handleCopy = () => {
    copy(output);
  };

  const loadSampleJson = () => {
    const sampleString = JSON.stringify(SAMPLE_JSON, null, 2);
    setInput(sampleString);
    setOutput(sampleString);
    setParsedJson(SAMPLE_JSON);
    setError('');
  };

  const downloadJson = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  const getCharCount = () => {
    return {
      input: input.length,
      output: output.length,
      reduction: input.length > 0 && output.length > 0 
        ? Math.round(((input.length - output.length) / input.length) * 100)
        : 0
    };
  };

  const charCount = getCharCount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <Button onClick={loadSampleJson} variant="outline" size="sm" className="gap-2">
            <FileJson className="h-4 w-4" />
            {tc('loadSample')}
          </Button>
        </div>
        
        {/* Stats Bar */}
        {(input || output) && (
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-md">
            <span>Input: <strong>{charCount.input}</strong> chars</span>
            {output && (
              <>
                <span>•</span>
                <span>Output: <strong>{charCount.output}</strong> chars</span>
                {charCount.reduction !== 0 && (
                  <>
                    <span>•</span>
                    <span className={charCount.reduction > 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>
                      {charCount.reduction > 0 ? '↓' : '↑'} {Math.abs(charCount.reduction)}% size
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Ad - Before Tool */}
      <InArticleAd dataAdSlot="1111111111" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('input')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={formatJson}>{t('format')}</Button>
              <Button onClick={minifyJson} variant="secondary">
                {t('minify')}
              </Button>
              <Button onClick={validateJson} variant="outline">
                {t('validate')}
              </Button>
              <Button onClick={clearAll} variant="outline">
                {t('clear')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <CardTitle>{t('output')}</CardTitle>
              <div className="flex items-center gap-2">
                {parsedJson && (
                  <div className="flex items-center gap-1 border rounded-md p-1">
                    <Button
                      size="sm"
                      variant={viewMode === 'tree' ? 'secondary' : 'ghost'}
                      onClick={() => setViewMode('tree')}
                      className="h-7 px-2"
                    >
                      <TreePine className="h-3.5 w-3.5 mr-1" />
                      Tree
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'formatted' ? 'secondary' : 'ghost'}
                      onClick={() => setViewMode('formatted')}
                      className="h-7 px-2"
                    >
                      <Code2 className="h-3.5 w-3.5 mr-1" />
                      Code
                    </Button>
                  </div>
                )}
                {output && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={downloadJson}
                      className="h-8"
                      title="Download JSON"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="h-8"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          {t('copy')}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Search and Expand/Collapse for Tree View */}
            {parsedJson && viewMode === 'tree' && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={tc('searchInJson')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleExpandAll}
                  className="h-9 gap-2"
                  title={expandAll ? 'Collapse All' : 'Expand All'}
                >
                  {expandAll ? (
                    <>
                      <ChevronsUpDown className="h-4 w-4" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronsDownUp className="h-4 w-4" />
                      Expand
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 text-destructive mb-4">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {viewMode === 'tree' && parsedJson ? (
              <div className="border rounded-md bg-muted/30 min-h-[400px] max-h-[600px] overflow-auto">
                <JsonTreeViewer 
                  data={parsedJson} 
                  searchTerm={searchTerm}
                  expandAll={expandAll}
                />
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                placeholder={t('output')}
                className="min-h-[400px] font-mono text-sm"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ad - After Tool */}
      <InArticleAd dataAdSlot="2222222222" />
    </div>
  );
}

