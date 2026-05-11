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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          <Loader2 className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
        </motion.div>
        <div className="text-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Composing</p>
          <p className="font-display text-2xl text-foreground">Your evening, taking shape.</p>
        </div>
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* TOP — Progress */}
      <div className="pt-10 pb-6 px-6 md:px-10 max-w-2xl mx-auto w-full">
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            {stepLabels[currentStep]}
          </p>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground tabular-nums">
            {String(currentStep + 1).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
          </p>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={false}
            animate={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        {summaryParts.length > 0 && currentStep > 0 && (
          <p className="text-[11px] text-muted-foreground mt-4 italic">
            {summaryParts.join(" · ")}
          </p>
        )}
      </div>

      {/* CENTER — Step Content */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-10 py-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {stepContent[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM — Navigation */}
      <div className="pb-10 pt-6 px-6 md:px-10 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none text-[11px] uppercase tracking-[0.22em]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={goNext}
          disabled={!canProceed()}
          className="group flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] disabled:opacity-30 transition-all hover:bg-primary/90 shadow-[0_10px_28px_-12px_hsl(var(--primary)/0.5)] hover:-translate-y-0.5"
        >
          {currentStep === TOTAL_STEPS - 1 ? "Compose menu" : "Continue"}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
