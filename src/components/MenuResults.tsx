import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DishCard from "./DishCard";

interface MenuDish {
  dish: string;
  category: string;
  importance: string;
  priority: number;
  start_time: string;
  start_time_minutes: number;
  effort_level: string;
  can_overlap: boolean;
  ingredients_used: string[];
  missing_ingredients: string[];
  savings: number;
  reason: string;
}

interface MenuData {
  menu: MenuDish[];
  total_savings: number;
  // Legacy compat
  summary?: { total_savings?: number; optimization_note?: string };
}

interface Video {
  dish: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

const MenuResults = ({ menu }: { menu: MenuData }) => {
  const dishes = menu.menu || [];
  const totalSavings = menu.total_savings ?? menu.summary?.total_savings ?? 0;

  // Sort by start_time_minutes descending (earliest task first)
  const sortedDishes = [...dishes].sort((a, b) => (b.start_time_minutes ?? 0) - (a.start_time_minutes ?? 0));

  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    const dishNames = sortedDishes.map((d) => d.dish);
    if (!dishNames.length) return;

    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("search-recipe-videos", {
          body: { dishes: dishNames },
        });
        if (error) throw error;
        setVideos(data?.videos || []);
      } catch (err) {
        console.error("Failed to fetch recipe videos:", err);
      } finally {
        setVideosLoading(false);
      }
    };

    fetchVideos();
  }, [menu.menu]);

  function getVideoForDish(dishName: string): Video | undefined {
    const lower = dishName.toLowerCase();
    return videos.find((v) => v.dish.toLowerCase() === lower);
  }

  return (
    <div className="space-y-10">
      {/* Editorial header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-3"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-secondary-foreground">
          <Sparkles className="w-3 h-3" /> Tonight&rsquo;s plan
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground leading-[1.1]">
          Your hosting timeline
        </h2>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          A calm evening flow — paced so you can pour the wine, not panic.
        </p>
      </motion.div>

      {/* Savings — friendly chip card */}
      {totalSavings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 rounded-2xl bg-sage-soft/60 border border-primary/15 px-5 py-4"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Saved from your pantry
          </span>
          <span className="ml-auto font-display text-xl text-foreground">~${totalSavings}</span>
        </motion.div>
      )}

      {/* Loading */}
      {videosLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="text-[11px] uppercase tracking-[0.2em]">Curating references</span>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-0">
        {sortedDishes.map((dish, i) => {
          const video = getVideoForDish(dish.dish);
          return (
            <DishCard
              key={i}
              dish={dish}
              video={video}
              index={i}
              isLast={i === sortedDishes.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MenuResults;
