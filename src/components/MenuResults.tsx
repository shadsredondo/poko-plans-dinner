import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DishCard from "./DishCard";

interface MenuDish {
  dish: string;
  category: string;
  start_time: string;
  priority: number;
  ingredients_used: string[];
  missing_ingredients: string[];
  savings: number;
  reason: string;
}

interface MenuSummary {
  total_savings: number;
  optimization_note: string;
}

interface MenuData {
  menu: MenuDish[];
  summary: MenuSummary;
  // Legacy compat
  menuTitle?: string;
  courses?: any[];
  totalPantrySavings?: number;
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
  const summary = menu.summary || { total_savings: 0, optimization_note: "" };

  // Sort by priority (1 = first)
  const sortedDishes = [...dishes].sort((a, b) => a.priority - b.priority);

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
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-2"
      >
        <h2 className="font-display text-lg font-bold text-foreground tracking-tight">
          Your Cooking Timeline
        </h2>
        {summary.optimization_note && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-secondary" />
            {summary.optimization_note}
          </p>
        )}
      </motion.div>

      {/* Savings Banner */}
      {summary.total_savings > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-2.5"
        >
          <Wallet className="w-4 h-4 text-menu-savings" />
          <span className="text-sm font-semibold text-menu-savings">
            Saved ~${summary.total_savings} using your pantry
          </span>
        </motion.div>
      )}

      {/* Loading indicator for videos */}
      {videosLoading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground py-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="text-xs">Finding recipe videos…</span>
        </div>
      )}

      {/* Timeline Cards */}
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
