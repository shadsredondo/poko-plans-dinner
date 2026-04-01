import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Youtube, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  dish: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

const RecipeVideos = ({ dishes }: { dishes: string[] }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!dishes.length) return;

    const fetchVideos = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("search-recipe-videos", {
          body: { dishes },
        });
        if (fnError) throw fnError;
        setVideos(data?.videos || []);
      } catch (err) {
        console.error("Failed to fetch recipe videos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [dishes]);

  if (error || (!loading && videos.length === 0)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="bg-menu-card rounded-xl border border-menu-border p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Youtube className="w-4 h-4 text-destructive" />
        <h3 className="font-display font-bold text-foreground text-sm">Recipe Videos</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Finding recipe videos...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {videos.map((video) => (
            <a
              key={video.videoId}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3 rounded-lg hover:bg-muted/50 transition-colors p-1.5 -m-1.5"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-28 h-20 object-cover rounded-lg shrink-0"
                loading="lazy"
              />
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-menu-accent mb-0.5">
                  {video.dish}
                </span>
                <span className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {video.title}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  {video.channelTitle}
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecipeVideos;
