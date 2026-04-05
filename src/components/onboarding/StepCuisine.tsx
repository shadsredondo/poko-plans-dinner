interface Props {
  value: string;
  customValue: string;
  onChange: (v: string) => void;
  onCustomChange: (v: string) => void;
}

const presets = [
  { label: "Italian 🇮🇹", value: "Italian" },
  { label: "Indian 🇮🇳", value: "Indian" },
  { label: "Asian 🥢", value: "Asian fusion" },
  { label: "Mediterranean 🫒", value: "Mediterranean" },
];

const StepCuisine = ({ value, customValue, onChange, onCustomChange }: Props) => (
  <div className="space-y-8">
    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
      What's the cuisine vibe?
    </h1>
    <div className="flex flex-wrap gap-3">
      {presets.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-5 py-3 border-2 font-semibold text-sm transition-all ${
            value === opt.value
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-card text-foreground border-border hover:border-primary/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
      <button
        onClick={() => onChange("custom")}
        className={`rounded-full px-5 py-3 border-2 font-semibold text-sm transition-all ${
          value === "custom"
            ? "bg-primary text-primary-foreground border-primary shadow-md"
            : "bg-card text-foreground border-border hover:border-primary/50"
        }`}
      >
        Multi cuisine / Custom ✨
      </button>
    </div>

    {value === "custom" && (
      <input
        value={customValue}
        onChange={(e) => onCustomChange(e.target.value)}
        placeholder="e.g. Thai-Mexican fusion, Middle Eastern…"
        className="w-full bg-card border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        autoFocus
      />
    )}
  </div>
);

export default StepCuisine;
