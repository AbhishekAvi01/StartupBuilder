import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy, Check } from "lucide-react";

interface ResultCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  defaultOpen?: boolean;
}

export const ResultCard = ({
  title,
  content,
  icon,
  isLoading = false,
  defaultOpen = false,
}: ResultCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border border-border bg-card hover:border-brand-primary/50 transition-colors">
      <div
        className="flex items-center justify-between p-6 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-brand-primary">
            {icon}
          </div>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            {isLoading && (
              <p className="text-sm text-muted-foreground mt-1">
                Generating content...
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {content && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-border pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : content ? (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {content}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No content available</p>
          )}
        </div>
      )}
    </Card>
  );
};
