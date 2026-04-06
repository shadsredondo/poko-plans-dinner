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

const effortColors: Record<string, string> = {
  low: "text-secondary",
  medium: "text-amber-500",
  high: "text-destructive",
};

const DishCard = ({ dish, video, index, isLast = false }: DishCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const visibleIngredients = dish.ingredients_used.slice(0, 3);
  const hiddenCount = dish.ingredients_used.length - 3;

  const isAnchor = dish.importance === "anchor";

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-[19px] top-[44px] bottom-[-12px] w-px bg-gradient-to-b from-secondary/40 to-secondary/10 z-0" />
      )}

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08 + index * 0.1, ease: "easeOut" }}
        className="relative z-10 flex gap-4"
      >
        {/* Timeline dot */}
        <div className="flex flex-col items-center pt-1 shrink-0">
          <div className={`w-[10px] h-[10px] rounded-full shadow-sm ${
            isAnchor
              ? "bg-primary border-2 border-primary/60"
              : "bg-secondary border-2 border-secondary/60"
          }`} />
        </div>

        {/* Card */}
        <div className="flex-1 min-w-0">
          {/* Time badge */}
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary mb-1.5 block">
            {dish.start_time}
          </span>

          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileTap={{ scale: 0.995 }}
            className={`w-full text-left bg-menu-card rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200 border group cursor-pointer ${
              isAnchor ? "border-primary/30" : "border-menu-border/50"
            }`}
          >
            {/* Main row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-muted/40 rounded-full px-2 py-0.5 shrink-0">
                  {categoryLabels[dish.category] || dish.category}
                </span>
                <h3 className="font-display font-bold text-foreground text-[15px] leading-snug truncate">
                  {dish.dish}
                </h3>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Effort indicator */}
                <Flame className={`w-3 h-3 ${effortColors[dish.effort_level] || "text-muted-foreground"}`} />

                {dish.savings > 0 && (
                  <span className="text-[11px] font-semibold text-menu-savings whitespace-nowrap">
                    Saved ${dish.savings}
                  </span>
                )}

                {video && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoOpen(true);
                    }}
                    className="w-7 h-7 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
                    title="Watch recipe video"
                  >
                    <Play className="w-3 h-3 text-secondary" />
                  </button>
                )}

                <div className="w-5 h-5 flex items-center justify-center text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                  {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>

            {/* Ingredient chips + reason */}
            <div className="flex items-center gap-1.5 mt-2">
              {visibleIngredients.map((ing, j) => (
                <span
                  key={j}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                >
                  {ing}
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className="text-[10px] text-muted-foreground/60 font-medium">
                  +{hiddenCount} more
                </span>
              )}
              <span className="text-[10px] text-muted-foreground/50 ml-auto italic truncate max-w-[120px]">
                {dish.reason}
              </span>
            </div>
          </motion.button>

          {/* Expanded content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-menu-card border border-menu-border/50 border-t-0 rounded-b-xl px-4 py-3 -mt-1 space-y-3">
                  {/* Meta badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {dish.importance}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      dish.effort_level === "low" ? "bg-secondary/10 text-secondary" :
                      dish.effort_level === "high" ? "bg-destructive/10 text-destructive" :
                      "bg-amber-500/10 text-amber-600"
                    }`}>
                      {dish.effort_level} effort
                    </span>
                    {dish.can_overlap && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
                        Can overlap
                      </span>
                    )}
                  </div>

                  {/* Pantry ingredients */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 block mb-1.5">
                      From your pantry
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dish.ingredients_used.map((ing, j) => (
                        <span
                          key={j}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                        >
                          {ing} ✓
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing ingredients */}
                  {dish.missing_ingredients.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 block mb-1.5 flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        Need to buy
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dish.missing_ingredients.map((ing, j) => (
                          <span
                            key={j}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video */}
                  {video && (
                    <button
                      onClick={() => setVideoOpen(true)}
                      className="flex items-center gap-2 text-xs text-secondary hover:text-secondary/80 transition-colors font-medium"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Watch recipe video
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {!isLast && <div className="h-3" />}

      {/* Video Modal */}
      {video && (
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
            <DialogHeader className="px-5 pt-5 pb-2">
              <DialogTitle className="text-base font-semibold truncate">{dish.dish}</DialogTitle>
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
    </div>
  );
};

export default DishCard;
