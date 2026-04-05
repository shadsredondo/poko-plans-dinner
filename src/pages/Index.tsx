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
    <div className="min-h-screen bg-transparent flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/85 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <PokoAvatar size="sm" animate={false} />
          <span className="font-display font-bold text-foreground">Poko</span>
          {user && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full px-3 py-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-bold font-display">My Menus</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="text-muted-foreground hover:text-foreground transition-colors" title="Start over">
            <RotateCcw className="w-4 h-4" />
          </button>
          <AccountMenu />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
            className="flex justify-center pt-2 pb-6"
          >
            <button
              onClick={handleReset}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
            >
              Plan another dinner 🔄
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
