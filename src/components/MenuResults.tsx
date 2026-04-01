import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Wallet, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DishCard from "./DishCard";

interface Ingredient {
  name: string;
  fromPantry: boolean;
  estimatedCost?: number;
}

interface Course {
  type: string;
  name: string;
  description: string;
  keyIngredients: Ingredient[] | string[];
  fromFridge?: boolean;
  estimatedCost?: number;
  pantrySavings?: number;
}

interface PlanItem {
  time: string;
  task: string;
}

interface MenuData {
  menuTitle: string;
  courses: Course[];
  shoppingList: string[];
  plan?: PlanItem[];
  timeline?: PlanItem[];
  pokoComment?: string;
  pokoReaction?: string;
  pokoTip?: string;
  totalEstimatedCost?: number;
  totalPantrySavings?: number;
}

interface Video {
  dish: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

function normalizeIngredient(ing: Ingredient | string): Ingredient {
  if (typeof ing === "string") {
    return { name: ing, fromPantry: false };
  }
  return ing;
}

/** Try to match a timeline step to a dish name */
function findPrepStep(dishName: string, planItems: PlanItem[]): PlanItem | undefined {
  const lower = dishName.toLowerCase();
  const words = lower.split(/\s+/).filter((w) => w.length > 3);
  return planItems.find((item) => {
    const taskLower = item.task.toLowerCase();
    return words.some((word) => taskLower.includes(word));
  });
}

const MenuResults = ({ menu }: { menu: MenuData }) => {
  const planItems = menu.plan || menu.timeline || [];
  const comment = menu.pokoComment || menu.pokoTip || menu.pokoReaction;

  // Fetch recipe videos and distribute per dish
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    const dishes = menu.courses.map((c) => c.name);
    if (!dishes.length) return;

    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("search-recipe-videos", {
          body: { dishes },
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
  }, [menu.courses]);

  function getVideoForDish(dishName: string): Video | undefined {
    const lower = dishName.toLowerCase();
    return videos.find((v) => v.dish.toLowerCase() === lower);
  }

  return (
    <div className="space-y-5">
      {/* Menu Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-3"
      >
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="w-8 h-px bg-menu-accent/40" />
          <Leaf className="w-4 h-4 text-menu-accent" />
          <div className="w-8 h-px bg-menu-accent/40" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
          {menu.menuTitle}
        </h2>
      </motion.div>

      {/* Overall Savings Banner */}
      {menu.totalPantrySavings && menu.totalPantrySavings > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-2 bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-2.5"
        >
          <Wallet className="w-4 h-4 text-menu-savings" />
          <span className="text-sm font-semibold text-menu-savings">
            You saved ~${menu.totalPantrySavings} overall using your pantry
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

      {/* Dish Cards — one card per dish with all info consolidated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {menu.courses.map((course, i) => {
          const ingredients = course.keyIngredients.map(normalizeIngredient);
          const video = getVideoForDish(course.name);
          const prepStep = findPrepStep(course.name, planItems);

          return (
            <DishCard
              key={i}
              courseType={course.type}
              name={course.name}
              ingredients={ingredients}
              estimatedCost={course.estimatedCost}
              pantrySavings={course.pantrySavings}
              video={video}
              prepStep={prepStep}
              index={i}
            />
          );
        })}
      </div>

      {/* Poko Comment */}
      {comment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center px-4 pt-1"
        >
          <p className="text-sm text-muted-foreground">{comment}</p>
        </motion.div>
      )}
    </div>
  );
};

export default MenuResults;
