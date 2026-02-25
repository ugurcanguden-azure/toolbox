import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PrivacyBadgeProps {
  className?: string;
}

export function PrivacyBadge({ className }: PrivacyBadgeProps) {
  const t = useTranslations("common");
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium",
        className
      )}
      title="This tool runs entirely in your browser. No data is sent to external servers."
    >
      <Shield className="w-4 h-4" />
      {t("privacyClientSideOnly")}
    </div>
  );
}
