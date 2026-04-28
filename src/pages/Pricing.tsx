import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Try the engine.",
    cta: "Get started",
    features: ["5 generations / month", "Basic hooks & scripts", "Save up to 5 projects"],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    desc: "For serious creators.",
    cta: "Coming soon",
    popular: true,
    features: ["Unlimited generations", "AI voiceover (ElevenLabs)", "Export to CapCut & PDF", "3 months project history", "All advanced tones"],
  },
  {
    name: "Unlimited",
    price: "$39",
    period: "/mo",
    desc: "For agencies & power users.",
    cta: "Coming soon",
    features: ["Everything in Pro", "Advanced video analysis", "Unlimited project history", "Priority generation", "Priority support"],
  },
];

export default function Pricing() {
  return (
    <div className="px-4 sm:px-6 py-12 md:py-20 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          Simple, <span className="text-gradient">creator-friendly</span> pricing
        </h1>
        <p className="text-muted-foreground">Start free. Upgrade when you're ready to scale.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((t) => (
          <Card
            key={t.name}
            className={cn(
              "border-gradient p-7 flex flex-col relative",
              t.popular && "glow-purple ring-1 ring-primary/40"
            )}
          >
            {t.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Most popular
              </div>
            )}
            <h3 className="font-display text-2xl font-bold">{t.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.desc}</p>
            <div className="mb-6">
              <span className="font-display text-4xl font-bold">{t.price}</span>
              <span className="text-muted-foreground text-sm">{t.period}</span>
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <Check className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {t.cta === "Get started" ? (
              <Button asChild className="w-full bg-gradient-primary text-primary-foreground"><Link to="/auth">{t.cta}</Link></Button>
            ) : (
              <Button disabled variant="outline" className="w-full">{t.cta}</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
