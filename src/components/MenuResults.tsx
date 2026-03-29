import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ClipboardList, Leaf, ChevronRight, Wallet } from "lucide-react";

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
};

function getIngredientEmoji(ingredient: string): string {
  const lower = ingredient.toLowerCase();
  for (const [key, emoji] of Object.entries(ingredientEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return "🥄";
}

function normalizeIngredient(ing: Ingredient | string): Ingredient {
  if (typeof ing === "string") {
    return { name: ing, fromPantry: false };
  }
  return ing;
}

const MenuResults = ({ menu }: { menu: MenuData }) => {
  const planItems = menu.plan || menu.timeline || [];
  const comment = menu.pokoComment || menu.pokoTip || menu.pokoReaction;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      setCanScroll(el.scrollWidth > el.clientWidth);
    }
  }, [menu.courses]);

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
        <h2 className="font-display text-xl font-bold text-foreground tracking-tight">{menu.menuTitle}</h2>
      </motion.div>

      {/* Overall Savings Banner */}
      {menu.totalPantrySavings && menu.totalPantrySavings > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-2 bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-2.5"
        >
          <Wallet className="w-4 h-4 text-secondary" />
          <span className="text-sm font-semibold text-secondary">
            You saved ~${menu.totalPantrySavings} overall using your pantry
          </span>
        </motion.div>
      )}

      {/* Courses — Horizontal Tiles */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {menu.courses.map((course, i) => {
            const ingredients = course.keyIngredients.map(normalizeIngredient);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="snap-start shrink-0 w-[calc(50%-6px)] min-w-[260px] bg-menu-card rounded-2xl border border-menu-border p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-menu-accent">
                    {courseLabels[course.type] || course.type}
                  </span>
                  <h3 className="font-display font-bold text-foreground text-base leading-snug mt-2">{course.name}</h3>
                  <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{course.description}</p>
                  <div className="flex gap-2 mt-4">
                    {ingredients.slice(0, 3).map((ing, j) => (
                      <span
                        key={j}
                        className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 min-w-[52px] border ${
                          ing.fromPantry
                            ? "bg-secondary/10 border-secondary/30"
                            : "bg-menu-tag border-transparent"
                        }`}
                      >
                        <span className="text-lg leading-none">{getIngredientEmoji(ing.name)}</span>
                        <span className={`text-[9px] font-medium truncate max-w-[48px] ${
                          ing.fromPantry ? "text-secondary" : "text-muted-foreground"
                        }`}>
                          {ing.name}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Per-dish savings */}
                {course.pantrySavings != null && course.pantrySavings > 0 && (
                  <span className="mt-3 text-[11px] text-secondary font-semibold self-start">
                    Saved ~${course.pantrySavings} using your pantry
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
        {canScroll && (
          <div className="absolute right-0 top-0 bottom-2 w-10 flex items-center justify-center pointer-events-none bg-gradient-to-l from-background/80 to-transparent rounded-r-xl">
            <ChevronRight className="w-4 h-4 text-muted-foreground animate-pulse" />
          </div>
        )}
      </div>

      {/* Shopping List */}
      {menu.shoppingList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-menu-card rounded-xl border border-menu-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4 text-menu-accent" />
            <h3 className="font-display font-bold text-foreground text-sm">Shopping List</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {menu.shoppingList.map((item, i) => (
              <span key={i} className="text-sm bg-menu-tag text-foreground px-3 py-1 rounded-md font-medium">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plan */}
      {planItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-menu-card rounded-xl border border-menu-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-menu-accent" />
            <h3 className="font-display font-bold text-foreground text-sm">Plan</h3>
          </div>
          <div className="space-y-2.5">
            {planItems.map((item, i) => (
              <div key={i} className="flex gap-3 items-baseline">
                <span className="text-[11px] font-bold text-menu-accent-foreground bg-menu-accent-light px-2.5 py-1 rounded-md min-w-[105px] text-center whitespace-nowrap">
                  {item.time}
                </span>
                <span className="text-sm text-foreground leading-snug">{item.task}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
