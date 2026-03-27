import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PokoAvatar from "@/components/PokoAvatar";
import ChatBubble from "@/components/ChatBubble";
import MenuResults from "@/components/MenuResults";
import { useToast } from "@/hooks/use-toast";

type Step = "welcome" | "guests" | "ingredients" | "effort" | "cuisine" | "generating" | "results";

const effortOptions = [
  { label: "Minimal 😴", value: "minimal", desc: "I can barely be bothered" },
  { label: "Moderate 🍳", value: "moderate", desc: "I'll put in some effort" },
  { label: "Go all out 👨‍🍳", value: "high", desc: "Let's impress everyone" },
];

const cuisineOptions = [
  { label: "Italian 🇮🇹", value: "Italian" },
  { label: "Asian 🥢", value: "Asian fusion" },
  { label: "Mexican 🌮", value: "Mexican" },
  { label: "Mediterranean 🫒", value: "Mediterranean" },
  { label: "Surprise me 🎲", value: "surprise" },
];

const Index = () => {
  const [step, setStep] = useState<Step>("welcome");
  const [guests, setGuests] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [effort, setEffort] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [menu, setMenu] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [step, menu]);

  useEffect(() => {
    if (step === "guests" || step === "ingredients") {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [step]);

  const handleSubmitGuests = () => {
    const val = inputValue.trim();
    if (!val || isNaN(Number(val)) || Number(val) < 1) return;
    setGuests(val);
    setInputValue("");
    setStep("ingredients");
  };

  const handleSubmitIngredients = () => {
    const val = inputValue.trim();
    if (!val) return;
    setIngredients(val);
    setInputValue("");
    setStep("effort");
  };

  const handleSelectEffort = (val: string) => {
    setEffort(val);
    setStep("cuisine");
  };

  const handleSelectCuisine = async (val: string) => {
    setCuisine(val);
    setStep("generating");

    try {
      const { data, error } = await supabase.functions.invoke("generate-menu", {
        body: { guests: Number(guests), ingredients, effort, cuisine: val },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setMenu(data);
      setStep("results");
    } catch (err: any) {
      console.error("Menu generation failed:", err);
      toast({
        title: "Poko hit a snag 😅",
        description: err.message || "Something went wrong generating your menu. Let's try again!",
        variant: "destructive",
      });
      setStep("cuisine");
    }
  };

  const handleReset = () => {
    setStep("welcome");
    setGuests("");
    setIngredients("");
    setEffort("");
    setCuisine("");
    setMenu(null);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (step === "guests") handleSubmitGuests();
      if (step === "ingredients") handleSubmitIngredients();
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
        {step !== "welcome" && (
          <button onClick={handleReset} className="text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-lg mx-auto w-full">
          {/* Welcome */}
          {step === "welcome" && (
            <motion.div key="welcome" className="flex flex-col items-center text-center pt-12 space-y-6"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <PokoAvatar size="xl" expression="wink" />
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Hi, I'm Poko 👀
                </h1>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  Give me your random fridge situation, I'll turn it into a dinner party.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep("guests")}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-shadow"
              >
                Let's go! 🚀
              </motion.button>
            </motion.div>
          )}

          {/* Guests question - show once we're past welcome */}
          {step !== "welcome" && (
            <ChatBubble message="How many people are we feeding? 🍽️" sender="poko" expression="thinking" />
          )}
          {/* Guests answer */}
          {guests && step !== "welcome" && (
            <ChatBubble message={`${guests} people`} sender="user" />
          )}

          {/* Ingredients question */}
          {step !== "welcome" && step !== "guests" && (
            <ChatBubble message="What's in your fridge right now — don't overthink it. Just list whatever you've got! 🧊" sender="poko" expression="happy" />
          )}
          {/* Ingredients answer */}
          {ingredients && (
            <ChatBubble message={ingredients} sender="user" />
          )}

          {/* Effort */}
          {step === "effort" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ChatBubble message="Be honest… how much effort are we putting in today? 💪" sender="poko" expression="wink" />
              <div className="mt-3 space-y-2 pl-11">
                {effortOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectEffort(opt.value)}
                    className="w-full text-left bg-card border border-border rounded-xl px-4 py-3 hover:border-primary transition-colors"
                  >
                    <span className="font-bold text-foreground">{opt.label}</span>
                    <span className="text-sm text-muted-foreground ml-2">{opt.desc}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
          {effort && step !== "effort" && (
            <>
              <ChatBubble message="Be honest… how much effort are we putting in today? 💪" sender="poko" expression="wink" />
              <ChatBubble message={effortOptions.find(o => o.value === effort)?.label || effort} sender="user" />
            </>
          )}

          {/* Cuisine */}
          {step === "cuisine" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ChatBubble message="Any vibe? Or should I surprise you? 🌍" sender="poko" expression="excited" />
              <div className="mt-3 flex flex-wrap gap-2 pl-11">
                {cuisineOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectCuisine(opt.value)}
                    className="bg-card border border-border rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:border-primary transition-colors"
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Generating */}
          {step === "generating" && (
            <motion.div className="flex flex-col items-center py-12 space-y-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <PokoAvatar size="lg" expression="thinking" animate={false} />
              </motion.div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-body">Poko is cooking up something brilliant...</span>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {step === "results" && menu && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MenuResults menu={menu} />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="flex justify-center pt-4 pb-6"
              >
                <button
                  onClick={handleReset}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
                >
                  Plan another dinner 🔄
                </button>
              </motion.div>
            </motion.div>
          )}
      </div>

      {/* Input Area */}
      {(step === "guests" || step === "ingredients") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-card px-4 py-3 max-w-lg mx-auto w-full"
        >
          <div className="flex items-end gap-2">
            {step === "ingredients" ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="chicken, rice, some sad tomatoes, half a lemon..."
                rows={2}
                className="flex-1 bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="number"
                min={1}
                max={50}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 4"
                className="flex-1 bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
            <button
              onClick={step === "guests" ? handleSubmitGuests : handleSubmitIngredients}
              disabled={!inputValue.trim()}
              className="bg-primary text-primary-foreground p-3 rounded-xl disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
