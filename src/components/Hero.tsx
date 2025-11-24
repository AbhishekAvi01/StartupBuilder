import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles, TrendingUp, Target, Briefcase } from "lucide-react";

interface HeroProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export const Hero = ({ onSubmit, isLoading }: HeroProps) => {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onSubmit(idea);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            AI-Powered Startup Analysis
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Transform Ideas Into
            <br />
            <span className="brand-gradient bg-clip-text text-transparent">
              Investor-Ready Plans
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Get comprehensive market research, business models, and pitch decks in minutes—not months.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-20">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <label htmlFor="idea-input" className="block text-sm font-medium mb-3">
              What's your startup idea?
            </label>
            <Textarea
              id="idea-input"
              placeholder="Describe your idea in a few sentences. Example: A platform that connects freelance designers with small businesses..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-[140px] resize-none border-border/50 focus:border-primary text-base mb-4"
              disabled={isLoading}
            />
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Get detailed analysis in 4 comprehensive sections
              </p>
              
              <Button
                type="submit"
                size="lg"
                disabled={!idea.trim() || isLoading}
                className="brand-gradient text-white font-medium hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    Start Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { 
              icon: <Target className="w-5 h-5" />, 
              title: "Problem-Solution Fit", 
              desc: "Validate your core hypothesis" 
            },
            { 
              icon: <TrendingUp className="w-5 h-5" />, 
              title: "Market Analysis", 
              desc: "Size, competition & opportunities" 
            },
            { 
              icon: <Briefcase className="w-5 h-5" />, 
              title: "Business Strategy", 
              desc: "Canvas & pitch deck content" 
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-xl p-6 hover:border-brand-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 text-brand-primary">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
