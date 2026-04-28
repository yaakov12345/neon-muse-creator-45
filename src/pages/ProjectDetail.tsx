import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2, ArrowLeft, Copy, Mic, Download, Play, Pause, Sparkles, Flame,
  TrendingUp, DollarSign, Target, MessageCircle, Hash,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const VOICES = [
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George (Warm)" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Friendly)" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam (Bold)" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte (Clear)" },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian (Deep)" },
];

interface ScriptStep { time: string; visual: string; spoken: string; }
interface TopHook { text: string; isStrongest: boolean; }

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [generatingTTS, setGeneratingTTS] = useState(false);
  const [voiceId, setVoiceId] = useState(VOICES[0].id);

  useEffect(() => {
    if (!id) return;
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
    if (error) toast.error(error.message);
    setProject(data);
    setLoading(false);
  }

  function buildSpokenScript(): string {
    const r = project?.result;
    if (!r) return "";
    const hook = r.topHooks?.find((h: TopHook) => h.isStrongest)?.text || r.hook || "";
    const lines: string[] = [];
    if (hook) lines.push(hook);
    if (Array.isArray(r.scriptSteps)) {
      r.scriptSteps.forEach((s: ScriptStep) => s.spoken && lines.push(s.spoken));
    }
    return lines.join(". ");
  }

  async function generateVoiceover() {
    const text = buildSpokenScript();
    if (!text) return toast.error("No script available");
    setGeneratingTTS(true);
    setAudioUrl(null);
    try {
      const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
        body: { text, voiceId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const url = `data:audio/mpeg;base64,${data.audioContent}`;
      setAudioUrl(url);
      const a = new Audio(url);
      a.onended = () => setPlaying(false);
      setAudio(a);
      toast.success("Voiceover ready");
    } catch (e: any) {
      toast.error(e?.message || "Voiceover failed");
    } finally {
      setGeneratingTTS(false);
    }
  }

  function togglePlay() {
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  }

  function copyScript() {
    const r = project?.result;
    if (!r) return;
    const text = [
      `HOOK: ${r.topHooks?.find((h: TopHook) => h.isStrongest)?.text || r.hook || ""}`,
      "",
      "SCRIPT:",
      ...(r.scriptSteps || []).map((s: ScriptStep) => `[${s.time}] 🗣 ${s.spoken} | 🎬 ${s.visual}`),
      "",
      `CAPTION: ${r.caption || ""}`,
      `HASHTAGS: ${(r.hashtags || []).join(" ")}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Script copied");
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!project) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">Project not found</p>
      <Button asChild><Link to="/projects">Back to projects</Link></Button>
    </div>
  );

  const r = project.result || {};
  const score = project.viral_score ?? 75;
  const topHooks: TopHook[] = r.topHooks || (r.hook ? [{ text: r.hook, isStrongest: true }] : []);
  const steps: ScriptStep[] = r.scriptSteps || [];

  return (
    <div className="px-4 sm:px-6 py-6 md:py-10 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/projects"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyScript}><Copy className="h-4 w-4" /> Copy</Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => navigate("/generator")}>
            <Sparkles className="h-4 w-4" /> New
          </Button>
        </div>
      </div>

      {/* Title + score */}
      <Card className="border-gradient p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{project.title}</h1>
            <div className="flex flex-wrap gap-1.5">
              {project.video_length && <Tag>{project.video_length}</Tag>}
              {project.goal && <Tag>{project.goal}</Tag>}
              {project.niche && <Tag>{project.niche}</Tag>}
            </div>
          </div>
          <ScoreGauge score={score} />
        </div>
      </Card>

      {/* Voiceover */}
      <Card className="border-gradient p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Mic className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold">AI Voiceover</h2>
            <p className="text-xs text-muted-foreground">Studio-quality narration powered by ElevenLabs.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="flex-1 h-10 rounded-md bg-input border border-border px-3 text-sm"
            disabled={generatingTTS}
          >
            {VOICES.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <Button onClick={generateVoiceover} disabled={generatingTTS} className="bg-gradient-primary text-primary-foreground">
            {generatingTTS ? (<><Loader2 className="h-4 w-4 animate-spin" /> Generating with ElevenLabs...</>) : (<><Mic className="h-4 w-4" /> Generate Voiceover</>)}
          </Button>
        </div>

        {audioUrl && (
          <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-muted">
            <Button size="sm" variant="ghost" onClick={togglePlay} className="h-9 w-9 p-0 rounded-full bg-primary text-primary-foreground hover:opacity-90">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <audio src={audioUrl} controls className="flex-1 h-9" />
            <Button size="sm" variant="outline" asChild>
              <a href={audioUrl} download="voiceover.mp3"><Download className="h-4 w-4" /></a>
            </Button>
          </div>
        )}
      </Card>

      {/* Hooks */}
      {topHooks.length > 0 && (
        <Card className="border-gradient p-6">
          <SectionTitle icon={Flame} title="Hook Variations" subtitle="Top hooks ranked by virality." />
          <div className="space-y-2 mt-4">
            {topHooks.map((h, i) => (
              <div key={i} className={cn(
                "p-4 rounded-lg border transition-colors",
                h.isStrongest ? "border-primary bg-primary/10 glow-purple" : "border-border bg-card"
              )}>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-muted-foreground mt-1">#{i + 1}</span>
                  <p className="flex-1 text-sm leading-relaxed">{h.text}</p>
                  {h.isStrongest && <Flame className="h-4 w-4 text-primary shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Script */}
      {steps.length > 0 && (
        <Card className="border-gradient p-6">
          <SectionTitle icon={Play} title="Full Script" subtitle="Frame-by-frame with timestamps." />
          <div className="space-y-3 mt-4">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="text-xs font-mono font-bold text-primary shrink-0 w-16">{s.time}</div>
                <div className="flex-1 space-y-2">
                  <div><span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2">Spoken</span><span className="text-sm">{s.spoken}</span></div>
                  <div><span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2">Visual</span><span className="text-sm text-muted-foreground">{s.visual}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Retention */}
      {(r.retentionStructure || r.engagementBoosters?.length) && (
        <Card className="border-gradient p-6">
          <SectionTitle icon={TrendingUp} title="Retention & Editing Tips" />
          {r.retentionStructure && <p className="text-sm text-muted-foreground mt-3">{r.retentionStructure}</p>}
          {r.engagementBoosters?.length > 0 && (
            <ul className="mt-4 space-y-2">
              {r.engagementBoosters.map((b: string, i: number) => (
                <li key={i} className="flex gap-2 text-sm"><span className="text-primary">•</span>{b}</li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* Monetization */}
      {(r.monetizationModel || r.monetizationPlan) && (
        <Card className="border-gradient p-6">
          <SectionTitle icon={DollarSign} title="Monetization Strategy" />
          {r.monetizationModel && <p className="text-sm font-semibold mt-3">{r.monetizationModel}</p>}
          {r.monetizationPlan && <p className="text-sm text-muted-foreground mt-2">{r.monetizationPlan}</p>}
          {r.pricingSuggestion && <p className="text-sm mt-2"><span className="text-muted-foreground">Pricing: </span>{r.pricingSuggestion}</p>}
        </Card>
      )}

      {/* Caption + hashtags */}
      {(r.caption || r.hashtags?.length) && (
        <Card className="border-gradient p-6">
          <SectionTitle icon={Hash} title="Caption & Hashtags" />
          {r.caption && <p className="text-sm mt-3 p-3 bg-muted rounded-lg">{r.caption}</p>}
          {r.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {r.hashtags.map((h: string, i: number) => (
                <span key={i} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">{h.startsWith("#") ? h : `#${h}`}</span>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">{children}</span>
);

function SectionTitle({ icon: Icon, title, subtitle }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="url(#g)" strokeWidth="8" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold">{pct}</span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Viral</span>
      </div>
    </div>
  );
}
