import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ChevronDown, Soup, Salad, Cake, Wine, UtensilsCrossed } from "lucide-react";
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
  starter: "STARTER",
  main: "MAIN",
  side: "SIDE",
  dessert: "DESSERT",
  drink: "DRINK",
};

// Tile + label colors echoing the reference image
const categoryStyles: Record<
  string,
  { Icon: typeof Soup; tileBg: string; tileText: string; labelText: string; dotBg: string }
> = {
  starter: { Icon: Salad, tileBg: "bg-sage-soft", tileText: "text-primary", labelText: "text-primary", dotBg: "bg-primary" },
  main:    { Icon: Soup, tileBg: "bg-citrus-soft", tileText: "text-citrus", labelText: "text-accent", dotBg: "bg-citrus" },
  side:    { Icon: UtensilsCrossed, tileBg: "bg-sage-soft", tileText: "text-primary", labelText: "text-primary", dotBg: "bg-primary" },
  dessert: { Icon: Cake, tileBg: "bg-berry-soft", tileText: "text-berry", labelText: "text-berry", dotBg: "bg-berry" },
  drink:   { Icon: Wine, tileBg: "bg-berry-soft", tileText: "text-berry", labelText: "text-berry", dotBg: "bg-berry" },
};

// Pretty "X min before" / "X hr before" using start_time_minutes (offset before serve)
function formatBefore(mins?: number): { top: string; bottom: string } {
  if (mins == null) return { top: "NOW", bottom: "" };
  if (mins <= 0) return { top: "AT", bottom: "SERVE" };
  if (mins >= 60) {
    const hr = Math.round(mins / 60);
    return { top: `${hr} HR`, bottom: "BEFORE" };
  }
  return { top: `${mins} MIN`, bottom: "BEFORE" };
}

const DishCard = ({ dish, video, index, isLast = false }: DishCardProps) => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cat = categoryStyles[dish.category] || categoryStyles.main;
  const CatIcon = cat.Icon;
  const before = formatBefore(dish.start_time_minutes);
  const pantryLine = dish.ingredients_used?.length
    ? `Uses pantry ${dish.ingredients_used.slice(0, 3).join(", ")}`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.06, ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
      className="relative"
    >
      <div className="grid grid-cols-[88px_56px_1fr_auto] items-center gap-x-4 py-4">
        {/* Time-before column with dotted timeline */}
        <div className="relative flex flex-col items-center justify-center">
          {/* timeline line */}
          {!isLast && (
            <span
              aria-hidden
              className="absolute left-1/2 top-[calc(50%+10px)] -translate-x-1/2 h-[calc(100%+1rem)] border-l border-dashed border-border"
            />
          )}
          {/* timeline dot */}
          <span className={`absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${cat.dotBg} ring-4 ring-background`} />
          <div className="text-center leading-tight">
            <div className="text-[11px] font-semibold tracking-[0.18em] text-foreground/80">{before.top}</div>
            {before.bottom && (
              <div className="text-[10px] tracking-[0.22em] text-muted-foreground mt-0.5">{before.bottom}</div>
            )}
          </div>
        </div>

        {/* Icon tile */}
        <div className={`w-14 h-14 rounded-2xl ${cat.tileBg} flex items-center justify-center shadow-[0_6px_18px_-10px_hsl(var(--shadow-warm)/0.35)]`}>
          <CatIcon className={`w-6 h-6 ${cat.tileText}`} strokeWidth={1.75} />
        </div>

        {/* Title block */}
        <div className="min-w-0">
          <div className={`text-[10px] font-semibold tracking-[0.22em] ${cat.labelText} mb-1`}>
            {categoryLabels[dish.category] || dish.category.toUpperCase()}
          </div>
          <h3 className="font-display text-lg md:text-xl font-medium text-foreground leading-snug tracking-tight">
            {dish.dish}
          </h3>
          {pantryLine && (
            <p className="text-[12.5px] text-primary/90 mt-0.5 leading-relaxed">{pantryLine}</p>
          )}
        </div>

        {/* Right cluster: play, expand, savings */}
        <div className="flex items-center gap-3 md:gap-4">
          {video && (
            <button
              onClick={() => setVideoOpen(true)}
              aria-label="Watch recipe video"
              title="Watch recipe video"
              className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-[0_6px_16px_-8px_hsl(var(--secondary)/0.9)] hover:scale-105 transition-transform"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={0} />
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label="Show details"
            className="w-7 h-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          <div className="w-16 text-right">
            {dish.savings > 0 ? (
              <span className="text-[15px] font-medium text-berry">– ${dish.savings}</span>
            ) : (
              <span className="text-[15px] font-medium text-muted-foreground">– $0</span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-[148px] mr-2 mb-3 px-5 py-4 rounded-2xl bg-muted/40 border border-border/60 grid gap-3 md:grid-cols-2"
        >
          {dish.reason && (
            <p className="text-[13px] text-foreground/85 leading-relaxed md:col-span-2">{dish.reason}</p>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">From the pantry</p>
            <p className="text-[13px] text-foreground/85 leading-relaxed">{dish.ingredients_used.join(", ")}</p>
          </div>
          {dish.missing_ingredients.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">To gather</p>
              <p className="text-[13px] text-foreground/85 leading-relaxed">{dish.missing_ingredients.join(", ")}</p>
            </div>
          )}
        </motion.div>
      )}

      {!isLast && <div className="h-px bg-border/50 ml-[148px]" />}

      {/* Video Modal */}
      {video && (
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-border">
            <DialogHeader className="px-6 pt-6 pb-3">
              <DialogTitle className="font-display text-xl font-normal truncate">{dish.dish}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`}
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
