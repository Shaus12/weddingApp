/**
 * GET status/URL for a Save The Date video (installationId + date).
 * Query params: installationId, date (YYYY-MM-DD).
 * Returns: { videoUrl?: string, status?: string }.
 * Production: look up storage/DB for completed video; return videoUrl when ready.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const url = new URL(req.url);
    const installationId = url.searchParams.get("installationId");
    const date = url.searchParams.get("date");

    if (!installationId || !date) {
      return new Response(
        JSON.stringify({ error: "installationId and date required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // TODO: In production, look up Supabase Storage or DB for (installationId, date).
    // If a video was generated and stored, return { videoUrl: "https://..." }.
    // Otherwise return { status: "pending" } or {}.
    const result: { videoUrl?: string; status?: string } = {};
    // Stub: no server-side storage yet; client relies on POST response and local cache.
    result.status = "pending";

    return new Response(JSON.stringify(result), {
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
