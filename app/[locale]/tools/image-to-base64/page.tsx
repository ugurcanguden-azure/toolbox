"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Image as ImageIcon, Copy, Download, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks";

interface ImageInfo {
  name: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
}

export default function ImageToBase64Page() {
  const t = useTranslations("tools.imageToBase64");
  const tCommon = useTranslations("common");
  const { copy } = useCopyToClipboard();

  const [base64, setBase64] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      setDataUrl(result);
      setPreview(result);

      // Extract base64 (remove data:image/...;base64, prefix)
      const base64String = result.split(",")[1];
      setBase64(base64String);

      // Get image info
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          mimeType: file.type,
        });
      };
      img.src = result;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };

  const handleClear = () => {
    setBase64("");
    setDataUrl("");
    setPreview("");
    setImageInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadBase64 = () => {
    const blob = new Blob([base64], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "base64.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {t("uploadImage")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">{t("uploadImage")}</p>
              <p className="text-sm text-muted-foreground">{t("dragDrop")}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {preview && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {t("preview")}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <X className="h-4 w-4 mr-2" />
                  {t("clear")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-4 bg-muted rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="max-w-full max-h-96 object-contain" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Info */}
        {imageInfo && (
          <Card>
            <CardHeader>
              <CardTitle>{t("imageInfo")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("fileName")}</p>
                  <p className="text-sm font-mono">{imageInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("fileSize")}</p>
                  <p className="text-sm font-mono">{(imageInfo.size / 1024).toFixed(2)} KB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("dimensions")}</p>
                  <p className="text-sm font-mono">
                    {imageInfo.width} × {imageInfo.height}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("mimeType")}</p>
                  <p className="text-sm font-mono">{imageInfo.mimeType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Base64 Output */}
        {base64 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("base64Output")}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(base64)}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t("copyBase64")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => copy(dataUrl)}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t("copyDataUrl")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadBase64}>
                    <Download className="h-4 w-4 mr-2" />
                    {t("downloadBase64")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={base64} readOnly className="min-h-[200px] font-mono text-xs" />
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t("info.title")}</CardTitle>
            <CardDescription>{t("info.description")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
