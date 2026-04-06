import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StepGuests from "./StepGuests";
import StepIngredients from "./StepIngredients";
import StepEffort from "./StepEffort";
import StepCuisine from "./StepCuisine";
import StepSkill from "./StepSkill";

export interface OnboardingData {
  guests: number | null;
  ingredients: string[];
  effort: string;
  cuisine: string;
  customCuisine: string;
  skill: string;
}

const TOTAL_STEPS = 5;

const stepLabels = ["Guests", "Ingredients", "Effort", "Cuisine", "Skill"];

interface Props {
  onComplete: (menu: any, data: OnboardingData) => void;
}

const OnboardingFlow = ({ onComplete }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const [data, setData] = useState<OnboardingData>({
    guests: null,
    ingredients: [],
    effort: "",
    cuisine: "",
    customCuisine: "",
    skill: "",
  });

  const update = useCallback((partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return data.guests !== null;
      case 1: return data.ingredients.length > 0;
      case 2: return !!data.effort;
      case 3: return !!data.cuisine;
      case 4: return !!data.skill;
      default: return false;
    }
  };

  const goNext = async () => {
    if (!canProceed()) return;
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      // Final step — generate menu
      setGenerating(true);
      try {
        const cuisineVal = data.cuisine === "custom" ? data.customCuisine : data.cuisine;
        const { data: menuData, error } = await supabase.functions.invoke("generate-menu", {
          body: {
            guests: data.guests,
            ingredients: data.ingredients.join(", "),
            effort: data.effort,
            skill: data.skill,
            cuisine: cuisineVal,
          },
        });
        if (error) throw error;
        if (menuData?.error) throw new Error(menuData.error);
        onComplete(menuData, data);
      } catch (err: any) {
        console.error("Menu generation failed:", err);
        toast({
          title: "Something went wrong 😅",
          description: err.message || "Let's try again!",
          variant: "destructive",
        });
        setGenerating(false);
      }
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const summaryParts: string[] = [];
  if (data.guests) summaryParts.push(`${data.guests} guests`);
  if (data.ingredients.length) summaryParts.push(`${data.ingredients.length} ingredients`);
  if (data.effort) summaryParts.push(data.effort);
  if (data.cuisine) summaryParts.push(data.cuisine === "custom" ? data.customCuisine : data.cuisine);
  if (data.skill) summaryParts.push(data.skill);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  if (generating) {
    return (
      <div className="min-h-screen bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-muted-foreground font-medium">Crafting your perfect menu…</p>
      </div>
    );
  }

  const stepContent = [
    <StepGuests key="guests" value={data.guests} onChange={(v) => update({ guests: v })} />,
    <StepIngredients key="ingredients" value={data.ingredients} onChange={(v) => update({ ingredients: v })} />,
    <StepEffort key="effort" value={data.effort} onChange={(v) => update({ effort: v })} />,
    <StepCuisine key="cuisine" value={data.cuisine} customValue={data.customCuisine} onChange={(v) => update({ cuisine: v })} onCustomChange={(v) => update({ customCuisine: v })} />,
    <StepSkill key="skill" value={data.skill} onChange={(v) => update({ skill: v })} />,
  ];

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-sm flex flex-col">
      {/* TOP — Progress */}
      <div className="pt-8 pb-4 px-6 max-w-xl mx-auto w-full">
        <p className="text-sm text-muted-foreground font-medium mb-3">
          Step {currentStep + 1} of {TOTAL_STEPS}
        </p>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={false}
            animate={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {summaryParts.length > 0 && currentStep > 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            {summaryParts.join(" • ")}
          </p>
        )}
      </div>

      {/* CENTER — Step Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {stepContent[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM — Navigation */}
      <div className="pb-8 pt-4 px-6 max-w-xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={goNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-40 transition-all hover:shadow-lg disabled:hover:shadow-none"
        >
          {currentStep === TOTAL_STEPS - 1 ? "Generate Menu" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
