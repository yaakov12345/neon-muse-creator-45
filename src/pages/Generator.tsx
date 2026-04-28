async function handleGenerate() {
  const parsed = schema.safeParse({ idea, audience, niche });

  if (!parsed.success) {
    toast.error(parsed.error.issues[0].message);
    setStep(1);
    return;
  }

  if (!user) {
    toast.error("You must be logged in");
    return;
  }

  setLoading(true);

  const advancedNotes = [
    extremelyViral && "Push for maximum virality with bold pattern interrupts.",
    strongCTA && "Include a strong, direct sales CTA.",
    retention && "Optimize structure heavily for retention curve.",
    videoName && `User uploaded a reference video (${videoName}${videoDuration ? `, ${videoDuration}s` : ""}).`,
    selectedTones.length && `Tone: ${selectedTones.join(", ")}`,
    audience && `Audience: ${audience}`,
    niche && `Niche: ${niche}`,
  ].filter(Boolean).join(" ");

  const enrichedIdea = `${idea}\n\n${advancedNotes}`;

  try {
    console.log("🚀 Calling function...");

    const { data, error } = await supabase.functions.invoke("generate", {
      body: {
        idea: enrichedIdea,
        mode: goal,
        videoLength: length,
        image: imageData,
      },
    });

    console.log("📦 RESPONSE:", data, error);

    if (error) throw error;
    if (!data) throw new Error("No data returned");

    const viralScore =
      Math.round(((data.viralityScore ?? 70) + (data.executionScore ?? 70) + (data.moneyScore ?? 70)) / 3) || 75;

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
        image_url: imageData ? "embedded" : null,
        result: data,
        viral_score: viralScore,
      })
      .select()
      .single();

    if (saveErr) throw saveErr;

    toast.success("🔥 Strategy generated!");
    navigate(`/projects/${saved.id}`);

  } catch (err) {
    console.error("❌ ERROR:", err);
    toast.error("Generation failed — check console");
  } finally {
    setLoading(false);
  }
}