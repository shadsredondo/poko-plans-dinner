import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronDown, ChevronUp, ShoppingCart, Flame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface DishCardProps {
  dish: MenuDish;
  video?: Video;
  index: number;
  isLast?: boolean;
}

const categoryLabels: Record<string, string> = {
  starter: "Starter",
  main: "Main",
  side: "Side",
  dessert: "Dessert",
};

const effortLabels: Record<string, string> = {
  low: "Effortless",
  medium: "Considered",
  high: "Involved",
};

const DishCard = ({ dish, video, index, isLast = false }: DishCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const visibleIngredients = dish.ingredients_used.slice(0, 3);
  const hiddenCount = dish.ingredients_used.length - 3;

  const isAnchor = dish.importance === "anchor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
      className={`relative ${!isLast ? "border-b border-border/60" : ""}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left py-7 group"
      >
        {/* Header row */}
        <div className="grid grid-cols-[80px_1fr_auto] gap-6 items-baseline">
          {/* Time column */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {dish.start_time}
            </span>
            {isAnchor && (
              <span className="text-[9px] uppercase tracking-[0.24em] text-accent">Anchor</span>
            )}
          </div>

          {/* Dish */}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-2">
              {categoryLabels[dish.category] || dish.category}
            </p>
            <h3 className="font-display text-2xl md:text-[26px] font-normal text-foreground leading-[1.15] tracking-tight">
              {dish.dish}
            </h3>
            <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed line-clamp-1 italic">
              {dish.reason}
            </p>
          </div>

          {/* Right meta */}
          <div className="flex items-center gap-4 self-center">
            {video && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoOpen(true);
                }}
                className="w-9 h-9 rounded-full border border-border hover:border-foreground hover:bg-foreground hover:text-background flex items-center justify-center transition-colors"
                title="Reference"
              >
                <Play className="w-3 h-3" />
              </button>
            )}
            <div className="text-muted-foreground group-hover:text-foreground transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Quiet ingredient row */}
        <div className="grid grid-cols-[80px_1fr_auto] gap-6 mt-5 items-center">
          <div />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {visibleIngredients.map((ing, j) => (
              <span key={j} className="text-[12px] text-foreground/80">
                {ing}
                {j < visibleIngredients.length - 1 && <span className="text-muted-foreground/40 ml-3">·</span>}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="text-[11px] text-muted-foreground italic">+{hiddenCount} more</span>
            )}
          </div>
          {dish.savings > 0 && (
            <span className="text-[11px] uppercase tracking-[0.18em] text-menu-savings whitespace-nowrap">
              −${dish.savings}
            </span>
          )}
        </div>
      </button>

      {/* Expanded — editorial detail panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 pb-8">
              <div className="hidden md:block" />
              <div className="space-y-6 max-w-xl">
                <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Flame className="w-3 h-3" />
                    {effortLabels[dish.effort_level] || dish.effort_level}
                  </span>
                  {dish.can_overlap && <span>Can overlap</span>}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-3">
                    From the pantry
                  </p>
                  <p className="text-[14px] text-foreground/85 leading-relaxed">
                    {dish.ingredients_used.join(", ")}
                  </p>
                </div>

                {dish.missing_ingredients.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-3 flex items-center gap-2">
                      <ShoppingCart className="w-3 h-3" />
                      To gather
                    </p>
                    <p className="text-[14px] text-foreground/85 leading-relaxed">
                      {dish.missing_ingredients.join(", ")}
                    </p>
                  </div>
                )}

                {video && (
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    View reference
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      {video && (
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-border">
            <DialogHeader className="px-6 pt-6 pb-3">
              <DialogTitle className="font-display text-xl font-normal truncate">{dish.dish}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?rel=0`}
                title={video.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default DishCard;
