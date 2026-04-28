import { useRef, useState } from "react";
import {
  Flame, Film, DollarSign, Hash, Loader2, ArrowRight,
  Layers, CalendarDays, Lightbulb, Sparkles,
  MessageCircle, Repeat, Rocket, Crown, Tag, Target, Flame as FlameIcon, TrendingUp,
  Megaphone, Magnet, Eye, Zap, Users, ImagePlus, X,
} from "lucide-react";
import { TopBar, type Mode, type VideoLength } from "@/components/TopBar";
import { ResultCard } from "@/components/ResultCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguageSystem } from "@/hooks/useLanguageSystem";

interface ScriptStep { time: string; visual: string; spoken: string; }
interface TopHook { text: string; isStrongest: boolean; }
interface Results {
  viralityScore: number; viralityReason: string;
  moneyScore: number; moneyReason: string;
  subscriptionScore: number; subscriptionReason: string;
  executionScore: number; executionReason: string;
  topHooks: TopHook[];
  hook: string;
  scriptSteps: ScriptStep[];
  retentionStructure: string;
  engagementBoosters: string[];
  commentBait: string;
  viralLoopTip: string;
  distributionPlan: string;
  distributionTips: string;
  monetizationModel: string;
  monetizationPlan: string;
  whyPeoplePay: string;
  premiumFeature: string;
  pricingSuggestion: string;
  dailyIdea: string;
  dailyChallenge: string;
  streakMotivation: string;
  improvementTip: string;
  returnHook: string;
  seriesSystem: string;
  acquisitionVideoConcept: string;
  acquisitionHook: string;
  problemToToolAngle: string;
  acquisitionScript: string;
  viralPostIdea: string;
  acquisitionCtaLoop: string;
  viralSeed: string;
  acquisitionHashtags: string[];
  caption: string;
  hashtags: string[];
}

const ScoreRing = ({ label, score, reason, accent }: { label: string; score: number; reason: string; accent: "purple" | "green" | "mixed" }) => {
  const ring =
    accent === "purple" ? "from-primary to-primary/40 text-primary"
    : accent === "green" ? "from-secondary to-secondary/40 text-secondary"
    : "from-primary to-secondary text-foreground";
  return (
    <div className="rounded-2xl border-gradient bg-gradient-card p-4 flex items-center gap-3" style={{ boxShadow: "var(--shadow-card)" }}>
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

const SectionTitle = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3 opacity-0 animate-fade-in-up">
    <Icon className="h-4 w-4 text-secondary" />
    <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  </div>
);

const Index = () => {
  const [mode, setMode] = useState<Mode>("both");
  const [videoLength, setVideoLength] = useState<VideoLength>("30s");
  const { language, resolvedLanguage, changeLanguage, isRTL } = useLanguageSystem();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const t = isRTL
    ? {
        badge: "מנוע ויראלי + צמיחת SaaS לטיקטוק",
        title1: "הפוך כל רעיון",
        title2: "לוויראלי",
        subtitle: "Hooks חזקים • סקריפטים מנצחים • מונטיזציה • Retention\nמותאם אישית לאורך הסרטון שלך",
        placeholder: "הזן רעיון או מוצר כאן... (למשל: שולחן עץ כפרי, מכונת קפה אוטומטית, אוזניות אלחוטיות)",
        cta: "צור אסטרטגיה ויראלית",
        ctaLoading: "יוצר...",
        lengthLabel: "אורך סרטון",
        modeLabel: "מצב",
        examplesLabel: "דוגמאות מהירות",
        examples: ["שולחן עץ כפרי", "מכונת קפה אוטומטית", "אוזניות אלחוטיות", "קרם פנים טבעי", "מנורת LED חכמה"],
        lengths: [
          { id: "10s" as VideoLength, label: "10 שניות", desc: "Ultra Short" },
          { id: "15s" as VideoLength, label: "15-20 שניות", desc: "Short (מומלץ)", recommended: true },
          { id: "30s" as VideoLength, label: "30-45 שניות", desc: "Medium" },
          { id: "60s" as VideoLength, label: "60 שניות", desc: "Long" },
        ],
        modes: [
          { id: "both" as Mode, label: "Both", desc: "צפיות + כסף" },
          { id: "money" as Mode, label: "Money", desc: "הכנסה" },
          { id: "views" as Mode, label: "Views", desc: "צפיות" },
        ],
        optimized: (m: Mode) => `מותאם ל${m === "views" ? "טווח הגעה ושימור" : m === "money" ? "הכנסה ומנוי" : "צמיחה + הכנסה"}`,
      }
    : {
        badge: "TikTok viral + SaaS growth engine",
        title1: "Turn any idea into a",
        title2: "viral growth system",
        subtitle: "Strong hooks • Winning scripts • Monetization • Retention\nTailored to your video length",
        placeholder: "Enter an idea or product here... (e.g. rustic wood table, automatic coffee machine, wireless earbuds)",
        cta: "Generate Viral Strategy",
        ctaLoading: "Generating...",
        lengthLabel: "Video length",
        modeLabel: "Mode",
        examplesLabel: "Quick examples",
        examples: ["Rustic wood table", "Automatic coffee machine", "Wireless earbuds", "Natural face cream", "Smart LED lamp"],
        lengths: [
          { id: "10s" as VideoLength, label: "10s", desc: "Ultra Short" },
          { id: "15s" as VideoLength, label: "15-20s", desc: "Short (recommended)", recommended: true },
          { id: "30s" as VideoLength, label: "30-45s", desc: "Medium" },
          { id: "60s" as VideoLength, label: "60s", desc: "Long" },
        ],
        modes: [
          { id: "both" as Mode, label: "Both", desc: "Views + Money" },
          { id: "money" as Mode, label: "Money", desc: "Revenue" },
          { id: "views" as Mode, label: "Views", desc: "Reach" },
        ],
        optimized: (m: Mode) => `Optimized for ${m === "views" ? "reach & retention" : m === "money" ? "revenue & subscription" : "growth + revenue"}`,
      };

  const handleGenerate = async () => {
    if (!idea.trim() || loading) return;
    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-strategy", {
        body: { idea: idea.trim(), mode, language: resolvedLanguage.toUpperCase(), videoLength },
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
    steps.map((s) => `⏱ ${s.time}\n🗣 ${s.spoken}\n🎬 ${s.visual}`).join("\n\n");

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar mode={mode} onModeChange={setMode} language={language} onLanguageChange={changeLanguage} videoLength={videoLength} onVideoLengthChange={setVideoLength} />

      <main className="flex-1 px-4 sm:px-6 pb-24">
        <section className="max-w-3xl mx-auto pt-12 sm:pt-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-xs text-muted-foreground mb-6 animate-fade-in-up">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            {t.badge}
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight leading-[1.05] mb-5 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            {t.title1}{" "}
            <span className="text-gradient">{t.title2}</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in-up whitespace-pre-line" style={{ animationDelay: "160ms" }}>
            {t.subtitle}
          </p>

          <div className="relative animate-fade-in-up" style={{ animationDelay: "240ms" }}>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-primary opacity-30 blur-xl pointer-events-none" />
            <div className="relative rounded-2xl border-gradient bg-card p-2 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder={t.placeholder}
                dir={isRTL ? "rtl" : "ltr"}
                className="flex-1 bg-transparent px-4 py-4 text-base sm:text-lg placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !idea.trim()}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-primary text-background font-semibold text-sm sm:text-base transition-smooth hover:scale-[1.02] hover:animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
              >
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />{t.ctaLoading}</>) :
                  (<>{isRTL ? "←" : "→"} {t.cta}</>)}
              </button>
            </div>
          </div>

          {/* Video length picker */}
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{t.lengthLabel}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {t.lengths.map((l) => {
                const active = videoLength === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setVideoLength(l.id)}
                    className={`relative rounded-xl border px-3 py-3 text-start transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(270_95%_65%/0.25)]"
                        : "border-border/60 bg-muted/30 hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-display font-semibold text-sm">{l.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{l.desc}</div>
                    {l.recommended && (
                      <span className="absolute top-1.5 end-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-secondary/20 text-secondary">★</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode picker */}
          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "360ms" }}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{t.modeLabel}</div>
            <div className="grid grid-cols-3 gap-2">
              {t.modes.map((m) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`rounded-xl border px-3 py-3 transition-all ${
                      active
                        ? "border-secondary bg-secondary/10 shadow-[0_0_20px_hsl(160_84%_45%/0.25)]"
                        : "border-border/60 bg-muted/30 hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-display font-semibold text-sm">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick examples */}
          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "420ms" }}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{t.examplesLabel}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {t.examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setIdea(ex)}
                  className="px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-xs text-foreground/80 hover:border-primary/60 hover:bg-primary/10 hover:text-foreground transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70 mt-6">
            {t.optimized(mode)}
          </p>
        </section>

        {results && (
          <section className="max-w-5xl mx-auto mt-14 space-y-8">
            {/* Scores */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 opacity-0 animate-fade-in-up">
              <ScoreRing label="Virality" score={results.viralityScore} reason={results.viralityReason} accent="purple" />
              <ScoreRing label="Money" score={results.moneyScore} reason={results.moneyReason} accent="green" />
              <ScoreRing label="Subscription" score={results.subscriptionScore} reason={results.subscriptionReason} accent="mixed" />
              <ScoreRing label="Execution" score={results.executionScore} reason={results.executionReason} accent="mixed" />
            </div>

            {/* TikTok Viral Engine */}
            {showViews && (
              <div>
                <SectionTitle icon={FlameIcon}>TikTok Viral Engine</SectionTitle>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
                  <ResultCard
                    icon={Flame}
                    title="Top 5 Viral Hooks"
                    content={results.topHooks.map((h, i) => `${h.isStrongest ? "🔥 " : `${i + 1}. `}${h.text}`).join("\n\n")}
                    accent="purple"
                    delay={80}
                  />
                  <ResultCard icon={Film} title={`Full Video Script (${videoLength})`} content={scriptText(results.scriptSteps)} accent="purple" delay={160} />
                  <ResultCard icon={TrendingUp} title="Retention & Viral Loop" content={`${results.retentionStructure}\n\n${results.viralLoopTip}`} accent="green" delay={240} />
                  <ResultCard
                    icon={MessageCircle}
                    title="Engagement Boosters"
                    content={`${results.engagementBoosters.map((b, i) => `${i + 1}. ${b}`).join("\n")}\n\n💬 ${results.commentBait}`}
                    accent="green"
                    delay={320}
                  />
                  <ResultCard icon={Rocket} title="Distribution Plan" content={results.distributionPlan} accent="purple" delay={400} />
                  <ResultCard icon={TrendingUp} title="Optimization Tips" content={results.distributionTips} accent="green" delay={480} />
                </div>
              </div>
            )}

            {/* SaaS + Subscription */}
            {showMoney && (
              <div>
                <SectionTitle icon={DollarSign}>SaaS + Subscription Engine</SectionTitle>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
                  <ResultCard
                    icon={DollarSign}
                    title="Monetization Model"
                    content={`Model: ${results.monetizationModel.toUpperCase()}\n\n${results.monetizationPlan}`}
                    accent="green"
                    delay={80}
                  />
                  <ResultCard icon={Target} title="Why People Pay" content={results.whyPeoplePay} accent="purple" delay={160} />
                  <ResultCard icon={Crown} title="Premium Feature" content={results.premiumFeature} accent="purple" delay={240} />
                  <ResultCard icon={Tag} title="Pricing Suggestion" content={results.pricingSuggestion} accent="green" delay={320} />
                </div>
              </div>
            )}

            {/* Daily Growth Loop */}
            <div>
              <SectionTitle icon={Sparkles}>Daily Growth Loop</SectionTitle>
              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3">
                <ResultCard icon={CalendarDays} title="Tomorrow's TikTok Idea" content={results.dailyIdea} accent="purple" delay={80} />
                <ResultCard icon={Target} title="Daily Challenge" content={results.dailyChallenge} accent="green" delay={160} />
                <ResultCard icon={Sparkles} title="Streak Motivation" content={results.streakMotivation} accent="purple" delay={240} />
                <ResultCard icon={Lightbulb} title="Next Improvement" content={results.improvementTip} accent="green" delay={320} />
                <ResultCard icon={Repeat} title="Return Hook" content={results.returnHook} accent="purple" delay={400} />
                <ResultCard icon={Layers} title="Content Series System" content={results.seriesSystem} accent="green" delay={480} />
              </div>
            </div>

            {/* TikTok User Acquisition Engine */}
            <div>
              <SectionTitle icon={Megaphone}>TikTok User Acquisition Engine</SectionTitle>
              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
                <ResultCard icon={Film} title="Viral Video Concept (for creator)" content={results.acquisitionVideoConcept} accent="purple" delay={80} />
                <ResultCard icon={Zap} title="Hook for Viral Growth" content={results.acquisitionHook} accent="green" delay={160} />
                <ResultCard icon={Magnet} title="Problem → Tool Angle" content={results.problemToToolAngle} accent="purple" delay={240} />
                <ResultCard icon={Film} title="Copy-This Video Script" content={results.acquisitionScript} accent="green" delay={320} />
                <ResultCard icon={Users} title="Viral Post Idea (indirect promo)" content={results.viralPostIdea} accent="purple" delay={400} />
                <ResultCard icon={ArrowRight} title="CTA Loop" content={results.acquisitionCtaLoop} accent="green" delay={480} />
                <ResultCard icon={Eye} title="Viral Seed (curiosity trigger)" content={results.viralSeed} accent="purple" delay={560} />
                <ResultCard icon={Hash} title="Acquisition Hashtags" content={results.acquisitionHashtags.join(" ")} accent="green" delay={640} />
              </div>
            </div>

            {/* Caption + Hashtags */}
            {showViews && (
              <div>
                <SectionTitle icon={Hash}>Caption + Hashtags</SectionTitle>
                <ResultCard
                  icon={Hash}
                  title="Ready to post"
                  content={`${results.caption}\n\n${results.hashtags.join(" ")}`}
                  accent="green"
                  delay={80}
                />
              </div>
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
