import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- Abuse protection -------------------------------------------------------

const HOUR = 3600;
const DAY = 86400;
// Each YouTube search costs 100 of the default 10,000 daily quota units;
// keep a margin so the quota is never exhausted.
const LIMITS = { ipHour: 30, ipDay: 100, youtubeSearchesDay: 90 };
const CACHE_DAYS = 30;

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const clientIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") ??
  req.headers.get("x-real-ip") ??
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
  "unknown";

// Counts a hit against each [key, limit, windowSeconds]; false once any is exceeded.
// Fails open so a limiter outage doesn't take the app down.
const withinLimits = async (limits: [string, number, number][]) => {
  for (const [key, limit, windowSeconds] of limits) {
    const { data, error } = await supabaseAdmin.rpc("hit_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.error("Rate limit check failed:", error.message);
      return true;
    }
    if (data === false) return false;
  }
  return true;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type Video = { dish: string; videoId: string; title: string; thumbnail: string; channelTitle: string };

const dishKey = (dish: string) => dish.trim().toLowerCase();

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { dishes } = await req.json();

    if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
      return json({ error: "Missing dishes array" }, 400);
    }
    if (!dishes.every((d) => typeof d === "string" && d.trim() && d.length <= 120)) {
      return json({ error: "Invalid dishes" }, 400);
    }

    const ip = clientIp(req);
    const allowed = await withinLimits([
      [`videos:ip:${ip}:hour`, LIMITS.ipHour, HOUR],
      [`videos:ip:${ip}:day`, LIMITS.ipDay, DAY],
    ]);
    // Videos are a nice-to-have; over the limit the menu simply shows none.
    if (!allowed) return json({ videos: [] });

    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    if (!YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY not configured");

    // Max 4 dishes, one video each
    const wanted: string[] = dishes.slice(0, 4);

    const since = new Date(Date.now() - CACHE_DAYS * DAY * 1000).toISOString();
    const { data: cachedRows, error: cacheError } = await supabaseAdmin
      .from("recipe_video_cache")
      .select("dish_key, video")
      .in("dish_key", wanted.map(dishKey))
      .gte("created_at", since);
    if (cacheError) console.error("Video cache read failed:", cacheError.message);
    const cached = new Map((cachedRows ?? []).map((r) => [r.dish_key, r.video as Omit<Video, "dish"> | null]));

    const results = await Promise.all(
      wanted.map(async (dish): Promise<Video | null> => {
        const key = dishKey(dish);
        if (cached.has(key)) {
          const video = cached.get(key);
          return video ? { ...video, dish } : null;
        }

        if (!(await withinLimits([["youtube:global:day", LIMITS.youtubeSearchesDay, DAY]]))) return null;

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
        const video = item
          ? {
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
          }
          : null;

        const { error: writeError } = await supabaseAdmin
          .from("recipe_video_cache")
          .upsert({ dish_key: key, video, created_at: new Date().toISOString() });
        if (writeError) console.error("Video cache write failed:", writeError.message);

        return video ? { ...video, dish } : null;
      })
    );

    return json({ videos: results.filter(Boolean) });
  } catch (e) {
    console.error("search-recipe-videos error:", e);
    return json({ error: e instanceof Error ? e.message : "Something went wrong" }, 500);
  }
});
