import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PokoAvatar from "@/components/PokoAvatar";
import MenuResults from "@/components/MenuResults";
import SaveMenuNudge from "@/components/SaveMenuNudge";
import AccountMenu from "@/components/AccountMenu";
import OnboardingFlow, { OnboardingData } from "@/components/onboarding/OnboardingFlow";
import { useAuth } from "@/hooks/useAuth";
import { clearChatState } from "@/lib/chatStorage";

type Phase = "onboarding" | "results";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("onboarding");
  const [menu, setMenu] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  const handleComplete = (menuData: any, data: OnboardingData) => {
    setMenu(menuData);
    setOnboardingData(data);
    setPhase("results");
  };

  const handleReset = () => {
    clearChatState();
    setPhase("onboarding");
    setMenu(null);
    setOnboardingData(null);
  };

  if (phase === "onboarding") {
    return <OnboardingFlow onComplete={handleComplete} />;
  }

  // Results phase
  const cuisineVal = onboardingData?.cuisine === "custom" ? onboardingData.customCuisine : onboardingData?.cuisine || "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border/60 bg-background/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <PokoAvatar size="sm" animate={false} />
          <span className="font-display text-lg tracking-tight text-foreground">Poko</span>
          {user && (
            <button
              onClick={() => navigate("/menus")}
              className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ml-4 text-xs uppercase tracking-[0.18em]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Menus</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground transition-colors text-xs uppercase tracking-[0.18em] flex items-center gap-2"
            title="Start over"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
          <AccountMenu />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-12 space-y-8 max-w-2xl mx-auto w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <MenuResults menu={menu} />
          <SaveMenuNudge
            menu={menu}
            guests={onboardingData?.guests || 2}
            ingredients={onboardingData?.ingredients.join(", ") || ""}
            effort={onboardingData?.effort || ""}
            skill={onboardingData?.skill || ""}
            cuisine={cuisineVal}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="flex justify-center pt-10 pb-6"
          >
            <button
              onClick={handleReset}
              className="group inline-flex items-center gap-3 border border-foreground/80 text-foreground px-8 py-3.5 text-xs uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Plan another evening
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
