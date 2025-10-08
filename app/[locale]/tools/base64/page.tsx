'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea, InArticleAd } from '@/components';
import { Copy, Check, AlertCircle, ArrowLeftRight, Upload, Download, FileText } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';

type Mode = 'encode' | 'decode';

const SAMPLE_TEXT = 'Hello World! This is a sample text for Base64 encoding. 🚀';
const SAMPLE_BASE64 = 'SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBzYW1wbGUgdGV4dCBmb3IgQmFzZTY0IGVuY29kaW5nLiDwn5qA';

export default function Base64Page() {
  const t = useTranslations('tools.base64');
  const tc = useTranslations('common');
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [mode, setMode] = React.useState<Mode>('encode');
  const [fileName, setFileName] = React.useState('');
  const { copied: copiedInput, copy: copyInput } = useCopyToClipboard();
  const { copied: copiedOutput, copy: copyOutput } = useCopyToClipboard();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleEncode = () => {
    try {
      if (!input) {
        setError('Please enter text to encode');
        setOutput('');
        return;
      }
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
    } catch (e) {
      setError('Failed to encode. Invalid characters?');
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      if (!input) {
        setError('Please enter Base64 to decode');
        setOutput('');
        return;
      }
      const decoded = decodeURIComponent(escape(atob(input.trim())));
      setOutput(decoded);
      setError('');
    } catch (e) {
      setError('Invalid Base64 string');
      setOutput('');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    
    // Swap input and output if both have values
    if (input && output) {
      const temp = input;
      setInput(output);
      setOutput(temp);
    }
    setError('');
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput(SAMPLE_TEXT);
      const encoded = btoa(unescape(encodeURIComponent(SAMPLE_TEXT)));
      setOutput(encoded);
    } else {
      setInput(SAMPLE_BASE64);
      const decoded = decodeURIComponent(escape(atob(SAMPLE_BASE64)));
      setOutput(decoded);
    }
    setError('');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setFileName('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (mode === 'encode') {
          // For encode mode, convert file to base64
          const base64 = result.split(',')[1]; // Remove data:*/*;base64, prefix
          setInput(file.name); // Show filename in input
          setOutput(base64);
        } else {
          // For decode mode, treat file content as base64 string
          setInput(result);
        }
        setError('');
      } catch (err) {
        setError('Failed to read file');
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    if (mode === 'encode') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const downloadOutput = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsFile = () => {
    if (!output || mode !== 'decode') return;

    try {
      // Try to decode base64 to binary
      const binaryString = atob(output);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'decoded-file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError('Failed to convert to file. Invalid Base64?');
    }
  };

  const autoDetect = () => {
    if (!input.trim()) return;

    // Simple heuristic: if it looks like base64, switch to decode
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    const looksLikeBase64 = base64Regex.test(input.trim());

    if (looksLikeBase64 && mode === 'encode') {
      setMode('decode');
      handleDecode();
    } else if (!looksLikeBase64 && mode === 'decode') {
      setMode('encode');
      handleEncode();
    } else {
      handleProcess();
    }
  };

  const getCharCount = () => {
    return {
      input: input.length,
      output: output.length,
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
          <div className="flex gap-2">
            <Button onClick={loadSample} variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              {tc('sample')}
            </Button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
            <span className={`font-medium ${mode === 'encode' ? 'text-primary' : 'text-muted-foreground'}`}>
              Encode
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMode}
              className="h-8 w-8 p-0"
              title="Toggle mode"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <span className={`font-medium ${mode === 'decode' ? 'text-primary' : 'text-muted-foreground'}`}>
              Decode
            </span>
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
              </>
            )}
            {fileName && (
              <>
                <span>•</span>
                <span>{tc('file')}: <strong>{fileName}</strong></span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{mode === 'encode' ? 'Text Input' : 'Base64 Input'}</CardTitle>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8"
                  title={tc('uploadFile')}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                {input && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyInput(input)}
                    className="h-8"
                  >
                    {copiedInput ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleProcess}>
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </Button>
              <Button onClick={autoDetect} variant="secondary">
                Auto Detect
              </Button>
              <Button onClick={clearAll} variant="outline">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{mode === 'encode' ? 'Base64 Output' : 'Decoded Output'}</CardTitle>
              <div className="flex gap-2">
                {output && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={downloadOutput}
                      className="h-8"
                      title={tc('downloadAsText')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {mode === 'decode' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={downloadAsFile}
                        className="h-8"
                        title={tc('downloadAsFile')}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyOutput(output)}
                      className="h-8"
                    >
                      {copiedOutput ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 text-destructive mb-4">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <Textarea
              value={output}
              readOnly
              placeholder={mode === 'encode' ? 'Base64 output will appear here...' : 'Decoded text will appear here...'}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold mb-2">💡 About Base64</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format. 
          It&apos;s commonly used to encode binary data for transmission over text-based protocols.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>Use Cases:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Email attachments (MIME)</li>
              <li>Data URLs in HTML/CSS</li>
              <li>JWT tokens</li>
              <li>API authentication</li>
            </ul>
          </div>
          <div>
            <strong>Features:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>UTF-8 support (emojis ✅)</li>
              <li>File encoding/decoding</li>
              <li>Auto-detection</li>
              <li>Copy & download</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ad - After Info */}
      <InArticleAd dataAdSlot="3333333333" />
    </div>
  );
}

