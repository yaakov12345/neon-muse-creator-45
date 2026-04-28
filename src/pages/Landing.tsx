import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, TrendingUp, Mic, Play, Star, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguageSystem } from "@/hooks/useLanguageSystem";

const translations: Record<string, {
  badge: string; h1a: string; h1b: string; h1c: string;
  subtitle: string; cta: string; ctaSub: string; pricingBtn: string;
  social1: string; social2: string;
  featuresTitle: string; featuresSub: string;
  ctaCardTitle: string; ctaCardSub: string;
  features: { title: string; desc: string }[];
}> = {
  en: {
    badge: "AI-Powered Viral Strategy Engine",
    h1a: "Turn Any Product into",
    h1b: "Viral TikTok & Reels",
    h1c: "Content That Grows & Sells",
    subtitle: "Hooks, scripts, on-screen text, retention tips, monetization plans, and AI voiceovers — generated in seconds, tuned to go viral.",
    cta: "Start Generating Now",
    ctaSub: "Free to start · No credit card",
    pricingBtn: "See Pricing",
    social1: "Loved by creators",
    social2: "1M+ viral hooks generated",
    featuresTitle: "Everything you need to go viral",
    featuresSub: "From idea to published reel in minutes.",
    ctaCardTitle: "Your next viral video is one click away.",
    ctaCardSub: "Join creators turning ordinary products into millions of views.",
    features: [
      { title: "7+ Hook Variations", desc: "Curiosity gaps, FOMO, before/after, and more — ranked by virality." },
      { title: "Timed Scripts", desc: "Frame-by-frame breakdown with on-screen text and visual cues." },
      { title: "AI Voiceover", desc: "Studio-quality narration powered by ElevenLabs in one click." },
      { title: "Viral Score", desc: "Get a 0–100 score with reasoning so you know what's working." },
      { title: "Monetization Plan", desc: "CTAs, funnels, and offers tuned to convert viewers to buyers." },
      { title: "Save & Iterate", desc: "Keep every winning strategy in your project library." },
    ],
  },
  he: {
    badge: "מנוע אסטרטגיה ויראלית מבוסס AI",
    h1a: "הפוך כל מוצר ל",
    h1b: "תוכן ויראלי בטיקטוק ורילס",
    h1c: "שצומח ומוכר",
    subtitle: "הוקים, סקריפטים, טקסט על המסך, טיפי שימור, תוכניות מונטיזציה וקריינות AI — נוצרים בשניות, מותאמים לוויראליות.",
    cta: "התחל לייצר עכשיו",
    ctaSub: "חינמי להתחלה · ללא כרטיס אשראי",
    pricingBtn: "תמחור",
    social1: "אהוב על יוצרים",
    social2: "מיליון+ הוקים ויראליים נוצרו",
    featuresTitle: "כל מה שצריך כדי להפוך ויראלי",
    featuresSub: "מרעיון לרילס מפורסם בדקות.",
    ctaCardTitle: "הסרטון הוויראלי הבא שלך במרחק קליק אחד.",
    ctaCardSub: "הצטרף ליוצרים שהופכים מוצרים רגילים למיליוני צפיות.",
    features: [
      { title: "7+ וריאציות הוק", desc: "פערי סקרנות, FOMO, לפני/אחרי ועוד — מדורגים לפי ויראליות." },
      { title: "סקריפטים עם תזמון", desc: "פירוט פריים אחר פריים עם טקסט על המסך ורמזים ויזואליים." },
      { title: "קריינות AI", desc: "קריינות איכות סטודיו מבוססת ElevenLabs בלחיצה אחת." },
      { title: "ציון ויראלי", desc: "קבל ציון 0–100 עם הנמקה כדי לדעת מה עובד." },
      { title: "תוכנית מונטיזציה", desc: "CTA, משפכים והצעות מותאמות להמרת צופים לקונים." },
      { title: "שמור ושפר", desc: "שמור כל אסטרטגיה מנצחת בספריית הפרויקטים שלך." },
    ],
  },
  es: {
    badge: "Motor de estrategia viral con IA",
    h1a: "Convierte cualquier producto en",
    h1b: "contenido viral en TikTok y Reels",
    h1c: "que crece y vende",
    subtitle: "Hooks, guiones, texto en pantalla, consejos de retención, planes de monetización y voces AI — generados en segundos.",
    cta: "Empieza a generar ahora",
    ctaSub: "Gratis para empezar · Sin tarjeta de crédito",
    pricingBtn: "Ver precios",
    social1: "Amado por creadores",
    social2: "1M+ hooks virales generados",
    featuresTitle: "Todo lo que necesitas para volverse viral",
    featuresSub: "De idea a reel publicado en minutos.",
    ctaCardTitle: "Tu próximo video viral está a un clic.",
    ctaCardSub: "Únete a creadores que convierten productos ordinarios en millones de vistas.",
    features: [
      { title: "7+ variaciones de Hook", desc: "Curiosidad, FOMO, antes/después y más — clasificados por viralidad." },
      { title: "Guiones con tiempo", desc: "Desglose fotograma a fotograma con texto en pantalla." },
      { title: "Voz AI", desc: "Narración de calidad estudio con ElevenLabs en un clic." },
      { title: "Puntuación viral", desc: "Obtén una puntuación 0–100 con razonamiento." },
      { title: "Plan de monetización", desc: "CTAs y embudos para convertir espectadores en compradores." },
      { title: "Guarda e itera", desc: "Guarda cada estrategia ganadora en tu biblioteca." },
    ],
  },
  fr: {
    badge: "Moteur de stratégie virale IA",
    h1a: "Transformez n'importe quel produit en",
    h1b: "contenu viral TikTok & Reels",
    h1c: "qui croît et vend",
    subtitle: "Hooks, scripts, texte à l'écran, conseils de rétention, plans de monétisation et voix IA — générés en secondes.",
    cta: "Commencer maintenant",
    ctaSub: "Gratuit pour commencer · Sans carte de crédit",
    pricingBtn: "Voir les prix",
    social1: "Adoré par les créateurs",
    social2: "1M+ hooks viraux générés",
    featuresTitle: "Tout ce dont vous avez besoin pour devenir viral",
    featuresSub: "De l'idée au reel publié en minutes.",
    ctaCardTitle: "Votre prochain succès viral est à un clic.",
    ctaCardSub: "Rejoignez les créateurs qui transforment des produits ordinaires en millions de vues.",
    features: [
      { title: "7+ variations de Hook", desc: "Curiosité, FOMO, avant/après et plus — classés par viralité." },
      { title: "Scripts minutés", desc: "Décomposition image par image avec texte à l'écran." },
      { title: "Voix IA", desc: "Narration studio avec ElevenLabs en un clic." },
      { title: "Score viral", desc: "Obtenez un score 0–100 avec des explications." },
      { title: "Plan de monétisation", desc: "CTAs et entonnoirs pour convertir les spectateurs." },
      { title: "Sauvegarder et itérer", desc: "Conservez chaque stratégie gagnante." },
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
      {/* Language selector */}
      <div className="flex justify-end px-4 sm:px-6 pt-4">
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-xs text-muted-foreground hover:border-primary/40 transition-all">
            <Globe className="h-3 w-3" />
            {allLanguages.find((l) => l.code === language)?.flag}{" "}
            {allLanguages.find((l) => l.code === language)?.nativeLabel}
          </button>
          <div className="absolute end-0 top-full mt-1 w-44 rounded-xl border border-border bg-card shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 overflow-hidden">
            {allLanguages.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors ${language === l.code ? "text-primary font-medium" : "text-foreground"}`}
              >
                <span>{l.flag}</span>
                <span>{l.nativeLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-10 pb-20 md:pt-16 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-40 right-1/4 h-[300px] w-[400px] rounded-full bg-secondary/20 blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3 w-3" />
            {t.badge}
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            {t.h1a}{" "}
            <span className="text-gradient">{t.h1b}</span>{" "}
            {t.h1c}
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-purple text-base h-12 px-8">
              <Link to={ctaTo}>
                {t.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8">
              <Link to="/pricing">{t.pricingBtn}</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">{t.ctaSub}</p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />)}
              <span className="ml-1">{t.social1}</span>
            </div>
            <span>·</span>
            <span>{t.social2}</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-3">
            <span className="text-gradient">{t.featuresTitle}</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">{t.featuresSub}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.features.map((f, i) => {
              const Icon = featureIcons[i] ?? Sparkles;
              return (
                <Card key={f.title} className="border-gradient p-6 hover:glow-purple transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-1">{f.title}</h3>
                  <p​​​​​​​​​​​​​​​​
