import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

type DemoResult = {
  hook: string;
  script: string[];
  captions: string[];
  cta: string;
};

const TONES = ["Bold", "Funny", "Educational", "Emotional", "Luxury", "Edgy"];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("Bold");
  const [result, setResult] = useState<DemoResult | null>(null);

  const ctaTo = user ? "/generator" : "/auth";

  function generateDemo() {
    if (!idea.trim()) return;
    setResult({
      hook: `Most people don't realize this about ${idea}...`,
      script: [
        "0-3s: Open with a surprising problem your audience feels.",
        `3-10s: Show why ${idea} solves that problem faster or better.`,
        "10-20s: Add proof, demo, or a before/after moment.",
        "20-30s: End with a clear CTA: save, follow, buy, or comment.",
      ],
      captions: [
        "Stop scrolling — this changes everything.",
        "The easiest way to get better results.",
        "You're probably doing this the hard way.",
      ],
      cta: "Follow for more viral content ideas.",
    });
  }

  function goToFullGenerator() {
    if (idea.trim()) sessionStorage.setItem("pending_idea", idea.trim());
    if (audience.trim()) sessionStorage.setItem("pending_audience", audience.trim());
    if (niche.trim()) sessionStorage.setItem("pending_niche", niche.trim());
    if (tone) sessionStorage.setItem("pending_tone", tone);
    navigate(ctaTo);
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 pb-24">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Viralyx</div>
          <Button asChild variant="secondary" size="sm">
            <Link to="/pricing">Pricing</Link>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-4xl mx-auto text-center pt-16">
        <div className="inline-flex px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm mb-6">
          AI-Powered Viral Strategy Engine ✨
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Generate Viral TikTok & Reels Scripts{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            in 10 Seconds
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto">
          Turn any product, service, or idea into hooks, scripts, captions, retention tips, and CTAs
          that are built to grow and sell.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-2xl">
            <a href="#generator">Generate My First Viral Script</a>
          </Button>
          <Button asChild variant="secondary" size="lg" className="px-8 py-6 text-lg rounded-2xl">
            <a href="#example">See Example</a>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm mt-4">
          Free to start · No credit card · No API key required
        </p>
      </section>

      {/* SOCIAL PROOF */}
      <section className="max-w-4xl mx-auto mt-12 grid grid-cols-3 gap-4 text-center">
        {[
          ["1,200+", "Creators"],
          ["2M+", "Views Generated"],
          ["10s", "To Generate"],
        ].map(([num, label]) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-4">
            <div className="text-2xl font-bold">{num}</div>
            <div className="text-muted-foreground text-sm">{label}</div>
          </div>
        ))}
      </section>

      {/* GENERATOR */}
      <section
        id="generator"
        className="max-w-3xl mx-auto mt-20 bg-card border border-primary/20 rounded-3xl p-6"
      >
        <h2 className="text-3xl font-bold mb-2">Viral Generator</h2>
        <p className="text-muted-foreground mb-6">Try a quick demo. Refine in the full generator.</p>

        <label className="block mb-2 font-semibold">Your Product / Idea *</label>
        <Textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Example: skincare product for acne, fitness app, online course..."
          className="h-32 bg-background rounded-2xl"
        />

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-2 font-semibold">Audience</label>
            <Input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Gen Z women"
              className="bg-background rounded-2xl h-12"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Niche</label>
            <Input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. skincare"
              className="bg-background rounded-2xl h-12"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block mb-3 font-semibold">Tone</label>
          <div className="flex flex-wrap gap-3">
            {TONES.map((item) => (
              <button
                key={item}
                onClick={() => setTone(item)}
                className={`px-4 py-2 rounded-xl border transition ${
                  tone === item
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-transparent border-border hover:bg-muted"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <Button
            onClick={generateDemo}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-6 rounded-2xl font-bold text-lg"
          >
            Quick Demo ✨
          </Button>
          <Button
            onClick={goToFullGenerator}
            variant="secondary"
            className="w-full py-6 rounded-2xl font-bold text-lg"
          >
            Full AI Strategy →
          </Button>
        </div>
      </section>

      {/* RESULT */}
      {result && (
        <section className="max-w-3xl mx-auto mt-10 bg-card border border-border rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">Your Viral Strategy 🔥</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-primary">Hook</h3>
              <p className="text-muted-foreground mt-2">{result.hook}</p>
            </div>
            <div>
              <h3 className="font-bold text-primary">Timed Script</h3>
              <ul className="text-muted-foreground mt-2 space-y-2">
                {result.script.map((line, i) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary">Caption Ideas</h3>
              <ul className="text-muted-foreground mt-2 space-y-2">
                {result.captions.map((line, i) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary">CTA</h3>
              <p className="text-muted-foreground mt-2">{result.cta}</p>
            </div>
            <Button
              onClick={goToFullGenerator}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-6 rounded-2xl font-bold"
            >
              Get the Full AI Strategy 🚀
            </Button>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto mt-20">
        <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["1", "Describe", "Write your product, idea, or offer."],
            ["2", "Generate", "Get hooks, scripts, captions, and CTAs."],
            ["3", "Post", "Use the content on TikTok, Reels, or Shorts."],
          ].map(([num, title, text]) => (
            <div key={num} className="bg-card border border-border rounded-3xl p-6 text-center">
              <div className="text-primary text-4xl font-bold">{num}</div>
              <h3 className="text-xl font-bold mt-3">{title}</h3>
              <p className="text-muted-foreground mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXAMPLE */}
      <section
        id="example"
        className="max-w-3xl mx-auto mt-20 bg-card border border-border rounded-3xl p-6"
      >
        <h2 className="text-3xl font-bold mb-6">Example Output</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Hook:</strong> "You're using this product wrong — and
            it's costing you results."
          </p>
          <p>
            <strong className="text-foreground">Script:</strong> "Most people buy this because they
            want X. But the real reason it works is Y..."
          </p>
          <p>
            <strong className="text-foreground">CTA:</strong> "Save this before you create your next
            video."
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto mt-20">
        <h2 className="text-4xl font-bold text-center mb-10">Everything You Need To Go Viral</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["⚡", "Hook Variations", "Curiosity, FOMO, before/after and bold hooks."],
            ["🎬", "Timed Scripts", "Frame-by-frame breakdown for short-form video."],
            ["💬", "Captions", "Scroll-stopping captions for TikTok and Reels."],
            ["🎯", "CTA Ideas", "Clear calls-to-action that drive saves and sales."],
            ["🧠", "Retention Tips", "Ideas that keep viewers watching longer."],
            ["🎤", "Voiceover Direction", "Ready-to-record narration guidance."],
          ].map(([icon, title, text]) => (
            <div key={title} className="bg-card border border-border rounded-3xl p-6">
              <div className="text-3xl">{icon}</div>
              <h3 className="text-xl font-bold mt-4">{title}</h3>
              <p className="text-muted-foreground mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-3xl mx-auto text-center mt-24">
        <h2 className="text-4xl font-bold">Ready To Create Your First Viral Script?</h2>
        <p className="text-muted-foreground mt-4">Start with one idea. Get a strategy in seconds.</p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-2xl font-bold text-lg"
        >
          <Link to={ctaTo}>Start Generating Now 🚀</Link>
        </Button>
      </section>
    </div>
  );
}
