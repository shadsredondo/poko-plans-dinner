import { useState } from "react";
import { X, Mic, Loader2 } from "lucide-react";
import { useVoiceDictation } from "@/hooks/useVoiceDictation";
import { motion, AnimatePresence } from "framer-motion";
import { getIngredientSuggestions } from "@/lib/ingredientSuggestions";

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

const StepIngredients = ({ value, onChange }: Props) => {
  const [input, setInput] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const suggestions = getIngredientSuggestions(input, value);

  const { state, isSupported, toggle } = useVoiceDictation((text) => {
    setInput(text);
  });

  const addIngredient = (ingredientInput = input) => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    const items = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    const unique = [...new Set([...value, ...items])];
    onChange(unique);
    setInput("");
    setActiveSuggestion(0);
  };

  const chooseSuggestion = (suggestion: string) => {
    const priorItems = input.split(",").slice(0, -1).map((item) => item.trim()).filter(Boolean);
    addIngredient([...priorItems, suggestion].join(", "));
  };

  const remove = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setActiveSuggestion((index) => (index + 1) % suggestions.length);
      return;
    }
    if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setActiveSuggestion((index) => (index - 1 + suggestions.length) % suggestions.length);
      return;
    }
    if (e.key === "Escape" && suggestions.length) {
      e.preventDefault();
      setInput("");
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length) chooseSuggestion(suggestions[activeSuggestion] || suggestions[0]);
      else addIngredient();
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
    <div className="space-y-8 sm:space-y-12">
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Pantry</p>
        <h1 className="font-display text-[2.25rem] sm:text-4xl md:text-5xl font-normal text-foreground leading-[1.05]">
          What's already in your kitchen?
        </h1>
        <p className="text-sm text-muted-foreground italic">
          A few notes will do — nothing more.
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="flex gap-3 items-center border-b border-border focus-within:border-foreground transition-colors">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setActiveSuggestion(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="chicken, tomatoes, garlic…"
            role="combobox"
            aria-label="Add pantry ingredients"
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            aria-controls="ingredient-suggestions"
            aria-activedescendant={suggestions.length ? `ingredient-suggestion-${activeSuggestion}` : undefined}
            className="min-w-0 flex-1 bg-transparent border-0 px-0 py-3 font-display text-base sm:text-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {isSupported && (
            <button
              onClick={toggle}
              disabled={state === "processing"}
              aria-label={state === "idle" ? "Start voice input" : state === "listening" ? "Stop voice input" : "Voice input"}
              className={`relative flex items-center justify-center w-11 h-11 shrink-0 rounded-full transition-all duration-300 ${
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
            onClick={() => addIngredient()}
            disabled={!input.trim()}
            className="min-h-11 px-1 text-foreground text-[11px] uppercase tracking-[0.18em] disabled:opacity-30 transition-opacity hover:text-accent"
          >
            Add
          </button>
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                id="ingredient-suggestions"
                role="listbox"
                aria-label="Ingredient suggestions"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_45px_-24px_hsl(var(--shadow-warm)/0.55)]"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    id={`ingredient-suggestion-${index}`}
                    role="option"
                    aria-selected={index === activeSuggestion}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => chooseSuggestion(suggestion)}
                    className={`flex min-h-11 w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                      index === activeSuggestion ? "bg-sage-soft/70 text-foreground" : "bg-card text-foreground/85 hover:bg-muted/60"
                    }`}
                  >
                    <span className="font-medium">{suggestion}</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Add</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
                  aria-label={`Remove ${item}`}
                  className="w-11 h-11 -my-3 -mr-3 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
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
