import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ReturningUserBanner = () => {
  const [show, setShow] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return; // Already signed in

      const hasVisited = localStorage.getItem("hasVisited");
      if (hasVisited) {
        setShow(true);
      }
      localStorage.setItem("hasVisited", "true");
    };
    checkUser();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result?.error) {
        toast({ title: "Something went wrong", description: String(result.error), variant: "destructive" });
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
        toast({ title: "Welcome back! 🎉" });
      }
      setAuthOpen(false);
      setShow(false);
    } catch (err: any) {
      toast({ title: "Oops", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-accent/50 border-b border-border overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2.5 max-w-lg mx-auto">
              <p className="text-sm text-foreground">
                Welcome back 👀{" "}
                <span className="text-muted-foreground">Save your menus and pick up where you left off.</span>
              </p>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <button
                  onClick={() => setAuthOpen(true)}
                  className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full"
                >
                  Sign in
                </button>
                <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader className="text-center items-center">
            <DialogTitle className="font-display text-lg">Welcome back 👋</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Sign in to save and revisit your menus
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReturningUserBanner;
