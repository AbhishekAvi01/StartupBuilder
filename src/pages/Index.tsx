import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Results {
  problemSolution: string;
  marketResearch: string;
  businessModel: string;
  pitchDeck: string;
}

interface LoadingState {
  problemSolution: boolean;
  marketResearch: boolean;
  businessModel: boolean;
  pitchDeck: boolean;
}

const Index = () => {
  const [originalIdea, setOriginalIdea] = useState("");
  const [results, setResults] = useState<Results>({
    problemSolution: "",
    marketResearch: "",
    businessModel: "",
    pitchDeck: "",
  });
  const [loading, setLoading] = useState<LoadingState>({
    problemSolution: false,
    marketResearch: false,
    businessModel: false,
    pitchDeck: false,
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("startupAnalysis");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setOriginalIdea(data.idea || "");
        setResults(data.results || results);
        setShowDashboard(true);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
  }, []);

  // Save to localStorage whenever results change
  useEffect(() => {
    if (originalIdea && Object.values(results).some(r => r)) {
      localStorage.setItem(
        "startupAnalysis",
        JSON.stringify({ idea: originalIdea, results })
      );
    }
  }, [originalIdea, results]);

  const handleSubmit = async (idea: string) => {
    setOriginalIdea(idea);
    setShowDashboard(true);
    setResults({
      problemSolution: "",
      marketResearch: "",
      businessModel: "",
      pitchDeck: "",
    });

    // Sequential processing
    const steps: Array<keyof Results> = [
      "problemSolution",
      "marketResearch",
      "businessModel",
      "pitchDeck",
    ];

    for (const step of steps) {
      setLoading((prev) => ({ ...prev, [step]: true }));

      try {
        const { data, error } = await supabase.functions.invoke("startup-agent", {
          body: { idea, step },
        });

        if (error) {
          console.error(`Error in ${step}:`, error);
          
          if (error.message?.includes("429") || error.message?.includes("Too Many Requests")) {
            toast({
              title: "Rate Limit Reached",
              description: "Too many requests. Please wait a moment and try again.",
              variant: "destructive",
            });
            setLoading((prev) => ({ ...prev, [step]: false }));
            break;
          }
          
          if (error.message?.includes("402") || error.message?.includes("Payment Required")) {
            toast({
              title: "Credits Required",
              description: "Please add credits to your Lovable AI workspace to continue.",
              variant: "destructive",
            });
            setLoading((prev) => ({ ...prev, [step]: false }));
            break;
          }

          throw error;
        }

        setResults((prev) => ({
          ...prev,
          [step]: data?.result || "No content generated",
        }));
      } catch (err) {
        console.error(`Failed to generate ${step}:`, err);
        toast({
          title: "Generation Failed",
          description: `Failed to generate ${step}. Please try again.`,
          variant: "destructive",
        });
      } finally {
        setLoading((prev) => ({ ...prev, [step]: false }));
      }
    }
  };

  const handleReset = () => {
    setShowDashboard(false);
    setOriginalIdea("");
    setResults({
      problemSolution: "",
      marketResearch: "",
      businessModel: "",
      pitchDeck: "",
    });
    localStorage.removeItem("startupAnalysis");
  };

  return (
    <>
      <Navigation />
      <div className="relative">
        {!showDashboard ? (
          <Hero
            onSubmit={handleSubmit}
            isLoading={Object.values(loading).some((l) => l)}
          />
        ) : (
          <Dashboard
            results={results}
            loading={loading}
            onReset={handleReset}
            originalIdea={originalIdea}
          />
        )}
      </div>
    </>
  );
};

export default Index;
