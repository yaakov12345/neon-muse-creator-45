import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { idea, mode = "both", language = "EN" } = await req.json();
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
        ? "Optimize for reach, retention, and virality."
        : mode === "money"
        ? "Optimize for revenue, conversion, and monetization."
        : "Balance virality and monetization.";

    const systemPrompt = `You are an elite short-form content strategist for creators (TikTok, Reels, Shorts, YouTube). ${focus} Respond in language: ${language}. Be punchy, specific, and actionable. No fluff.`;

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
          { role: "user", content: `Idea / product: ${idea}\n\nGenerate a viral strategy.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "viral_strategy",
              description: "Return a viral content strategy with 4 components.",
              parameters: {
                type: "object",
                properties: {
                  hook: { type: "string", description: "A scroll-stopping viral hook (1-3 sentences)." },
                  script: { type: "string", description: "A 30-45s video script with timestamps and beats." },
                  monetization: { type: "string", description: "Concrete monetization plan with bullet points." },
                  caption: { type: "string", description: "Caption + 5-7 relevant hashtags." },
                },
                required: ["hook", "script", "monetization", "caption"],
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
