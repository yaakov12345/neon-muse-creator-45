import { useState } from "react";
import {
  Flame, Film, DollarSign, Hash, Loader2, ArrowRight,
  TrendingUp, Layers, CalendarDays, Lightbulb, MessageSquare, Sparkles,
} from "lucide-react";
import { TopBar, type Mode } from "@/components/TopBar";
import { ResultCard } from "@/components/ResultCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScriptStep { visual: string; spoken: string; }
interface Results {
  viralityScore: number; viralityReason: string;
  moneyScore: number; moneyReason: string;
  executionScore: number; executionReason: string;
  hook: string;
  scriptSteps: ScriptStep[];
  monetizationMethod: string;
  monetizationPlan: string;
  seriesStrategy: string;
  dailyIdea: string;
  improvementTip: string;
  caption: string;
  hashtags: string[];
}

const ScoreRing = ({ label, score, reason, accent }: { label: string; score: number; reason: string; accent: "purple" | "green" | "mixed" }) => {
  const ring =
    accent === "purple" ? "from-primary to-primary/40 text-primary"
    : accent === "green" ? "from-secondary to-secondary/40 text-secondary"
    : "from-primary to-secondary text-foreground";
  return (
    <div className="rounded-2xl border-gradient bg-gradient-card p-4 sm:p-5 flex items-center gap-4" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className={`relative h-14 w-14 shrink-0 rounded-full bg-gradient-to-br ${ring} p-[2px]`}>
        <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
          <span className="font-display font-bold text-lg">{score}</span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground/90 leading-snug line-clamp-2">{reason}</div>
      </div>
    </div>
  );
};

const Index = () => {
  const [mode, setMode] = useState<Mode>("both");
  const [language, setLanguage] = useState("AUTO");
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
        if (status === 429) toast.error("Rate limit exceeded. Try again in a moment.");
        else if (status === 402) toast.error("AI credits exhausted. Add funds to continue.");
        else toast.error(error.message || "Failed to generate strategy.");
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

  const scriptText = (steps: ScriptStep[]) =>
    steps.map((s, i) => `${i + 1}. 🎬 ${s.visual}\n   🗣 ${s.spoken}`).join("\n\n");

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar mode={mode} onModeChange={setMode} language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 px-4 sm:px-6 pb-24">
        <section className="max-w-3xl mx-auto pt-12 sm:pt-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-xs text-muted-foreground mb-6 animate-fade-in-up">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            AI viral growth engine
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] mb-5 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            Turn any idea into a{" "}
            <span className="text-gradient">viral growth system</span>.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            Hooks, scripts, monetization, daily ideas — engineered for creators who post every day.
          </p>

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
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Generating...</>) :
                  (<>Generate Viral Strategy<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>)}
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70 mt-4">
            Optimized for {mode === "views" ? "reach & retention" : mode === "money" ? "revenue & conversion" : "growth + revenue"}
          </p>
        </section>

        {results && (
          <section className="max-w-5xl mx-auto mt-14 space-y-5 sm:space-y-6">
            {/* Scores */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
              <ScoreRing label="Virality" score={results.viralityScore} reason={results.viralityReason} accent="purple" />
              <ScoreRing label="Money" score={results.moneyScore} reason={results.moneyReason} accent="green" />
              <ScoreRing label="Execution" score={results.executionScore} reason={results.executionReason} accent="mixed" />
            </div>

            {/* Main result cards */}
            <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
              {showViews && <ResultCard icon={Flame} title="Viral Hook" content={results.hook} accent="purple" delay={80} />}
              {showViews && <ResultCard icon={Film} title="Video Script" content={scriptText(results.scriptSteps)} accent="purple" delay={160} />}
              {showMoney && (
                <ResultCard
                  icon={DollarSign}
                  title="Monetization Plan"
                  content={`Method: ${results.monetizationMethod.toUpperCase()}\n\n${results.monetizationPlan}`}
                  accent="green"
                  delay={240}
                />
              )}
              {showViews && (
                <ResultCard
                  icon={Hash}
                  title="Caption + Hashtags"
                  content={`${results.caption}\n\n${results.hashtags.join(" ")}`}
                  accent="green"
                  delay={320}
                />
              )}
            </div>

            {/* Daily growth system */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "360ms" }}>
                <Sparkles className="h-4 w-4 text-secondary" />
                <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Daily Growth System
                </h2>
              </div>
              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3">
                <ResultCard icon={Layers} title="Series Strategy" content={results.seriesStrategy} accent="purple" delay={400} />
                <ResultCard icon={CalendarDays} title="Tomorrow's Idea" content={results.dailyIdea} accent="green" delay={480} />
                <ResultCard icon={Lightbulb} title="Improvement Tip" content={results.improvementTip} accent="purple" delay={560} />
              </div>
            </div>
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
