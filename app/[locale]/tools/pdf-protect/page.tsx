"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { FileUp, FileOutput, Download, AlertCircle, Loader2, X, FileText, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { protectPdf } from "@/app/actions/pdf-actions";
import { toast } from "sonner";

export default function PdfProtectPage() {
  const t = useTranslations("tools.pdfProtect");
  const tc = useTranslations("common");

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);
    setSuccess(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      setError(t("invalidFile"));
    }
  }, [t]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else if (selectedFile) {
      setError(t("invalidFile"));
    }
  }, [t]);

  const handleProtect = async () => {
    if (!file || !password) return;

    setIsConverting(true);
    setError(null);
    setSuccess(false);
    setProgress(10);
    setProgressText(t("uploading"));

    // Simulate progress steps
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 60) setProgressText(t("processing"));
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append("fileInput", file);
      formData.append("password", password);

      const result = await protectPdf(formData);

      clearInterval(progressInterval);

      if (result.error) {
        setError(result.error);
        setProgress(0);
        toast.error(t("errorTitle"), { description: result.error });
      } else if (result.data) {
        setProgressText(t("downloading"));
        setProgress(100);
        setSuccess(true);
        toast.success(t("successToast"));

        // Trigger download
        const byteArray = Uint8Array.from(atob(result.data.base64), (c) => c.charCodeAt(0));
        const blob = new Blob([byteArray], { type: result.data.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.data.fileName || file.name.replace(".pdf", "-protected.pdf");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {
      clearInterval(progressInterval);
      setError(t("unexpectedError"));
      setProgress(0);
      toast.error(t("errorTitle"), { description: t("unexpectedError") });
    } finally {
      setIsConverting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPassword("");
    setError(null);
    setSuccess(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center 
                border-2 border-dashed rounded-xl p-12 cursor-pointer
                transition-all duration-300
                ${isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }
              `}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4
                transition-colors duration-300
                ${isDragging ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
              `}>
                <FileUp className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium mb-1">{t("dropzone")}</p>
              <p className="text-sm text-muted-foreground">{t("dropzoneHint")}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  disabled={isConverting}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t("passwordLabel")}
                </label>
                <Input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  disabled={isConverting}
                />
              </div>

              {/* Progress Bar */}
              {isConverting && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {progressText || t("processing")}
                    </span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Success State */}
              {success && !isConverting && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg animate-in fade-in duration-300">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">{t("success")}</span>
                </div>
              )}

              {/* Convert Button */}
              <Button
                onClick={handleProtect}
                disabled={isConverting || !password}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("protecting")}
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    {t("protectButton")}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 text-destructive rounded-xl mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{t("errorTitle")}</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("aboutTitle")}</CardTitle>
          <CardDescription>{t("aboutDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t("feature1")}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t("feature2")}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t("feature3")}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
