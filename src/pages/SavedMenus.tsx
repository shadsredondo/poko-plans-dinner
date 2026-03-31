import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Wallet, Clock, RotateCcw, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSavedMenus, type SavedMenu } from "@/hooks/useSavedMenus";
import PokoAvatar from "@/components/PokoAvatar";
import AccountMenu from "@/components/AccountMenu";
import MenuResults from "@/components/MenuResults";
import { useToast } from "@/hooks/use-toast";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const SavedMenus = () => {
  const { user, signOut } = useAuth();
  const { data: menus, isLoading, deleteMenu } = useSavedMenus(user?.id);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const expandedMenu = menus?.find((m) => m.id === expandedId);

  const handleReuse = (menu: SavedMenu) => {
    // Navigate to home with menu params to pre-fill
    navigate("/new", {
      state: {
        reuse: true,
        guests: menu.guests,
        ingredients: menu.ingredients,
        effort: menu.effort,
        skill: menu.skill,
        cuisine: menu.cuisine,
      },
    });
  };

  const handleDelete = async (e: React.MouseEvent, menuId: string) => {
    e.stopPropagation();
    try {
      await deleteMenu.mutateAsync(menuId);
      if (expandedId === menuId) setExpandedId(null);
      toast({ title: "Menu deleted 🗑️" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <PokoAvatar size="sm" animate={false} />
          <span className="font-display font-bold text-foreground">Poko</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/new")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="New menu"
          >
            <ChefHat className="w-4 h-4" />
          </button>
          <AccountMenu />
        </div>
      </header>

      {/* Expanded menu view */}
      <AnimatePresence>
        {expandedMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto"
          >
            <div className="max-w-lg mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setExpandedId(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleReuse(expandedMenu)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-shadow flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reuse this menu
                </button>
              </div>
              <MenuResults menu={expandedMenu.menu_data} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1 mb-6"
        >
          <h1 className="font-display text-2xl font-bold text-foreground">
            Your menus 📋
          </h1>
          <p className="text-sm text-muted-foreground">
            Pick up where you left off or reuse a favorite.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !menus || menus.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center pt-16 space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ChefHat className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <p className="font-display font-bold text-foreground text-lg">
                No saved menus yet
              </p>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                Generate your first menu to get started.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/new")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
            >
              Create a menu 🚀
            </motion.button>
          </motion.div>
        ) : (
          /* Menu cards */
          <div className="space-y-3">
            {menus.map((menu, i) => {
              const courses = menu.menu_data?.courses || [];
              const dishPreview = courses.slice(0, 3).map((c: any) => c.name);

              return (
                <motion.button
                  key={menu.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setExpandedId(menu.id)}
                  className="w-full text-left bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all group relative"
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(e, menu.id)}
                    className="absolute top-3 right-3 text-muted-foreground/0 group-hover:text-muted-foreground hover:!text-destructive transition-colors p-1"
                    title="Delete menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <h3 className="font-display font-bold text-foreground text-base leading-snug pr-6">
                    {menu.menu_title}
                  </h3>

                  {dishPreview.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-1">
                      {dishPreview.join(" · ")}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    {menu.total_pantry_savings != null && menu.total_pantry_savings > 0 && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
                        <Wallet className="w-3 h-3" />
                        Saved ~${menu.total_pantry_savings}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {timeAgo(menu.created_at)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <RotateCcw className="w-3 h-3" />
                    Reuse or change this menu
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedMenus;
