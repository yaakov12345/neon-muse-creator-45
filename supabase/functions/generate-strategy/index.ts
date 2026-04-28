import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { idea, mode = "both", language = "AUTO" } = await req.json();
    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return new Response(JSON.stringify({ error: "Missing 'idea'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const focus =
      mode === "views"
        ? "Bias every score, hook, and plan toward maximum reach, retention, and virality."
        : mode === "money"
        ? "Bias every score, hook, and plan toward revenue, conversion, and monetization."
        : "Balance virality and monetization equally.";

    const languageRule =
      language && language !== "AUTO"
        ? `Respond ONLY in this language code: ${language}.`
        : `Detect the language of the user's idea automatically (Hebrew, English, Spanish, Arabic, French, etc.) and respond ONLY in that language. Keep tone natural, simple, human.`;

    const systemPrompt = `You are an elite AI system combining: viral content strategist, performance marketing expert, monetization engine, behavioral psychology expert, and daily content growth system.

🌍 LANGUAGE: ${languageRule}

🎯 GOAL: Turn any idea into (1) viral short-form content, (2) monetization strategy, (3) daily content growth system.

${focus}

⚠️ RULES:
- No fluff, no long explanations.
- Must work for ANY niche.
- Feel like a professional growth tool.
- Encourage daily usage.
- Scores are integers 1-10.
- Video script: 3-5 steps, each step has a visual + spoken line.
- Hashtags: exactly 5 global hashtags (with #).
- Caption: short, natural, engaging.

You MUST call the viral_strategy function with all required fields.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Idea / product: ${idea}\n\nGenerate the full elite viral growth strategy.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "viral_strategy",
              description: "Return an elite viral growth strategy with scores, hook, script, monetization, series, daily idea, improvement tip, caption, and hashtags.",
              parameters: {
                type: "object",
                properties: {
                  viralityScore: { type: "integer", minimum: 1, maximum: 10 },
                  viralityReason: { type: "string", description: "Short reason for the virality score." },
                  moneyScore: { type: "integer", minimum: 1, maximum: 10 },
                  moneyReason: { type: "string", description: "Short reason for the money score." },
                  executionScore: { type: "integer", minimum: 1, maximum: 10 },
                  executionReason: { type: "string", description: "Short reason for the execution score." },
                  hook: { type: "string", description: "ONE strong scroll-stopping sentence." },
                  scriptSteps: {
                    type: "array",
                    minItems: 3,
                    maxItems: 5,
                    items: {
                      type: "object",
                      properties: {
                        visual: { type: "string", description: "What is shown on screen." },
                        spoken: { type: "string", description: "What is said / on-screen text." },
                      },
                      required: ["visual", "spoken"],
                      additionalProperties: false,
                    },
                  },
                  monetizationMethod: {
                    type: "string",
                    enum: ["affiliate", "product", "service", "lead generation"],
                  },
                  monetizationPlan: { type: "string", description: "Short, concrete explanation of the monetization method." },
                  seriesStrategy: { type: "string", description: "How to turn this into a 5-10 video series." },
                  dailyIdea: { type: "string", description: "One new related idea the user can post tomorrow." },
                  improvementTip: { type: "string", description: "One simple optimization tip for next time." },
                  caption: { type: "string", description: "Short, natural, engaging caption." },
                  hashtags: {
                    type: "array",
                    minItems: 5,
                    maxItems: 5,
                    items: { type: "string", description: "Global hashtag starting with #." },
                  },
                },
                required: [
                  "viralityScore", "viralityReason",
                  "moneyScore", "moneyReason",
                  "executionScore", "executionReason",
                  "hook", "scriptSteps",
                  "monetizationMethod", "monetizationPlan",
                  "seriesStrategy", "dailyIdea", "improvementTip",
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
