-- Rate limiting for edge functions (fixed windows, one row per key).
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  count INTEGER NOT NULL DEFAULT 0
);

-- RLS on with no policies: only the service role (edge functions) can access it.
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Atomically counts a hit for p_key and returns true while within p_limit
-- for the current p_window_seconds window.
CREATE OR REPLACE FUNCTION public.hit_rate_limit(p_key TEXT, p_limit INTEGER, p_window_seconds INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO public.rate_limits AS r (key, window_start, count)
  VALUES (p_key, now(), 1)
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN r.window_start < now() - make_interval(secs => p_window_seconds) THEN 1
      ELSE r.count + 1
    END,
    window_start = CASE
      WHEN r.window_start < now() - make_interval(secs => p_window_seconds) THEN now()
      ELSE r.window_start
    END
  RETURNING count INTO v_count;

  RETURN v_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.hit_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hit_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;

-- Cache of YouTube search results per dish, to save YouTube API quota.
-- video is NULL when the search found nothing.
CREATE TABLE IF NOT EXISTS public.recipe_video_cache (
  dish_key TEXT PRIMARY KEY,
  video JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.recipe_video_cache ENABLE ROW LEVEL SECURITY;
