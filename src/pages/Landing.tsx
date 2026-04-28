import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, TrendingUp, Mic, Play, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { user } = useAuth();
  const ctaTo = user ? "/generator" : "/auth";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-40 right-1/4 h-[300px] w-[400px] rounded-full bg-secondary/20 blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3 w-3" />
            AI-Powered Viral Strategy Engine
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Turn Any Product into{" "}
            <span className="text-gradient">Viral TikTok &amp; Reels</span> Content
            That Grows &amp; Sells
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hooks, scripts, on-screen text, retention tips, monetization plans, and AI voiceovers — generated in seconds, tuned to go viral.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-purple text-base h-12 px-8">
              <Link to={ctaTo}>
                Start Generating Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8">
              <Link to="/pricing">See Pricing</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />)}
              <span className="ml-1">Loved by creators</span>
            </div>
            <span>·</span>
            <span>1M+ viral hooks generated</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-3">
            Everything you need to <span className="text-gradient">go viral</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">From idea to published reel in minutes.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "7+ Hook Variations", desc: "Curiosity gaps, FOMO, before/after, and more — ranked by virality." },
              { icon: Play, title: "Timed Scripts", desc: "Frame-by-frame breakdown with on-screen text and visual cues." },
              { icon: Mic, title: "AI Voiceover", desc: "Studio-quality narration powered by ElevenLabs in one click." },
              { icon: TrendingUp, title: "Viral Score", desc: "Get a 0–100 score with reasoning so you know what's working." },
              { icon: Sparkles, title: "Monetization Plan", desc: "CTAs, funnels, and offers tuned to convert viewers to buyers." },
              { icon: ArrowRight, title: "Save & Iterate", desc: "Keep every winning strategy in your project library." },
            ].map((f) => (
              <Card key={f.title} className="border-gradient p-6 hover:glow-purple transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 pb-24">
        <Card className="max-w-4xl mx-auto border-gradient p-10 md:p-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Your next viral video is one click away.
          </h2>
          <p className="text-muted-foreground mb-8">Join creators turning ordinary products into millions of views.</p>
          <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground glow-purple h-12 px-8">
            <Link to={ctaTo}>Start Generating Now <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
