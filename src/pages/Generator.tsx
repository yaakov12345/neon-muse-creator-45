import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Sparkles, Image as ImageIcon, Video, Camera, Upload, X, ArrowRight, ArrowLeft,
  Loader2, Eye, DollarSign, Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const lengths = [
  { id: "10s", label: "10s", desc: "Ultra short" },
  { id: "15s", label: "15-20s", desc: "Recommended" },
  { id: "30s", label: "30-45s", desc: "Medium" },
  { id: "60s", label: "60s", desc: "Long" },
];
const goals = [
  { id: "both", label: "Both", icon: Sparkles, desc: "Views + Revenue" },
  { id: "views", label: "Views", icon: Eye, desc: "Maximum reach" },
  { id: "money", label: "Revenue", icon: DollarSign, desc: "Conversion focus" },
];
const tones = ["Aggressive", "Funny", "Emotional", "Storytelling", "Professional", "Motivational", "Relatable"];

const schema = z.object({
  idea: z.string().trim().min(5, "Add at least a few words about your product").max(2000),
  audience: z.string().trim().max(200).optional(),
  niche: z.string().trim().max(100).optional(),
});

export default function Generator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [niche, setNiche] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [length, setLength] = useState("15s");
  const [goal, setGoal] = useState("both");
  const [selectedTones, setSelectedTones] = useState<string[]>(["Storytelling", "Relatable"]);
  const [extremelyViral, setExtremelyViral] = useState(true);
  const [strongCTA, setStrongCTA] = useState(true);
  const [retention, setRetention] = useState(true);
  const [loading, setLoading] = useState(false);

  const imgInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const recordInput = useRef<HTMLInputElement>(null);

  function pickImage(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please upload an image");
    if (file.size > 8 * 1024 * 1024) return toast.error("Image too large (max 8MB)");
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(file);
  }

  function pickVideo(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("video/")) return toast.error("Please upload a video");
    if (file.size > 50 * 1024 * 1024) return toast.error("Video too large (max 50MB)");
    setVideoName(file.name);
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      setVideoDuration(Math.round(v.duration));
      URL.revokeObjectURL(url);
    };
    v.src = url;
    toast.success("Video added — we'll analyze its style and pacing.");
  }

  function toggleTone(t: string) {
    setSelectedTones((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function handleGenerate() {
    const parsed = schema.safeParse({ idea, audience, niche });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      setStep(1);
      return;
    }

    setLoading(true);
    const advancedNotes = [
      extremelyViral && "Push for maximum virality with bold pattern interrupts.",
      strongCTA && "Include a strong, direct sales CTA.",
      retention && "Optimize structure heavily for retention curve.",
      videoName && `User uploaded a reference video (${videoName}${videoDuration ? `, ${videoDuration}s` : ""}). Infer pacing/style and improve recommendations.`,
      selectedTones.length && `Tone preferences: ${selectedTones.join(", ")}.`,
      audience && `Target audience: ${audience}.`,
      niche && `Niche: ${niche}.`,
    ].filter(Boolean).join(" ");

    const enrichedIdea = `${idea}\n\n${advancedNotes}`;

    try {
      const { data, error } = await supabase.functions.invoke("generate-strategy", {
        body: {
          idea: enrichedIdea,
          mode: goal,
          videoLength: length,
          image: imageData,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Save to projects
      const viralScore =
        Math.round(((data.viralityScore ?? 70) + (data.executionScore ?? 70) + (data.moneyScore ?? 70)) / 3) || 75;

      const { data: saved, error: saveErr } = await supabase
        .from("projects")
        .insert({
          user_id: user!.id,
          title: idea.slice(0, 80),
          idea,
          niche,
          audience,
          video_length: length,
          goal,
          tones: selectedTones,
          image_url: imageData ? "embedded" : null,
          result: data,
          viral_score: viralScore,
        })
        .select()
        .single();

      if (saveErr) throw saveErr;
      toast.success("Strategy generated!");
      navigate(`/projects/${saved.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 py-8 md:py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Generate a <span className="text-gradient">viral strategy</span>
        </h1>
        <p className="text-muted-foreground">Three quick steps. Hooks, script, and a voiceover ready to publish.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
              step >= s ? "bg-gradient-primary text-primary-foreground glow-purple" : "bg-muted text-muted-foreground"
            )}>
              {s}
            </div>
            {s < 3 && <div className={cn("h-px w-12 transition-colors", step > s ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      {/* STEP 1: Media + idea */}
      {step === 1 && (
        <Card className="border-gradient p-6 md:p-8 space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Add media (optional but recommended)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MediaButton icon={ImageIcon} label="Upload Image" onClick={() => imgInput.current?.click()} active={!!imageData} />
              <MediaButton icon={Video} label="Upload Video" onClick={() => videoInput.current?.click()} active={!!videoName} />
              <MediaButton icon={Camera} label="Take Photo" onClick={() => cameraInput.current?.click()} />
              <MediaButton icon={Upload} label="Record Video" onClick={() => recordInput.current?.click()} />
            </div>
            <input ref={imgInput} type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0] ?? null)} />
            <input ref={videoInput} type="file" accept="video/*" hidden onChange={(e) => pickVideo(e.target.files?.[0] ?? null)} />
            <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={(e) => pickImage(e.target.files?.[0] ?? null)} />
            <input ref={recordInput} type="file" accept="video/*" capture="environment" hidden onChange={(e) => pickVideo(e.target.files?.[0] ?? null)} />

            {(imageData || videoName) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {imageData && (
                  <div className="relative">
                    <img src={imageData} alt="upload" className="h-24 w-24 object-cover rounded-lg border border-border" />
                    <button onClick={() => setImageData(null)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {videoName && (
                  <div className="relative px-4 py-3 bg-muted rounded-lg flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4 text-secondary" />
                    <span className="max-w-[180px] truncate">{videoName}</span>
                    {videoDuration && <span className="text-muted-foreground">· {videoDuration}s</span>}
                    <button onClick={() => { setVideoName(null); setVideoDuration(null); }} className="ml-2"><X className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="idea" className="text-base font-semibold mb-2 block">Product / idea description *</Label>
            <Textarea
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. Smart LED desk lamp with 16M colors, controlled by app. Solves eye strain for late-night gamers and remote workers."
              rows={5}
              maxLength={2000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{idea.length}/2000</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="audience">Target audience</Label>
              <Input id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Gen Z gamers, 18-28" maxLength={200} />
            </div>
            <div>
              <Label htmlFor="niche">Niche / category</Label>
              <Input id="niche" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. Tech gadgets" maxLength={100} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} className="bg-gradient-primary text-primary-foreground" disabled={!idea.trim()}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Settings */}
      {step === 2 && (
        <Card className="border-gradient p-6 md:p-8 space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Video length</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {lengths.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLength(l.id)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-all",
                    length === l.id ? "border-primary bg-primary/10 glow-purple" : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="font-semibold">{l.label}</div>
                  <div className="text-xs text-muted-foreground">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Goal</Label>
            <div className="grid sm:grid-cols-3 gap-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    "rounded-lg border p-3 flex items-center gap-3 transition-all text-left",
                    goal === g.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  )}
                >
                  <g.icon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">{g.label}</div>
                    <div className="text-xs text-muted-foreground">{g.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Tone (multi-select)</Label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTone(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    selectedTones.includes(t)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold mb-1 block">Advanced</Label>
            <ToggleRow label="Extremely viral" desc="Push pattern interrupts and shock value" value={extremelyViral} onChange={setExtremelyViral} />
            <ToggleRow label="Strong sales CTA" desc="Direct, conversion-focused calls to action" value={strongCTA} onChange={setStrongCTA} />
            <ToggleRow label="Focus on retention" desc="Optimize for full watch-through" value={retention} onChange={setRetention} />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={() => setStep(3)} className="bg-gradient-primary text-primary-foreground">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Generate */}
      {step === 3 && (
        <Card className="border-gradient p-8 md:p-12 text-center space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center glow-purple animate-pulse-glow">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold mb-2">Ready to generate</h2>
            <p className="text-muted-foreground text-sm">
              {videoName ? "Analyzing your video and " : ""}Crafting your viral strategy in {length} · {goal} mode
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={loading}
            className="h-14 px-10 text-base bg-gradient-primary text-primary-foreground glow-purple hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {videoName ? "Analyzing media..." : "Generating viral strategy..."}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Generate Viral Strategy
              </>
            )}
          </Button>

          <div className="pt-2">
            <Button variant="ghost" onClick={() => setStep(2)} disabled={loading}>
              <ArrowLeft className="h-4 w-4" /> Back to settings
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function MediaButton({ icon: Icon, label, onClick, active }: { icon: any; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 flex flex-col items-center gap-2 transition-all hover:border-primary/40 hover:bg-primary/5",
        active ? "border-primary bg-primary/10 glow-purple" : "border-border"
      )}
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 transition-colors text-left"
    >
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <div className={cn("h-6 w-11 rounded-full p-0.5 transition-colors", value ? "bg-primary" : "bg-muted")}>
        <div className={cn("h-5 w-5 rounded-full bg-background transition-transform", value && "translate-x-5")} />
      </div>
    </button>
  );
}
