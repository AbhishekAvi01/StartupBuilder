import { useEffect, useRef } from "react";
import { ResultCard } from "./ResultCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, TrendingUp, Layout, Presentation } from "lucide-react";

interface DashboardProps {
  results: {
    problemSolution: string;
    marketResearch: string;
    businessModel: string;
    pitchDeck: string;
  };
  loading: {
    problemSolution: boolean;
    marketResearch: boolean;
    businessModel: boolean;
    pitchDeck: boolean;
  };
  onReset: () => void;
  originalIdea: string;
}

export const Dashboard = ({ results, loading, onReset, originalIdea }: DashboardProps) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to latest completed section
    const hasContent = Object.values(results).some(r => r);
    if (hasContent && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  const sections = [
    {
      title: "Problem-Solution Fit",
      key: "problemSolution" as const,
      icon: <Lightbulb className="w-5 h-5" />,
    },
    {
      title: "Market Research",
      key: "marketResearch" as const,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Business Model Canvas",
      key: "businessModel" as const,
      icon: <Layout className="w-5 h-5" />,
    },
    {
      title: "Pitch Deck Content",
      key: "pitchDeck" as const,
      icon: <Presentation className="w-5 h-5" />,
    },
  ];

  return (
    <div ref={dashboardRef} className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 animate-fade-in">
          <Button
            variant="ghost"
            onClick={onReset}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          
          <div className="bg-secondary/50 border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Your Idea
            </h2>
            <p className="text-base">{originalIdea}</p>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Analysis Results
            </h1>
            <p className="text-muted-foreground">
              Comprehensive breakdown of your startup concept
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={section.key} style={{ animationDelay: `${index * 100}ms` }}>
              <ResultCard
                title={section.title}
                content={results[section.key]}
                icon={section.icon}
                isLoading={loading[section.key]}
                defaultOpen={index === 0}
              />
            </div>
          ))}
        </div>

        {!Object.values(loading).some(l => l) && Object.values(results).every(r => r) && (
          <div className="mt-8 bg-card border border-border rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Analysis Complete
            </h3>
            <p className="text-muted-foreground mb-6">
              All sections generated. Ready to refine your plan or analyze a new idea.
            </p>
            <Button
              onClick={onReset}
              size="lg"
              className="brand-gradient text-white hover:opacity-90"
            >
              Analyze New Idea
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
