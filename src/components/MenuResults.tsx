import { motion } from "framer-motion";
import { ShoppingCart, ClipboardList, Leaf } from "lucide-react";

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

      {/* Courses */}
      <div className="space-y-3">
        {menu.courses.map((course, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-menu-card rounded-xl border border-menu-border p-4"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-menu-accent">
                {courseLabels[course.type] || course.type}
              </span>
              {course.fromFridge && (
                <span className="text-[10px] bg-menu-accent-light text-menu-accent-foreground px-2 py-0.5 rounded-full font-semibold">
                  From your fridge
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-foreground text-[15px] leading-snug">{course.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{course.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {course.keyIngredients.map((ing, j) => (
                <span key={j} className="text-[11px] bg-menu-tag text-muted-foreground px-2 py-0.5 rounded-md">
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
