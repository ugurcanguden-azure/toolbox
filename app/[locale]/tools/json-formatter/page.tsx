'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Editor from '@monaco-editor/react';
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea, JsonTreeViewer, PrivacyBadge } from '@/components';
import { Copy, Check, AlertCircle, Code2, TreePine, Download, FileJson, Search, ChevronsDownUp, ChevronsUpDown, CopyMinus } from 'lucide-react';
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
  const [autoFormat, setAutoFormat] = React.useState(false);
  const { copied, copy } = useCopyToClipboard();
  const [copiedString, setCopiedString] = React.useState(false);
  const { theme } = useTheme();

  const handleCopyString = () => {
    try {
      if (!output) return;
      const parsed = JSON.parse(output);
      const stringified = JSON.stringify(JSON.stringify(parsed));
      copy(stringified);
      setCopiedString(true);
      setTimeout(() => setCopiedString(false), 2000);
    } catch {
      // ignore
    }
  };

  const getErrorLineNumber = (input: string, errorMessage: string) => {
    // Attempt to match common JSON parse error formats like "position 123"
    const positionMatch = errorMessage.match(/position (\d+)/);
    if (positionMatch && positionMatch[1]) {
      const position = parseInt(positionMatch[1], 10);
      const textUntilError = input.substring(0, position);
      const lineNumber = textUntilError.split('\n').length;
      return `Line ${lineNumber}: ${errorMessage}`;
    }
    return errorMessage;
  };

  const formatJson = (textToFormat: string = input) => {
    if (!textToFormat.trim()) return;
    try {
      const parsed = JSON.parse(textToFormat);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setParsedJson(parsed);
      setError('');
      if (textToFormat !== input) setInput(formatted); // Update input if called from auto-format
      else setInput(formatted);
    } catch (e: any) {
      const errorStr = e instanceof Error ? e.message : String(e);
      setError(t('invalidJson') + ' - ' + getErrorLineNumber(textToFormat, errorStr));
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleInputChange = (val: string | undefined) => {
    const value = val || '';
    setInput(value);
    
    // Auto format if pasting a large chunk assuming user wants it formatted immediately
    if (autoFormat && (value.trim().startsWith('{') || value.trim().startsWith('['))) {
      try {
        JSON.parse(value);
        // If it parses successfully and autoFormat is on, format it.
      } catch (e) {
        // do nothing
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (!autoFormat) return;
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText.trim()) return;
    
    try {
      const parsed = JSON.parse(pastedText);
      const formatted = JSON.stringify(parsed, null, 2);
      // Wait for React to update the input state from onChange first, then override
      setTimeout(() => {
        setInput(formatted);
        setOutput(formatted);
        setParsedJson(parsed);
        setError('');
      }, 10);
    } catch {
      // Ignore paste formatting if invalid
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is JSON?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate."
        }
      },
      {
        "@type": "Question",
        "name": "Why do I need to validate JSON?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Validating JSON ensures that your data structure follows the strict JSON syntax rules. Invalid JSON will cause parsing errors in your applications."
        }
      },
      {
        "@type": "Question",
        "name": "How do I format JSON automatically?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can paste your JSON code into the editor and click the 'Format' button. You can also enable 'Auto-format on paste' for instant beautification."
        }
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <PrivacyBadge />
            <Button onClick={loadSampleJson} variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
              <FileJson className="h-4 w-4" />
              {tc('loadSample')}
            </Button>
          </div>
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
      {/* <InArticleAd dataAdSlot="1111111111" /> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('input')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm mb-2">
                <input 
                  type="checkbox" 
                  checked={autoFormat} 
                  onChange={(e) => setAutoFormat(e.target.checked)} 
                  className="rounded border-gray-300"
                />
                Auto-format on paste
              </label>
            </div>
            <div className="h-[400px] border rounded-md overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="json"
                value={input}
                onChange={handleInputChange}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  formatOnPaste: autoFormat,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 2,
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => formatJson(input)}>{t('format')}</Button>
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
                      onClick={handleCopyString}
                      className="h-8"
                      title="Copy as stringified JSON"
                    >
                      {copiedString ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Stringified!
                        </>
                      ) : (
                        <>
                          <CopyMinus className="h-4 w-4 mr-2" />
                          Escape
                        </>
                      )}
                    </Button>
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
      {/* <InArticleAd dataAdSlot="2222222222" /> */}

      {/* SEO & Guide Section */}
      <article className="mt-16 prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Ultimate JSON Formatter & Validator Guide</h2>
        <p>
          JSON (JavaScript Object Notation) has become the de facto standard for data interchange on the modern web. However, working with raw, minified JSON data can be a daunting task for developers. Our advanced <strong>JSON Formatter and Validator</strong> is designed to simplify your workflow by transforming unreadable strings into beautifully structured, syntax-highlighted code.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Why Use a JSON Formatter?</h3>
        <p>
          When interacting with APIs, databases, or configuration files, you often encounter JSON data packed into a single, dense line to save bandwidth. While this is efficient for machines, humans need structure. A JSON Formatter instantly:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Beautifies Data:</strong> Adds proper indentation (usually 2 or 4 spaces) and line breaks, making the hierarchy of objects and arrays visually clear.</li>
          <li><strong>Enhances Readability:</strong> With features like syntax highlighting, it becomes easier to distinguish between strings, numbers, booleans, and null values.</li>
          <li><strong>Saves Time:</strong> Instead of manually tracking nested brackets and braces, the tool organizes everything instantly.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">The Critical Role of JSON Validation</h3>
        <p>
          Syntax errors in JSON are a common source of bugs in software development. Even a single misplaced comma or a missing quotation mark can break an entire application parsing the payload. Our JSON Validator acts as your first line of defense:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Strict Syntax Checking:</strong> Adheres to RFC 8259 standards to ensure your JSON is 100% compliant.</li>
          <li><strong>Detailed Error Reporting:</strong> Instead of a generic failure, our tool pinpoints the exact line number where the error occurred (e.g., &quot;Unexpected token ] at Line 42&quot;), drastically reducing debugging time.</li>
          <li><strong>Confidence in Deployment:</strong> Always validate your JSON payloads here before committing them to configuration files or sending them through API requests.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Advanced Features for Power Users</h3>
        <p>
          Beyond simple formatting and validation, our free online JSON tool offers several advanced capabilities:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Tree View Mode:</strong> Navigate massive JSON files effortlessly by collapsing and expanding object nodes. Perfect for exploring complex, deeply nested API responses.</li>
          <li><strong>Auto-Format on Paste:</strong> Enable this toggle to instantly beautify your JSON the moment it hits the editor, streamlining your workflow.</li>
          <li><strong>Minification:</strong> Need to compress your JSON for production? Our minify feature strips out all whitespace, minimizing the payload size for optimal transfer speeds.</li>
          <li><strong>100% Client-Side Privacy:</strong> Your data never leaves your browser. All formatting and validation processes happen locally on your device, ensuring maximum security for your sensitive information.</li>
        </ul>
      </article>
    </div>
  );
}

