import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ShoppingCart, Flame, Soup, Salad, Cake, Wine, UtensilsCrossed } from "lucide-react";
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
  drink: "Drink",
};

const categoryStyles: Record<string, { Icon: typeof Soup; bg: string; text: string }> = {
  starter: { Icon: Salad, bg: "bg-sage-soft", text: "text-primary" },
  main: { Icon: Soup, bg: "bg-terracotta-soft", text: "text-accent" },
  side: { Icon: UtensilsCrossed, bg: "bg-citrus-soft", text: "text-citrus" },
  dessert: { Icon: Cake, bg: "bg-berry-soft", text: "text-berry" },
  drink: { Icon: Wine, bg: "bg-berry-soft", text: "text-berry" },
};

const effortLabels: Record<string, string> = {
  low: "Effortless",
  medium: "Considered",
  high: "Involved",
};

const DishCard = ({ dish, video, index, isLast = false }: DishCardProps) => {
  const [videoOpen, setVideoOpen] = useState(false);

  const isAnchor = dish.importance === "anchor";
  const cat = categoryStyles[dish.category] || categoryStyles.main;
  const CatIcon = cat.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
      className={`relative ${!isLast ? "mb-4" : ""}`}
    >
      <div className="bg-card rounded-3xl border border-border/60 p-6 md:p-7 shadow-[0_8px_30px_-18px_hsl(var(--shadow-warm)/0.25)] hover:shadow-[0_14px_36px_-16px_hsl(var(--shadow-warm)/0.35)] hover:-translate-y-0.5 transition-all duration-300">
        {/* Header row */}
        <div className="flex flex-wrap items-start gap-4">
          {/* Category icon medallion */}
          <div className={`shrink-0 w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center`}>
            <CatIcon className={`w-5 h-5 ${cat.text}`} strokeWidth={1.75} />
          </div>

          {/* Title block */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {dish.start_time}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text} text-[10px] uppercase tracking-[0.18em]`}>
                {categoryLabels[dish.category] || dish.category}
              </span>
              {isAnchor && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] uppercase tracking-[0.18em]">
                  Anchor
                </span>
              )}
            </div>
            <h3 className="font-display text-xl md:text-2xl font-normal text-foreground leading-snug tracking-tight">
              {dish.dish}
            </h3>
            {dish.reason && (
              <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                {dish.reason}
              </p>
            )}
          </div>

          {/* Right cluster: savings + play */}
          <div className="shrink-0 flex items-center gap-3">
            {dish.savings > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/60 text-secondary-foreground text-[11px] font-medium">
                Saved ~${dish.savings}
              </span>
            )}
            {video && (
              <button
                onClick={() => setVideoOpen(true)}
                aria-label="Watch recipe video on YouTube"
                title="Watch recipe video"
                className="group/play relative shrink-0 w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-[0_8px_22px_-10px_hsl(var(--secondary)/0.9)] hover:scale-105 hover:shadow-[0_12px_28px_-10px_hsl(var(--secondary)/1)] transition-all duration-300"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={0} />
                <span className="absolute -bottom-1.5 -right-1.5 bg-accent text-accent-foreground text-[8px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-full font-medium opacity-0 group-hover/play:opacity-100 transition-opacity whitespace-nowrap">
                  Recipe
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Detail strip */}
        <div className="mt-5 pt-5 border-t border-border/50 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <span className="text-base leading-none">🌿</span> From the pantry
            </p>
            <p className="text-[13.5px] text-foreground/85 leading-relaxed">
              {dish.ingredients_used.join(", ")}
            </p>
          </div>

          {dish.missing_ingredients.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <ShoppingCart className="w-3 h-3" /> To gather
              </p>
              <p className="text-[13.5px] text-foreground/85 leading-relaxed">
                {dish.missing_ingredients.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Footer row */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Flame className="w-3 h-3 text-accent" />
            {effortLabels[dish.effort_level] || dish.effort_level}
          </span>
          {dish.can_overlap && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Can overlap</span>
          )}
          {video && (
            <button
              onClick={() => setVideoOpen(true)}
              className="ml-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors"
            >
              Watch recipe video
              <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>

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
