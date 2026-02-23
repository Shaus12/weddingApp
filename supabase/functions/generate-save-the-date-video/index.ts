/**
 * Generate Save The Date video (8–12s, 1080x1920).
 * Inputs: userId, names, weddingDate, style, photo reference.
 * Output: { videoUrl } — URL to mp4 (e.g. from storage).
 *
 * Production: use user photo(s) + motion graphics (Ken Burns, light leaks, bokeh);
 * overlay text (names, date, "Save the Date") rendered by us, not AI.
 * This stub returns a placeholder URL for development.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Placeholder 9:16 vertical mp4 for development; replace with real storage URL in production
const PLACEHOLDER_VIDEO_URL =
  "https://assets.mixkit.co/active_storage/video_items/99935/1717720529/99935-video-720.mp4";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      userId,
      partner1Name,
      partner2Name,
      weddingDate,
      style,
      photoReferenceUri,
    } = body;

    // Optional: validate inputs
    if (!partner1Name || !partner2Name) {
      return new Response(
        JSON.stringify({ error: "partner1Name and partner2Name required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // TODO: In production:
    // 1. Download photoReferenceUri if provided
    // 2. Generate video with motion graphics (Ken Burns, light leaks) + overlay text
    // 3. Upload result to Supabase Storage
    // 4. Return public URL
    // For now simulate ~2s delay and return placeholder
    await new Promise((r) => setTimeout(r, 2000));

    const videoUrl = PLACEHOLDER_VIDEO_URL;

    return new Response(JSON.stringify({ videoUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
