import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { dishes } = await req.json();

    if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
      return new Response(JSON.stringify({ error: "Missing dishes array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    if (!YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY not configured");

    // Search for one video per dish (max 4 dishes)
    const results = await Promise.all(
      dishes.slice(0, 4).map(async (dish: string) => {
        const query = encodeURIComponent(`${dish} recipe`);
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&videoDuration=medium&key=${YOUTUBE_API_KEY}`;

        const resp = await fetch(url);
        if (!resp.ok) {
          const errBody = await resp.text();
          console.error(`YouTube search failed for "${dish}": ${resp.status}`, errBody);
          return null;
        }

        const data = await resp.json();
        const item = data.items?.[0];
        if (!item) return null;

        return {
          dish,
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
        };
      })
    );

    return new Response(JSON.stringify({ videos: results.filter(Boolean) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-recipe-videos error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Something went wrong" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
