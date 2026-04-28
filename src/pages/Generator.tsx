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

  if (!idea?.trim()) {
    toast.error("Please enter an idea");
    return;
  }

  setLoading(true);

  try {
    console.log("🚀 Starting generation process...");

    let imageUrl: string | null = null;

    // === 1. העלאת התמונה ל-Supabase Storage ===
    if (imageFile && imageData) {
      const fileExt = imageFile.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      console.log(`Uploading image: ${fileName}`);

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        toast.error("Failed to upload image. Please try again.");
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
      console.log("✅ Image uploaded successfully:", imageUrl);
    }

    // === 2. הכנת ה-prompt ===
    const advancedNotes = [
      extremelyViral && "Push for maximum virality with bold pattern interrupts.",
      strongCTA && "Include a strong, direct sales CTA.",
      retention && "Optimize structure heavily for retention curve.",
      videoName && `User uploaded a reference video (${videoName}${videoDuration ? `, ${videoDuration}s` : ""}).`,
      selectedTones.length && `Tone: ${selectedTones.join(", ")}`,
      audience && `Audience: ${audience}`,
      niche && `Niche: ${niche}`,
    ].filter(Boolean).join(" | ");

    const enrichedIdea = `${idea}\n\nAdvanced instructions: ${advancedNotes}`;

    // === 3. קריאה ל-Edge Function ===
    console.log("Calling Edge Function with imageUrl:", !!imageUrl);

    const { data, error } = await supabase.functions.invoke("generate", {
      body: {
        idea: enrichedIdea,
        mode: goal,
        videoLength: length,
        imageUrl: imageUrl,     // ← שולח URL במקום base64
      },
    });

    if (error) {
      console.error("Edge Function Error:", error);
      toast.error(error.message || "Generation failed");
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from AI service");
    }

    console.log("✅ AI Response received successfully");

    // חישוב ציון ויראלי
    const viralScore = Math.round(
      ((data.viralityScore ?? 70) + (data.executionScore ?? 70) + (data.moneyScore ?? 70)) / 3
    ) || 75;

    // === 4. שמירה למסד הנתונים ===
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
        image_url: imageUrl || null,
        result: data,
        viral_score: viralScore,
      })
      .select()
      .single();

    if (saveErr) {
      console.error("Database save error:", saveErr);
      throw saveErr;
    }

    toast.success("🔥 Strategy generated successfully!");
    navigate(`/projects/${saved.id}`);

  } catch (err: any) {
    console.error("❌ handleGenerate Error:", err);
    toast.error(err.message || "Generation failed — please try again");
  } finally {
    setLoading(false);
  }
}