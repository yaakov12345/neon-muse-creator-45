import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, mode = "both", language = "AUTO", videoLength = "30s", image, imageUrl } = await req.json();

    if ((!idea || typeof idea !== "string" || !idea.trim()) && !image && !imageUrl) {
      return new Response(
        JSON.stringify({ error: "Missing 'idea' or image/imageUrl" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured in Supabase Edge Function secrets");
    }

    // העדפה ל-imageUrl (מומלץ), אחרת ניסיון עם base64
    const finalImage = imageUrl || image;

    const focus =
      mode === "views"
        ? "Bias outputs toward maximum reach, retention, and viral loops."
        : mode === "money"
        ? "Bias outputs toward revenue, conversion, and monetization funnels."
        : "Balance virality and monetization equally.";

    const languageRule =
      language && language !== "AUTO"
        ? `Respond ONLY in this language code: ${language}. Adapt currency and cultural style to that market (IL=₪, US=$, EU=€).`
        : `Auto-detect the user's language from their idea and respond ONLY in that language across ALL fields. Adapt currency and cultural style accordingly.`;

    const lengthGuidance: Record<string, string> = {
      "10s": "Structure for a 10-second video: 2 sections (0-3s hook, 3-10s payoff+CTA).",
      "15s": "Structure for a 15-second video: 3 sections (0-3s hook, 3-12s value, 12-15s CTA).",
      "20s": "Structure for a 20-second video: 3-4 sections.",
      "30s": "Structure for a 30-second video: 4 sections (0-3s hook, 3-10s setup, 10-25s value, 25-30s CTA).",
      "45s": "Structure for a 45-second video: 5 sections with clear time stamps.",
      "60s": "Structure for a 60-second video: 5-6 sections with mid-video re-hook.",
    };

    const lenRule = lengthGuidance[videoLength] || lengthGuidance["30s"];

    const systemPrompt = `You are Viralyx — the world's most advanced platform for viral short-form strategy and monetization (TikTok, Reels, YouTube Shorts). You are a senior marketing consultant with millions of views.

🌍 LANGUAGE: ${languageRule}

🎯 MODE: ${focus}

⏱ VIDEO LENGTH: ${videoLength}. ${lenRule}

You MUST call the viral_strategy function. Every field must be specific, strategic, creative, and based on 2026 best practices.
Use proven techniques: Curiosity Gap, Before/After, FOMO, Social Proof, Strong CTA.
Tone: professional, confident, warm, inspiring.`;

    const userContent = finalImage
      ? [
          {
            type: "text",
            text: `Product / idea: ${idea || "(Image only — analyze the product from the photo)"}\nVideo length: ${videoLength}\nMode: ${mode}\n\nAnalyze the uploaded image (colors, style, mood, materials) and weave those visual details into the hooks, script visuals, retention and monetization strategy. Generate the full Viralyx strategy.`,
          },
          { type: "image_url", image_url: { url: finalImage } },
        ]
      : `Product / idea: ${idea}\nVideo length: ${videoLength}\nMode: ${mode}\n\nGenerate the full Viralyx strategy.`;

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
          { role: "user", content: userContent },
        ],
        tools: [ /* כאן נשאיר את ה-tools כפי שהיה - הם ארוכים, לא שיניתי אותם */ ],
        tool_choice: { type: "function", function: { name: "viral_strategy" } },
      }),
    });

    // ... (שאר הטיפול בתגובה נשאר דומה, אבל עם לוגים טובים יותר)

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI Gateway Error ${response.status}:`, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a few moments." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured output from AI");
    }

    const args = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e: any) {
    console.error("❌ generate function error:", e);
    return new Response(
      JSON.stringify({ 
        error: e.message || "Internal server error",
        details: e.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});