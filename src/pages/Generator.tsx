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
    console.log("🚀 Starting generation...");

    let imageUrl: string | null = null;

    // === העלאת תמונה ===
    if (imageData) {
      let fileToUpload: File | Blob | null = null;

      if (imageFile instanceof File) {
        fileToUpload = imageFile;
      } else if (imageData instanceof File || imageData instanceof Blob) {
        fileToUpload = imageData;
      } else if (typeof imageData === "string" && imageData.startsWith("data:image")) {
        // אם זה base64 – המר ל-Blob
        const base64Response = await fetch(imageData);
        fileToUpload = await base64Response.blob();
      }

      if (fileToUpload) {
        // הגבלת גודל (מקסימום ~8MB)
        if (fileToUpload.size > 8 * 1024 * 1024) {
          toast.error("Image is too large. Please use image under 8MB.");
          throw new Error("Image too large");
        }

        const fileExt = fileToUpload.name?.split('.').pop()?.toLowerCase() || 'png';
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        console.log(`Uploading image: ${fileName} (${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB)`);

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload image");
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
        console.log("✅ Image uploaded:", imageUrl);
      }
    }

    // === הכנת prompt ===
    const advancedNotes = [
      extremelyViral && "Push for maximum virality with bold pattern interrupts.",
      strongCTA && "Include a strong, direct sales CTA.",
      retention && "Optimize structure heavily for retention curve.",
      videoName && `Reference video: ${videoName}`,
      selectedTones.length && `Tone: ${selectedTones.join(", ")}`,
      audience && `Audience: ${audience}`,
      niche && `Niche: ${niche}`,
    ].filter(Boolean).join(" | ");

    const enrichedIdea = `${idea}\n\nAdvanced instructions: ${advancedNotes}`;

    // === קריאה ל-Edge Function ===
    const { data, error } = await supabase.functions.invoke("generate", {
      body: {
        idea: enrichedIdea,
        mode: goal,
        videoLength: length,
        imageUrl: imageUrl,
      },
    });

    if (error) throw error;
    if (!data) throw new Error("No data returned from AI");

    const viralScore = Math.round(
      ((data.viralityScore ?? 70) + (data.executionScore ?? 70) + (data.moneyScore ?? 70)) / 3
    ) || 75;

    // שמירה ב-DB
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

    toast.success("🔥 Strategy generated successfully!");
    navigate(`/projects/${saved.id}`);

  } catch (err: any) {
    console.error("❌ handleGenerate failed:", err);
    toast.error(err.message || "Generation failed. Please try again.");
  } finally {
    setLoading(false);
  }
}