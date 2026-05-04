import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");

  const ctaTo = user ? "/generator" : "/auth";

  function handleGenerate() {
    if (idea.trim()) {
      sessionStorage.setItem("pending_idea", idea.trim());
    }
    navigate(ctaTo);
  }

  return (
    <div className="bg-background text-foreground min-h-screen px-4 py-8">
      {/* HERO */}
      <section className="max-w-3xl mx-auto text-center space-y-6 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Generate Viral TikTok Scripts{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            in 10 Seconds
          </span>
        </h1>
        <p className="text-muted-foreground text-lg">
          AI that creates hooks, scripts, and content ideas that actually get views & sales.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
        >
          <Link to={ctaTo}>Generate My First Viral Video 🚀</Link>
        </Button>
        <p className="text-sm text-muted-foreground">Free to start • No credit card</p>
        <p className="text-sm text-muted-foreground">
          Used by 1,200+ creators • 2M+ views generated
        </p>
      </section>

      {/* INPUT */}
      <section className="max-w-xl mx-auto mt-12">
        <Textarea
          placeholder="Describe your product or idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={4}
          className="bg-card border-border"
        />
        <Button
          onClick={handleGenerate}
          className="w-full mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground"
          size="lg"
        >
          Generate Viral Strategy ✨
        </Button>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6 text-center">
        {[
          { title: "1. Describe", desc: "Tell us about your idea or product" },
          { title: "2. Generate", desc: "AI creates viral hooks & scripts" },
          { title: "3. Post", desc: "Use it for TikTok / Reels instantly" },
        ].map((s) => (
          <div key={s.title}>
            <h3 className="font-bold text-lg">{s.title}</h3>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* EXAMPLE OUTPUT */}
      <section className="max-w-2xl mx-auto mt-16 bg-card p-6 rounded-xl border border-border">
        <h2 className="text-xl font-semibold mb-4">Example Output 🔥</h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Hook:</strong> "You're using this wrong..."</p>
          <p><strong className="text-foreground">Script:</strong> "Most people think X, but actually Y..."</p>
          <p><strong className="text-foreground">CTA:</strong> "Follow for more viral strategies"</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
        {[
          { title: "🔥 Viral Hooks", desc: "Curiosity, FOMO & high-retention openers" },
          { title: "🎬 Scripts", desc: "Frame-by-frame content breakdown" },
          { title: "🎤 AI Voice", desc: "Studio-quality narration in seconds" },
        ].map((f) => (
          <div key={f.title} className="bg-card p-5 rounded-xl border border-border">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section className="text-center mt-20 mb-12 space-y-6">
        <h2 className="text-2xl font-bold">Ready to go viral?</h2>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-6 text-lg"
        >
          <Link to={ctaTo}>Create My First Viral Script 🚀</Link>
        </Button>
      </section>
    </div>
  );
}
