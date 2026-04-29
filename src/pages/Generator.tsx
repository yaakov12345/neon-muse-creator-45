import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Upload } from "lucide-react";
import ImageAnalysisSection, { ImageAnalysisData } from "@/components/ImageAnalysisSection";

const schema = z.object({
  idea: z.string().trim().min(3, "Idea must be at least 3 characters").max(2000),
  audience: z.string().trim().max(200).optional().or(z.literal("")),
  niche: z.string().trim().max(200).optional().or(z.literal("")),
});

const TONES = ["Bold", "Funny", "Educational", "Emotional", "Luxury", "Edgy"];

export default function Generator() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [niche, setNiche] = useState("");
  const [length, setLength] = useState("30s");
  const [goal, setGoal] = useState<"views" | "money" | "both">("both");
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [extremelyViral, setExtremelyViral] = useState(true);
  const [strongCTA, setStrongCTA] = useState(true);
  const [retention, setRetention] = useState(true);
  const [videoName, setVideoName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysisData | null>(null);
  const [analysisImageUrl, setAnalysisImageUrl] = useState<string | null>(null);
  const [analysisFilePath, setAnalysisFilePath] = useState<string | null>(null);
  const [extraDetails, setExtraDetails] = useState("");
  function toggleTone(t: string) {
    setSelectedTones((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image too large (max 8MB)");
      return;
    }
    setImageFile(file);
    setAnalysis(null);
    setAnalysisImageUrl(null);
    setAnalysisFilePath(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageData(dataUrl);
      // Kick off analysis automatically
      void analyzeImage(file);
    };
    reader.readAsDataURL(file);
  }

  async function uploadAndSign(file: File): Promise<{ filePath: string; signedUrl: string } | null> {
    if (!user) return null;
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (upErr) {
      console.error(upErr);
      return null;
    }
    const { data: signed } = await supabase.storage
      .from("project-images")
      .createSignedUrl(filePath, 3600);
    if (!signed?.signedUrl) return null;
    return { filePath, signedUrl: signed.signedUrl };
  }

  async function analyzeImage(file: File) {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    setAnalyzing(true);
    try {
      let signedUrl = analysisImageUrl;
      let filePath = analysisFilePath;
      if (!signedUrl || !filePath) {
        const uploaded = await uploadAndSign(file);
        if (!uploaded) throw new Error("Image upload failed");
        signedUrl = uploaded.signedUrl;
        filePath = uploaded.filePath;
        setAnalysisImageUrl(signedUrl);
        setAnalysisFilePath(filePath);
      }
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: { imageUrl: signedUrl },
      });
      if (error) throw error;
      if (!data || data.error) throw new Error(data?.error || "Analysis failed");
      setAnalysis(data as ImageAnalysisData);
      toast.success("✨ Image analyzed");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleRegenerateAnalysis() {
    if (imageFile) await analyzeImage(imageFile);
  }

  async function handleGenerate() {
    const parsed = schema.safeParse({ idea, audience, niche });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Validation failed");
      setStep(1);
      return;
    }
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | null = analysisImageUrl;

      // Upload now if user skipped analysis (no image uploaded yet)
      if (!imageUrl && imageData && imageFile) {
        const uploaded = await uploadAndSign(imageFile);
        if (uploaded) {
          imageUrl = uploaded.signedUrl;
          setAnalysisImageUrl(uploaded.signedUrl);
          setAnalysisFilePath(uploaded.filePath);
        }
      }

      const analysisNotes = analysis
        ? [
            `Detected product: ${analysis.detectedProduct}`,
            `Vibe: ${analysis.vibe}`,
            `Style: ${analysis.style}`,
            `Dominant colors: ${analysis.dominantColors.join(", ")}`,
            `Key visual elements: ${analysis.keyElements.join("; ")}`,
            `AI-suggested hooks: ${analysis.suggestedHooks.join(" | ")}`,
          ].join("\n")
        : "";

      const advancedNotes = [
        extremelyViral && "Push for maximum virality with bold pattern interrupts.",
        strongCTA && "Include a strong, direct sales CTA.",
        retention && "Optimize structure heavily for retention curve.",
        videoName && `Reference video: ${videoName}`,
        selectedTones.length && `Tone: ${selectedTones.join(", ")}`,
        audience && `Audience: ${audience}`,
        niche && `Niche: ${niche}`,
        extraDetails && `Extra product details: ${extraDetails}`,
      ]
        .filter(Boolean)
        .join(" | ");

      const enrichedIdea = `${idea}${analysisNotes ? `\n\nVisual analysis:\n${analysisNotes}` : ""}\n\nAdvanced instructions: ${advancedNotes}`;

      const { data, error } = await supabase.functions.invoke("generate-strategy", {
        body: { idea: enrichedIdea, mode: goal, videoLength: length, imageUrl },
      });
      if (error) throw error;
      if (!data) throw new Error("No data returned");

      const viralScore =
        Math.round(
          ((data?.viralityScore ?? 70) + (data?.executionScore ?? 70) + (data?.moneyScore ?? 70)) / 3
        ) || 75;

      const { data: saved, error: saveErr } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: idea.slice(0, 80),
          idea,
          niche,
          audience,
          video_length: length,
          goal,
          tones: selectedTones,
          image_url: imageUrl,
          result: data,
          viral_score: viralScore,
        })
        .select()
        .single();

      if (saveErr) throw saveErr;

      toast.success("🔥 Strategy generated!");
      navigate(`/projects/${saved.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Viral Generator
        </h1>
        <p className="text-muted-foreground mt-2">Turn your idea into a viral strategy</p>
      </div>

      <Card className="p-6 space-y-6 backdrop-blur-md bg-card/60 border-primary/20">
        <div className="space-y-2">
          <Label>Your Product / Idea *</Label>
          <Textarea
            placeholder="Describe your product, service, or content idea..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Audience</Label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Gen Z women" />
          </div>
          <div className="space-y-2">
            <Label>Niche</Label>
            <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. skincare" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Video Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["10s", "15s", "20s", "30s", "45s", "60s"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Goal</Label>
            <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Maximum Views</SelectItem>
                <SelectItem value="money">Maximum Money</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tone (multi-select)</Label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Button
                key={t}
                type="button"
                size="sm"
                variant={selectedTones.includes(t) ? "default" : "outline"}
                onClick={() => toggleTone(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Reference Image (optional)</Label>
          <label className="flex items-center gap-2 cursor-pointer border border-dashed border-primary/40 rounded-lg p-4 hover:bg-primary/5 transition">
            <Upload className="w-4 h-4" />
            <span className="text-sm">{imageFile?.name || "Upload product image (auto-analyzed)"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
          </label>
          {analyzing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing image with AI...
            </div>
          )}
          {imageData && !analysis && !analyzing && (
            <img src={imageData} alt="preview" className="mt-2 max-h-40 rounded-lg" />
          )}
        </div>

        {!analysis && (
          <Button
            onClick={handleGenerate}
            disabled={loading || analyzing || !idea.trim()}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Generate Viral Strategy</>
            )}
          </Button>
        )}
      </Card>

      {analysis && (
        <ImageAnalysisSection
          data={analysis}
          imageDataUrl={imageData}
          extraDetails={extraDetails}
          onExtraDetailsChange={setExtraDetails}
          onRegenerate={handleRegenerateAnalysis}
          onGenerateStrategy={handleGenerate}
          regenerating={analyzing}
          generating={loading}
        />
      )}
    </div>
  );
}
