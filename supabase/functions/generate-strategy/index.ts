import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { idea, mode = "both", language = "AUTO", videoLength = "30s", image } = await req.json();
    if ((!idea || typeof idea !== "string" || !idea.trim()) && !image) {
      return new Response(JSON.stringify({ error: "Missing 'idea' or 'image'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const focus =
      mode === "views"
        ? "Bias outputs toward maximum reach, retention, and viral loops."
        : mode === "money"
        ? "Bias outputs toward revenue, conversion, and monetization funnels."
        : "Balance virality and monetization equally.";

    const languageRule =
      language && language !== "AUTO"
        ? `Respond ONLY in this language code: ${language}. Adapt currency and cultural style to that market (IL=₪, US=$, EU=€). No mixing languages.`
        : `Auto-detect the user's language from their idea (Hebrew, English, Spanish, Arabic, French, German, Portuguese, etc.) and respond ONLY in that language across ALL fields. Adapt currency and cultural style to that market (IL=₪, US=$, EU=€). No mixing.`;

    const lengthGuidance: Record<string, string> = {
      "10s": "Structure the script for a 10-second video: 2 sections (0-3s hook, 3-10s payoff+CTA).",
      "15s": "Structure the script for a 15-second video: 3 sections (0-3s hook, 3-12s value, 12-15s CTA).",
      "20s": "Structure the script for a 20-second video: 3-4 sections (0-3s hook, 3-15s value, 15-20s CTA).",
      "30s": "Structure the script for a 30-second video: 4 sections (0-3s hook, 3-10s setup, 10-25s value, 25-30s CTA).",
      "45s": "Structure the script for a 45-second video: 5 sections with clear time stamps.",
      "60s": "Structure the script for a 60-second video: 5-6 sections with clear time stamps and a mid-video re-hook.",
    };
    const lenRule = lengthGuidance[videoLength] || lengthGuidance["30s"];

    const systemPrompt = `You are Viralyx — the world's most advanced platform for viral strategy + monetization on TikTok, Instagram Reels and YouTube Shorts. You operate as a senior marketing consultant + creator with millions of views. You are an expert in viral psychology, hook science, retention techniques, short-form storytelling and monetization funnels.

🌍 LANGUAGE: ${languageRule}

🎯 MODE: ${focus}

⏱ VIDEO LENGTH: ${videoLength}. ${lenRule}

You MUST call the viral_strategy function. Every field must be specific, strategic, creative, based on 2026 best practices. Use proven viral techniques: Curiosity Gap, Before/After, FOMO, Social Proof, Strong CTA. Tone: professional, confident, warm, inspiring. No fluff.

REQUIREMENTS:
- 4 scores 1–10 with sharp 1–2 sentence reasons each.
- topHooks: exactly 5 powerful 3-second opening hooks tailored to the video length. Mark the strongest one's "isStrongest": true (only one).
- scriptSteps: full timed script. Each step has a precise timestamp range (e.g. "0-3s", "3-10s"), spoken text (natural and exact), and visual description. Match the count to the chosen video length.
- retentionStructure: advanced techniques to keep viewers till the end + create rewatch value.
- engagementBoosters: 4-5 strong comment bait / engagement ideas.
- monetization: concrete revenue angles localized to the user's market and currency.
- distributionTips: best posting hours, recommended hashtags, trending sounds, algorithm tips.
- Plus the daily growth loop, SaaS/subscription engine, and TikTok user acquisition engine fields for the in-app dashboard.
- caption: short and natural. hashtags: exactly 5 with #.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: image
              ? [
                  { type: "text", text: `Product / idea: ${idea || "(image only — infer the product from the photo)"}\nVideo length: ${videoLength}\nMode: ${mode}\n\nThe user uploaded a product image. Analyze its colors, style, materials, mood and visual details, then weave those specifics into the hooks, script visuals, retention plan and monetization angles. Generate the full Viralyx strategy.` },
                  { type: "image_url", image_url: { url: image } },
                ]
              : `Product / idea: ${idea}\nVideo length: ${videoLength}\nMode: ${mode}\n\nGenerate the full Viralyx strategy.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "viral_strategy",
              description: "Return the full Viralyx viral + monetization strategy.",
              parameters: {
                type: "object",
                properties: {
                  viralityScore: { type: "integer", minimum: 1, maximum: 10 },
                  viralityReason: { type: "string" },
                  moneyScore: { type: "integer", minimum: 1, maximum: 10 },
                  moneyReason: { type: "string" },
                  subscriptionScore: { type: "integer", minimum: 1, maximum: 10 },
                  subscriptionReason: { type: "string" },
                  executionScore: { type: "integer", minimum: 1, maximum: 10 },
                  executionReason: { type: "string" },

                  topHooks: {
                    type: "array",
                    minItems: 5,
                    maxItems: 5,
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        isStrongest: { type: "boolean" },
                      },
                      required: ["text", "isStrongest"],
                      additionalProperties: false,
                    },
                  },

                  hook: { type: "string", description: "The single strongest viral hook (first 3s)." },
                  scriptSteps: {
                    type: "array",
                    minItems: 2,
                    maxItems: 6,
                    items: {
                      type: "object",
                      properties: {
                        time: { type: "string", description: "Time range like '0-3s'." },
                        spoken: { type: "string" },
                        visual: { type: "string" },
                      },
                      required: ["time", "spoken", "visual"],
                      additionalProperties: false,
                    },
                  },

                  retentionStructure: { type: "string" },
                  engagementBoosters: {
                    type: "array",
                    minItems: 4,
                    maxItems: 5,
                    items: { type: "string" },
                  },
                  commentBait: { type: "string" },
                  viralLoopTip: { type: "string" },
                  distributionPlan: { type: "string" },
                  distributionTips: { type: "string", description: "Posting hours, hashtags, trending sounds, algorithm tips." },

                  monetizationModel: {
                    type: "string",
                    enum: ["freemium", "subscription", "creator toolkit", "automation tool"],
                  },
                  monetizationPlan: { type: "string" },
                  whyPeoplePay: { type: "string" },
                  premiumFeature: { type: "string" },
                  pricingSuggestion: { type: "string" },

                  dailyIdea: { type: "string" },
                  dailyChallenge: { type: "string" },
                  streakMotivation: { type: "string" },
                  improvementTip: { type: "string" },
                  returnHook: { type: "string" },
                  seriesSystem: { type: "string" },

                  acquisitionVideoConcept: { type: "string" },
                  acquisitionHook: { type: "string" },
                  problemToToolAngle: { type: "string" },
                  acquisitionScript: { type: "string" },
                  viralPostIdea: { type: "string" },
                  acquisitionCtaLoop: { type: "string" },
                  viralSeed: { type: "string" },
                  acquisitionHashtags: {
                    type: "array",
                    minItems: 5,
                    maxItems: 5,
                    items: { type: "string" },
                  },

                  caption: { type: "string" },
                  hashtags: {
                    type: "array",
                    minItems: 5,
                    maxItems: 5,
                    items: { type: "string" },
                  },
                },
                required: [
                  "viralityScore", "viralityReason",
                  "moneyScore", "moneyReason",
                  "subscriptionScore", "subscriptionReason",
                  "executionScore", "executionReason",
                  "topHooks", "hook", "scriptSteps",
                  "retentionStructure", "engagementBoosters", "commentBait", "viralLoopTip",
                  "distributionPlan", "distributionTips",
                  "monetizationModel", "monetizationPlan", "whyPeoplePay", "premiumFeature", "pricingSuggestion",
                  "dailyIdea", "dailyChallenge", "streakMotivation", "improvementTip", "returnHook", "seriesSystem",
                  "acquisitionVideoConcept", "acquisitionHook", "problemToToolAngle", "acquisitionScript",
                  "viralPostIdea", "acquisitionCtaLoop", "viralSeed", "acquisitionHashtags",
                  "caption", "hashtags",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "viral_strategy" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured output returned");
    const args = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-strategy error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
