import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ReturningUserBannerProps {
  onSignIn: () => void;
}

const ReturningUserBanner = ({ onSignIn }: ReturningUserBannerProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited) {
      setShow(true);
    }
    localStorage.setItem("hasVisited", "true");
  }, []);

  return (
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
              <span className="text-muted-foreground">Want to save your menus and pick up where you left off?</span>
            </p>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <button
                onClick={onSignIn}
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
  );
};

export default ReturningUserBanner;
