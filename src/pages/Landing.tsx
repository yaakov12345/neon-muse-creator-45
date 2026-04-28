import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, TrendingUp, Mic, Play, Star, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguageSystem } from "@/hooks/useLanguageSystem";

const translations = {
  en: {
    badge: "AI-Powered Viral Strategy Engine",
    h1a: "Turn Any Product into",
    h1b: "Viral TikTok & Reels",
    h1c: "Content That Grows & Sells",
    subtitle: "Hooks, scripts, on-screen text, retention tips, monetization plans, and AI voiceovers — generated in seconds.",
    cta: "Start Generating Now",
    ctaSub: "Free to start · No credit card",
    pricingBtn: "See Pricing",
    social1: "Loved by creators",
    social2: "1M+ viral hooks generated",
    featuresTitle: "Everything you need to go viral",
    featuresSub: "From idea to published reel in minutes.",
    ctaCardTitle: "Your next viral video is one click away.",
    ctaCardSub: "Join creators turning products into millions of views.",
    features: [
      { title: "7+ Hook Variations", desc: "Curiosity, FOMO, before/after — ranked by virality." },
      { title: "Timed Scripts", desc: "Frame-by-frame breakdown with visuals." },
      { title: "AI Voiceover", desc: "Studio-quality narration in one click." },
      { title: "Viral Score", desc: "0–100 score with explanation." },
      { title: "Monetization Plan", desc: "CTAs and funnels that convert." },
      { title: "Save & Iterate", desc: "Keep every winning idea." },
    ],
  },
};

const featureIcons = [Zap, Play, Mic, TrendingUp, Sparkles, ArrowRight];

export default function Landing() {
  const { user } = useAuth();
  const { language, changeLanguage, isRTL, allLanguages } = useLanguageSystem();
  const ctaTo = user ? "/generator" : "/auth";
  const t = translations[language] ?? translations.en;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Language */}
      <div className="flex justify-end px-4 pt-4">
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs">
            <Globe className="h-3 w-3" />
            {allLanguages.find((l) => l.code === language)?.flag}
          </button>
          <div className="absolute end-0 mt-1 w-40 rounded-xl border bg-card shadow-lg opacity-0 group-hover:opacity-100 transition-all">
            {allLanguages.map((l) => (
              <button key={l.code} onClick={() => changeLanguage(l.code)} className="block w-full text-left px-3 py-2 text-xs hover:bg-muted">
                {l.flag} {l.nativeLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="text-center px-4 pt-16 pb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs mb-6">
          <Sparkles className="h-3 w-3" />
          {t.badge}
        </div>

        <h1 className="text-5xl font-bold mb-4">
          {t.h1a} <span className="text-primary">{t.h1b}</span> {t.h1c}
        </h1>

        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          {t.subtitle}
        </p>

        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to={ctaTo}>{t.cta}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/pricing">{t.pricingBtn}</Link>
          </Button>
        </div>

        <p className="text-xs mt-3">{t.ctaSub}</p>

        <div className="mt-6 flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-yellow-400" />
            ))}
            {t.social1}
          </div>
          <span>{t.social2}</span>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            {t.featuresTitle}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {t.features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <Card key={f.title} className="p-6">
                  <Icon className="mb-3" />
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-24">
        <h2 className="text-2xl font-bold mb-2">
          {t.ctaCardTitle}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t.ctaCardSub}
        </p>
        <Button asChild>
          <Link to={ctaTo}>{t.cta}</Link>
        </Button>
      </section>
    </div>
  );
}