import { motion } from "framer-motion";
import { Clock, ShoppingCart, ChefHat, Sparkles } from "lucide-react";
import ChatBubble from "./ChatBubble";

interface Course {
  type: string;
  name: string;
  description: string;
  keyIngredients: string[];
  fromFridge: boolean;
}

interface TimelineItem {
  time: string;
  task: string;
}

interface MenuData {
  pokoReaction: string;
  menuTitle: string;
  courses: Course[];
  shoppingList: string[];
  timeline: TimelineItem[];
  pokoTip: string;
}

const courseEmojis: Record<string, string> = {
  starter: "🥗",
  main: "🍽️",
  side: "🥘",
  dessert: "🍰",
};

const courseLabels: Record<string, string> = {
  starter: "Starter",
  main: "Main Course",
  side: "Side",
  dessert: "Dessert",
};

const MenuResults = ({ menu }: { menu: MenuData }) => {
  return (
    <div className="space-y-4">
      <ChatBubble message={menu.pokoReaction} sender="poko" expression="excited" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
      >
        {/* Menu Title */}
        <div className="bg-primary px-5 py-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary-foreground" />
            <h2 className="font-display text-lg font-bold text-primary-foreground">{menu.menuTitle}</h2>
          </div>
        </div>

        {/* Courses */}
        <div className="p-4 space-y-3">
          {menu.courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="bg-background rounded-xl p-4 border border-border"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{courseEmojis[course.type] || "🍴"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {courseLabels[course.type] || course.type}
                    </span>
                    {course.fromFridge && (
                      <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-semibold">
                        ✓ From your fridge
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-foreground mt-1">{course.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{course.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {course.keyIngredients.map((ing, j) => (
                      <span key={j} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Shopping List */}
      {menu.shoppingList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-card rounded-2xl border border-border p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-foreground">Quick Shopping List</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {menu.shoppingList.map((item, i) => (
              <span key={i} className="text-sm bg-poko-light text-foreground px-3 py-1.5 rounded-full border border-border">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-card rounded-2xl border border-border p-4 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-foreground">Cooking Timeline</h3>
        </div>
        <div className="space-y-3">
          {menu.timeline.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-xs font-mono font-bold text-primary bg-poko-light px-2 py-1 rounded-lg min-w-[60px] text-center">
                {item.time}
              </span>
              <span className="text-sm text-foreground pt-0.5">{item.task}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Poko Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-poko-light rounded-2xl p-4 border border-border"
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">Poko's Pro Tip</span>
        </div>
        <p className="text-sm text-muted-foreground">{menu.pokoTip}</p>
      </motion.div>
    </div>
  );
};

export default MenuResults;
