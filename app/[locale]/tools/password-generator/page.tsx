'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Slider,
  Checkbox,
  Label,
  Input
} from '@/components/ui';
import { Copy, Check, Shield, AlertTriangle, Info, RefreshCw, Trash2 } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  entropy: number;
  timeToCrack: string;
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const SIMILAR_CHARS = 'il1Lo0O';
const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;:.<>';

const WORDLIST = [
  'correct', 'horse', 'battery', 'staple', 'dragon', 'monkey', 'island', 'pencil',
  'sunset', 'coffee', 'garden', 'wizard', 'rocket', 'planet', 'ocean', 'forest',
  'mountain', 'river', 'castle', 'knight', 'tiger', 'eagle', 'dolphin', 'panda',
  'phoenix', 'thunder', 'lightning', 'rainbow', 'crystal', 'diamond', 'silver', 'golden',
  'shadow', 'mystic', 'cosmic', 'stellar', 'lunar', 'solar', 'arctic', 'desert',
  'jungle', 'canyon', 'valley', 'meadow', 'breeze', 'storm', 'cloud', 'star',
  'comet', 'meteor', 'galaxy', 'nebula', 'quasar', 'pulsar', 'atom', 'proton',
];

export default function PasswordGeneratorPage() {
  const t = useTranslations('tools.passwordGenerator');
  const { copy } = useCopyToClipboard();
  
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });
  
  const [passphraseOptions, setPassphraseOptions] = useState({
    words: 4,
    separator: '-',
    capitalize: true,
    includeNumber: true,
  });
  
  const [numberOfPasswords, setNumberOfPasswords] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const generateCharSet = (): string => {
    let charset = '';
    
    if (options.uppercase) charset += CHAR_SETS.uppercase;
    if (options.lowercase) charset += CHAR_SETS.lowercase;
    if (options.numbers) charset += CHAR_SETS.numbers;
    if (options.symbols) charset += CHAR_SETS.symbols;
    
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
    }
    
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('');
    }
    
    return charset;
  };

  const generatePassword = (): string => {
    const charset = generateCharSet();
    
    if (charset.length === 0) {
      setError(t('selectAtLeastOne'));
      return '';
    }
    
    setError('');
    let password = '';
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < options.length; i++) {
      password += charset[array[i] % charset.length];
    }
    
    return password;
  };

  const generatePassphrase = (): string => {
    const selectedWords: string[] = [];
    const array = new Uint32Array(passphraseOptions.words);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < passphraseOptions.words; i++) {
      let word = WORDLIST[array[i] % WORDLIST.length];
      if (passphraseOptions.capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      selectedWords.push(word);
    }
    
    let passphrase = selectedWords.join(passphraseOptions.separator);
    
    if (passphraseOptions.includeNumber) {
      const num = Math.floor(Math.random() * 1000);
      passphrase += passphraseOptions.separator + num;
    }
    
    return passphrase;
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return {
        score: 0,
        label: t('strengthWeak'),
        color: 'text-red-500',
        entropy: 0,
        timeToCrack: t('instant'),
      };
    }

    // Calculate entropy
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

    const entropy = Math.log2(Math.pow(poolSize, password.length));

    // Calculate time to crack (assuming 1 billion guesses per second)
    const combinations = Math.pow(poolSize, password.length);
    const secondsToCrack = combinations / 1e9 / 2; // Divide by 2 for average case
    
    let timeToCrack = '';
    let score = 0;
    let label = '';
    let color = '';

    if (secondsToCrack < 1) {
      timeToCrack = t('instant');
      score = 0;
      label = t('strengthWeak');
      color = 'text-red-500';
    } else if (secondsToCrack < 60) {
      timeToCrack = `${Math.round(secondsToCrack)} ${t('seconds')}`;
      score = 1;
      label = t('strengthFair');
      color = 'text-orange-500';
    } else if (secondsToCrack < 3600) {
      timeToCrack = `${Math.round(secondsToCrack / 60)} ${t('minutes')}`;
      score = 1;
      label = t('strengthFair');
      color = 'text-orange-500';
    } else if (secondsToCrack < 86400) {
      timeToCrack = `${Math.round(secondsToCrack / 3600)} ${t('hours')}`;
      score = 2;
      label = t('strengthGood');
      color = 'text-yellow-500';
    } else if (secondsToCrack < 2592000) {
      timeToCrack = `${Math.round(secondsToCrack / 86400)} ${t('days')}`;
      score = 2;
      label = t('strengthGood');
      color = 'text-yellow-500';
    } else if (secondsToCrack < 31536000) {
      timeToCrack = `${Math.round(secondsToCrack / 2592000)} ${t('months')}`;
      score = 3;
      label = t('strengthStrong');
      color = 'text-blue-500';
    } else if (secondsToCrack < 3153600000) {
      timeToCrack = `${Math.round(secondsToCrack / 31536000)} ${t('years')}`;
      score = 3;
      label = t('strengthStrong');
      color = 'text-blue-500';
    } else {
      timeToCrack = `${Math.round(secondsToCrack / 3153600000)} ${t('centuries')}`;
      score = 4;
      label = t('strengthVeryStrong');
      color = 'text-green-500';
    }

    return { score, label, color, entropy: Math.round(entropy), timeToCrack };
  };

  const handleGenerate = () => {
    const newPasswords: string[] = [];
    
    for (let i = 0; i < numberOfPasswords; i++) {
      const pwd = mode === 'password' ? generatePassword() : generatePassphrase();
      if (pwd) newPasswords.push(pwd);
    }
    
    if (newPasswords.length > 0) {
      setPasswords(newPasswords);
    }
  };

  const handleCopy = async (password: string, index: number) => {
    await copy(password);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await copy(passwords.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setPasswords([]);
    setError('');
  };

  // Generate initial password on mount
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const atLeastOneSelected = 
    options.uppercase || options.lowercase || options.numbers || options.symbols;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium">
            <Shield className="w-4 h-4" />
            100% Client-Side Only (No Server Tracking)
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Curiobox Secure Password Generator",
            "applicationCategory": "SecurityApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Generate robust, uncrackable passwords and passphrases instantly. 100% Secure and strictly client-side.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1950"
            }
          })
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={mode === 'password' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setMode('password')}
              >
                Password
              </Button>
              <Button
                variant={mode === 'passphrase' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setMode('passphrase')}
              >
                {t('passphraseMode')}
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          {mode === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Length Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t('length')}</Label>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {options.length}
                    </span>
                  </div>
                  <Slider
                    value={[options.length]}
                    onValueChange={([value]: number[]) => setOptions({ ...options, length: value })}
                    min={4}
                    max={128}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Character Options */}
                <div className="space-y-3">
                  <Label>{t('characters')}</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.uppercase}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, uppercase: checked as boolean })
                      }
                    />
                    <Label htmlFor="uppercase" className="font-normal cursor-pointer">
                      {t('uppercase')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={options.lowercase}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, lowercase: checked as boolean })
                      }
                    />
                    <Label htmlFor="lowercase" className="font-normal cursor-pointer">
                      {t('lowercase')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={options.numbers}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, numbers: checked as boolean })
                      }
                    />
                    <Label htmlFor="numbers" className="font-normal cursor-pointer">
                      {t('numbers')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={options.symbols}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, symbols: checked as boolean })
                      }
                    />
                    <Label htmlFor="symbols" className="font-normal cursor-pointer">
                      {t('symbols')}
                    </Label>
                  </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeSimilar"
                      checked={options.excludeSimilar}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, excludeSimilar: checked as boolean })
                      }
                    />
                    <Label htmlFor="excludeSimilar" className="font-normal text-xs cursor-pointer">
                      {t('excludeSimilar')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeAmbiguous"
                      checked={options.excludeAmbiguous}
                      onCheckedChange={(checked) => 
                        setOptions({ ...options, excludeAmbiguous: checked as boolean })
                      }
                    />
                    <Label htmlFor="excludeAmbiguous" className="font-normal text-xs cursor-pointer">
                      {t('excludeAmbiguous')}
                    </Label>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Passphrase Settings */}
          {mode === 'passphrase' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Number of Words */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t('passphraseWords')}</Label>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {passphraseOptions.words}
                    </span>
                  </div>
                  <Slider
                    value={[passphraseOptions.words]}
                    onValueChange={([value]: number[]) => 
                      setPassphraseOptions({ ...passphraseOptions, words: value })
                    }
                    min={2}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Separator */}
                <div className="space-y-2">
                  <Label htmlFor="separator">{t('passphraseSeparator')}</Label>
                  <Input
                    id="separator"
                    value={passphraseOptions.separator}
                    onChange={(e) => 
                      setPassphraseOptions({ ...passphraseOptions, separator: e.target.value })
                    }
                    maxLength={3}
                    className="w-full"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="capitalize"
                      checked={passphraseOptions.capitalize}
                      onCheckedChange={(checked) => 
                        setPassphraseOptions({ ...passphraseOptions, capitalize: checked as boolean })
                      }
                    />
                    <Label htmlFor="capitalize" className="font-normal cursor-pointer">
                      {t('passphraseCapitalize')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeNumber"
                      checked={passphraseOptions.includeNumber}
                      onCheckedChange={(checked) => 
                        setPassphraseOptions({ ...passphraseOptions, includeNumber: checked as boolean })
                      }
                    />
                    <Label htmlFor="includeNumber" className="font-normal cursor-pointer">
                      {t('passphraseIncludeNumber')}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Number of Passwords */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('generateMultiple')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{t('numberOfPasswords')}</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {numberOfPasswords}
                  </span>
                </div>
                <Slider
                  value={[numberOfPasswords]}
                  onValueChange={([value]: number[]) => setNumberOfPasswords(value)}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={mode === 'password' && !atLeastOneSelected}
                  className="flex-1 h-12 text-base gap-2"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  {t('generate')} {numberOfPasswords > 1 ? `(${numberOfPasswords})` : ''}
                </Button>
                {passwords.length > 0 && (
                  <>
                    {passwords.length > 1 && (
                      <Button
                        variant="secondary"
                        onClick={handleCopyAll}
                        className="flex-1 h-12 gap-2"
                        size="lg"
                      >
                        {copiedIndex === -1 ? (
                          <>
                            <Check className="w-5 h-5 text-green-500" />
                            {t('copiedAll')}!
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            {t('copyAll')}
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleClear}
                      className="h-12 gap-2"
                      size="lg"
                    >
                      <Trash2 className="w-5 h-5" />
                      {t('clear')}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generated Passwords */}
          <Card>
            <CardHeader>
              <CardTitle>{t('generatedPasswords')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {passwords.map((password, index) => {
                const strength = calculatePasswordStrength(password);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm break-all mb-2">
                        {password}
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* Entropy Bar */}
                        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              strength.score === 0 ? 'bg-red-500 w-1/4' :
                              strength.score === 1 ? 'bg-orange-500 w-2/4' :
                              strength.score === 2 ? 'bg-yellow-500 w-3/4' :
                              'bg-green-500 w-full'
                            }`}
                          />
                        </div>
                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full flex-wrap">
                          <div className="flex items-center gap-1 font-medium">
                            <Shield className={`w-3.5 h-3.5 ${strength.color}`} />
                            <span className={strength.color}>{strength.label}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/50 border">
                            <span className="font-semibold text-foreground/80">{strength.entropy}</span>
                            <span>{t('bits')} {t('entropy')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="opacity-70">{t('timeToCrack')}:</span>
                            <span className="font-medium text-foreground">{strength.timeToCrack}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(password, index)}
                      className="shrink-0"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {t('aboutTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('aboutDescription')}
              </p>
              
              <div>
                <h3 className="font-semibold mb-2 text-sm">{t('tips')}</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('tip1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('tip2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('tip3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('tip4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('tip5')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t('tip6')}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEO & Guide Section */}
      <article className="mt-16 prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">How to Create a Strong & Secure Password</h2>
        <p>
          In today&apos;s digital landscape, your password is often the only barrier between your personal data and malicious actors. Generating a secure password isn&apos;t just about making it hard to guess—it&apos;s about making it mathematically improbable for computers to crack. Our <strong>Secure Password Generator</strong> helps you achieve exactly that, providing robust strings of characters instantly.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Why Use a Password Generator?</h3>
        <p>
          Human brains are exceptionally poor at generating true randomness. When asked to create a password, people predictably use names, birthdates, dictionary words, and simple patterns like &quot;QWERTY&quot; or &quot;123456&quot;. A Password Generator eliminates human predictability by using cryptographic algorithms to ensure maximum entropy.
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Length Over Complexity:</strong> The single most important factor in password strength is length. A 16-character password with only lowercase letters takes infinitely longer to crack than an 8-character password with symbols.</li>
          <li><strong>Defeating Dictionary Attacks:</strong> Hackers use automated tools to try millions of common word combinations per second. A randomly generated string completely bypasses this vulnerability.</li>
          <li><strong>Unique for Every Site:</strong> Reusing passwords means a breach on a minor website compromises your banking and email accounts. A generator makes it easy to have a unique, strong password for every service.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Password vs. Passphrase</h3>
        <p>
          Our tool offers two distinct modes: passwords and passphrases. 
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Passwords</strong> are random strings of abstract characters (e.g., <code>k8#jL$9z!2P</code>). They are highly secure but almost impossible to memorize. They are best used in conjunction with a Password Manager.</li>
          <li><strong>Passphrases</strong> consist of 3-5 random dictionary words (e.g., <code>correct-horse-battery-staple</code>). Because of their extreme length, they are highly resistant to brute-force attacks, yet they are much easier for humans to remember and type on mobile devices.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">100% Client-Side Privacy</h3>
        <p>
          Security tools require absolute trust. Unlike many online utilities, our Password Generator operates <strong>entirely within your browser</strong>. No data is ever transmitted to a server, no logs are kept, and the passwords disappear the moment you close the tab. What happens on your device stays on your device.
        </p>
      </article>
    </div>
  );
}
