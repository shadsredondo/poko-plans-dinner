import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, RotateCcw, Mic, MicOff, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PokoAvatar from "@/components/PokoAvatar";
import ChatBubble from "@/components/ChatBubble";
import MenuResults from "@/components/MenuResults";
import SaveMenuNudge from "@/components/SaveMenuNudge";
import AccountMenu from "@/components/AccountMenu";
import ReturningUserBanner from "@/components/ReturningUserBanner";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useVoiceDictation } from "@/hooks/useVoiceDictation";
import { cleanIngredients } from "@/lib/cleanIngredients";

type Step = "welcome" | "guests" | "ingredients" | "effort" | "skill" | "cuisine" | "generating" | "results";

const effortOptions = [
  { label: "Minimal 😴", value: "minimal", desc: "I can barely be bothered" },
  { label: "Moderate 🍳", value: "moderate", desc: "I'll put in some effort" },
  { label: "Go all out 👨‍🍳", value: "high", desc: "Let's impress everyone" },
];

const skillOptions = [
  { label: "Pro chef 👨‍🍳", value: "advanced", desc: "I know my way around a kitchen" },
  { label: "Comfortable home cook 🍳", value: "intermediate", desc: "I can follow a recipe and improvise" },
  { label: "Assembler 🥪", value: "beginner", desc: "I assemble things and call it cooking" },
];

const cuisineOptions = [
  { label: "Italian 🇮🇹", value: "Italian" },
  { label: "Asian 🥢", value: "Asian fusion" },
  { label: "Mexican 🌮", value: "Mexican" },
  { label: "Mediterranean 🫒", value: "Mediterranean" },
  { label: "Surprise me 🎲", value: "surprise" },
];

const CHAT_STATE_KEY = "poko_chat_state";

const loadChatState = () => {
  try {
    const saved = sessionStorage.getItem(CHAT_STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const saved = useRef(loadChatState());
  const [step, setStep] = useState<Step>(saved.current?.step || "welcome");
  const [ingredients, setIngredients] = useState(saved.current?.ingredients || "");
  const [guests, setGuests] = useState(saved.current?.guests || "");
  const [effort, setEffort] = useState(saved.current?.effort || "");
  const [skill, setSkill] = useState(saved.current?.skill || "");
  const [cuisine, setCuisine] = useState(saved.current?.cuisine || "");
  const [menu, setMenu] = useState<any>(saved.current?.menu || null);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Persist chat state to sessionStorage
  useEffect(() => {
    if (step === "welcome") {
      sessionStorage.removeItem(CHAT_STATE_KEY);
      return;
    }
    sessionStorage.setItem(CHAT_STATE_KEY, JSON.stringify({
      step: step === "generating" ? "cuisine" : step,
      guests, ingredients, effort, skill, cuisine, menu,
    }));
  }, [step, guests, ingredients, effort, skill, cuisine, menu]);

  const handleVoiceResult = useCallback((text: string) => {
    setInputValue(text);
  }, []);
  const voice = useVoiceDictation(handleVoiceResult);

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
    if (voice.isListening) voice.stop();
    const cleaned = cleanIngredients(val);
    setIngredients(cleaned || val);
    setInputValue("");
    setStep("effort");
  };

  const handleSelectEffort = (val: string) => {
    setEffort(val);
    setStep("skill");
  };

  const handleSelectSkill = (val: string) => {
    setSkill(val);
    setStep("cuisine");
  };

  const handleSelectCuisine = async (val: string) => {
    setCuisine(val);
    setStep("generating");

    try {
      const { data, error } = await supabase.functions.invoke("generate-menu", {
        body: { guests: Number(guests), ingredients, effort, skill, cuisine: val },
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
    sessionStorage.removeItem(CHAT_STATE_KEY);
    setStep("welcome");
    setGuests("");
    setIngredients("");
    setEffort("");
    setSkill("");
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
        <div className="flex items-center gap-3">
          <PokoAvatar size="sm" animate={false} />
          <span className="font-display font-bold text-foreground">Poko</span>
          {user && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full px-3 py-1.5"
              title="My Menus"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-bold font-display">My Menus</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {step !== "welcome" && (
            <button onClick={handleReset} className="text-muted-foreground hover:text-foreground transition-colors" title="Start over">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <AccountMenu />
        </div>
      </header>
      <ReturningUserBanner />

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-lg mx-auto w-full">
          {/* Welcome */}
          {step === "welcome" && (
            <motion.div key="welcome" className="flex flex-col items-center text-center pt-12 space-y-6"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <PokoAvatar size="xl" />
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Hi, I'm Poko 👀
                </h1>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  Give me your random fridge and pantry situation, I'll turn it into a dinner party.
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
            <ChatBubble message="How many people are we feeding? 🍽️" sender="poko" />
          )}
          {/* Guests answer */}
          {guests && step !== "welcome" && (
            <ChatBubble message={`${guests} people`} sender="user" />
          )}

          {/* Ingredients question */}
          {step !== "welcome" && step !== "guests" && (
            <ChatBubble message="What's in your fridge right now — don't overthink it. Just list whatever you've got! 🧊" sender="poko" />
          )}
          {/* Ingredients answer */}
          {ingredients && (
            <ChatBubble message={ingredients} sender="user" />
          )}

          {/* Effort */}
          {step === "effort" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ChatBubble message="Be honest… how much effort are we putting in today? 💪" sender="poko" />
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
              <ChatBubble message="Be honest… how much effort are we putting in today? 💪" sender="poko" />
              <ChatBubble message={effortOptions.find(o => o.value === effort)?.label || effort} sender="user" />
            </>
          )}

          {/* Cooking Skill */}
          {step === "skill" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ChatBubble message="What's your cooking level? 👀 Pro chef or more 'I assemble things and call it cooking'?" sender="poko" />
              <div className="mt-3 space-y-2 pl-11">
                {skillOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectSkill(opt.value)}
                    className="w-full text-left bg-card border border-border rounded-xl px-4 py-3 hover:border-primary transition-colors"
                  >
                    <span className="font-bold text-foreground">{opt.label}</span>
                    <span className="text-sm text-muted-foreground ml-2">{opt.desc}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
          {skill && step !== "skill" && (
            <>
              <ChatBubble message="What's your cooking level? 👀 Pro chef or more 'I assemble things and call it cooking'?" sender="poko" />
              <ChatBubble message={skillOptions.find(o => o.value === skill)?.label || skill} sender="user" />
            </>
          )}

          {/* Cuisine */}
          {step === "cuisine" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ChatBubble message="Any vibe? Or should I surprise you? 🌍" sender="poko" />
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
                <PokoAvatar size="lg" animate={false} />
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
              <SaveMenuNudge
                menu={menu}
                guests={Number(guests)}
                ingredients={ingredients}
                effort={effort}
                skill={skill}
                cuisine={cuisine}
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
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="relative">
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type or say what's in your fridge…"
                    rows={2}
                    className="w-full bg-background border border-input rounded-xl px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {voice.isSupported && (
                    <button
                      type="button"
                      onClick={voice.toggle}
                      className={`absolute right-2.5 bottom-2.5 p-1.5 rounded-full transition-colors ${
                        voice.isListening
                          ? "bg-destructive/10 text-destructive"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      aria-label={voice.isListening ? "Stop listening" : "Start voice input"}
                    >
                      {voice.isListening ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                          <MicOff className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                {voice.isListening && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-destructive font-medium pl-1"
                  >
                    Listening… speak your ingredients
                  </motion.p>
                )}
                {!voice.isListening && voice.isSupported && !inputValue && (
                  <p className="text-xs text-muted-foreground pl-1">
                    You can tap the mic and just speak your ingredients
                  </p>
                )}
              </div>
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
