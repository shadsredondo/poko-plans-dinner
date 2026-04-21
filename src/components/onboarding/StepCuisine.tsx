interface Props {
  value: string;
  customValue: string;
  onChange: (v: string) => void;
  onCustomChange: (v: string) => void;
}

const presets = [
  { label: "Italian", region: "Mediterranean" },
  { label: "Indian", region: "Subcontinental" },
  { label: "Asian fusion", region: "Pan-Asian" },
  { label: "Mediterranean", region: "Coastal" },
];

const StepCuisine = ({ value, customValue, onChange, onCustomChange }: Props) => (
  <div className="space-y-12">
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Direction</p>
      <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground leading-[1.05]">
        Where shall we travel tonight?
      </h1>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
      {presets.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onChange(opt.label)}
          className={`text-left px-6 py-6 transition-colors duration-300 ${
            value === opt.label
              ? "bg-foreground text-background"
              : "bg-background hover:bg-muted"
          }`}
        >
          <p className={`text-[10px] uppercase tracking-[0.24em] mb-2 ${
            value === opt.label ? "text-background/60" : "text-muted-foreground"
          }`}>
            {opt.region}
          </p>
          <p className="font-display text-2xl">{opt.label}</p>
        </button>
      ))}
      <button
        onClick={() => onChange("custom")}
        className={`text-left px-6 py-6 sm:col-span-2 transition-colors duration-300 ${
          value === "custom"
            ? "bg-foreground text-background"
            : "bg-background hover:bg-muted"
        }`}
      >
        <p className={`text-[10px] uppercase tracking-[0.24em] mb-2 ${
          value === "custom" ? "text-background/60" : "text-muted-foreground"
        }`}>
          Compose your own
        </p>
        <p className="font-display text-2xl italic">A cuisine of your choosing</p>
      </button>
    </div>

    {value === "custom" && (
      <input
        value={customValue}
        onChange={(e) => onCustomChange(e.target.value)}
        placeholder="e.g. Levantine, Nordic, Thai-Mexican…"
        className="w-full bg-transparent border-0 border-b border-border px-0 py-3 font-display text-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
        autoFocus
      />
    )}
  </div>
);

export default StepCuisine;
