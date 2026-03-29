import { motion } from "framer-motion";
import { ShoppingCart, ClipboardList, Sparkles } from "lucide-react";

interface Course {
  type: string;
  name: string;
  description: string;
  keyIngredients: string[];
  fromFridge: boolean;
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
}

const courseEmojis: Record<string, string> = {
  starter: "🥗",
  main: "🍽️",
  side: "🥘",
  dessert: "🍰",
};

const courseLabels: Record<string, string> = {
  starter: "Starter",
  main: "Main",
  side: "Side",
  dessert: "Dessert",
};

const MenuResults = ({ menu }: { menu: MenuData }) => {
  const planItems = menu.plan || menu.timeline || [];
  const comment = menu.pokoComment || menu.pokoTip || menu.pokoReaction;

  return (
    <div className="space-y-4">
      {/* Menu Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-2"
      >
        <h2 className="font-display text-xl font-bold text-foreground">{menu.menuTitle}</h2>
      </motion.div>

      {/* Courses */}
      <div className="space-y-3">
        {menu.courses.map((course, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{courseEmojis[course.type] || "🍴"}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {courseLabels[course.type] || course.type}
              </span>
              {course.fromFridge && (
                <span className="text-[10px] bg-secondary/15 text-secondary px-2 py-0.5 rounded-full font-semibold ml-auto">
                  From your fridge
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-foreground text-base">{course.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{course.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {course.keyIngredients.map((ing, j) => (
                <span key={j} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {ing}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shopping List */}
      {menu.shoppingList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-foreground text-sm">Shopping List</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {menu.shoppingList.map((item, i) => (
              <span key={i} className="text-sm bg-muted text-foreground px-3 py-1 rounded-full">
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
          className="bg-card rounded-2xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-foreground text-sm">Plan</h3>
          </div>
          <div className="space-y-2.5">
            {planItems.map((item, i) => (
              <div key={i} className="flex gap-3 items-baseline">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg min-w-[100px] text-center whitespace-nowrap">
                  {item.time}
                </span>
                <span className="text-sm text-foreground">{item.task}</span>
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
          className="flex items-start gap-2 px-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground italic">{comment}</p>
        </motion.div>
      )}
    </div>
  );
};

export default MenuResults;
