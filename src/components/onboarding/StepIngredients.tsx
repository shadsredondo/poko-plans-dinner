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
    listening: "text-[hsl(var(--mic-teal))]",
    processing: "text-muted-foreground",
    error: "text-destructive",
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          What's in your fridge?
        </h1>
        <p className="text-muted-foreground text-sm">
          Don't overthink it — just add what you have
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. chicken, tomatoes, garlic"
            className="flex-1 bg-card border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {isSupported && (
            <button
              onClick={toggle}
              disabled={state === "processing"}
              className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
                state === "listening"
                  ? "bg-[hsl(var(--mic-teal))] text-[hsl(var(--mic-teal-foreground))] shadow-md"
                  : state === "processing"
                  ? "bg-muted text-muted-foreground cursor-wait"
                  : state === "error"
                  ? "bg-muted text-destructive"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              title={state === "idle" ? "Tap to speak" : state === "listening" ? "Tap to stop" : ""}
            >
              {/* Teal pulse rings for listening */}
              {state === "listening" && (
                <>
                  <span className="absolute inset-0 rounded-full bg-[hsl(var(--mic-teal))]/20 animate-[mic-pulse_2s_ease-out_infinite]" />
                  <span className="absolute inset-[-4px] rounded-full bg-[hsl(var(--mic-teal))]/10 animate-[mic-pulse_2s_ease-out_0.4s_infinite]" />
                </>
              )}

              {state === "processing" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mic className="w-4 h-4 relative z-10" />
              )}
            </button>
          )}
          <button
            onClick={addIngredient}
            disabled={!input.trim()}
            className="bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-40 transition-opacity"
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
              className={`text-xs font-medium ${helperColor[state]}`}
            >
              {helperText[state]}
            </motion.p>
          )}
        </AnimatePresence>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm font-medium"
              >
                {item}
                <button
                  onClick={() => remove(item)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
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
