import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CalendarClock, PiggyBank } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-3xl border border-border/60 shadow-[0_10px_40px_-22px_hsl(var(--shadow-warm)/0.3)] p-5 md:p-7"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 mb-2">
        <div className="w-10 h-10 rounded-full bg-sage-soft flex items-center justify-center">
          <CalendarClock className="w-5 h-5 text-primary" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground leading-[1.1]">
            Your hosting timeline
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
            A relaxed sequence of dishes,<br className="hidden md:inline" /> paced for a stress-free evening.
          </p>
        </div>

        {totalSavings > 0 && (
          <div className="ml-auto flex items-center gap-2 rounded-full bg-secondary/50 border border-secondary/60 pl-3 pr-5 py-2">
            <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-secondary-foreground" strokeWidth={1.75} />
            </span>
            <div className="leading-tight">
              <div className="text-[9px] font-semibold tracking-[0.22em] text-secondary-foreground/80">PANTRY SAVINGS</div>
              <div className="font-display text-lg text-foreground">~${totalSavings}</div>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {videosLoading && (
        <div className="flex items-center gap-2 text-muted-foreground mt-4">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="text-[11px] uppercase tracking-[0.2em]">Curating references</span>
        </div>
      )}

      {/* Timeline rows */}
      <div className="mt-4">
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
    </motion.div>
  );
};

export default MenuResults;
