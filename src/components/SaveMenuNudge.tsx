import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bookmark, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSavedMenus } from "@/hooks/useSavedMenus";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, PENDING_MENU_KEY } from "@/lib/auth";

interface SaveMenuNudgeProps {
  menu?: any;
  guests?: number;
  ingredients?: string;
  effort?: string;
  skill?: string;
  cuisine?: string;
}

const SaveMenuNudge = ({ menu, guests, ingredients, effort, skill, cuisine }: SaveMenuNudgeProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const savingRef = useRef(false);
  const { user } = useAuth();
  const { saveMenu } = useSavedMenus(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();

  const buildPayload = (menuData?: any) => {
    const m = menuData || menu;
    if (!m) return null;
    // Derive title from first dish or fallback
    const title = m.menu?.[0]?.dish
      ? `${m.menu[0].dish} & more`
      : m.menuTitle || "Untitled Menu";
    return {
      menu_title: m.menu_title || title,
      menu_data: m,
      guests: menuData?.guests ?? guests,
      ingredients: menuData?.ingredients ?? ingredients,
      effort: menuData?.effort ?? effort,
      skill: menuData?.skill ?? skill,
      cuisine: menuData?.cuisine ?? cuisine,
      total_estimated_cost: null,
      total_pantry_savings: m.total_savings ?? m.summary?.total_savings ?? null,
    };
  };

  const doSave = async (payload: ReturnType<typeof buildPayload>) => {
    if (!payload || savingRef.current) return;
    savingRef.current = true;
    try {
      await saveMenu.mutateAsync(payload);
      setSaved(true);
      sessionStorage.removeItem(PENDING_MENU_KEY);
      toast({
        title: "Saved to your menus 🎉",
        description: "You can find this in your saved menus.",
      });
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    } finally {
      savingRef.current = false;
    }
  };

  // When user clicks Save
  const handleSave = async () => {
    if (!menu) return;
    if (!user) {
      // Persist to sessionStorage so it survives OAuth redirects
      sessionStorage.setItem(PENDING_MENU_KEY, JSON.stringify(buildPayload()));
      setOpen(true);
      return;
    }
    await doSave(buildPayload());
  };

  // Auto-save after auth completes (handles both in-dialog email auth and OAuth redirect)
  useEffect(() => {
    if (!user || saved || savingRef.current) return;

    // Check for pending menu from before auth
    const pending = sessionStorage.getItem(PENDING_MENU_KEY);
    if (pending) {
      try {
        const payload = JSON.parse(pending);
        setOpen(false);
        doSave(payload);
      } catch {
        sessionStorage.removeItem(PENDING_MENU_KEY);
      }
      return;
    }

    // In-dialog sign-in (menu still in memory)
    if (open && menu) {
      setOpen(false);
      doSave(buildPayload());
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Ensure menu is persisted before redirect
      if (menu) {
        sessionStorage.setItem(PENDING_MENU_KEY, JSON.stringify(buildPayload()));
      }
      // The menu isn't restored on /new after a reload, so land on /menus,
      // which saves the pending menu.
      const { error } = await signInWithGoogle("/menus");
      if (error) {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Something went wrong", description: err?.message || "Google sign-in failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({ title: "Check your email ✉️", description: "We sent you a confirmation link." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Auto-save will trigger via useEffect when user state updates
      }
    } catch (err: any) {
      toast({ title: "Oops", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 pt-8 pb-2 border-t border-border/60 mt-8"
      >
        <div className="flex items-center justify-center gap-2 text-foreground">
          <Check className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-[0.22em]">Saved to your menus</span>
        </div>
        <p className="text-xs text-muted-foreground italic">Kept safely for the evening.</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-[11px] uppercase tracking-[0.22em] font-normal"
          onClick={() => navigate("/menus")}
        >
          View saved menus →
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="text-center space-y-4 pt-10 pb-2 border-t border-border/60 mt-8"
      >
        <p className="text-sm text-muted-foreground italic">
          Keep this menu close, for the next quiet evening.
        </p>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-3 border border-foreground/80 text-foreground px-7 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-colors duration-300"
        >
          <Bookmark className="w-3.5 h-3.5" strokeWidth={1.5} />
          Save this menu
        </button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader className="text-center items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-lg">Save your menu</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Sign in to save — your menu won't be lost
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full rounded-xl h-11 font-semibold gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                onClick={handleEmailAuth}
                disabled={loading || !email || !password}
                className="w-full rounded-xl h-10 font-semibold"
              >
                {isSignUp ? "Sign up" : "Sign in"}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-semibold hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>

            <p className="text-center text-[11px] text-muted-foreground">
              By continuing you agree to our{" "}
              <a href="/terms" target="_blank" rel="noopener" className="underline underline-offset-2">Terms</a> and{" "}
              <a href="/privacy" target="_blank" rel="noopener" className="underline underline-offset-2">Privacy Policy</a>.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SaveMenuNudge;
