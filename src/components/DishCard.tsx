import { useState } from "react";
import { motion } from "framer-motion";
import { Youtube, ExternalLink, Clock } from "lucide-react";

interface Ingredient {
  name: string;
  fromPantry: boolean;
  estimatedCost?: number;
}

interface PlanItem {
  time: string;
  task: string;
}

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface DishCardProps {
  courseType: string;
  name: string;
  ingredients: Ingredient[];
  estimatedCost?: number;
  pantrySavings?: number;
  video?: Video;
  prepStep?: PlanItem;
  index: number;
}

const courseLabels: Record<string, string> = {
  starter: "Starter",
  main: "Main",
  side: "Side",
  dessert: "Dessert",
};

const ingredientEmojis: Record<string, string> = {
  chicken: "🍗", beef: "🥩", pork: "🥩", lamb: "🐑", fish: "🐟", salmon: "🍣",
  shrimp: "🦐", prawn: "🦐", rice: "🍚", pasta: "🍝", noodles: "🍜",
  bread: "🍞", egg: "🥚", eggs: "🥚", cheese: "🧀", butter: "🧈", milk: "🥛",
  cream: "🍶", tomato: "🍅", tomatoes: "🍅", potato: "🥔", potatoes: "🥔",
  onion: "🧅", garlic: "🧄", carrot: "🥕", broccoli: "🥦", corn: "🌽",
  mushroom: "🍄", mushrooms: "🍄", pepper: "🫑", avocado: "🥑",
  lemon: "🍋", lime: "🍋", orange: "🍊", apple: "🍎", banana: "🍌",
  strawberry: "🍓", coconut: "🥥", chocolate: "🍫", honey: "🍯",
  sugar: "🍬", salt: "🧂", olive: "🫒", oil: "🫒", tofu: "🧊",
  lettuce: "🥬", spinach: "🥬", cucumber: "🥒", eggplant: "🍆",
  peas: "🫛", beans: "🫘", chili: "🌶️", ginger: "🫚", herb: "🌿",
  herbs: "🌿", basil: "🌿", cilantro: "🌿", mint: "🌿", wine: "🍷",
  soy: "🥫", sauce: "🥫", vinegar: "🥫",
  cinnamon: "🫚", nutmeg: "🫚", cumin: "🫚", paprika: "🌶️",
  flour: "🌾", wheat: "🌾", oat: "🌾", barley: "🌾",
  peanut: "🥜", almond: "🥜", walnut: "🥜", cashew: "🥜", nut: "🥜",
  peach: "🍑", mango: "🥭", pineapple: "🍍", grape: "🍇", cherry: "🍒",
  melon: "🍈", pear: "🍐", kiwi: "🥝",
  bacon: "🥓", ham: "🥓", turkey: "🦃", duck: "🦆",
  crab: "🦀", lobster: "🦞", squid: "🦑", oyster: "🦪",
  yogurt: "🥛", pie: "🥧", cake: "🎂", cookie: "🍪",
  coffee: "☕", tea: "🍵",
};

function getIngredientEmoji(ingredient: string): string {
  const lower = ingredient.toLowerCase();
  for (const [key, emoji] of Object.entries(ingredientEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return "🍽️";
}

const DishCard = ({
  courseType,
  name,
  ingredients,
  estimatedCost,
  pantrySavings,
  video,
  prepStep,
  index,
}: DishCardProps) => {
  const [hovered, setHovered] = useState(false);

  const pantryItems = ingredients.filter((ing) => ing.fromPantry).slice(0, 4);
  const buyItems = ingredients.filter((ing) => !ing.fromPantry).slice(0, 3);
  const pantryCount = pantryItems.length;

  const contextLine =
    pantryCount >= 3
      ? "Mostly pantry-friendly"
      : pantryCount >= 1
        ? `Great use of your ${pantryItems[0]?.name?.toLowerCase() || "pantry"}`
        : estimatedCost != null && estimatedCost <= 5
          ? "Low effort, high impact"
          : "A crowd-pleaser";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.12 }}
      whileHover={{ scale: 1.015, y: -3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="bg-menu-card rounded-2xl border border-menu-border overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default"
    >
      {/* Header: course label + dish name */}
      <div className="px-5 pt-5 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-menu-course-label/60">
          {courseLabels[courseType] || courseType}
        </span>
        <h3 className="font-display font-bold text-foreground text-lg leading-tight mt-1 truncate">
          {name}
        </h3>
      </div>

      {/* Emoji ingredient row */}
      <div className="flex items-center gap-2.5 px-5 py-2.5">
        {ingredients.slice(0, 5).map((ing, j) => (
          <motion.span
            key={j}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2 + index * 0.08 + j * 0.05,
              type: "spring",
              stiffness: 300,
            }}
            className="text-2xl"
            title={ing.name}
          >
            {getIngredientEmoji(ing.name)}
          </motion.span>
        ))}
      </div>

      {/* Ingredient tags */}
      <div className="px-5 pb-2 space-y-1.5">
        {pantryItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pantryItems.map((ing, j) => (
              <span
                key={`p-${j}`}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25"
              >
                {ing.name}
              </span>
            ))}
          </div>
        )}
        {buyItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {buyItems.map((ing, j) => (
              <span
                key={`b-${j}`}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-menu-tag text-muted-foreground"
              >
                {ing.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Context line */}
      <div className="px-5 pb-2">
        <p className="text-xs text-muted-foreground italic">{contextLine}</p>
      </div>

      {/* Prep step (if available) */}
      {prepStep && (
        <div className="px-5 pb-2 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-menu-accent" />
          <span className="text-[11px] text-muted-foreground">
            <span className="font-semibold text-menu-accent-foreground">{prepStep.time}</span>
            {" · "}
            {prepStep.task}
          </span>
        </div>
      )}

      {/* Video CTA — revealed on hover */}
      {video && (
        <motion.div
          initial={false}
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-destructive hover:underline"
          >
            <Youtube className="w-3.5 h-3.5" />
            Watch how to make this
            <ExternalLink className="w-2.5 h-2.5 ml-auto" />
          </a>
        </motion.div>
      )}

      {/* Savings footer */}
      <div className="mt-auto border-t border-menu-border px-5 py-2.5 flex items-center">
        <span className="text-xs font-semibold text-menu-savings">
          {pantrySavings != null && pantrySavings > 0
            ? `💸 Saved ~$${pantrySavings} using your pantry`
            : estimatedCost != null
              ? `~$${estimatedCost}`
              : ""}
        </span>
      </div>
    </motion.div>
  );
};

export default DishCard;
