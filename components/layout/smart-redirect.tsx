"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner"; // Assuming sonner is used or standard toast

// Very basic heuristics for detecting data types
const isBase64 = (str: string) => {
  if (str === '' || str.trim() === '') return false;
  // A simple regex just to catch obvious long base64 strings that aren't just normal text
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return str.length > 20 && base64Regex.test(str.trim());
};

const isJson = (str: string) => {
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const isJwt = (str: string) => {
  const parts = str.split('.');
  return parts.length === 3 && isBase64(parts[0]) && isBase64(parts[1]);
};

export function SmartRedirectListener({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept if they are already on the correct tool page
      const currentTool = pathname.split('/').pop() || '';
      
      const pastedText = e.clipboardData?.getData('text');
      if (!pastedText) return;

      if (isJwt(pastedText) && currentTool !== 'jwt-decoder') {
        toast("Looks like a JWT token!", {
          description: "Want to decode it?",
          action: {
            label: "Go to Decoder",
            onClick: () => router.push(`/${locale}/tools/jwt-decoder`),
          },
          duration: 5000,
        });
        return;
      }

      if (isJson(pastedText) && currentTool !== 'json-formatter') {
        toast("Looks like JSON data!", {
          description: "Want to format or validate it?",
          action: {
            label: "Go to Formatter",
            onClick: () => router.push(`/${locale}/tools/json-formatter`),
          },
          duration: 5000,
        });
        return;
      }

      if (isBase64(pastedText) && currentTool !== 'base64' && !isJwt(pastedText)) {
        toast("Looks like Base64 encoded string!", {
          description: "Want to decode it?",
          action: {
            label: "Go to Base64 Decoder",
            onClick: () => router.push(`/${locale}/tools/base64`),
          },
          duration: 5000,
        });
        return;
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [pathname, router, locale]);

  return null; // This is a logic-only component
}
