import { useState } from "react";
import { Flame, Film, DollarSign, Hash, Loader2, ArrowRight } from "lucide-react";
import { TopBar, type Mode } from "@/components/TopBar";
import { ResultCard } from "@/components/ResultCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Results {
  hook: string;
  script: string;
  monetization: string;
  caption: string;
}

const Index = () => {
  const [mode, setMode] = useState<Mode>("both");
  const [language, setLanguage] = useState("EN");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim() || loading) return;
    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-strategy", {
        body: { idea: idea.trim(), mode, language },
      });

      if (error) {
        const status = (error as any).context?.status;
        if (status === 429) {
          toast.error("Rate limit exceeded. Try again in a moment.");
        } else if (status === 402) {
          toast.error("AI credits exhausted. Add funds to continue.");
        } else {
          toast.error(error.message || "Failed to generate strategy.");
        }
        return;
      }

      if (!data || data.error) {
        toast.error(data?.error || "Something went wrong.");
        return;
      }

      setResults(data as Results);
    } catch (e) {
      console.error(e);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showViews = mode === "views" || mode === "both";
  const showMoney = mode === "money" || mode === "both";

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar mode={mode} onModeChange={setMode} language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 px-4 sm:px-6 pb-24">
        <section className="max-w-3xl mx-auto pt-12 sm:pt-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-xs text-muted-foreground mb-6 animate-fade-in-up">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            AI viral strategy engine
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] mb-5 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            Turn any idea into a{" "}
            <span className="text-gradient">viral strategy</span>.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            Hooks, scripts, monetization, captions — generated for creators in seconds.
          </p>

          {/* Input */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "240ms" }}>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-primary opacity-30 blur-xl pointer-events-none" />
            <div className="relative rounded-2xl border-gradient bg-card p-2 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Enter your idea or product..."
                className="flex-1 bg-transparent px-4 py-4 text-base sm:text-lg placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !idea.trim()}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-primary text-background font-semibold text-sm sm:text-base transition-smooth hover:scale-[1.02] hover:animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Viral Strategy
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70 mt-4">
            Optimized for {mode === "views" ? "reach & retention" : mode === "money" ? "revenue & conversion" : "growth + revenue"}
          </p>
        </section>

        {/* Results */}
        {results && (
          <section className="max-w-5xl mx-auto mt-16 grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
            {showViews && (
              <ResultCard icon={Flame} title="Viral Hook" content={results.hook} accent="purple" delay={0} />
            )}
            {showViews && (
              <ResultCard icon={Film} title="Video Script" content={results.script} accent="purple" delay={120} />
            )}
            {showMoney && (
              <ResultCard icon={DollarSign} title="Monetization Strategy" content={results.monetization} accent="green" delay={240} />
            )}
            {showViews && (
              <ResultCard icon={Hash} title="Caption + Hashtags" content={results.caption} accent="green" delay={360} />
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        Built for creators · Viralyx © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
