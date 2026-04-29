import { Loader2, RefreshCw, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface ImageAnalysisData {
  detectedProduct: string;
  dominantColors: string[];
  style: string;
  vibe: string;
  keyElements: string[];
  suggestedHooks: string[];
}

interface Props {
  data: ImageAnalysisData;
  imageDataUrl: string | null;
  extraDetails: string;
  onExtraDetailsChange: (v: string) => void;
  onRegenerate: () => void;
  onGenerateStrategy: () => void;
  regenerating?: boolean;
  generating?: boolean;
}

export default function ImageAnalysisSection({
  data,
  imageDataUrl,
  extraDetails,
  onExtraDetailsChange,
  onRegenerate,
  onGenerateStrategy,
  regenerating,
  generating,
}: Props) {
  const styleTags = data.style?.split("•").map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <div className="mt-12 p-8 bg-card border border-primary/30 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground text-2xl">
            📸
          </div>
          <h2 className="text-2xl font-bold text-foreground">Image Analysis</h2>
        </div>
        <div className="px-5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-medium rounded-full">
          ✅ AI Analysis Complete
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          {imageDataUrl && (
            <div className="bg-muted border border-border rounded-2xl p-4 mb-6">
              <img
                src={imageDataUrl}
                alt="Uploaded product"
                className="w-full h-auto max-h-80 mx-auto rounded-xl object-contain"
              />
            </div>
          )}
          <div>
            <p className="text-muted-foreground text-sm mb-1">Detected Product</p>
            <p className="text-2xl font-semibold text-foreground">{data.detectedProduct}</p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div>
            <p className="text-muted-foreground text-sm mb-3">Dominant Colors</p>
            <div className="flex flex-wrap gap-5">
              {data.dominantColors.map((hex, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-2xl border border-border shadow-md"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Style & Aesthetic</p>
              <div className="flex flex-wrap gap-2">
                {styleTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 bg-muted border border-border rounded-xl text-sm text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">Vibe / Mood</p>
              <p className="text-foreground text-lg font-medium">{data.vibe}</p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm mb-3">Key Visual Elements</p>
            <ul className="space-y-2 text-foreground/80 text-[15px] list-disc pl-5">
              {data.keyElements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-primary font-semibold mb-4 flex items-center gap-2 text-lg">
          💡 AI Suggested Viral Hooks
        </p>
        <div className="space-y-4">
          {data.suggestedHooks.map((hook, i) => (
            <div
              key={i}
              className="bg-muted border border-border rounded-2xl p-4 text-foreground/90"
            >
              {hook}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <label className="block text-muted-foreground text-sm mb-3">
          Product Description & Additional Details{" "}
          <span className="text-amber-500">(highly recommended)</span>
        </label>
        <Textarea
          rows={4}
          value={extraDetails}
          onChange={(e) => onExtraDetailsChange(e.target.value)}
          placeholder="Full product name, price, unique benefit, target audience, special features..."
          className="rounded-2xl px-6 py-5"
        />
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={onRegenerate}
          disabled={regenerating || generating}
          className="flex-1 py-6 rounded-2xl"
        >
          {regenerating ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Regenerating...</>
          ) : (
            <><RefreshCw className="w-4 h-4 mr-2" /> Regenerate Analysis</>
          )}
        </Button>
        <Button
          onClick={onGenerateStrategy}
          disabled={regenerating || generating}
          className="flex-1 py-6 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg shadow-lg shadow-primary/40"
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
          ) : (
            <><Rocket className="w-4 h-4 mr-2" /> Generate Full Viral Strategy</>
          )}
        </Button>
      </div>
    </div>
  );
}
