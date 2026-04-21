import { useState } from "react";
import { X, Mic, Loader2 } from "lucide-react";
import { useVoiceDictation } from "@/hooks/useVoiceDictation";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

const StepIngredients = ({ value, onChange }: Props) => {
  const [input, setInput] = useState("");

  const { state, isSupported, toggle } = useVoiceDictation((text) => {
    setInput(text);
  });

  const addIngredient = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const items = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    const unique = [...new Set([...value, ...items])];
    onChange(unique);
    setInput("");
  };

  const remove = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const helperText = {
    idle: null,
    listening: "Speak now…",
    processing: "Processing…",
    error: "Couldn't hear you. Try again.",
  };

  const helperColor = {
    idle: "",
    listening: "text-mic-teal",
    processing: "text-muted-foreground",
    error: "text-destructive",
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Pantry</p>
        <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground leading-[1.05]">
          What's already in your kitchen?
        </h1>
        <p className="text-sm text-muted-foreground italic">
          A few notes will do — nothing more.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-3 items-center border-b border-border focus-within:border-foreground transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="chicken, tomatoes, garlic…"
            className="flex-1 bg-transparent border-0 px-0 py-3 font-display text-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {isSupported && (
            <button
              onClick={toggle}
              disabled={state === "processing"}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                state === "listening"
                  ? "bg-foreground text-background"
                  : state === "processing"
                  ? "bg-muted text-muted-foreground cursor-wait"
                  : state === "error"
                  ? "bg-muted text-destructive"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={state === "idle" ? "Tap to speak" : state === "listening" ? "Tap to stop" : ""}
            >
              {state === "listening" && (
                <>
                  <span className="absolute inset-0 rounded-full bg-foreground/20 animate-mic-pulse" />
                  <span className="absolute inset-[-4px] rounded-full bg-foreground/10 animate-mic-pulse [animation-delay:0.4s]" />
                </>
              )}

              {state === "processing" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Mic className="w-3.5 h-3.5 relative z-10" strokeWidth={1.5} />
              )}
            </button>
          )}
          <button
            onClick={addIngredient}
            disabled={!input.trim()}
            className="text-foreground text-[11px] uppercase tracking-[0.22em] disabled:opacity-30 transition-opacity hover:text-accent"
          >
            Add
          </button>
        </div>

        <AnimatePresence mode="wait">
          {helperText[state] && (
            <motion.p
              key={state}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={`text-[10px] uppercase tracking-[0.22em] ${helperColor[state]}`}
            >
              {helperText[state]}
            </motion.p>
          )}
        </AnimatePresence>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
            {value.map((item) => (
              <span
                key={item}
                className="group inline-flex items-center gap-2 text-foreground/85 text-[14px] border-b border-border hover:border-foreground transition-colors pb-0.5"
              >
                {item}
                <button
                  onClick={() => remove(item)}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <X className="w-3 h-3" strokeWidth={1.5} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepIngredients;
